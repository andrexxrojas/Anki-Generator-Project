"use client";

import {JSX, useEffect, useState} from "react";
import { getGenerationStats } from "@/app/services/deck.service";
import styles from "./styles.module.css";
import {useAuth} from "@/app/context/AuthContext/AuthContext";

interface GenerationsLeftProps {
    refreshTrigger?: number;
}

export default function GenerationsLeft({ refreshTrigger }: GenerationsLeftProps): JSX.Element {
    const [stats, setStats] = useState<{ used: number; limit: number; left: number } | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getGenerationStats();
                console.log(data);
                setStats({
                    used: data.generationsUsed,
                    limit: data.generationsLimit,
                    left: data.generationsLeft
                });
            } catch (error) {
                console.log("Failed to fetch generation stats:", error);
            }
        };

        void fetchStats();
    }, [refreshTrigger, user]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <span className={styles.number}>
                    {stats?.used} / {stats?.limit} generations
                </span>
            </div>
        </div>
    )
}