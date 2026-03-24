"use client";

import styles from "./styles.module.css";
import StepHeader from "@/app/components/StepHeader";
import Form from "@/app/generate/components/Step2/components/Form";
import NavButtons from "@/app/generate/components/Step2/components/NavButtons";
import {Dispatch, SetStateAction} from "react";

export interface DeckOptions {
    deckName: string;
    cardTypes: string[];
    cardLimit: number | null;
    cardStyles: string[];
}

interface StepProps {
    onNext: () => void;
    onBack: () => void;
    deckOptions: DeckOptions;
    setDeckOptions: Dispatch<SetStateAction<DeckOptions>>;
}

export default function Step2({ onNext, onBack, deckOptions, setDeckOptions }: StepProps) {
    const isFormComplete =
        deckOptions.deckName.trim() !== "" &&
        deckOptions.cardTypes.length > 0 &&
        deckOptions.cardLimit !== null &&
        deckOptions.cardStyles.length > 0;

    return (
        <div className={styles.stepWrapper}>
            <div className={styles.stepContainer}>
                <StepHeader
                    title="Customize Your Deck"
                    subtitle="Fill in the details for your new deck"
                />
                <Form
                    formData={deckOptions}
                    setFormData={setDeckOptions}
                />
                <NavButtons
                    onNext={onNext}
                    onBack={onBack}
                    formData={deckOptions}
                    setDeckOptions={setDeckOptions}
                    canContinue={isFormComplete}
                />
            </div>
        </div>
    )
}