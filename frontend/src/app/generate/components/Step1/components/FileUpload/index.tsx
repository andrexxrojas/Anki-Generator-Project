import styles from "./styles.module.css";
import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {TrashSimpleIcon, UploadIcon} from "@phosphor-icons/react";
import gsap from "gsap";

interface FileUploadProps {
    onComplete: (file: File | null) => void;
    onDelete: () => void;
    setCanContinue: Dispatch<SetStateAction<boolean>>;
    file: File | null;
}

interface FileData {
    name: string;
    size: number;
    type: string;
    text: string;
    wordCount: number;
}

// Updated Dropzone to accept currentFile and onDelete props
const Dropzone = ({
                      onFileUpload,
                      currentFile,
                      onDelete
                  }: {
    onFileUpload: (file: File) => Promise<void>;
    currentFile: File | null;
    onDelete: () => void;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const dropzoneRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const formatSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileTypeLabel = (type: string): string => {
        if (type.includes("pdf")) return "PDF";
        if (type.includes("word") || type.includes("docx") || type.includes("officedocument")) return "DOCX";
        return "FILE";
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (currentFile) return; // Don't allow drop if file already selected

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await onFileUpload(e.dataTransfer.files[0]);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!currentFile) {
            e.dataTransfer.dropEffect = "copy";
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && !currentFile) {
            await onFileUpload(e.target.files[0]);
            e.target.value = "";
        }
    };

    const handleClick = () => {
        if (!currentFile) {
            inputRef.current?.click();
        }
    };

    const handleDeleteClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    };

    return (
        <div className={styles.dropZoneContainer}>
            <input
                type="file"
                ref={inputRef}
                className={styles.hiddenInput}
                onChange={handleFileSelect}
                accept=".pdf,.docx"
            />

            <div
                ref={dropzoneRef}
                className={`${styles.dropZone} ${currentFile ? styles.hasFile : ''}`}
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {!currentFile ? (
                    // Empty state
                    <>
                        <div className={styles.iconContainer}>
                            <UploadIcon size={19} />
                        </div>
                        <p className={styles.dropZoneText}>
                            Drop your file here or browse
                        </p>
                        <small className={styles.dropZoneSubtext}>
                            Pick a file and we'll extract the key content
                        </small>
                    </>
                ) : (
                    // File selected state
                    <>
                        <div className={styles.iconContainer} onClick={handleDeleteClick}>
                            <TrashSimpleIcon size={19} />
                        </div>
                        <div className={styles.fileDetails}>
                            <p className={styles.dropZoneText}>
                                {currentFile.name}
                            </p>
                            <small className={styles.dropZoneSubtext}>
                                {formatSize(currentFile.size)}
                            </small>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default function FileUpload({onComplete, onDelete, setCanContinue, file: parentFile}: FileUploadProps) {
    const [file, setFile] = useState<File | null>(parentFile);
    const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

    useEffect(() => {
        setFile(parentFile);
        setCanContinue(!!parentFile);
    }, [parentFile, setCanContinue]);

    const validateFile = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(`${API_URL}/file/validate`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Invalid file.");
                return false;
            }

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

    const handleFileUpload = async (uploadedFile: File) => {
        const validated = await validateFile(uploadedFile);

        if (validated) {
            setFile(uploadedFile);
            onComplete(uploadedFile);
            setCanContinue(true);
        } else {
            alert("Only .pdf and .docx files are allowed");
        }
    };

    const handleDelete = () => {
        setFile(null);
        onDelete();
        setCanContinue(false);
    };

    return (
        <div className={styles.container}>
            <Dropzone
                onFileUpload={handleFileUpload}
                currentFile={file}
                onDelete={handleDelete}
            />
        </div>
    );
}