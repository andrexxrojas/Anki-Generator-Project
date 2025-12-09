import Deck from "../models/Deck.js";
import Card from "../models/Card.js";

// Create a deck
export const createDeck = async (req, res) => {
    try {
        const {title, description} = req.body;

        const deck = await Deck.create({
            title,
            description
        });

        res.json(deck);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Error creating deck"});
    }
};

// Get all decks
export const getDecks = async (req, res) => {
    try {
        const decks = await Deck.findAll({
            include: [Card]
        });

        res.json(decks);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Error fetching decks"});
    }
};

// Get a single deck by id
export const getDeckById = async (req, res) => {
    try {
        const {deckId} = req.params;

        const deck = await Deck.findByPk(deckId, {
            include: [Card]
        });

        if (!deck) {
            return res.status(404).json({message: "Deck not found"});
        }

        res.json(deck);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Error fetching deck"});
    }
};

// Delete a deck
export const deleteDeck = async (req, res) => {
    try {
        const {deckId} = req.params;

        await Card.destroy({where: {deckId}});
        await Deck.destroy({where: {id: deckId}});

        res.json({message: "Deck deleted"});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Error deleting deck"});
    }
};

// Update deck
export const updateDeck = async (req, res) => {
    try {
        const {deckId} = req.params;
        const {title, description, cards} = req.body;

        // 1. Update deck info
        await Deck.update(
            {title, description},
            {where: {id: deckId}}
        );

        // 2. Get current cards in DB
        const existingCards = await Card.findAll({where: {deckId}});
        const existingIds = existingCards.map(c => c.id);

        // 3. Get ids coming from a client
        const incomingIds = cards.filter(c => c.id).map(c => c.id);

        // 4. Delete removed cards
        const cardsToDelete = existingIds.filter(id => !incomingIds.includes(id));
        if (cardsToDelete.length > 0) {
            await Card.destroy({where: {id: cardsToDelete}});
        }

        // 5. Add or update cards
        for (let card of cards) {
            if (card.id) {
                // Update existing card
                await Card.update(
                    {front: card.front, back: card.back},
                    {where: {id: card.id}}
                );
            } else {
                // Create a new card
                await Card.create({
                    front: card.front,
                    back: card.back,
                    deckId
                });
            }
        }

        res.json({message: "Deck updated successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Error updating deck"});
    }
};




















