import styles from "../Step3.module.css";
import {exportDeckApkg, saveDeck} from "../services/deck.service.js";
import {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import { FloppyDiskIcon, DownloadSimpleIcon, DotsThreeVerticalIcon } from "@phosphor-icons/react";

const HeaderControls = ({title, updateTitle, numItems, generatedDeck}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [deckTitle, setDeckTitle] = useState(title);
    const menuRef = useRef(null);
    const titleInputRef = useRef(null);
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
        actionCallback();
        setShowMenu(false);
    };

    const handleExport = async () => {
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
            cards: generatedDeck.result.cards,
            tags: generatedDeck.result.tags,
        };

        try {
            const result = await saveDeck(deckData);

            if (result.entity === "guest") {
                switch(result.action) {
                    case "created":
                        alert("Deck saved temporarily! Sign up to keep it permanently.");
                        navigate("/auth/signup?from=save-deck&deckId=" + result.deckId);
                        break;
                    case "updated":
                        alert("Deck updated temporarily! Sign up to keep it permanently.");
                        navigate("/auth/signup?from=save-deck&deckId=" + result.deckId);
                        break;
                    case "already_exists_guest":
                        alert("Sign up to migrate it to your account.");
                        navigate("/auth/signup?from=save-deck&deckId=" + result.deckId);
                        break;
                }
            } else {
                switch(result.action) {
                    case "created":
                        alert("Deck saved to dashboard!");
                        console.log("Successfully created!");
                        break;
                    case "already_exists":
                        alert("You've already saved this exact deck!");
                        console.log("Deck already exists!");
                        break;
                    case "migrated":
                        alert("Deck migrated to your account successfully!");
                        break;
                    case "updated":
                        alert("Deck updated successfully!");
                        break;
                }
            }
        } catch (err) {
            console.error(err);
            alert("Failed to save deck");
        }
    }

    const handleStartEdit = () => {
        setIsEditing(true);
        setShowMenu(false);
        setTimeout(() => {
            if (titleInputRef.current) {
                titleInputRef.current.focus();
            }
        }, 0);
    };

    const handleSaveTitle = () => {
        setIsEditing(false);
        if (updateTitle && deckTitle !== title) {
            updateTitle(deckTitle);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSaveTitle();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setDeckTitle(title);
        }
    };

    return (
        <div className={styles["header-controls"]}>
            <div className={styles["header-info"]}>
                {isEditing ? (
                    <input
                        ref={titleInputRef}
                        type="text"
                        value={deckTitle}
                        onChange={(e) => setDeckTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSaveTitle}
                        className={styles["header-info-title-input"]}
                        autoFocus
                    />
                ) : (
                    <h4
                        className={styles["header-info-title"]}
                        onClick={handleStartEdit}
                    >
                        {deckTitle}
                    </h4>
                )}
                <p className={styles["header-info-subtitle"]}>{numItems} Items</p>
                <div className={styles["menu-anchor"]} ref={menuRef}>
                    <button
                        className={styles["header-info-menu"]}
                        onClick={() => setShowMenu((prev) => !prev)}
                    >
                        <DotsThreeVerticalIcon size={19} weight="bold"/>
                    </button>
                    {showMenu && (
                        <div className={styles["dropdown-menu"]}>
                            <button
                                className={styles["menu-item"]}
                                onClick={() => handleAction(handleStartEdit)}
                            >
                                Edit Name
                            </button>
                            <button
                                className={styles["menu-item"]}
                                onClick={() => handleAction(handleSave)}
                            >
                                Save Deck
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
                        <FloppyDiskIcon size={19}/>
                    </span>
                </button>
                <button
                    type="button"
                    className={`${styles["btn"]} ${styles["export"]}`}
                    onClick={() => handleExport()}
                >
                    <span className={styles["btn-txt"]}>Export</span>
                    <span className={styles["btn-logo"]}>
                        <DownloadSimpleIcon size={19}/>
                    </span>
                </button>
            </div>
        </div>
    )
}

export default HeaderControls;