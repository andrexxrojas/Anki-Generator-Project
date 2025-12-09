import styles from "./Signup.module.css";
import {Link} from "react-router-dom";
import {useState} from "react";

export default function Signup() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
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

        if (form.password !== form.confirmPassword) return;

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: form.username,
                    email: form.email,
                    password: form.password
                })
            })

            const data = await res.json();

            if (!res.ok) {
                console.error(data.error);
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className={styles["signup-wrapper"]}>
            <div className={styles["signup-container"]}>
                <div className={styles["signup-info"]}>
                    <h6 className={styles["signup-title"]}>Join Ankigen</h6>
                    <p className={styles["signup-desc"]}>Sign up to start your study journey.</p>
                </div>

                <form className={styles["signup-form"]} onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={form.email}
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
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <button className={styles["submit-btn"]} type="submit">Signup</button>
                    <div className={styles["login-redirect"]}>
                        <span className={styles["login-redirect-txt"]}>Already have an account?</span>
                        <Link to="/auth/login" className={styles["login-redirect-link"]}>
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}