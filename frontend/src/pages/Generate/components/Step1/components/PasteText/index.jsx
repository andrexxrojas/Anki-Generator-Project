import styles from "./PasteText.module.css";
import {useState, useEffect} from "react";

export default function TextUpload({onComplete, setCanContinue, textValue, resetDeckOptions}) {
    const [text, setText] = useState(textValue || "");

    useEffect(() => {
        const words = text.trim().split(/\s+/).filter(Boolean);

        if (words.length >= 50) {
            setCanContinue(true);
            onComplete(text);
        } else {
            setCanContinue(false);
            onComplete(null);
        }
    }, [])

    const handleChange = (e) => {
        const value = e.target.value;
        setText(value);

        const words = value.trim().split(/\s+/).filter(Boolean);

        if (words.length >= 50) {
            setCanContinue(true);
            onComplete(value);
        } else {
            setCanContinue(false);
            onComplete(null);
            resetDeckOptions();
        }
    }

    return (
        <div className={styles["text-upload-container"]}>
            <small className={styles["char-count"]}>{text.length} / 3000</small>
            <textarea
                value={text}
                onChange={handleChange}
                maxLength={3000}
                placeholder="Drop your notes in and we'll do the rest..."
                className={styles["text-area"]}
            />
        </div>
    );
}
