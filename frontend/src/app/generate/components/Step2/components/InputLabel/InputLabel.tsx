"use client";

import styles from "./styles.module.css";

interface InputLabelProps {
    title: string;
    subtitle: string;
}

export default function InputLabel({ title, subtitle }: InputLabelProps) {
    return (
        <div className={styles.inputLabel}>
            <p className={styles.labelTitle}>{title}</p>
            <div className={styles.labelSubtitle}>{subtitle}</div>
        </div>
    );
}