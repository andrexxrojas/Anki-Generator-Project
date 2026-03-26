import styles from "./styles.module.css";
import Link from "next/link";

export default function GetStarted() {
    return (
        <div className={styles.sectionWrapper}>
            <section className={styles.sectionContainer}>
                <div className={styles.sectionInfo}>
                    <h1 className={styles.title}>
                        Stop wasting time making flashcards.
                    </h1>
                    <p className={styles.subtitle}>
                        Generate Anki decks instantly.
                    </p>
                </div>
                <Link href="/generate" className={styles.cta}>Generate Flashcards</Link>
                <p className={styles.freeHint}>
                    4 free monthly generations
                </p>
            </section>
        </div>
    )
}