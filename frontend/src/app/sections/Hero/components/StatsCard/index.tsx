"use client";

import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import { getTotalGenerations } from "@/app/services/deck.service";

export default function StatsCard() {
    const [total, setTotal] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTotalGenerations = async () => {
            try {
                setIsLoading(true);
                const data = await getTotalGenerations();
                setTotal(data.total);
            } catch (error) {
                console.error("Failed to fetch total generations:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchTotalGenerations();
    }, []);

    return (
        <div className={styles.boxContainer}>
            <span className={styles.microlabel}>Real-time</span>
            <div className={styles.bottomSection}>
                <h2 className={styles.title}>
                    {total?.toLocaleString()} decks generated
                </h2>
                <p className={styles.subtitle}>
                    Real-time count of flashcard decks created using AI.
                    Every click turns notes into study-ready cards.
                </p>
                <button className={styles.cta}>Learn more</button>
            </div>
        </div>
    )
}