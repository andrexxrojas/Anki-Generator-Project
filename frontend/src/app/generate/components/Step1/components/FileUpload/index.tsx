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

interface DropZoneProps {
    onFileUpload: (file: File) => Promise<void>;
}

interface SelectedFileProps {
    file: File;
    onDelete: () => void;
}

interface FileData {
    name: string;
    size: number;
    type: string;
    text: string;
    wordCount: number;
}

const Dropzone = ({ onFileUpload }: DropZoneProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const isDraggingRef = useRef<boolean>(false);

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        isDraggingRef.current = true;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await onFileUpload(e.dataTransfer.files[0]);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        isDraggingRef.current = true;
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        isDraggingRef.current = false;
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await onFileUpload(e.target.files[0]);
            e.target.value = "";
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
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
                className={styles.dropZone}
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className={styles.iconContainer}>
                    <UploadIcon size={19} />
                </div>
                <p className={styles.dropZoneText}>
                    Drop your files here or browse
                </p>
                <small className={styles.dropZoneSubtext}>
                    Max word count up to 500
                </small>
            </div>
        </div>
    )
}

const SelectedFile = ({ file, onDelete }: SelectedFileProps) => {
    const fileRef = useRef<HTMLDivElement>(null);
    const prevFileRef = useRef<File | null>(null);
    const didMount = useRef<boolean>(false);

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true;
            prevFileRef.current = file;
            return;
        }

        if (!file || prevFileRef.current === file) return;

        if (fileRef.current) {
            gsap.fromTo(
                fileRef.current,
                { autoAlpha: 0, y: -30 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.525,
                    ease: "power3.out",
                }
            );
        }

        prevFileRef.current = file;
    }, [file]);

    const handleDelete = () => {
        if (fileRef.current) {
            gsap.to(fileRef.current, {
                autoAlpha: 0,
                y: 30,
                duration: 0.3,
                ease: "power3.out",
                onComplete: () => onDelete(),
            });
        }
    };

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

    return (
        <div ref={fileRef} className={styles.selectedFile}>
            <div className={styles.fileIcon}>
                {getFileTypeLabel(file.type)}
            </div>
            <div className={styles.fileDetails}>
                <small className={styles.fileName}>{file.name}</small>
                <small className={styles.fileMeta}>{formatSize(file.size)}</small>
            </div>
            <div className={styles.deleteIcon} onClick={handleDelete}>
                <TrashSimpleIcon size={19} />
            </div>
        </div>
    );
}

export default function FileUpload({onComplete, onDelete, setCanContinue, file: parentFile}: FileUploadProps) {
    const [file, setFile] = useState<File | null>(parentFile);
    const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

    useEffect(() => {
        const changeFile = (file: File | null) => {
            setFile(file);
        }

        changeFile(parentFile);
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
            const fileData: FileData = {
                name: uploadedFile.name,
                size: uploadedFile.size,
                type: uploadedFile.type,
                text: validated.text,
                wordCount: validated.wordCount
            };

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
            <Dropzone onFileUpload={handleFileUpload} />
            {file && (
                <SelectedFile file={file} onDelete={handleDelete} />
            )}
        </div>
    )
}