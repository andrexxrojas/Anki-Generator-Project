"use client";

import styles from "./styles.module.css";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import {useAuth} from "@/app/context/AuthContext/AuthContext";

export default function AccountDropdown() {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { logout } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showMenu && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]);

    useGSAP(() => {
        if (!dropdownRef.current) return;

        if (showMenu) {
            gsap.fromTo(
                dropdownRef.current,
                { y: 25, opacity: 0, pointerEvents: "none" },
                { y: 0, opacity: 1, pointerEvents: "auto", duration: 0.3, ease: "power2.out" }
            );
        } else {
            gsap.to(dropdownRef.current, {
                y: 20,
                opacity: 0,
                pointerEvents: "none",
                duration: 0.3,
                ease: "power2.in",
            });
        }
    }, { dependencies: [showMenu] });

    return (
        <div className={styles.menuAnchor} ref={menuRef}>
            <button
                className={styles.btn}
                onClick={() => setShowMenu((prev) => !prev)}
            >
                Account
            </button>
            <div
                className={styles.dropdown}
                ref={dropdownRef}
                style={{ opacity: 0, pointerEvents: "none" }}
            >
                <Link href="/account/profile" className={styles.dropdownItem}>
                    Profile
                </Link>
                <Link href="/my-decks" className={styles.dropdownItem}>
                    My Decks
                </Link>
                <button
                    className={`${styles.dropdownItem} ${styles.btn}`}
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </div>
    )
}