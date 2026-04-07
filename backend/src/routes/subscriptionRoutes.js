import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
    createCheckout,
    checkCanGenerate,
    downgradeSubscription,
    createPortalSession,
    getUsage
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.post("/create-checkout", requireAuth, createCheckout);
router.get("/can-generate", requireAuth, checkCanGenerate);
router.post("/create-portal-session", requireAuth, createPortalSession);
router.get("/usage", requireAuth, getUsage);
router.post("/downgrade", requireAuth, downgradeSubscription);

export default router;