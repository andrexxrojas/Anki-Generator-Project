import styles from './DeckGrid.module.css';
import {useState, useEffect, useMemo, useRef} from 'react';
import {deleteDeck, exportDeckApkg, getDecks} from "../../services/deck.service.js";
import {UserCircleIcon, DotsThreeVerticalIcon} from "@phosphor-icons/react";

const DeckBox = ({id, title, numItems, tags, accountName, onDelete, cards}) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

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

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${title}?`)) { return; }

        try {
            await deleteDeck(id);
            setShowMenu(false);
            onDelete(id);
            alert("Deck deleted successfully!");
        } catch (err) {
            alert("Failed to delete deck:", err.message);
        }
    }

    const handleExport = async () => {
        try {
            const blob = await exportDeckApkg(title, cards);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${title}.apkg`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Failed to export deck");
        }
    };

    return (
        <div className={styles["deck-box-wrapper"]}>
            <div className={styles["deck-box-container"]}>
                <div className={styles["info-container"]}>
                    <h6 className={styles["deck-title"]}>{title}</h6>
                    <p className={styles["deck-items"]}>{numItems} flashcards</p>

                    <div className={styles["tags-container"]}>
                        {tags.map((tag) => (
                            <span key={tag} className={styles["tag"]}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className={styles["additional-container"]}>
                    <div className={styles["deck-account"]}>
                        <UserCircleIcon size={32} fill="#E5E5E5"/>
                        <span className={styles["deck-account-name"]}>{accountName}</span>
                    </div>

                    <div className={styles["menu-anchor"]} ref={menuRef}>
                        <button
                            className={styles["deck-menu"]}
                            onClick={() => setShowMenu((prev) => !prev)}
                        >
                            <DotsThreeVerticalIcon size={19} weight="bold"/>
                        </button>
                        {showMenu && (
                            <div className={styles["dropdown-menu"]}>
                                <button
                                    className={styles["menu-item"]}
                                >
                                    Edit Deck
                                </button>
                                <button
                                    className={styles["menu-item"]}
                                    onClick={handleExport}
                                >
                                    Export .apkg
                                </button>
                                <button
                                    className={`${styles["menu-item"]} ${styles["warning"]}`}
                                    onClick={handleDelete}
                                >
                                    Delete Deck
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function DeckGrid({ searchQuery = "" }) {
    const [decks, setDecks] = useState([]);

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const fetchedDecks = await getDecks();
                setDecks(fetchedDecks);
            } catch (err) {
                console.error(err.message);
            }
        };

        void fetchDecks();
    },[]);

    const handleDeleteDeck = (deletedId) => {
        setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deletedId));
    };


    const filteredDecks = useMemo(() => {
        if (!searchQuery.trim()) {
            return decks;
        }

        const query = searchQuery.toLowerCase().trim();
        return decks.filter(deck =>
            deck.title.toLowerCase().includes(query)
        );
    }, [searchQuery, decks]);

    return (
        <div className={styles["grid-wrapper"]}>
            <div className={styles["grid-container"]}>
                {filteredDecks.length === 0 ? (
                    <div className={styles["no-results"]}>
                        <p>No decks found{searchQuery && ` for "${searchQuery}"`}</p>
                    </div>
                ) : (
                    filteredDecks.map((deck, id) => (
                        <DeckBox
                            key={id}
                            id={deck.id}
                            title={deck.title}
                            numItems={deck.Cards.length}
                            tags={deck?.tags || []}
                            cards={deck.Cards}
                            accountName={deck.username}
                            onDelete={handleDeleteDeck}
                        />
                    ))
                )}
            </div>
        </div>
    )
}