import pkg from "anki-apkg-export";

const AnkiExport = pkg.default;

export const exportDeck = async (req, res) => {
    try {
        const {deckName, cards} = req.body;

        if (!deckName || !cards || !Array.isArray(cards)) {
            return res.status(400).json({message: "Missing deckName or cards"});
        }

        const apkg = new AnkiExport(deckName);

        cards.forEach((card) => {
            if (card.type === "basic" || card.type === "multiple-choice") {
                apkg.addCard(card.front, card.back);
            } else if (card.type === "reversible") {
                apkg.addCard(card.front, card.back);
                apkg.addCard(card.back, card.front);
            } else if (card.type === "cloze") {
                apkg.addCard(card.front, card.back);
            }
        });

        const zip = await apkg.save(); // returns a Buffer

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${deckName}.apkg"`
        );
        res.setHeader("Content-Type", "application/octet-stream");
        res.end(zip);
    } catch (err) {
        console.error("Anki export error:", err);
        res.status(500).json({message: "Failed to generate Anki deck"});
    }
}