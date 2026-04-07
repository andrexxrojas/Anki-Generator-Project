import stripe from '../config/stripe.js';
import User from '../models/User.js';
import { TIER_LIMITS } from '../config/stripe.js';

// Price ID mappings from environment variables
const PRICE_IDS = {
    PRO: process.env.STRIPE_PRICE_PRO_MONTHLY,
    PREMIUM: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
    FREE: process.env.STRIPE_PRICE_FREE
};

// Helper function to get tier from price ID using env vars
function getTierFromPriceId(priceId) {
    if (priceId === PRICE_IDS.PRO) return 'pro';
    if (priceId === PRICE_IDS.PREMIUM) return 'premium';
    if (priceId === PRICE_IDS.FREE) return 'free';

    // Fallback to string matching for safety
    if (priceId?.includes('pro')) return 'pro';
    if (priceId?.includes('premium')) return 'premium';

    console.log(`Unknown price ID: ${priceId}, defaulting to free`);
    return 'free';
}

export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Log the full event
    console.log(`=== WEBHOOK RECEIVED: ${event.type} ===`);
    console.log('=== FULL EVENT JSON ===');
    console.log(JSON.stringify(event.data.object, null, 2));
    console.log('=== END OF FULL EVENT ===');

    try {
        // Handle invoice paid (subscription created/renewed)
        // Handle invoice paid (subscription created/renewed)
        if (event.type === 'invoice.paid' || event.type === 'invoice.payment_succeeded') {
            console.log('Processing invoice.paid event');
            const invoice = event.data.object;

            // Get the subscription ID from the nested parent object
            let subscriptionId = null;

            if (invoice.parent && invoice.parent.subscription_details) {
                subscriptionId = invoice.parent.subscription_details.subscription;
            }

            // Also try to get from lines data as fallback
            if (!subscriptionId && invoice.lines && invoice.lines.data && invoice.lines.data[0]) {
                const lineItem = invoice.lines.data[0];
                if (lineItem.parent && lineItem.parent.subscription_item_details) {
                    subscriptionId = lineItem.parent.subscription_item_details.subscription;
                }
            }

            // Get userId from metadata (but NOT the tier)
            let userId = null;

            if (invoice.parent && invoice.parent.subscription_details && invoice.parent.subscription_details.metadata) {
                userId = invoice.parent.subscription_details.metadata.userId;
            }

            // Also check line item metadata as fallback
            if (!userId && invoice.lines && invoice.lines.data && invoice.lines.data[0]) {
                const lineMetadata = invoice.lines.data[0].metadata;
                userId = lineMetadata.userId || userId;
            }

            if (subscriptionId && userId) {
                const user = await User.findByPk(parseInt(userId));

                if (user) {
                    // ONLY update customer ID and subscription ID
                    // DO NOT update tier - keep what subscription.updated set
                    user.stripeCustomerId = invoice.customer;
                    user.stripeSubscriptionId = subscriptionId;
                    user.subscriptionStatus = 'active';
                    user.monthlyGenerationsUsed = 0;

                    await user.save();

                    console.log(`Invoice.paid - User ${user.email} - Keeping existing tier: ${user.subscriptionTier}`);

                    // ✅ CHECK FOR PENDING DOWNGRADE AFTER SAVING
                    if (user.pendingDowngradeTier && user.pendingDowngradeDate <= new Date()) {
                        await user.update({
                            subscriptionTier: user.pendingDowngradeTier,
                            monthlyGenerationLimit: TIER_LIMITS[user.pendingDowngradeTier].monthlyLimit,
                            pendingDowngradeTier: null,
                            pendingDowngradeDate: null
                        });
                        console.log(`Applied pending downgrade for user ${user.email} to ${user.pendingDowngradeTier}`);
                    }
                }
            }
        }

        // Handle subscription updated (cancellations, reactivations, plan changes)
        else if (event.type === 'customer.subscription.updated') {
            console.log('=== PROCESSING customer.subscription.updated ===');
            const subscription = event.data.object;

            // Get current_period_end from the subscription items (where it actually lives)
            let currentPeriodEnd = null;
            if (subscription.items && subscription.items.data && subscription.items.data.length > 0) {
                currentPeriodEnd = subscription.items.data[0].current_period_end;
            }

            console.log('Subscription data:', {
                id: subscription.id,
                status: subscription.status,
                cancel_at_period_end: subscription.cancel_at_period_end,
                cancel_at: subscription.cancel_at,
                current_period_end: currentPeriodEnd,
                customer: subscription.customer
            });

            // Try to find user by stripeSubscriptionId
            let user = await User.findOne({
                where: { stripeSubscriptionId: subscription.id }
            });

            // If not found, try by customer ID
            if (!user && subscription.customer) {
                console.log(`User not found by subscription ID, trying by customer ID: ${subscription.customer}`);
                user = await User.findOne({
                    where: { stripeCustomerId: subscription.customer }
                });
            }

            if (!user) {
                console.log(`❌ User NOT FOUND for subscription: ${subscription.id} or customer: ${subscription.customer}`);
                return res.json({ received: true });
            }

            console.log(`✅ Found user: ${user.email}`);
            console.log(`Current DB state - Tier: ${user.subscriptionTier}, Status: ${user.subscriptionStatus}, CancelAtPeriodEnd: ${user.cancelAtPeriodEnd}`);

            // Get tier from price ID using the helper function
            const priceId = subscription.items.data[0].price.id;
            const correctTier = getTierFromPriceId(priceId);
            console.log(`Price ID: ${priceId}, Correct tier: ${correctTier}`);

            // Check if subscription is scheduled for cancellation (has cancel_at date)
            if (subscription.cancel_at && !subscription.cancel_at_period_end) {
                console.log('🔴 User CANCELLED subscription - updating pending downgrade');
                const pendingDowngradeDate = subscription.cancel_at ? new Date(subscription.cancel_at * 1000) :
                    (currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null);

                await user.update({
                    subscriptionStatus: subscription.status,
                    cancelAtPeriodEnd: true,
                    pendingDowngradeTier: 'free',
                    pendingDowngradeDate: pendingDowngradeDate
                    // NOT changing subscriptionTier - keep as 'pro' or 'premium'
                });

                console.log(`✅ User ${user.email} scheduled cancellation - will keep ${user.subscriptionTier} until ${pendingDowngradeDate}`);
            }
            // Check if cancellation was removed (reactivation)
            else if (!subscription.cancel_at && user.cancelAtPeriodEnd === true) {
                console.log('🟢 User REACTIVATED subscription - clearing pending downgrade');
                await user.update({
                    cancelAtPeriodEnd: false,
                    pendingDowngradeTier: null,
                    pendingDowngradeDate: null,
                    subscriptionStatus: subscription.status,
                    subscriptionTier: correctTier,  // Use the correct tier from price ID
                    monthlyGenerationLimit: TIER_LIMITS[correctTier].monthlyLimit
                });
                console.log(`✅ Cleared pending downgrade for ${user.email}, now ${correctTier}`);
            }
            // Check if subscription was actually deleted/ended
            else if (subscription.status === 'canceled' || subscription.status === 'incomplete') {
                console.log('⚠️ Subscription is canceled/incomplete - downgrading to free');
                await user.update({
                    subscriptionTier: 'free',
                    monthlyGenerationLimit: TIER_LIMITS.free.monthlyLimit,
                    subscriptionStatus: subscription.status,
                    stripeSubscriptionId: null,
                    pendingDowngradeTier: null,
                    pendingDowngradeDate: null,
                    cancelAtPeriodEnd: false
                });
                console.log(`✅ User ${user.email} downgraded to free`);
            }
            // Normal subscription update (plan change, etc.)
            else {
                console.log('🔄 Normal subscription update');

                // Check if tier actually changed
                if (correctTier !== user.subscriptionTier) {
                    const tierOrder = { free: 0, pro: 1, premium: 2 };
                    const isDowngrade = tierOrder[correctTier] < tierOrder[user.subscriptionTier];

                    if (isDowngrade && correctTier !== 'free') {
                        // Downgrade to lower paid tier - schedule at period end
                        console.log('📅 Scheduling downgrade at period end');
                        const pendingDowngradeDate = currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null;

                        await user.update({
                            pendingDowngradeTier: correctTier,
                            pendingDowngradeDate: pendingDowngradeDate,
                            subscriptionStatus: subscription.status,
                            cancelAtPeriodEnd: false
                            // Keep current subscriptionTier
                        });
                        console.log(`✅ Scheduled downgrade from ${user.subscriptionTier} to ${correctTier} on ${pendingDowngradeDate}`);
                    }
                    else if (correctTier === 'free') {
                        // This should not happen normally - free tier should come from subscription.deleted
                        console.log('⚠️ Unexpected: Direct downgrade to free - ignoring');
                    }
                    else {
                        // Upgrade - apply immediately
                        console.log('⚡ Applying upgrade immediately');
                        await user.update({
                            subscriptionTier: correctTier,
                            monthlyGenerationLimit: TIER_LIMITS[correctTier].monthlyLimit,
                            subscriptionStatus: subscription.status,
                            pendingDowngradeTier: null,
                            pendingDowngradeDate: null,
                            cancelAtPeriodEnd: false
                        });
                        console.log(`✅ Upgraded to ${correctTier} immediately`);
                    }
                } else {
                    console.log(`ℹ️ No tier change - still ${correctTier}`);
                    // Still update status just in case
                    await user.update({
                        subscriptionStatus: subscription.status
                    });
                }
            }

            // Verify the update by fetching fresh from DB
            const updatedUser = await User.findByPk(user.id);
            console.log('=== FINAL DB STATE AFTER UPDATE ===');
            console.log(`subscriptionTier: ${updatedUser.subscriptionTier}`);
            console.log(`subscriptionStatus: ${updatedUser.subscriptionStatus}`);
            console.log(`cancelAtPeriodEnd: ${updatedUser.cancelAtPeriodEnd}`);
            console.log(`pendingDowngradeTier: ${updatedUser.pendingDowngradeTier}`);
            console.log(`pendingDowngradeDate: ${updatedUser.pendingDowngradeDate}`);
        }

        // Handle subscription deleted (subscription actually ends)
        else if (event.type === 'customer.subscription.deleted') {
            console.log('=== PROCESSING customer.subscription.deleted ===');
            const subscription = event.data.object;

            console.log('Subscription deleted:', subscription.id);

            // Try to get userId from metadata, or find by subscription ID
            let userId = subscription.metadata.userId;
            let user = null;

            if (userId) {
                user = await User.findByPk(parseInt(userId));
            } else {
                user = await User.findOne({
                    where: { stripeSubscriptionId: subscription.id }
                });
            }

            if (user) {
                await user.update({
                    subscriptionTier: 'free',
                    subscriptionStatus: 'inactive',
                    stripeSubscriptionId: null,
                    monthlyGenerationLimit: TIER_LIMITS.free.monthlyLimit,
                    pendingDowngradeTier: null,
                    pendingDowngradeDate: null,
                    cancelAtPeriodEnd: false
                });

                console.log(`✅ User ${user.email} subscription fully ended - downgraded to free`);
            }
        }
        else {
            console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });

    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: error.message });
    }
};