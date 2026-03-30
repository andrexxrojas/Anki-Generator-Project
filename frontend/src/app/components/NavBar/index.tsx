"use client";

import styles from "./styles.module.css";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import Link from "next/link";
import AccountDropdown from "@/app/components/NavBar/components/AccountDropdown";

export default function NavBar() {
    const { user } = useAuth();

    return (
        <div className={styles.navWrapper}>
            <nav className={styles.navContainer}>
                <div className={styles.leftSection}>
                    <Link href="/" className={styles.logo}>
                        AnkiGen
                    </Link>
                </div>
                <div className={styles.rightSection}>
                    <div className={styles.buttonsContainer}>
                        {user ? (
                            <AccountDropdown />
                        ) : (
                            <Link href="/account/login" className={`${styles.btn} ${styles.login}`}>Login</Link>
                        )}
                        <Link href="/generate" className={`${styles.btn} ${styles.generate}`}>Try it now</Link>
                    </div>
                </div>
            </nav>
        </div>
    )
}