import styles from "./Login.module.css";
import {Link} from "react-router-dom";
import {useState} from "react";

export default function Login() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [form, setForm] = useState({
        identifier: "",
        password: ""
    })

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    identifier: form.identifier,
                    password: form.password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data.error);
                return;
            }
        } catch (err) {
            console.error("Login error:", err);
        }
    }

    return (
        <div className={styles["login-wrapper"]}>
            <div className={styles["login-container"]}>
                <div className={styles["login-info"]}>
                    <h6 className={styles["login-title"]}>Login to Ankigen</h6>
                    <p className={styles["login-desc"]}>Your smarter way to study starts here</p>
                </div>

                <form className={styles["login-form"]} onSubmit={handleSubmit}>
                    <label htmlFor="identifier">Email or username</label>
                    <input
                        type="text"
                        id="identifier"
                        name="identifier"
                        placeholder="Enter your email or username"
                        value={form.identifier}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <div className={styles["forgot-password"]}>
                        <Link to="/forgot-password" className={styles["forgot-password-txt"]}>
                            Forgot password?
                        </Link>
                    </div>

                    <button className={styles["submit-btn"]} type="submit">Login</button>
                    <div className={styles["signup-redirect"]}>
                        <span className={styles["signup-redirect-txt"]}>Don't have an account?</span>
                        <Link to="/auth/signup" className={styles["signup-redirect-link"]}>
                            Sign Up
                        </Link>
                    </div>
                </form>

            </div>
        </div>
    )
}