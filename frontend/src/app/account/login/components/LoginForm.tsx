import styles from "../styles.module.css";
import { SubmitEvent as FormEvent } from "react";
import { useAuth } from "@/app/context/AuthContext/AuthContext";

export default function LoginForm() {
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const credentials = {
            identifier: formData.get("identifier") as string,
            password: formData.get("password") as string
        }

        try {
            login(credentials);
        } catch (error) {
            console.error("Failed to login user.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <div className={styles.fieldWrapper}>
                <label htmlFor="email" className={styles.formLabel}>
                    Email or username
                </label>
                <input
                    type="text"
                    id="identifier"
                    name="identifier"
                    placeholder="Email or username"
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
            <button
                type="submit"
                className={styles.formSubmitBtn}
                disabled={isLoading}
            >
                {isLoading ? "Logging in..." : "Sign in"}
            </button>
        </form>
    );
}