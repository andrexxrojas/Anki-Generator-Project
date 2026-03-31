"use client";

import styles from "./styles.module.css";
import {Dispatch, SetStateAction, useState} from "react";
import StepHeader from "@/app/components/StepHeader";
import ViewTab from "@/app/generate/components/Step1/components/ViewTab";
import FileUpload from "@/app/generate/components/Step1/components/FileUpload";
import PasteText from "@/app/generate/components/Step1/components/PasteText";
import NavButtons from "@/app/generate/components/Step1/components/NavButtons";

interface StepProps {
    onNext: () => void;
    material: Material;
    setMaterial: Dispatch<SetStateAction<Material>>;
    resetDeckOptions: () => void;
}

interface Material {
    type: "file" | "text" | null;
    file: File | null;
    text: string | "";
}

export default function Step1({ onNext, material, setMaterial, resetDeckOptions }: StepProps) {
    type ViewType = "upload-file" | "paste-text";
    const [view, setView] = useState<ViewType>("upload-file");
    const [canContinue, setCanContinue] = useState<boolean>(false);

    const handleView = (viewTo: ViewType) => {
        if (viewTo === view) return;
        setView(viewTo);
    }

    const handleFile = (file: File | null) => {
        setMaterial({
            type: "file",
            file,
            text: ""
        });
    };

    const handleText = (text: string) => {
        setMaterial({
            type: "text",
            file: null,
            text
        });
    };

    return (
        <div className={styles.stepWrapper}>
            <div className={`${styles.stepContainer} ${styles.grid}`}>
                <StepHeader
                    title="Upload Material"
                    subtitle="Choose how you want to create your deck"
                />
                <ViewTab handleView={handleView} activeView={view}/>
                {view === "upload-file" ? (
                    <FileUpload
                        onComplete={handleFile}
                        onDelete={() => {
                            handleFile(null);
                            resetDeckOptions();
                        }}
                        setCanContinue={setCanContinue}
                        file={material.file}
                    />
                ) : view === "paste-text" ? (
                    <PasteText
                        onComplete={handleText}
                        setCanContinue={setCanContinue}
                        textValue={material.text}
                        resetDeckOptions={resetDeckOptions}
                    />
                ) : null }
                <NavButtons
                    onNext={onNext}
                    material={material}
                    canContinue={canContinue}
                />
            </div>
        </div>
    )
}