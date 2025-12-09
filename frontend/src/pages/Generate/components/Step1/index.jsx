import styles from "./Step1.module.css";
import {useState, useEffect} from "react";
import FileUpload from "./components/FileUpload/index.jsx";
import PasteText from "./components/PasteText/index.jsx";

const Header = ({title, subtitle}) => {
    return (
        <div className={styles["header"]}>
            <h4 className={styles["header-title"]}>{title}</h4>
            <p className={styles["header-subtitle"]}>{subtitle}</p>
        </div>
    )
}

const ViewTab = ({handleView, activeView}) => {
    return (
        <div className={styles["tabs-container"]}>
            <div
                className={`${styles["tab"]} ${activeView === "upload-file" ? styles["active"] : ""}`}
                onClick={() => handleView("upload-file")}
            >
                <span className={styles["tab-txt"]}>Upload File</span>
            </div>
            <div
                className={`${styles["tab"]} ${activeView === "paste-text" ? styles["active"] : ""}`}
                onClick={() => handleView("paste-text")}
            >
                <span className={styles["tab-txt"]} onClick={() => handleView("paste-text")}>Paste Text</span>
            </div>
        </div>
    )
}

const NavButtons = ({onNext, material, canContinue}) => {
    const handleNext = () => {
        let file = material.file;
        let text = material.text;

        if (!file && !text.trim()) {
            console.log("Please input a file or text");
            return;
        }

        onNext();
    }

    return (
        <div className={styles["button-wrapper"]}>
            <button
                className={`${styles["btn"]} ${styles["continue"]}`}
                onClick={handleNext}
                disabled={!canContinue}
            >
                <span>Continue</span>
            </button>
        </div>
    )
}

export default function Step1({onNext, material, setMaterial, resetDeckOptions}) {
    const [view, setView] = useState("upload-file");
    const [canContinue, setCanContinue] = useState(false);

    const handleView = (viewTo) => {
        if (viewTo === view) return;
        setView(viewTo);
    }

    const handleFile = (file) => {
        setMaterial({
            type: "file",
            file,
            text: ""
        });
    };

    const handleText = (text) => {
        setMaterial({
            type: "text",
            file: null,
            text
        });
    };

    return (
        <div className={styles["step-wrapper"]}>
            <div className={styles["step-container"]}>
                <Header
                    title="Upload Material"
                    subtitle="Choose how you want to create your deck"
                />
                <ViewTab handleView={handleView} activeView={view}/>
                {view === "upload-file" ? (
                    <FileUpload onComplete={handleFile}
                                onDelete={() => {
                                    handleFile(null);
                                    resetDeckOptions();
                                }}
                                setCanContinue={setCanContinue}
                                file={material.file}
                    />
                ) : view === "paste-text" ? (
                    <PasteText onComplete={handleText}
                               setCanContinue={setCanContinue}
                               textValue={material.text}
                               resetDeckOptions={resetDeckOptions}
                    />
                ) : null}
                <NavButtons onNext={onNext} material={material} canContinue={canContinue}/>
            </div>
        </div>
    )
}