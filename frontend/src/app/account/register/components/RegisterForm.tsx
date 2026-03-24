import styles from "../styles.module.css";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext/AuthContext";

export default function RegisterForm() {
    const { signup, isLoading } = useAuth();
    const [passwordError, setPasswordError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setPasswordError("Passwords don't match");
            return;
        }

        setPasswordError("");

        const credentials = {
            username: formData.get("username") as string,
            email: formData.get("email") as string,
            password: password
        };

        try {
            signup(credentials);
        } catch (error) {
            throw new Error("Failed to register user.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.fieldWrapper}>
                <label htmlFor="username" className={styles.formLabel}>
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username"
                    className={styles.formInput}
                    disabled={isLoading}
                    required
                />
            </div>

            <div className={styles.fieldWrapper}>
                <label htmlFor="email" className={styles.formLabel}>
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    className={styles.formInput}
                    disabled={isLoading}
                    required
                />
            </div>

            <div className={styles.fieldWrapper}>
                <label htmlFor="password" className={styles.formLabel}>
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className={styles.formInput}
                    disabled={isLoading}
                    required
                />
            </div>

            <div className={styles.fieldWrapper}>
                <label htmlFor="confirmPassword" className={styles.formLabel}>
                    Confirm password
                </label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className={styles.formInput}
                    disabled={isLoading}
                    required
                />
                {passwordError && (
                    <p className={styles.errorMessage}>{passwordError}</p>
                )}
            </div>
            <button
                type="submit"
                className={styles.formSubmitBtn}
                disabled={isLoading}
            >
                {isLoading ? "Creating account..." : "Sign up"}
            </button>
        </form>
    );
}