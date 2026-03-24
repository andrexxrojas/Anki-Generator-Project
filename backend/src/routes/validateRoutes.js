import express from "express";
import {validateFile} from "../controllers/validateController.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/validate", upload.single("file"), validateFile);

export default router;