import styles from "./styles.module.css";

export default function StatsCard() {
    return (
        <div className={styles.boxContainer}>
            <span className={styles.microlabel}>Real-time</span>
            <div className={styles.bottomSection}>
                <h2 className={styles.title}>1,000 decks generated</h2>
                <p className={styles.subtitle}>
                    Real-time count of flashcard decks created using AI.
                    Every click turns notes into study-ready cards.
                </p>
                <button className={styles.cta}>Learn more</button>
            </div>
        </div>
    )
}