import styles from "./styles.module.css";
import { Dispatch, SetStateAction, useRef, useEffect, useState } from "react";
import { DeleteAccount } from "@/app/services/auth.service";

interface DeleteConfirmationProps {
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteConfirmation({ showModal, setShowModal }: DeleteConfirmationProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowModal(false);
            }
        };

        if (showModal) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showModal, setShowModal]);

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await DeleteAccount();
            window.location.href = "/";
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Failed to delete account. Please try again.");
        } finally {
            setIsDeleting(false);
            setShowModal(false);
        }
    };

    if (!showModal) return null;

    return (
        <div className={styles.wrapper}>
            <div className={styles.container} ref={containerRef}>
                <h4 className={styles.subtitle}>Delete Account</h4>
                <p className={styles.description}>
                    Are you sure you want to delete your account? <br/>
                    This action cannot be undone and all your decks will be permanently lost.
                </p>
                <button
                    className={styles.btn}
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting..." : "Confirm delete"}
                </button>
            </div>
        </div>
    )
}