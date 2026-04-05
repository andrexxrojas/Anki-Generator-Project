import express from "express";
import {register, login, logout, me, deleteAccount, getProfile} from "../controllers/authController.js";
import {guestMiddleware} from "../middleware/guestMiddleware.js";
import {requireAuth} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", guestMiddleware, register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", me);
router.get("/profile", requireAuth, getProfile);
router.delete("/delete-account", requireAuth, deleteAccount);

export default router;