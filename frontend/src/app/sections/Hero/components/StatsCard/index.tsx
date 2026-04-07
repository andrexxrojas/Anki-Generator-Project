"use client";

import styles from "./styles.module.css";
import useSWR from "swr";
import { getTotalGenerations } from "@/app/services/deck.service";

const fetcher = () => getTotalGenerations().then(d => d.total);

export default function StatsCard() {
    const { data: total } = useSWR("totalGenerations", fetcher, {
        refreshInterval: 30000,
        revalidateOnFocus: true,
    });

    return (
        <div className={styles.boxContainer}>
            <span className={styles.microlabel}>Real-time</span>
            <div className={styles.bottomSection}>
                <h2 className={styles.title}>
                    {total?.toLocaleString() ?? ""} decks generated
                </h2>
                <p className={styles.subtitle}>
                    Real-time count of flashcard decks created using AI.
                    Every click turns notes into study-ready cards.
                </p>
                <button className={styles.cta}>Learn more</button>
            </div>
        </div>
    );
}