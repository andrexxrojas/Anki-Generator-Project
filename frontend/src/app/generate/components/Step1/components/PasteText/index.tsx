import styles from "./styles.module.css";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";

interface PasteTextProps {
    onComplete: (text: string | "") => void;
    setCanContinue: Dispatch<SetStateAction<boolean>>;
    textValue: string;
    resetDeckOptions: () => void;
}

export default function PasteText({onComplete, setCanContinue, textValue, resetDeckOptions}: PasteTextProps) {
    const [text, setText] = useState(textValue || "");

    useEffect(() => {
        const words = text.trim().split(/\s+/).filter(Boolean);

        if (words.length >= 50) {
            setCanContinue(true);
            onComplete(text);
        } else {
            setCanContinue(false);
            onComplete("");
        }
    }, [])

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
            <small className={styles.charCount}>{text.length} / 3000</small>
            <textarea
                value={text}
                onChange={handleChange}
                maxLength={3000}
                placeholder="Drop your notes in and we'll do the rest..."
                className={styles.textArea}
            />
        </div>
    )
}