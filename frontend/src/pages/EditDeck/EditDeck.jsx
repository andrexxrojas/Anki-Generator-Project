import styles from "./EditDeck.module.css";
import HeaderControls from "./components/HeaderControls.jsx";
import DeckPreview from "./components/DeckPreview.jsx";
import ViewAllDecks from "./components/ViewAllDecks.jsx";
import {getDeck, updateDeck} from "./services/deck.service.js";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

export default function EditDeck() {
    const [deck, setDeck] = useState(null);
    const [loading, setLoading] = useState(!deck);

    const { id } = useParams();

    useEffect(() => {
        const fetchDeck = async () => {
            if (!id) return;

            try {
                getDeck(id)
                    .then(deck => setDeck(deck))
                    .catch(err => console.log(err))
                    .finally(() => setLoading(false));
            } catch (err) {
                console.error("Failed to fetch deck:", err);
            }
        }

        void fetchDeck();
    }, [id]);

    const handleUpdateCard = async (index, updatedData) => {
        const updatedCards = [...deck.Cards];
        updatedCards[index] = {
            ...updatedCards[index],
            ...updatedData
        };

        setDeck({
            ...deck,
            Cards: updatedCards
        });

        try {
            await updateDeck(deck.id, {
                title: deck.title,
                description: deck.description,
                cards: updatedCards
            });
        } catch (err) {
            console.error("Failed to update card:", err);
        }
    }

    return (
        <div className={styles["edit-wrapper"]}>
            <div className={styles["edit-container"]}>
                {loading ? (
                    <div className={styles["loading-container"]}>
                        <p>Loading your deck...</p>
                    </div>
                ) : (
                    <>
                        <HeaderControls
                            title={deck.title}
                            numItems={deck.Cards.length || 0}
                            deck={deck}
                        />
                        <DeckPreview
                            cards={deck.Cards}
                        />
                        <ViewAllDecks
                            cards={deck.Cards}
                            onUpdateCard={handleUpdateCard}
                        />
                    </>
                )}
            </div>
        </div>
    )
}