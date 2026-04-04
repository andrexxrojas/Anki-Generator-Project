"use client";

import styles from "./styles.module.css";
import {useEffect, useRef, useState} from "react";
import Step1 from "@/app/generate/components/Step1";
import Step2 from "@/app/generate/components/Step2";
import Step3 from "@/app/generate/components/Step3";
import GenerationsLeft from "@/app/components/GenerationsLeft";

interface Material {
    type: "file" | "text" | null;
    file: File | null;
    text: string;
}

interface DeckOptions {
    deckName: string;
    cardTypes: string[];
    cardLimit: number | null;
    cardStyles: string[];
}

interface PersistedState {
    currentStep: number;
    material: {
        type: "file" | "text" | null;
        file: {
            name: string;
            size: number;
            type: string;
            lastModified: number;
        } | null;
        text: string;
    };
    deckOptions: DeckOptions;
    generatedDeck: GeneratedDeck | null;
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

const defaultMaterial: Material = {
    type: null,
    file: null,
    text: ""
};

const defaultDeckOptions: DeckOptions = {
    deckName: "",
    cardTypes: [],
    cardLimit: null,
    cardStyles: []
};

export default function Generate() {
    const [currentStep, setCurrentStep] = useState(1);
    const [material, setMaterial] = useState<Material>(defaultMaterial);
    const [deckOptions, setDeckOptions] = useState<DeckOptions>(defaultDeckOptions);
    const [generatedDeck, setGeneratedDeck] = useState<GeneratedDeck | null>(null);
    const [refreshStats, setRefreshStats] = useState<number>(0);
    const isClient = useRef(false);

    const steps = [
        "Upload",
        "Customize",
        "Export Deck"
    ];

    const triggerStatsRefresh = () => {
        setRefreshStats(prev => prev + 1);
    };

    useEffect(() => {
        isClient.current = true;

        const restoreState = async () => {
            try {
                const saved = sessionStorage.getItem("anki-generate-state");
                if (!saved) return;

                const persisted: PersistedState = JSON.parse(saved);

                const updates = {
                    currentStep: persisted?.currentStep ?? 1,
                    deckOptions: persisted?.deckOptions ?? defaultDeckOptions,
                    generatedDeck: persisted?.generatedDeck ?? null,
                    material: defaultMaterial
                };

                if (persisted?.material) {
                    if (persisted.material.file) {
                        updates.material = {
                            type: persisted.material.type,
                            file: null,
                            text: persisted.material.text
                        };
                        console.log("File objects cannot be restored from sessionStorage");
                    } else {
                        updates.material = {
                            type: persisted.material.type,
                            file: null,
                            text: persisted.material.text
                        };
                    }
                }

                setCurrentStep(updates.currentStep);
                setDeckOptions(updates.deckOptions);
                setGeneratedDeck(updates.generatedDeck);
                setMaterial(updates.material);

            } catch (error) {
                console.error("Failed to restore state:", error);
            }
        };

        restoreState();
    }, [isClient]);

    const resetDeckOptions = () => {
        setDeckOptions(defaultDeckOptions);
    };

    const handleNewSet = () => {
        setCurrentStep(1);
        setMaterial(defaultMaterial);
        setDeckOptions(defaultDeckOptions);
        setGeneratedDeck(null);
        triggerStatsRefresh();

        sessionStorage.removeItem("anki-generate-state");
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1
                        onNext={() => setCurrentStep(2)}
                        material={material}
                        setMaterial={setMaterial}
                        resetDeckOptions={resetDeckOptions}
                    />
                );
            case 2:
                return (
                    <Step2
                        onNext={() => setCurrentStep(3)}
                        onBack={() => setCurrentStep(1)}
                        deckOptions={deckOptions}
                        setDeckOptions={setDeckOptions}
                    />
                );
            case 3:
                return <Step3
                    material={material}
                    deckOptions={deckOptions}
                    generatedDeck={generatedDeck}
                    setGeneratedDeck={setGeneratedDeck}
                    onNewSet={handleNewSet}
                    onGenerationComplete={triggerStatsRefresh}
                />;
            default:
                return null;
        }
    };

    useEffect(() => {
        if (isClient) {
            try {
                const stateToSave = {
                    currentStep,
                    material: {
                        type: material.type,
                        file: material.file ? {
                            name: material.file.name,
                            size: material.file.size,
                            type: material.file.type,
                            lastModified: material.file.lastModified
                        } : null,
                        text: material.text
                    },
                    deckOptions,
                    generatedDeck
                };

                sessionStorage.setItem(
                    "anki-generate-state",
                    JSON.stringify(stateToSave)
                );
            } catch (error) {
                console.error("Failed to save state:", error);
            }
        }
    }, [currentStep, material, deckOptions, generatedDeck, isClient]);

    return (
        <div className={styles.generateWrapper}>
            <div className={styles.stepContent}>
                <GenerationsLeft refreshTrigger={refreshStats} />
                {renderStep()}
            </div>
        </div>
    );
}