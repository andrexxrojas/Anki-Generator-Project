const API_URL = import.meta.env.VITE_API_URL;

export async function getDecks() {
    const res = await fetch(`${API_URL}/deck/my-decks`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch decks");
    }

    return res.json();
}

export async function deleteDeck(id) {
    const res = await fetch(`${API_URL}/deck/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Failed to delete deck");
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