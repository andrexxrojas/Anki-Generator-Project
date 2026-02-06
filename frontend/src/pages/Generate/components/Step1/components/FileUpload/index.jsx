import styles from "./FileUpload.module.css";
import {useState, useRef, useEffect} from "react";
import {UploadIcon} from "@phosphor-icons/react";
import gsap from "gsap";

export default function FileUpload({onComplete, onDelete, setCanContinue, file: parentFile}) {
    const [file, setFile] = useState(parentFile);
    const isDraggingRef = useRef(false);
    const inputRef = useRef(null);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        setFile(parentFile);
        setCanContinue(!!parentFile);
    }, [parentFile]);

    const validateFile = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(`${API_URL}/file/validate`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            // Backend sends errors with status >= 400
            if (!res.ok) {
                alert(data.error || "Invalid file.");
                return false;
            }

            // Return full validated payload
            return {
                valid: true,
                text: data.text,
                wordCount: data.wordCount
            };

        } catch (err) {
            console.error("Validation error:", err);
            alert("Something went wrong during validation.");
            return false;
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        isDraggingRef.current = true;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];

            const validated = await validateFile(droppedFile);

            if (validated) {
                const fileData = {
                    name: droppedFile.name,
                    size: droppedFile.size,
                    type: droppedFile.type,
                    text: validated.text,
                    wordCount: validated.wordCount
                };

                setFile(droppedFile);
                onComplete(fileData);
                setCanContinue(true);
                e.target.value = "";
            } else {
                alert("Only .pdf and .docx files are allowed");
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        isDraggingRef.current = true;
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        isDraggingRef.current = false;
    };

    const handleFileSelect = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const droppedFile = e.target.files[0];

            const validated = await validateFile(droppedFile);

            if (validated) {
                const fileData = {
                    name: droppedFile.name,
                    size: droppedFile.size,
                    type: droppedFile.type,
                    text: validated.text,
                    wordCount: validated.wordCount
                };

                setFile(droppedFile);
                onComplete(fileData);
                setCanContinue(true);
                e.target.value = "";
            }
        }
    };

    const handleClick = () => {
        inputRef.current.click();
    };

    const DropZone = () => {
        return (
            <div className={styles["drop-zone-container"]}>
                <input
                    type="file"
                    ref={inputRef}
                    className={styles["hidden-input"]}
                    onChange={handleFileSelect}
                    accept=".pdf,.docx"
                />

                <div
                    className={styles["drop-zone"]}
                    onClick={handleClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className={styles["icon-container"]}>
                        <UploadIcon size={19}/>
                    </div>
                    <p className={styles["drop-zone-text"]}>
                        Drop your files here or browse
                    </p>
                    <small className={styles["drop-zone-subtext"]}>
                        Max word count up to 1000
                    </small>
                </div>
            </div>
        );
    };

    const SelectedFile = ({file}) => {
        const fileRef = useRef(null);
        const prevFileRef = useRef(null);
        const didMount = useRef(false);

        useEffect(() => {
            if (!didMount.current) {
                didMount.current = true;
                prevFileRef.current = file;
                return;
            }

            if (!file || prevFileRef.current === file) return;

            gsap.fromTo(
                fileRef.current,
                {autoAlpha: 0, y: -30},
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.525,
                    ease: "power3.out",
                }
            );

            prevFileRef.current = file; // update after animation
        }, [file]);

        const handleDelete = () => {
            gsap.to(fileRef.current, {
                autoAlpha: 0,
                y: 30,
                duration: 0.3,
                ease: "power3.out",
                onComplete: () => {
                    setFile(null);
                    onDelete();
                    setCanContinue(false);
                },
            });
        };

        const formatSize = (bytes) => {
            if (bytes < 1024) return `${bytes} B`;
            if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        };

        const getFileTypeLabel = (type) => {
            if (type.includes("pdf")) return "PDF";
            if (type.includes("word")) return "DOCX";
            return "FILE";
        };

        return (
            <div ref={fileRef} className={styles["selected-file"]}>
                <div className={`${styles["file-icon"]} smaller`}>
                    {getFileTypeLabel(file.type)}
                </div>
                <div className={styles["file-details"]}>
                    <small className={styles["file-name"]}>{file.name}</small>
                    <small className={styles["file-meta"]}>{formatSize(file.size)}</small>
                </div>
                <div className={styles["delete-icon"]} onClick={handleDelete}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="14"
                        viewBox="0 0 12 14"
                        fill="none"
                    >
                        <path
                            d="M0.857143 12.6875C0.857143 13.0356 0.992602 13.3694 1.23372 13.6156C1.47484 13.8617 1.80186 14 2.14286 14H9.85714C10.1981 14 10.5252 13.8617 10.7663 13.6156C11.0074 13.3694 11.1429 13.0356 11.1429 12.6875V3.5H0.857143V12.6875ZM8.14286 5.6875C8.14286 5.57147 8.18801 5.46019 8.26838 5.37814C8.34875 5.2961 8.45776 5.25 8.57143 5.25C8.68509 5.25 8.7941 5.2961 8.87447 5.37814C8.95485 5.46019 9 5.57147 9 5.6875V11.8125C9 11.9285 8.95485 12.0398 8.87447 12.1219C8.7941 12.2039 8.68509 12.25 8.57143 12.25C8.45776 12.25 8.34875 12.2039 8.26838 12.1219C8.18801 12.0398 8.14286 11.9285 8.14286 11.8125V5.6875ZM5.57143 5.6875C5.57143 5.57147 5.61658 5.46019 5.69695 5.37814C5.77733 5.2961 5.88634 5.25 6 5.25C6.11366 5.25 6.22267 5.2961 6.30305 5.37814C6.38342 5.46019 6.42857 5.57147 6.42857 5.6875V11.8125C6.42857 11.9285 6.38342 12.0398 6.30305 12.1219C6.22267 12.2039 6.11366 12.25 6 12.25C5.88634 12.25 5.77733 12.2039 5.69695 12.1219C5.61658 12.0398 5.57143 11.9285 5.57143 11.8125V5.6875ZM3 5.6875C3 5.57147 3.04515 5.46019 3.12553 5.37814C3.2059 5.2961 3.31491 5.25 3.42857 5.25C3.54224 5.25 3.65124 5.2961 3.73162 5.37814C3.81199 5.46019 3.85714 5.57147 3.85714 5.6875V11.8125C3.85714 11.9285 3.81199 12.0398 3.73162 12.1219C3.65124 12.2039 3.54224 12.25 3.42857 12.25C3.31491 12.25 3.2059 12.2039 3.12553 12.1219C3.04515 12.0398 3 11.9285 3 11.8125V5.6875ZM11.5714 0.875004H8.35714L8.10536 0.363677C8.05202 0.25436 7.96986 0.162405 7.86812 0.0981575C7.76638 0.0339095 7.6491 -8.27959e-05 7.52946 4.7941e-06H4.46786C4.34849 -0.000463619 4.23142 0.0334019 4.13004 0.0977214C4.02866 0.162041 3.94708 0.254213 3.89464 0.363677L3.64286 0.875004H0.428571C0.314907 0.875004 0.205898 0.921098 0.125526 1.00315C0.0451529 1.08519 0 1.19647 0 1.3125L0 2.1875C0 2.30354 0.0451529 2.41482 0.125526 2.49686C0.205898 2.57891 0.314907 2.625 0.428571 2.625H11.5714C11.6851 2.625 11.7941 2.57891 11.8745 2.49686C11.9548 2.41482 12 2.30354 12 2.1875V1.3125C12 1.19647 11.9548 1.08519 11.8745 1.00315C11.7941 0.921098 11.6851 0.875004 11.5714 0.875004Z"
                            fill="black"
                        />
                    </svg>
                </div>
            </div>
        );
    };

    return (
        <div className={styles["file-upload-container"]}>
            <DropZone/>
            {file && <SelectedFile file={file}/>}
        </div>
    )
}