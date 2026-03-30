import styles from "./styles.module.css";

export default function DeleteAccount() {
    return (
        <div className={styles.card}>
            <h1 className={styles.title}>Security</h1>
            <h4 className={styles.subtitle}>Delete Account</h4>
            <p className={styles.description}>
                Permanently remove your account and all your decks. This action cannot be undone.
            </p>
            <button className={styles.btn}>
                Delete account
            </button>
        </div>
    )
}