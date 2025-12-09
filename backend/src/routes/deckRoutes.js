import express from "express";
import {requireAuth} from "../middleware/authMiddleware.js";
import {
    createDeck,
    getDecks,
    getDeckById,
    deleteDeck,
    updateDeck
} from "../controllers/deckController.js";

const router = express.Router();

router.post("/create-deck", requireAuth, createDeck);
router.get("/", requireAuth, getDecks);
router.get("/:deckId", requireAuth, getDeckById);
router.put("/:deckId", requireAuth, updateDeck);
router.delete("/:deckId", requireAuth, deleteDeck);

export default router;