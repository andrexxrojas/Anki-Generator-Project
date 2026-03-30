import styles from "./styles.module.css";

export default function TotalDecks() {
    return (
        <div className={styles.card}>
            <h1 className={styles.title}>Total decks</h1>
            <h2 className={styles.number}>35</h2>
            <p className={styles.description}>Decks generated all-time</p>
        </div>
    )
}