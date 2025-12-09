import mammoth from "mammoth";
import {PDFParse} from "pdf-parse";

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

export const validateFile = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({error: "No file uploaded."});
        }

        const {originalname, buffer} = file;

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
            // Validate + extract DOCX using mammoth
            const result = await mammoth.extractRawText({buffer});
            extractedText = result.value || "";
        }

        if (!extractedText.trim()) {
            return res.status(400).json({
                error: "File content could not be read or is empty.",
            });
        }

        const wordCount = extractedText.trim().split(/\s+/).length;

        if (wordCount > 500) {
            return res.status(400).json({
                error: `Document exceeds maximum word count. Found ${wordCount} words, maximum allowed is 500.`,
                wordCount: wordCount
            });
        }

        return res.status(200).json({
            message: "File validated successfully.",
            text: extractedText,
            wordCount: wordCount
        });

    } catch (err) {
        console.error("File validation error:", err);
        return res.status(500).json({
            error: "An error occurred while validating the file.",
            details: err.message
        });
    }
};