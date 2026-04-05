import subscriptionService from "../services/subscriptionService.js";
import User from "../models/User.js"; // Add this import for getUsage

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