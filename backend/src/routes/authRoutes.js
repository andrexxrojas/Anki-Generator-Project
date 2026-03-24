import express from "express";
import {register, login, logout, me} from "../controllers/authController.js";
import {guestMiddleware} from "../middleware/guestMiddleware.js";

const router = express.Router();

router.post("/register", guestMiddleware, register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", me);

export default router;