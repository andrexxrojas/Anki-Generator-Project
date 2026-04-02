"use client";

import styles from "./styles.module.css";
import StepHeader from "@/app/components/StepHeader";
import HeaderControls from "@/app/generate/components/Step3/components/HeaderControls";
import DeckPreview from "@/app/generate/components/Step3/components/DeckPreview";
import ViewAllDecks from "@/app/generate/components/Step3/components/ViewAllDecks";
import { Oval } from "react-loader-spinner";
import { generateDeck } from "@/app/services/deck.service";
import {Dispatch, SetStateAction, useEffect, useState} from "react";

interface StepProps {
    material: Material;
    deckOptions: DeckOptions;
    generatedDeck: GeneratedDeck | null;
    setGeneratedDeck: Dispatch<SetStateAction<GeneratedDeck | null>>
    onNewSet: () => void;
}

interface GeneratedDeck {
    deckName: string;
    tags: string[];
    cards: GeneratedCard[];
}

interface GeneratedCard {
    type: "basic" | "reversible" | "multiple-choice" | "cloze";
    front: string;
    back: string;
}

interface Material {
    type: "file" | "text" | null;
    file: File | null;
    text: string | "";
}

export interface DeckOptions {
    deckName: string;
    cardTypes: string[];
    cardLimit: number | null;
    cardStyles: string[];
}

export default function Step3({ material, deckOptions, generatedDeck, setGeneratedDeck, onNewSet }: StepProps) {
    const [loading, setLoading] = useState<boolean>(!generatedDeck);

    useEffect(() => {
        if (generatedDeck) return;

        const handleGeneration = async () => {
            try {
                const res = await generateDeck(material, deckOptions);
                setGeneratedDeck(res.result);
            } catch (error) {
                console.error("Error generating deck:", error);
            } finally {
                setLoading(false);
            }
        }

        void handleGeneration();
    }, [])

    const handleTitleUpdate = (newTitle: string) => {
        setGeneratedDeck(prevDeck => {
            if (!prevDeck) return null;
            return {
                ...prevDeck,
                deckName: newTitle
            };
        });
    }

    return (
        <div className={styles.stepWrapper}>
            <div className={styles.stepContainer}>
                {(loading || !generatedDeck?.cards) ? (
                    <div className={styles.loadingContainer}>
                        <Oval
                            height={40}
                            width={40}
                            color="#0A4FED"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                            ariaLabel='oval-loading'
                            secondaryColor="#E5E5E5"
                            strokeWidth={3}
                            strokeWidthSecondary={3}
                        />
                        <p className={styles.loadingTxt}>Generating your deck</p>
                    </div>
                ) : (
                    <>
                        <StepHeader
                            title="Ready to Export"
                            subtitle="Download your deck as an Anki File"
                        />
                        <HeaderControls
                            title={generatedDeck.deckName}
                            updateTitle={handleTitleUpdate}
                            numItems={generatedDeck.cards.length || 0}
                            generatedDeck={generatedDeck}
                            onNewSet={onNewSet}
                        />
                        <DeckPreview
                            cards={generatedDeck.cards}
                        />
                        <ViewAllDecks
                            cards={generatedDeck.cards}
                        />
                    </>
                )}
            </div>
        </div>
    )
}