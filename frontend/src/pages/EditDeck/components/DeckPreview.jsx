import styles from "../EditDeck.module.css";
import {useState} from "react";

const DeckPreview = ({cards}) => {
    const [cardIndex, setCardIndex] = useState(0);
    const [showBack, setShowBack] = useState(false);

    const handleNext = () => {
        setCardIndex((prev) => Math.min(prev + 1, cards.length - 1));
        setShowBack(false);
    };

    const handlePrev = () => {
        setCardIndex((prev) => Math.max(prev - 1, 0));
        setShowBack(false);
    };

    return (
        <div className={styles["deck-preview-wrapper"]}>
            <div className={styles["deck-preview"]}>
                <div className={styles["top-preview"]}>
                    <p>{cards[cardIndex].front}</p>
                </div>
                <div className={styles["bottom-preview"]} onClick={() => setShowBack((prev) => !prev)}>
                    {showBack ? <p>{cards[cardIndex].back}</p> :
                        <p className={styles["reveal-txt"]}>Click to Reveal Answer</p>}
                </div>
            </div>
            <div className={styles["buttons-container"]}>
                <button
                    className={`${styles["btn"]} ${styles["previous"]}`}
                    onClick={handlePrev}
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
                    onClick={handleNext}
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

export default DeckPreview;