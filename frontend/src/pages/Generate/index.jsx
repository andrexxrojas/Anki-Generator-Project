import styles from "./Generate.module.css";
import {useEffect, useState} from "react";
import Stepper from "./components/Stepper/index.jsx";
import Step1 from "./components/Step1/index.jsx";
import Step2 from "./components/Step2/index.jsx";
import Step3 from "./components/Step3/index.jsx";

export default function Generate() {
    const getInitialState = () => {
        const saved = sessionStorage.getItem("anki-generate-state");
        return saved ? JSON.parse(saved) : null;
    };

    const persisted = getInitialState();

    const [currentStep, setCurrentStep] = useState(() => persisted?.currentStep ?? 1);

    const [material, setMaterial] = useState(
    () => persisted?.material ?? {
        type: null,
        file: null,
        text: ""
    });

    const [deckOptions, setDeckOptions] = useState(
        () => persisted?.deckOptions ?? {
            deckName: "",
            cardTypes: [],
            cardLimit: null,
            cardStyles: []
        }
    );

    const steps = [
        "Upload",
        "Customize",
        "Export Deck"
    ]

    const [generatedDeck, setGeneratedDeck] = useState(
        () => persisted?.generatedDeck ?? null
    );

    const resetDeckOptions = () => {
        setDeckOptions({
            deckName: "",
            cardTypes: [],
            cardLimit: null,
            cardStyles: []
        })
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1
                    onNext={() => setCurrentStep(2)}
                    material={material}
                    setMaterial={setMaterial}
                    resetDeckOptions={resetDeckOptions}
                />;
            case 2:
                return <Step2
                    onNext={() => setCurrentStep(3)}
                    onBack={() => setCurrentStep(1)}
                    deckOptions={deckOptions}
                    setDeckOptions={setDeckOptions}
                />;
            case 3:
                return <Step3
                    material={material}
                    deckOptions={deckOptions}
                    generatedDeck={generatedDeck}
                    setGeneratedDeck={setGeneratedDeck}
                />;
            default:
                return null;
        }
    };

    useEffect(() => {
        sessionStorage.setItem(
            "anki-generate-state",
            JSON.stringify({
                currentStep,
                material,
                deckOptions,
                generatedDeck
            })
        );
    }, [currentStep, material, deckOptions, generatedDeck]);

    return (
        <div className={styles["generate-wrapper"]}>
            <Stepper steps={steps} currentStep={currentStep}/>
            <div className={styles["step-content"]}>
                {renderStep()}
            </div>
        </div>
    )
}