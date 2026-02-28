const API_URL = import.meta.env.VITE_API_URL;

export async function getDeck(id) {
    const res = await fetch(`${API_URL}/deck/${id}`, {
        method: "GET",
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch deck");
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

export const updateDeckTitle = async (deckId, title) => {
    const res = await fetch(`${API_URL}/deck/${deckId}/title`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title }),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update deck title");
    }

    return res.json();
};

export const updateDeck = async (deckId, deckData) => {
    const res = await fetch(`${API_URL}/deck/${deckId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(deckData),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update deck");
    }

    return res.json();
};