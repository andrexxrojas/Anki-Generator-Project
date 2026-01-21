import styles from "../Step3.module.css";
import {exportDeckApkg, saveDeck} from "../services/deck.service.js";
import {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";

const HeaderControls = ({title, numItems, generatedDeck}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMenu && menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    const handleAction = (actionCallback) => {
        actionCallback(); // Run the actual logic (save, delete, etc)
        setShowMenu(false); // Close the menu
    };

    const handleExport = async () => {
        console.log("Export button clicked. generatedDeck:", generatedDeck);
        if (!generatedDeck) return;

        try {
            const blob = await exportDeckApkg(
                generatedDeck.result.deckName,
                generatedDeck.result.cards
            );

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${generatedDeck.result.deckName}.apkg`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Failed to export deck");
        }
    };

    const handleSave = async () => {
        if (!generatedDeck) return alert("No deck to save");

        const deckData = {
            title: generatedDeck.result.deckName,
            description: generatedDeck.result.description || "",
            cards: generatedDeck.result.cards
        };

        try {
            const result = await saveDeck(deckData);

            if (result.entity === "guest") {
                console.log(result);
                navigate("/auth/signup?from=save-deck");
            } else {
                // Popup to show user their deck has been saved
            }
        } catch (err) {
            if (err.message === "Not authorized") {
                navigate("/auth/signup");
            } else {
                console.error(err);
            }
        }
    }

    return (
        <div className={styles["header-controls"]}>
            <div className={styles["header-info"]}>
                <h4 className={styles["header-info-title"]}>{title}</h4>
                <p className={styles["header-info-subtitle"]}>{numItems} Items</p>
                <div className={styles["menu-anchor"]} ref={menuRef}>
                    <button
                        className={styles["header-info-menu"]}
                        onClick={() => setShowMenu((prev) => !prev)}
                    >
                        <div className={styles["menu-logo"]}>
                            <div className={styles["circle"]}></div>
                            <div className={styles["circle"]}></div>
                            <div className={styles["circle"]}></div>
                        </div>
                    </button>
                    {showMenu && (
                        <div className={styles["dropdown-menu"]}>
                            <button
                                className={styles["menu-item"]}
                                onClick={() => handleAction(() => console.log("Editing"))}
                            >
                                Edit Name
                            </button>
                            <button
                                className={styles["menu-item"]}
                                onClick={() => handleAction(() => handleSave)}
                            >
                                Save Deck
                            </button>
                            <button
                                className={styles["menu-item"]}
                                onClick={() => handleAction(() => console.log("Regenerating"))}
                            >
                                Regenerate
                            </button>
                            <button
                                className={styles["menu-item"]}
                                onClick={handleExport}
                            >
                                Export .apkg
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles["buttons-container"]}>
                <button
                    className={`${styles["btn"]} ${styles["save"]}`}
                    onClick={() => handleSave()}
                >
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

export default HeaderControls;