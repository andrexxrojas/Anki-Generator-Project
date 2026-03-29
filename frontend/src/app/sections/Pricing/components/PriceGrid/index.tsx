import styles from "./styles.module.css";
import React from "react";

interface PriceGridProps {
    children: React.ReactNode;
}

export default function PriceGrid({ children }: PriceGridProps) {
    return (
        <div className={styles.priceGrid}>
            {children}
        </div>
    )
}