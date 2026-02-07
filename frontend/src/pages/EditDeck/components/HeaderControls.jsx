import styles from "../EditDeck.module.css";
import {DotsThreeVerticalIcon, DownloadSimpleIcon} from "@phosphor-icons/react";
import {useEffect, useRef, useState} from "react";
import {exportDeckApkg} from "../../Generate/components/Step3/services/deck.service.js";
import {updateDeckTitle} from "../services/deck.service.js";

export default function HeaderControls({title, numItems, deck}) {
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [deckTitle, setDeckTitle] = useState(title);
    const menuRef = useRef(null);
    const titleInputRef = useRef(null);

    const handleStartEdit = () => {
        setIsEditing(true);
        // Focus and select all text when editing starts
        setTimeout(() => {
            if (titleInputRef.current) {
                titleInputRef.current.focus();
                titleInputRef.current.select();
            }
        }, 0);
    };

    const handleSaveTitle = async () => {
        setIsEditing(false);

        const res = await updateDeckTitle(deck.id, deckTitle);
        setDeckTitle(res.deck.title);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSaveTitle();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setDeckTitle(title);
        }
    };

    const handleExport = async () => {
        if (!deck) return;

        try {
            const blob = await exportDeckApkg(
                deck.title,
                deck.Cards
            );

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${deck.title}.apkg`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            setShowMenu(false);
        } catch (err) {
            console.error(err);
            alert("Failed to export deck");
        }
    };

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
                        style={{ cursor: 'pointer' }}
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
                                onClick={handleStartEdit}
                            >
                                Edit Name
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
                    type="button"
                    className={`${styles["btn"]} ${styles["export"]}`}
                    onClick={handleExport}
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