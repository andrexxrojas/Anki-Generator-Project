"use client";

import styles from "./styles.module.css";
import AuthLayout from "@/app/components/AuthLayout";
import RegisterForm from "@/app/account/register/components/RegisterForm";

export default function RegisterPage() {
    return (
        <div className={styles.pageContainer}>
            <AuthLayout type="register">
                <RegisterForm />
            </AuthLayout>
        </div>
    )
}