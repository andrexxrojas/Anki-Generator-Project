import styles from "./styles.module.css";

interface SectionHeaderProps {
    microlabel: string;
    title: string;
    subtitle: string;
}

export default function SectionHeader({ microlabel, title, subtitle }: SectionHeaderProps) {
    return (
        <div className={styles.container}>
            <span className={styles.microlabel}>{microlabel}</span>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
        </div>
    )
}