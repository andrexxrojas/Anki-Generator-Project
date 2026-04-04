const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Material {
    type: "file" | "text" | null;
    file: File | null;
    text: string | "";
}

interface DeckOptions {
    deckName: string;
    cardTypes: string[];
    cardLimit: number | null;
    cardStyles: string[];
}

export async function generateDeck(material: Material, deckOptions: DeckOptions) {
    const body = JSON.stringify({
        material: material.type === "file" ? material.file?.text : material.text,
        deckOptions,
    });

    const res = await fetch(`${API_URL}/ai/generate`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Something went wrong while generating.");
    }

    return res.json();
}

interface GeneratedCard {
    type: "basic" | "reversible" | "multiple-choice" | "cloze";
    front: string;
    back: string;
}

export async function exportDeckApkg(deckName: string, cards: GeneratedCard[]) {
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

interface Deck {
    title: string;
    cards: GeneratedCard[];
    tags?: string[];
}

export async function saveDeck(deck: Deck) {
    const res = await fetch(`${API_URL}/deck/save-deck`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(deck),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save deck");
    }

    return res.json();
}

interface GenerationStats {
    generationsUsed: number;
    generationsLimit: number;
    generationsLeft: number;
}

export async function getGenerationStats(): Promise<GenerationStats> {
    const res = await fetch(`${API_URL}/ai/generation-stats`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch generation stats");
    }

    return res.json();
}