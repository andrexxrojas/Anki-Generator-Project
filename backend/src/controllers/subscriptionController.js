import subscriptionService from "../services/subscriptionService.js";
import User from "../models/User.js";
import stripe from "../config/stripe.js"; // Add this import for getUsage

export const createCheckout = async (req, res) => {
    try {
        // Get userId from authenticated user (from your auth middleware)
        const userId = req.user.id;  // ← Changed from req.body
        const { priceId } = req.body; // Only priceId comes from request body

        const successUrl = `${process.env.FRONTEND_URL}/subscription/success`;
        const cancelUrl = `${process.env.FRONTEND_URL}/subscription/cancel`;

        const session = await subscriptionService.createCheckoutSession(
            userId,
            priceId,
            successUrl,
            cancelUrl
        );

        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const downgradeSubscription = async (req, res) => {
    try {
        const user = req.user;
        const { newPriceId, newTier } = req.body; // newTier: 'free' or 'pro'

        if (!user.stripeSubscriptionId) {
            return res.status(400).json({ message: "No active subscription found" });
        }

        // For downgrading to free (cancel subscription)
        if (newTier === 'free') {
            // Cancel at period end (they keep access until billing period ends)
            await stripe.subscriptions.update(user.stripeSubscriptionId, {
                cancel_at_period_end: true
            });

            await user.update({
                subscriptionStatus: 'canceled'
                // Don't change tier yet - keep pro until period end
            });

            return res.json({
                message: "Subscription will be canceled at end of billing period",
                effectiveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
        }

        // For downgrading from premium to pro
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

        await stripe.subscriptions.update(user.stripeSubscriptionId, {
            items: [{
                id: subscription.items.data[0].id,
                price: newPriceId,
            }],
            proration_behavior: 'none', // Downgrade at period end
        });

        // Store pending downgrade
        await user.update({
            pendingDowngradeTier: newTier,
            pendingDowngradeDate: new Date(subscription.current_period_end * 1000)
        });

        res.json({
            message: `Downgrade to ${newTier} will take effect at end of billing period`,
            effectiveDate: new Date(subscription.current_period_end * 1000)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error downgrading subscription" });
    }
};

export const checkCanGenerate = async (req, res) => {
    try {
        // Also update this to use req.user instead of params for security
        const userId = req.user.id;  // ← Changed from req.params.userId
        const canGenerate = await subscriptionService.canGenerateDeck(userId);
        res.json({ canGenerate });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUsage = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.json({
            used: user.monthlyGenerationsUsed,
            limit: user.monthlyGenerationLimit,
            totalDecksGenerated: user.totalDecksGenerated,
            tier: user.subscriptionTier
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};