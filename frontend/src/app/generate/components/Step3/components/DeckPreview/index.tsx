import styles from "./styles.module.css";
import { useState } from "react";
import {ArrowLeftIcon, ArrowRightIcon} from "@phosphor-icons/react";

interface GeneratedCard {
    type: "basic" | "reversible" | "multiple-choice" | "cloze";
    front: string;
    back: string;
}

interface DeckPreviewProps {
    cards: GeneratedCard[];
}

const DeckPreview = ({ cards }: DeckPreviewProps) => {
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
        <div className={styles.deckPreviewWrapper}>
            <div className={styles.deckPreview}>
                <div className={styles.topPreview}>
                    <p>{cards[cardIndex].front}</p>
                </div>
                <div className={styles.bottomPreview} onClick={() => setShowBack((prev) => !prev)}>
                    {showBack ? <p>{cards[cardIndex].back}</p> :
                        <p className={styles.revealTxt}>Click to Reveal Answer</p>}
                </div>
            </div>
            <div className={styles.buttonsContainer}>
                <button
                    className={`${styles.btn} ${styles.previous}`}
                    onClick={handlePrev}
                    disabled={cardIndex === 0}
                >
                    <span className={styles.btnLogo}>
                        <ArrowLeftIcon size={13}/>
                    </span>
                    <span className={styles.btnTxt}>Previous</span>
                </button>
                <button
                    className={`${styles.btn} ${styles.next}`}
                    onClick={handleNext}
                    disabled={cardIndex === cards.length - 1}
                >
                    <span className={styles.btnTxt}>Next</span>
                    <span className={styles.btnLogo}>
                        <ArrowRightIcon size={13}/>
                    </span>
                </button>
            </div>
        </div>
    )
}

export default DeckPreview;