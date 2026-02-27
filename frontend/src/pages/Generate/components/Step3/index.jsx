import styles from "./Step3.module.css";
import {useState, useEffect} from "react";
import {generateDeck} from "./services/deck.service.js";
import ViewAllDecks from "./components/ViewAllDecks.jsx";
import DeckPreview from "./components/DeckPreview.jsx";
import HeaderControls from "./components/HeaderControls.jsx";
import Header from "./components/Header.jsx";

export default function Step3({material, deckOptions, generatedDeck, setGeneratedDeck}) {
    const [loading, setLoading] = useState(!generatedDeck);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (generatedDeck) return;

        generateDeck(material, deckOptions)
            .then(setGeneratedDeck)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, []);

    return (
        <div className={styles["step-wrapper"]}>
            <div className={styles["step-container"]}>
                {(loading || !generatedDeck?.result?.cards) ? (
                    <div className={styles["loading-container"]}>
                        <p>Generating your deck</p>
                    </div>
                ) : (
                    <>
                        <Header
                            title="Ready to Export"
                            subtitle="Download your deck as an Anki file"
                        />
                        <HeaderControls
                            title={generatedDeck?.result?.deckName || ''}
                            numItems={generatedDeck?.result?.cards?.length || 0}
                            generatedDeck={generatedDeck}
                        />
                        <DeckPreview
                            cards={generatedDeck?.result?.cards || []}
                        />
                        <ViewAllDecks
                            cards={generatedDeck?.result?.cards || []}
                        />
                    </>
                )}
            </div>
        </div>
    )
}