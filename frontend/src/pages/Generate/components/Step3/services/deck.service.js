const API_URL = import.meta.env.VITE_API_URL;

export async function generateDeck(material, deckOptions) {
    const body = JSON.stringify({
        material: material.type === "file" ? material.file.text : material.text,
        deckOptions,
    });

    const res = await fetch(`${API_URL}/openai/generate`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Something went wrong while generating.");
    }

    return res.json();
}

export async function exportDeckApkg(deckName, cards) {
    const res = await fetch(`${API_URL}/file-export/export-apkg`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            deckName: deckName,
            cards: cards,
        }),
    });

    if (!res.ok) {
        throw new Error("Failed to export deck");
    }

    return await res.blob();
}