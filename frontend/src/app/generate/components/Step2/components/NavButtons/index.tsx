"use client";

import styles from "./styles.module.css";
import {Dispatch, SetStateAction} from "react";

export interface DeckOptions {
    deckName: string;
    cardTypes: string[];
    cardLimit: number | null;
    cardStyles: string[];
}

interface NavButtonsProps {
    onNext: () => void;
    onBack: () => void;
    formData: DeckOptions;
    setDeckOptions: Dispatch<SetStateAction<DeckOptions>>;
    canContinue: boolean;
}

export default function NavButtons({
                                       onNext,
                                       onBack,
                                       formData,
                                       setDeckOptions,
                                       canContinue
                                   }: NavButtonsProps) {
    const handleBack = () => {
        onBack();
    }

    const isFormIncomplete =
        formData.deckName.trim() === "" ||
        formData.cardTypes.length === 0 ||
        formData.cardLimit === null ||
        formData.cardStyles.length === 0;

    const handleNext = () => {
        if (isFormIncomplete) {
            console.log("Please fill in all fields");
            return;
        }

        setDeckOptions(formData);
        onNext();
    }

    return (
        <div className={styles.buttonWrapper}>
            <button className={`${styles.btn} ${styles.goBack}`} onClick={handleBack}>
                Go Back
            </button>
            <button
                className={`${styles.btn} ${styles.continue}`}
                onClick={handleNext}
                disabled={!canContinue}
            >
                Continue
            </button>
        </div>
    );
}