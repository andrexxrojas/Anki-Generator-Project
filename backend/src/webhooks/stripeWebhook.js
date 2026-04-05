import stripe from '../config/stripe.js';
import User from '../models/User.js';
import { TIER_LIMITS } from '../config/stripe.js';

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

    try {
        if (event.type === 'invoice.paid' || event.type === 'invoice.payment_succeeded') {
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

            // Get metadata from the invoice parent
            let userId = null;
            let tier = null;

            if (invoice.parent && invoice.parent.subscription_details && invoice.parent.subscription_details.metadata) {
                userId = invoice.parent.subscription_details.metadata.userId;
                tier = invoice.parent.subscription_details.metadata.tier;
            }

            // Also check line item metadata as fallback
            if ((!userId || !tier) && invoice.lines && invoice.lines.data && invoice.lines.data[0]) {
                const lineMetadata = invoice.lines.data[0].metadata;
                userId = lineMetadata.userId || userId;
                tier = lineMetadata.tier || tier;
            }

            if (subscriptionId && userId && tier) {
                const user = await User.findByPk(parseInt(userId));

                if (user) {
                    user.stripeCustomerId = invoice.customer;
                    user.stripeSubscriptionId = subscriptionId;
                    user.subscriptionTier = tier;
                    user.subscriptionStatus = 'active';
                    user.monthlyGenerationLimit = TIER_LIMITS[tier].monthlyLimit;
                    user.monthlyGenerationsUsed = 0;

                    await user.save();
                }
            }
        }

        else if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object;
            const userId = subscription.metadata.userId;

            if (userId) {
                const user = await User.findByPk(parseInt(userId));
                if (user) {
                    await user.update({
                        subscriptionTier: 'free',
                        subscriptionStatus: 'inactive',
                        stripeSubscriptionId: null,
                        monthlyGenerationLimit: TIER_LIMITS.free.monthlyLimit,
                    });
                }
            }
        }

        res.json({ received: true });

    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: error.message });
    }
};