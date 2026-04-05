import subscriptionService from "../services/subscriptionService.js";

export const checkQuota = async (req, res, next) => {
    const user = req.user;
    const guest = req.guest;

    const entity = user || guest;

    if (!entity) {
        return res.status(500).json({message: "No user or guest found"});
    }

    if (req.user) {
        const canGenerate = await subscriptionService.canGenerateDeck(req.user.id);

        if (!canGenerate) {
            const limits = await subscriptionService.getUserLimits(req.user.id);
            return res.status(403).json({
                message: "Monthly generation limit reached. Upgrade your plan to continue generating.",
                used: limits.used,
                limit: limits.limit,
                tier: limits.tier
            });
        }
    } else {
        if (entity.generationsUsed >= entity.freeGenerations) {
            return res.status(403).json({
                message: "You have used all 15 free AI generations. Sign up for an account to get more!"
            });
        }
    }

    next();
};