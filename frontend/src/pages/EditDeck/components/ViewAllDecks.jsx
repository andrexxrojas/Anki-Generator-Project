import styles from "../EditDeck.module.css";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import { useState, useRef } from "react";

const ViewAllDecks = ({cards, onUpdateCard}) => {
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValues, setEditValues] = useState({ front: "", back: "" });
    const saveTimeoutRef = useRef(null);

    const handleEdit = (index, card) => {
        setEditingIndex(index);
        setEditValues({ front: card.front, back: card.back });
    }

    const handleSave = () => {
        if (editingIndex !== null) {
            onUpdateCard(editingIndex, editValues);
        }
        setEditingIndex(null);
    }

    const handleBlur = () => {
        saveTimeoutRef.current = setTimeout(() => {
            handleSave();
        }, 100);
    }

    const handleFocus = () => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
    }

    const handleChange = (field, value) => {
        setEditValues(prev => ({
            ...prev,
            [field]: value
        }));
    }

    return (
        <div className={styles["view-all-wrapper"]}>
            <div className={styles["view-all-container"]}>
                {cards.map((card, i) => (
                    <div key={i} className={styles["card-wrapper"]}>
                        <span className={styles["card-num"]}>{i + 1} / {cards.length}</span>
                        <div className={styles["card"]}>
                            <div className={styles["card-top-preview"]}>
                                {editingIndex === i ? (
                                    <textarea
                                        className={styles["edit-textarea"]}
                                        value={editValues.front}
                                        onChange={(e) => handleChange('front', e.target.value)}
                                        onBlur={handleBlur}
                                        onFocus={handleFocus}
                                        autoFocus
                                        rows={1}
                                    />
                                ) : (
                                    <p>{card.front}</p>
                                )}
                            </div>
                            <div className={styles["card-bottom-preview"]}>
                                {editingIndex === i ? (
                                    <textarea
                                        className={styles["edit-textarea"]}
                                        value={editValues.back}
                                        onChange={(e) => handleChange('back', e.target.value)}
                                        onBlur={handleBlur}
                                        onFocus={handleFocus}
                                        rows={1}
                                    />
                                ) : (
                                    <p>{card.back}</p>
                                )}
                            </div>
                            <button className={`${styles["edit-btn"]} ${editingIndex === i ? styles["active"] : ""}`} onClick={() => handleEdit(i, card)}>
                                <PencilSimpleIcon size={16}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ViewAllDecks;