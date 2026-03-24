export const checkQuota = async (req, res, next) => {
    const user = req.user;
    const guest = req.guest;

    const entity = user || guest; // whichever exists

    if (!entity) {
        return res.status(500).json({message: "No user or guest found"});
    }

    if (entity.generationsUsed >= entity.freeGenerations) {
        return res.status(403).json({
            message: "You have used all 15 free AI generations."
        });
    }

    next();
};
