import styles from "./styles.module.css";

interface UsageDetailsProps {
    monthlyDecksGenerated: number;
    generationsLeft: number;
    monthlyLimit: number;
}

export default function UsageDetails({ monthlyDecksGenerated, generationsLeft, monthlyLimit }: UsageDetailsProps) {
    const percentageUsed = (monthlyDecksGenerated / monthlyLimit) * 100;

    return (
        <div className={styles.card}>
            <h1 className={styles.title}>Usage details</h1>
            <div className={styles.progressContainer}>
                <p className={styles.totalGenerated}>
                    <span className={styles.secondary}>Decks generated: </span>{monthlyDecksGenerated}
                </p>
                <div className={styles.progressBarTrack}>
                    <div
                        className={styles.progressBarFill}
                        style={{ width: `${percentageUsed}%` }}
                    />
                </div>
            </div>
            <p className={styles.generationsLeft}>
                {generationsLeft} <span className={styles.secondary}>generations left</span>
            </p>
        </div>
    )
}