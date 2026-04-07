"use client";

import styles from "./styles.module.css";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getGenerationStats } from "@/app/services/deck.service";

interface PasteTextProps {
    onComplete: (text: string | "") => void;
    setCanContinue: Dispatch<SetStateAction<boolean>>;
    textValue: string;
    resetDeckOptions: () => void;
}

export default function PasteText({ onComplete, setCanContinue, textValue, resetDeckOptions }: PasteTextProps) {
    const [text, setText] = useState(textValue || "");
    const [characterLimit, setCharacterLimit] = useState<number | null>(null);

    useEffect(() => {
        const fetchCharacterLimit = async () => {
            try {
                const stats = await getGenerationStats();

                switch (stats.subscriptionTier) {
                    case 'premium':
                        setCharacterLimit(15000);
                        break;
                    case 'pro':
                        setCharacterLimit(8000);
                        break;
                    case 'free':
                    case 'guest':
                    default:
                        setCharacterLimit(3000);
                        break;
                }
            } catch (error) {
                console.error("Failed to fetch character limit:", error);
                setCharacterLimit(3000);
            }
        };

        void fetchCharacterLimit();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setText(value);

        const words = value.trim().split(/\s+/).filter(Boolean);

        if (words.length >= 50) {
            setCanContinue(true);
            onComplete(value);
        } else {
            setCanContinue(false);
            onComplete("");
            resetDeckOptions();
        }
    }

    return (
        <div className={styles.textUploadContainer}>
            <small className={styles.charCount}>{text.length} / {characterLimit}</small>
            <textarea
                value={text}
                onChange={handleChange}
                maxLength={characterLimit}
                placeholder="Drop your notes in and we'll do the rest..."
                className={styles.textArea}
            />
        </div>
    )
}