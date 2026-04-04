import express from "express";
import {authMiddlewareOptional} from "../middleware/authMiddlewareOptional.js";
import {guestMiddleware} from "../middleware/guestMiddleware.js";
import {checkQuota} from "../middleware/checkQuota.js";
import {generateContent, getGenerationStats} from "../controllers/generateController.js";

const router = express.Router();

// Guest OR user → allowed
router.post(
    "/generate",
    authMiddlewareOptional, // sets req.user if logged in
    guestMiddleware,        // creates/finds guest if not logged in
    checkQuota,             // enforces 15-limit
    generateContent
);

router.get("/generation-stats", guestMiddleware, getGenerationStats);

export default router;
