import styles from "./styles.module.css";
import Link from "next/link";

export default function WorkflowCard() {
    return (
        <div className={styles.boxContainer}>
            <span className={styles.microlabel}>Automation</span>
            <div className={styles.bottomSection}>
                <h2 className={styles.title}>Supercharge your workflow</h2>
                <p className={styles.subtitle}>
                    Turn hours of card creation into seconds with AI-powered
                    generation. Just paste, click, and import to Anki.
                </p>
                <Link href="/generate" className={styles.cta}>
                    Try it now
                </Link>
            </div>
        </div>
    )
}