import express from "express";
import {authMiddlewareOptional} from "../middleware/authMiddlewareOptional.js";
import {guestMiddleware} from "../middleware/guestMiddleware.js";
import {checkQuota} from "../middleware/checkQuota.js";
import {generateContent, getGenerationStats, getTotalGenerations} from "../controllers/generateController.js";

const router = express.Router();

// Track in-progress requests
const activeGenerations = new Set();

// Middleware to prevent duplicate generation requests
const preventDuplicateGeneration = (req, res, next) => {
    const userId = req.user?.id || req.guest?.guestId;
    const key = `generating:${userId}`;

    if (activeGenerations.has(key)) {
        return res.status(429).json({
            message: "Generation already in progress. Please wait."
        });
    }

    activeGenerations.add(key);

    // Remove after 30 seconds (safety timeout)
    setTimeout(() => {
        activeGenerations.delete(key);
    }, 30000);

    next();
};

router.post(
    "/generate",
    authMiddlewareOptional,
    guestMiddleware,
    checkQuota,
    preventDuplicateGeneration,
    generateContent
);

router.get("/generation-stats", guestMiddleware, getGenerationStats);
router.get("/total-generations", getTotalGenerations);

export default router;