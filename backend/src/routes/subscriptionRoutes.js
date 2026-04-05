import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
    createCheckout,
    checkCanGenerate,
    downgradeSubscription,
    getUsage
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.post("/create-checkout", requireAuth, createCheckout);
router.get("/can-generate", requireAuth, checkCanGenerate);
router.get("/usage", requireAuth, getUsage);
router.post("/downgrade", requireAuth, downgradeSubscription);

export default router;