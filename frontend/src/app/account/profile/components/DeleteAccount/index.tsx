"use client";

import styles from "./styles.module.css";
import { useState } from "react";
import DeleteConfirmation from "@/app/account/profile/components/DeleteAccount/components/DeleteConfirmation";

export default function DeleteAccount() {
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <div className={styles.card}>
            <h1 className={styles.title}>Security</h1>
            <h4 className={styles.subtitle}>Delete Account</h4>
            <p className={styles.description}>
                Permanently remove your account and all your decks. This action cannot be undone.
            </p>
            <button className={styles.btn} onClick={() => setShowModal(true)}>
                Delete account
            </button>
            <DeleteConfirmation showModal={showModal} setShowModal={setShowModal}/>
        </div>
    )
}