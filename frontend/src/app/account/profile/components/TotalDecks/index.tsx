import styles from "./styles.module.css";

interface TotalDecksProps {
    totalDecksGenerated: number;
}

export default function TotalDecks({ totalDecksGenerated }: TotalDecksProps) {
    return (
        <div className={styles.card}>
            <h1 className={styles.title}>Total decks</h1>
            <h2 className={styles.number}>{totalDecksGenerated}</h2>
            <p className={styles.description}>Decks generated all-time</p>
        </div>
    )
}