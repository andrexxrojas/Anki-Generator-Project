import express from "express";
import {requireAuth} from "../middleware/authMiddleware.js";
import {guestMiddleware} from "../middleware/guestMiddleware.js";
import {
    createDeck,
    getDecks,
    getDeckById,
    deleteDeck,
    updateDeck,
    saveDeck, getUserDecks
} from "../controllers/deckController.js";

const router = express.Router();

router.post("/create-deck", requireAuth, createDeck);
router.get("/my-decks", requireAuth, getUserDecks);
router.get("/:deckId", requireAuth, getDeckById);
router.put("/:deckId", requireAuth, updateDeck);
router.delete("/:deckId", requireAuth, deleteDeck);
router.post("/save-deck", guestMiddleware, saveDeck);

export default router;