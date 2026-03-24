import styles from "./styles.module.css";

interface GeneratedCard {
    type: "basic" | "reversible" | "multiple-choice" | "cloze";
    front: string;
    back: string;
}

interface DeckPreviewProps {
    cards: GeneratedCard[];
}

export default function ViewAllDecks({cards}: DeckPreviewProps) {
    return (
        <div className={styles.viewAllWrapper}>
            <div className={styles.viewAllContainer}>
                {cards.map((card, i) => (
                    <div key={i} className={styles.cardWrapper}>
                        <span className={styles.cardNum}>{i + 1} / {cards.length}</span>
                        <div className={styles.card}>
                            <div className={styles.cardTopPreview}>
                                <p>{card.front}</p>
                            </div>
                            <div className={styles.cardBottomPreview}>
                                <p>{card.back}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}