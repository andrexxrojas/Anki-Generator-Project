import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

const extractTextFromPdf = async (pdfBuffer) => {
    try {
        const unit8Array = new Uint8Array(pdfBuffer);
        const parser = new PDFParse(unit8Array);
        const data = await parser.getText();
        return data.text;
    } catch (error) {
        console.error("Internal PDF parsing error:", error);
        throw new Error("Could not parse PDF content.");
    }
}

const getCharacterLimit = (user, isGuest) => {
    if (isGuest || !user) {
        return 8000;
    }

    switch (user.subscriptionTier) {
        case 'premium':
            return 15000;
        case 'pro':
            return 8000;
        case 'free':
        default:
            return 3000;
    }
};

export const validateFile = async (req, res) => {
    try {
        const file = req.file;

        // Get user from request (set by auth middleware)
        const user = req.user;
        const isGuest = !user;

        if (!file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        const { originalname, buffer } = file;

        const ext = originalname.split(".").pop().toLowerCase();

        if (!["pdf", "docx"].includes(ext)) {
            return res.status(400).json({
                error: "Invalid file type. Only .pdf and .docx are allowed.",
            });
        }

        let extractedText = "";

        if (ext === "pdf") {
            const text = await extractTextFromPdf(buffer);
            extractedText = text || "";

        } else if (ext === "docx") {
            const result = await mammoth.extractRawText({ buffer });
            extractedText = result.value || "";
        }

        if (!extractedText.trim()) {
            return res.status(400).json({
                error: "File content could not be read or is empty.",
            });
        }

        // Get character count instead of word count
        const characterCount = extractedText.trim().length;
        const characterLimit = getCharacterLimit(user, isGuest);

        if (characterCount > characterLimit) {
            const tierName = isGuest ? "guest" : user.subscriptionTier;
            return res.status(400).json({
                error: `Document exceeds maximum character limit for ${tierName} tier. Found ${characterCount.toLocaleString()} characters, maximum allowed is ${characterLimit.toLocaleString()}.`,
                characterCount: characterCount,
                characterLimit: characterLimit,
                tier: isGuest ? "guest" : user.subscriptionTier
            });
        }

        return res.status(200).json({
            message: "File validated successfully.",
            text: extractedText,
            characterCount: characterCount,
            characterLimit: characterLimit,
            tier: isGuest ? "guest" : user.subscriptionTier
        });

    } catch (err) {
        console.error("File validation error:", err);
        return res.status(500).json({
            error: "An error occurred while validating the file.",
            details: err.message
        });
    }
};

export const validateText = async (req, res) => {
    try {
        const { text } = req.body;
        const user = req.user;
        const isGuest = !user;

        if (!text || !text.trim()) {
            return res.status(400).json({
                error: "Text content is empty."
            });
        }

        const characterCount = text.trim().length;
        const characterLimit = getCharacterLimit(user, isGuest);

        if (characterCount > characterLimit) {
            const tierName = isGuest ? "guest" : user.subscriptionTier;
            return res.status(400).json({
                error: `Text exceeds maximum character limit for ${tierName} tier. Found ${characterCount.toLocaleString()} characters, maximum allowed is ${characterLimit.toLocaleString()}.`,
                characterCount: characterCount,
                characterLimit: characterLimit,
                tier: isGuest ? "guest" : user.subscriptionTier
            });
        }

        return res.status(200).json({
            message: "Text validated successfully.",
            text: text,
            characterCount: characterCount,
            characterLimit: characterLimit,
            tier: isGuest ? "guest" : user.subscriptionTier
        });

    } catch (err) {
        console.error("Text validation error:", err);
        return res.status(500).json({
            error: "An error occurred while validating the text.",
            details: err.message
        });
    }
};