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