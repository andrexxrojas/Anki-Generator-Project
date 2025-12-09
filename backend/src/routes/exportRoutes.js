import express from "express";
import {exportDeck} from "../controllers/exportController.js";

const router = express.Router();

router.post("/export-apkg", exportDeck);

export default router;