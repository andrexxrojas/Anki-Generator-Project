import styles from "./Generate.module.css";
import {useState} from "react";
import Stepper from "./components/Stepper/index.jsx";
import Step1 from "./components/Step1/index.jsx";
import Step2 from "./components/Step2/index.jsx";
import Step3 from "./components/Step3/index.jsx";

export default function Generate() {
    const [currentStep, setCurrentStep] = useState(1);

    const [material, setMaterial] = useState({
        type: null,     // "file" or "text"
        file: null,     // File object
        text: ""        // pasted text
    });

    const [deckOptions, setDeckOptions] = useState({
        deckName: "",
        cardTypes: [],
        cardLimit: null,
        cardStyles: []
    });

    const steps = [
        "Upload",
        "Customize",
        "Export Deck"
    ]

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
                />;
            default:
                return null;
        }
    };

    return (
        <div className={styles["generate-wrapper"]}>
            <Stepper steps={steps} currentStep={currentStep}/>
            <div className={styles["step-content"]}>
                {renderStep()}
            </div>
        </div>
    )
}