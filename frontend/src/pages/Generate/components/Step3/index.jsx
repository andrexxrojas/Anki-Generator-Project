import styles from "./Step3.module.css";
import {useState, useEffect} from "react";

const Header = ({title, subtitle}) => {
    return (
        <div className={styles["header"]}>
            <h4 className={styles["header-title"]}>{title}</h4>
            <p className={styles["header-subtitle"]}>{subtitle}</p>
        </div>
    )
}

const HeaderControls = ({title, numItems, generatedDeck}) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const handleExport = async () => {
        console.log("Export button clicked. generatedDeck:", generatedDeck);
        if (!generatedDeck) return;

        const res = await fetch(`${API_URL}/file-export/export-apkg`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                deckName: generatedDeck.result.deckName,
                cards: generatedDeck.result.cards,
            }),
        });

        if (!res.ok) {
            alert("Failed to export deck");
            return;
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${generatedDeck.result.deckName}.apkg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };


    return (
        <div className={styles["header-controls"]}>
            <div className={styles["header-info"]}>
                <h4 className={styles["header-info-title"]}>{title}</h4>
                <p className={styles["header-info-subtitle"]}>{numItems} Items</p>
                <button className={styles["header-info-menu"]}>
                    <div className={styles["menu-logo"]}>
                        <div className={styles["circle"]}></div>
                        <div className={styles["circle"]}></div>
                        <div className={styles["circle"]}></div>
                    </div>
                </button>
            </div>
            <div className={styles["buttons-container"]}>
                <button className={`${styles["btn"]} ${styles["save"]}`}>
                    <span className={styles["btn-txt"]}>Save</span>
                    <span className={styles["btn-logo"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M8.5858 0C8.851 0 9.10535 0.105355 9.2929 0.292895L10.7071 1.7071C10.8946 1.89464 11 2.149 11 2.41422V9.5C11 10.3285 10.3285 11 9.5 11H1.5C0.671575 11 0 10.3285 0 9.5V1.5C0 0.671575 0.671575 0 1.5 0H8.5858ZM1.5 1C1.22386 1 1 1.22386 1 1.5V9.5C1 9.77615 1.22386 10 1.5 10H2V7C2 6.17155 2.67158 5.5 3.5 5.5H7.5C8.32845 5.5 9 6.17155 9 7V10H9.5C9.77615 10 10 9.77615 10 9.5V2.91422C10 2.649 9.89465 2.39464 9.7071 2.2071L8.7929 1.29289C8.60535 1.10536 8.351 1 8.0858 1H8V2C8 2.82842 7.32845 3.5 6.5 3.5H4.5C3.67158 3.5 3 2.82842 3 2V1H1.5ZM8 10V7C8 6.72385 7.77615 6.5 7.5 6.5H3.5C3.22386 6.5 3 6.72385 3 7V10H8ZM4 1H7V2C7 2.27614 6.77615 2.5 6.5 2.5H4.5C4.22386 2.5 4 2.27614 4 2V1Z"
                                fill="#0F0F0F"
                          />
                        </svg>
                    </span>
                </button>
                <button
                    type="button"
                    className={`${styles["btn"]} ${styles["export"]}`}
                    onClick={() => handleExport()}
                >
                    <span className={styles["btn-txt"]}>Export</span>
                    <span className={styles["btn-logo"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                          <path
                              d="M3.8 8.27778L6 10.5M6 10.5L8.2 8.27778M6 10.5V5.5M10.4 8.13489C11.0718 7.57444 11.5 6.72661 11.5 5.77778C11.5 4.09024 10.1457 2.72222 8.475 2.72222C8.35483 2.72222 8.24241 2.65889 8.18136 2.5543C7.46415 1.32491 6.13992 0.5 4.625 0.5C2.34682 0.5 0.5 2.36548 0.5 4.66667C0.5 5.8145 0.959498 6.85394 1.70282 7.6075"
                              stroke="#FAFAFA" stroke-linecap="round" stroke-linejoin="round"
                          />
                        </svg>
                    </span>
                </button>
            </div>
        </div>
    )
}

const DeckPreview = ({cards}) => {
    const [cardIndex, setCardIndex] = useState(0);

    return (
        <div className={styles["deck-preview-wrapper"]}>
            <div className={styles["deck-preview"]}>
                <div className={styles["top-preview"]}>
                    <p>{cards[cardIndex].front}</p>
                </div>
                <div className={styles["bottom-preview"]}>
                    <p>{cards[cardIndex].back}</p>
                </div>
            </div>
            <div className={styles["buttons-container"]}>
                <button
                    className={`${styles["btn"]} ${styles["previous"]}`}
                    onClick={() => setCardIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={cardIndex === 0}
                >
                    <span className={styles["btn-logo"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9" viewBox="0 0 11 9" fill="none">
                          <path d="M0.5 4.5H10.5M0.5 4.5L4.66667 0.5M0.5 4.5L4.66667 8.5" stroke="#262626"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                          />
                        </svg>
                    </span>
                    <span className={styles["btn-txt"]}>Previous</span>
                </button>
                <button
                    className={`${styles["btn"]} ${styles["next"]}`}
                    onClick={() => setCardIndex((prev) => Math.min(prev + 1, cards.length - 1))}
                    disabled={cardIndex === cards.length - 1}
                >
                    <span className={styles["btn-txt"]}>Next</span>
                    <span className={styles["btn-logo"]}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9" viewBox="0 0 11 9" fill="none">
                          <path d="M0.5 4.5H10.5M10.5 4.5L6.33333 0.5M10.5 4.5L6.33333 8.5" stroke="#262626"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                          />
                        </svg>
                    </span>
                </button>
            </div>
        </div>
    )
}

const ViewAllDecks = ({cards}) => {
    return (
        <div className={styles["view-all-wrapper"]}>
            <div className={styles["view-all-container"]}>
                {cards.map((card, i) => (
                    <div className={styles["card-wrapper"]}>
                        <span className={styles["card-num"]}>{i + 1} / {cards.length}</span>
                        <div className={styles["card"]}>
                            <div className={styles["card-top-preview"]}>
                                <p>{card.front}</p>
                            </div>
                            <div className={styles["card-bottom-preview"]}>
                                <p>{card.back}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const generateDeckJSON = async (material, deckOptions, setLoading, setError, setGeneratedDeck) => {
    const API_URL = import.meta.env.VITE_API_URL;

    setLoading(true);
    setError(null);

    try {
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

        const data = await res.json();
        setGeneratedDeck(data);
    } catch (err) {
        setError(err.message || "Unexpected error.");
    } finally {
        setLoading(false);
    }
}

export default function Step3({onBack, material, deckOptions}) {
    const [loading, setLoading] = useState(true);
    const [generatedDeck, setGeneratedDeck] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        generateDeckJSON(
            material,
            deckOptions,
            setLoading,
            setError,
            setGeneratedDeck
        )
    }, []);

    return (
        <div className={styles["step-wrapper"]}>
            <div className={styles["step-container"]}>
                {loading ? (
                    <div className={styles["loading-container"]}>
                        <p>Generating your deck...</p>
                    </div>
                ) : (
                    <>
                        <Header
                            title="Ready to Export"
                            subtitle="Download your deck as an Anki file"
                        />
                        <HeaderControls
                            title={generatedDeck.result.deckName}
                            numItems={generatedDeck.result.cards.length}
                            generatedDeck={generatedDeck}
                        />
                        <DeckPreview
                            cards={generatedDeck.result.cards}
                        />
                        <ViewAllDecks
                            cards={generatedDeck.result.cards}
                        />
                    </>
                )}
            </div>
        </div>
    )
}