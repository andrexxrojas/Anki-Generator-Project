import Guest from "../models/Guest.js";
import User from "../models/User.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const generateContent = async (req, res) => {
    try {
        const {material, deckOptions} = req.body;

        if (!material || !deckOptions) {
            return res.status(400).json({message: "Missing material or deckOptions"});
        }

        const entity = req.user || req.guest;

        if (!entity) {
            return res.status(500).json({message: "Missing user/guest"});
        }

        if (entity.generationsUsed >= entity.freeGenerations) {
            return res.status(403).json({ message: "Free generation limit reached" });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: buildDeckPrompt(material, deckOptions),
            config: {
                responseMimeType: "application/json",
                temperature: 0.2,
            }
        });

        const result = response.text;

        // Update quota
        entity.generationsUsed++;
        await entity.save();

        return res.json({
            result: JSON.parse(result),
            used: entity.generationsUsed,
            remaining: Math.max(0, entity.freeGenerations - entity.generationsUsed)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({message: "OpenAI error"});
    }
};

function buildDeckPrompt(material, deckOptions) {
    return `
You are an Anki card generator.
Your job is to create flashcards strictly from the provided material and deck settings.

OUTPUT MUST BE A VALID JSON OBJECT ONLY.

JSON FORMAT:
{
  "deckName": string,
  "tags": string[]
  "cards": [
    {
      "type": "basic" | "reversible" | "multiple-choice" | "cloze",
      "front": string,
      "back": string
    }
  ]
}

DECK SETTINGS:
- Deck Name: ${deckOptions.deckName}
- Card Types: ${deckOptions.cardTypes.join(", ")}
- Card Number: Exactly ${deckOptions.cardLimit}
- Card Styles: ${deckOptions.cardStyles.join(", ")}

TAG RULES:
1. Generate EXACTLY 3 tags (no more, no less)
2. Tags should be:
   - Capitalized (first letter uppercase, rest lowercase)
   - Single words only (no spaces, no hyphens)
   - Most relevant to the material
   - Broad category tags that are useful for filtering
3. Follow this priority for tag selection:
   - First tag: Main subject/category (e.g., "Spanish", "Biology", "Programming")
   - Second tag: Sub-category or focus area (e.g., "Vocabulary", "Cells", "JavaScript")
   - Third tag: Difficulty or type (e.g., "Beginner", "Concepts", "Practice")
4. NO DUPLICATES - ensure all 3 tags are distinct
5. IMPORTANT: Each tag must be Capitalized (e.g., "Spanish", not "spanish" or "SPANISH")

RULES:
- Use ONLY content from the provided material.
- Follow the card styles exactly.
- For multiple-choice:
  - Put question + choices (A., B., C...) in FRONT.
  - BACK contains ONLY the correct answer.
- For cloze:
  - FRONT must have the blanks instead of the answers (e.g., "The sky is ___").
  - BACK must have the full text with the answer (e.g., "The sky is blue").
- Reversible creates two cards swapping front/back.
- Use bullet points only when “bulleted” style is selected.
- Generate exactly ${deckOptions.cardLimit} cards.
- Escape all quotes.
- No extra commentary.

MATERIAL:
"""
${material}
"""
`;
}

