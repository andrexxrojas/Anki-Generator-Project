import Deck from "../models/Deck.js";
import Card from "../models/Card.js";
import crypto from "crypto";

// Helper to create hash of deck content
const createDeckHash = (cards, tags = []) => {
    // Create a consistent string representation
    const sortedCards = [...cards]
        .map(card => ({
            front: (card.front || '').toLowerCase().trim(),
            back: (card.back || '').toLowerCase().trim(),
            type: card.type || 'basic'
        }))
        .sort((a, b) => a.front.localeCompare(b.front));

    const sortedTags = [...tags].sort();

    const contentString = JSON.stringify({
        cards: sortedCards,
        tags: sortedTags
    });

    return crypto.createHash('md5').update(contentString).digest('hex');
};

// Create a deck
export const createDeck = async (req, res) => {
    try {
        const entity = req.user || req.guest;
        if (!entity) return res.status(401).json({message: "Not authorized"});

        const {title, description, tags, cards = []} = req.body;

        let deckHash = "";
        if (cards && cards.length > 0) {
            deckHash = createDeckHash(cards, tags || []);

            const existingDeck = await Deck.findOne({
                where: {
                    ownerType: req.user ? "user" : "guest",
                    ownerId: entity.id,
                    deckHash: deckHash
                }
            });

            if (existingDeck) {
                return res.status(409).json({
                    message: "This deck already exists!",
                    deckId: existingDeck.id
                });
            }
        }

        const deck = await Deck.create({
            title,
            description,
            tags: tags || [],
            deckHash: deckHash || '',
            ownerType: req.user ? "user" : "guest",
            ownerId: entity.id,
            ...(req.user && { userId: req.user.id })
        });

        if (cards && cards.length > 0) {
            await Card.bulkCreate(
                cards.map(c => ({
                    deckId: deck.id,
                    front: c.front,
                    back: c.back,
                    type: c.type || "basic"
                }))
            );
        }

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

// Update deck title
export const updateDeckTitle = async (req, res) => {
    try {
        const { deckId } = req.params;
        const { title } = req.body;

        if (!title || title.trim() === '') {
            return res.status(400).json({ message: "Title cannot be empty" });
        }

        const deck = await Deck.findByPk(deckId);
        if (!deck) {
            return res.status(404).json({ message: "Deck not found" });
        }

        deck.title = title.trim();
        await deck.save();

        res.json({
            message: "Title updated successfully",
            deck: deck
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating deck title" });
    }
};

// Save a deck
export const saveDeck = async (req, res) => {
    try {
        const entity = req.user || req.guest;
        const entityType = req.user ? "user" : "guest";

        if (!entity) return res.status(401).json({ message: "Not authorized" });

        const { title, description, cards, tags = [] } = req.body;

        if (!title || !cards?.length) {
            return res.status(400).json({ message: "Invalid deck data" });
        }

        const deckHash = createDeckHash(cards, tags);

        let deck;
        let isUpdate = false;
        let action = "created";

        const hasPendingMigration = req.cookies?.pendingDeckMigration === "1";

        if (req.user) {
            const existingDeck = await Deck.findOne({
                where: {
                    ownerType: "user",
                    ownerId: req.user.id,
                    deckHash: deckHash
                }
            });

            if (existingDeck) {
                return res.status(200).json({
                    message: "This deck has already been saved!",
                    deckId: existingDeck.id,
                    deckTitle: existingDeck.title,
                    action: "already_exists",
                    entity: "user",
                    entityId: req.user.id,
                });
            }

            if (hasPendingMigration && req.guest) {
                const guestDeck = await Deck.findOne({
                    where: { ownerType: "guest", ownerId: req.guest.id }
                });

                if (guestDeck) {
                    await guestDeck.update({
                        title,
                        description,
                        tags: tags,
                        deckHash,
                        ownerType: "user",
                        ownerId: req.user.id,
                        userId: req.user.id
                    });

                    await Card.destroy({ where: { deckId: guestDeck.id } });
                    deck = guestDeck;
                    action = "migrated";

                    res.clearCookie("pendingDeckMigration");
                    res.clearCookie("guestId");
                } else {
                    deck = await Deck.create({
                        title,
                        description,
                        tags: tags,
                        deckHash,
                        ownerType: "user",
                        ownerId: req.user.id,
                        userId: req.user.id,
                    });
                }
            } else {
                deck = await Deck.create({
                    title,
                    description,
                    tags: tags,
                    deckHash,
                    ownerType: "user",
                    ownerId: req.user.id,
                    userId: req.user.id,
                });
            }
        } else {
            const existingDeck = await Deck.findOne({
                where: {
                    ownerType: "guest",
                    ownerId: entity.id,
                    deckHash: deckHash
                }
            });

            if (existingDeck) {
                return res.json({
                    entity: "guest",
                    entityId: entity.id,
                    message: "This deck is ready for migration! Sign up to keep it permanently.",
                    deckId: existingDeck.id,
                    tags: existingDeck.tags,
                    action: "already_exists_guest",
                    requiresSignup: true
                });
            }

            res.cookie("pendingDeckMigration", "1", {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 10 * 60 * 1000
            });

            deck = await Deck.findOne({
                where: { ownerType: "guest", ownerId: entity.id }
            });

            if (deck) {
                await deck.update({
                    title,
                    description,
                    tags: tags,
                    deckHash
                });
                await Card.destroy({ where: { deckId: deck.id } });
                action = "updated";
            } else {
                deck = await Deck.create({
                    title,
                    description,
                    tags: tags,
                    deckHash,
                    ownerType: "guest",
                    ownerId: entity.id
                });
            }

            return res.json({
                entity: "guest",
                entityId: entity.id,
                message: "Deck saved temporarily! Sign up to keep it permanently.",
                deckId: deck.id,
                tags: deck.tags,
                action: action,
                requiresSignup: true
            });
        }

        await Card.bulkCreate(
            cards.map(c => ({
                deckId: deck.id,
                front: c.front,
                back: c.back,
                type: c.type || "basic"
            }))
        );

        return res.json({
            entity: entityType,
            entityId: entity.id,
            message: action === "migrated" ? "Deck migrated successfully!" :
                action === "updated" ? "Deck updated successfully!" :
                    "Deck saved successfully!",
            deckId: deck.id,
            tags: deck.tags,
            action: action
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to save deck" });
    }
};

// Get user decks
export const getUserDecks = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authorized" });

        const decks = await Deck.findAll({
            where: {
                ownerType: "user",
                ownerId: String(req.user.id)
            },
            include: [Card]
        });

        const decksWithUser = decks.map(deck => ({
            ...deck.toJSON(),
            username: req.user.username,
        }))

        res.json(decksWithUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching decks" });
    }
};



















