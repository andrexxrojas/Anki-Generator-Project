import styles from "./styles.module.css";
import WorkflowCard from "@/app/sections/Hero/components/WorkflowCard";
import StatsCard from "@/app/sections/Hero/components/StatsCard";

export default function Hero() {
    return (
        <div className={styles.sectionWrapper}>
            <section className={`${styles.sectionContainer} ${styles.grid}`}>
                <h1 className={styles.title}>Automated flashcard creation</h1>
                <div className={styles.boxContainer}>
                    <WorkflowCard />
                    <StatsCard />
                </div>
            </section>
        </div>
    )
}