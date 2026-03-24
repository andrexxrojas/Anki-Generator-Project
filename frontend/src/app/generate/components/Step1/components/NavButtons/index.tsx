import styles from "./styles.module.css";

interface Material {
    type: "file" | "text" | null;
    file: File | null;
    text: string;
}

interface NavButtonsProps {
    onNext: () => void;
    material: Material;
    canContinue: boolean;
}

export default function NavButtons({ onNext, material, canContinue }: NavButtonsProps) {
    const handleNext = () => {
        const file = material.file;
        const text = material.text;

        if (!file && !text.trim()) {
            console.log("Please input a file or text");
            return;
        }

        onNext();
    }

    return (
        <div className={styles.buttonWrapper}>
            <button
                className={styles.button}
                onClick={handleNext}
                disabled={!canContinue}
            >
                Continue
            </button>
        </div>
    )
}