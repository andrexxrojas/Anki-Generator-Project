import styles from "./styles.module.css";
import Link from "next/link";

export default function Subscription() {
    return (
        <div className={styles.card}>
            <h1 className={styles.title}>Billing & Subscription</h1>
            <h2 className={styles.currentPlan}>Free</h2>
            <p className={styles.description}>
                No active subscription. <Link href="/" className={styles.linkItem}>View plans</Link> to get started.
            </p>
        </div>
    )
}