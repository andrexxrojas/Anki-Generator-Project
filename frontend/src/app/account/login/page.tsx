"use client";

import styles from "./styles.module.css";
import AuthLayout from "@/app/components/AuthLayout";
import LoginForm from "@/app/account/login/components/LoginForm";

export default function LoginPage() {
    return (
        <div className={styles.pageContainer}>
            <AuthLayout type="login">
                <LoginForm />
            </AuthLayout>
        </div>
    )
}