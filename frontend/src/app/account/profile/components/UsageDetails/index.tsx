import styles from "./styles.module.css";

export default function UsageDetails() {
    return (
        <div className={styles.card}>
            <h1 className={styles.title}>Usage details</h1>
            <div className={styles.progressContainer}>
                <p className={styles.totalGenerated}>
                    <span className={styles.secondary}>Decks generated: </span>1
                </p>
                <div className={styles.progressBarTrack}>
                    <div
                        className={styles.progressBarFill}
                        style={{ width: `${10}%` }}
                    />
                </div>
            </div>
            <p className={styles.generationsLeft}>
                25 <span className={styles.secondary}>generations left</span>
            </p>
        </div>
    )
}