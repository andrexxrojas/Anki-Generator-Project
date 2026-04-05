import stripe, { PRICE_IDS, TIER_LIMITS } from '../config/stripe.js';
import User from '../models/User.js';

class SubscriptionService {
    async createCheckoutSession(userId, priceId, successUrl, cancelUrl) {
        const user = await User.findByPk(userId);

        let tier = 'free';
        if (priceId === PRICE_IDS.pro_monthly) tier = 'pro';
        if (priceId === PRICE_IDS.premium_monthly) tier = 'premium';

        const session = await stripe.checkout.sessions.create({
            customer: user.stripeCustomerId || undefined,
            customer_email: !user.stripeCustomerId ? user.email : undefined,
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                userId: user.id.toString(),
                tier: tier,
            },
            subscription_data: {
                metadata: {
                    userId: user.id.toString(),
                    tier: tier,
                },
            },
        });

        return { sessionId: session.id, url: session.url };
    }

    async canGenerateDeck(userId) {
        const user = await User.findByPk(userId);
        if (!user) return false;

        const limits = TIER_LIMITS[user.subscriptionTier];
        return user.monthlyGenerationsUsed < limits.monthlyLimit;
    }

    async incrementUsage(userId) {
        const user = await User.findByPk(userId);
        if (user) {
            await user.increment('monthlyGenerationsUsed');
            await user.increment('totalDecksGenerated');
        }
    }

    async getUserLimits(userId) {
        const user = await User.findByPk(userId);
        if (!user) return null;

        const now = new Date();
        const lastReset = new Date(user.lastResetDate);

        if (now.getMonth() !== lastReset.getMonth() ||
            now.getFullYear() !== lastReset.getFullYear()) {
            // Reset monthly usage
            user.monthlyGenerationsUsed = 0;
            user.lastResetDate = now;
            await user.save();
        }

        const limits = TIER_LIMITS[user.subscriptionTier];

        return {
            used: user.monthlyGenerationsUsed,
            limit: limits.monthlyLimit,
            tier: user.subscriptionTier,
            totalDecksGenerated: user.totalDecksGenerated
        };
    }
}

export default new SubscriptionService();