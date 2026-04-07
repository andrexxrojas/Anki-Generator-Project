import express from "express";
import {validateFile, validateText} from "../controllers/validateController.js";
import multer from "multer";
import {guestMiddleware} from "../middleware/guestMiddleware.js";

const router = express.Router();
const upload = multer();

router.post("/validate", upload.single("file"), validateFile);
router.post("/validate-text", guestMiddleware, validateText);

export default router;