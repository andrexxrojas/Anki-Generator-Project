"use client";

import styles from "./styles.module.css";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import Link from "next/link";

export default function NavBar() {
    const { user } = useAuth();

    return (
        <div className={styles.navWrapper}>
            <nav className={styles.navContainer}>
                <div className={styles.leftSection}>
                    <div className={styles.logoContainer}>
                        <Link href="/" className={styles.logo}>Anki Gen</Link>
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <div className={styles.buttonsContainer}>
                        <Link href="/account/login" className={styles.linkBtn}>Login</Link>
                        <Link
                            href="/generate"
                            className={`${styles.linkBtn} ${styles.generate}`}
                        >Try it now</Link>
                    </div>
                </div>
            </nav>
        </div>
    )
}