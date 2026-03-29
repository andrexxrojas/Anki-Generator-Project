import styles from "./styles.module.css";
import SectionHeader from "@/app/components/SectionHeader";
import {BoxArrowDownIcon, FileTextIcon, TargetIcon} from "@phosphor-icons/react/ssr";

export default function Features() {
    return (
        <div className={styles.sectionWrapper}>
            <section className={`${styles.sectionContainer} ${styles.grid}`}>
                <SectionHeader
                    microlabel="Features"
                    title="Instant Flashcards"
                    subtitle="
                        Generate, format, and export Anki-ready
                        decks without the manual work.
                    "
                />
                <div className={styles.featureGrid}>
                    <div className={styles.feature}>
                        <div className={styles.iconContainer}>
                            <BoxArrowDownIcon size={20} />
                        </div>
                        <div className={styles.boxInfo}>
                            <h2 className={styles.boxTitle}>Instant export</h2>
                            <p className={styles.boxSubtitle}>
                                One-click export to Anki. Works on phone, tablet, and
                                desktop. Zero setup, start studying immediately.
                            </p>
                        </div>
                    </div>

                    <div className={styles.feature}>
                        <div className={styles.iconContainer}>
                            <FileTextIcon size={20} />
                        </div>
                        <div className={styles.boxInfo}>
                            <h2 className={styles.boxTitle}>Flexible input</h2>
                            <p className={styles.boxSubtitle}>
                                Works with lecture notes, textbook chapters,
                                study guides, and research papers.
                            </p>
                        </div>
                    </div>

                    <div className={styles.feature}>
                        <div className={styles.iconContainer}>
                            <TargetIcon size={20} />
                        </div>
                        <div className={styles.boxInfo}>
                            <h2 className={styles.boxTitle}>Built for Anki</h2>
                            <p className={styles.boxSubtitle}>
                                Creates properly formatted cards that work 
                                seamlessly with Anki&#39;s spaced repetition system.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}