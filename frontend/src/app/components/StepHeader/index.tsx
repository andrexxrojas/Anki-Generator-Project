import styles from "./styles.module.css";

interface HeaderProps {
    title: string;
    subtitle: string;
}

export default function StepHeader({title, subtitle}: HeaderProps) {
    return (
        <div className={styles.header}>
            <h4 className={styles.headerTitle}>{title}</h4>
            <p className={styles.headerSubtitle}>{subtitle}</p>
        </div>
    )
}