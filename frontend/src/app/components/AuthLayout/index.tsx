import styles from "./styles.module.css";
import { ReactNode } from "react";
import Link from "next/link";

interface AuthLayoutProps {
    type: 'register' | 'login';
    children: ReactNode;
}

export default function AuthLayout({ type, children }: AuthLayoutProps) {
    const title = type === "register"
        ? "Create your account"
        : "Sign in to continue"

    const description = type === "register"
        ? "Sign up to start your study journey"
        : "Your smarter way to study starts here";

    const toggleText = type === "register"
        ? "Already have an account?"
        : "Don't have an account?";

    const toggleLink = type === "register"
        ? "/account/login"
        : "/account/register";

    const linkText = type === "register"
        ? "Login"
        : "Sign up";

    return (
        <div className={styles.layoutContainer}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>
            {children}
            <div className={styles.toggleContainer}>
                <p className={styles.toggleText}>
                    {toggleText}{" "}
                    <Link href={toggleLink}>
                        {linkText}
                    </Link>
                </p>
            </div>
        </div>
    )
}