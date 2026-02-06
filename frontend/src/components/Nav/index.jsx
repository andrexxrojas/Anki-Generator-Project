import styles from "./Nav.module.css";
import {NavLink, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/authContext.jsx";

export default function Nav() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleRedirect = (redirectTo) => {
        navigate(redirectTo);
    }

    return (
        <div className={styles["nav-wrapper"]}>
            <nav className={styles["nav-container"]}>
                <div className={styles["left-side"]}>
                    <div className={styles["logo-container"]}>
                        <h6 className={styles["logo-txt"]}>Anki Gen</h6>
                    </div>
                </div>
                <div className={styles["right-side"]}>
                    <ul className={styles["list-container"]}>
                        <li className={styles["list-content"]}>
                            <NavLink to="/" className={styles["content-txt"]}>
                                Home
                            </NavLink>
                        </li>
                        {user && (
                            <li className={styles["list-content"]}>
                                <NavLink to="/dashboard" className={styles["content-txt"]}>
                                    Dashboard
                                </NavLink>
                            </li>
                        )}
                        <li className={styles["list-content"]}>
                            <NavLink to="/" className={styles["content-txt"]}>
                                Features
                            </NavLink>
                        </li>
                        <li className={styles["list-content"]}>
                            <NavLink
                                to="#"
                                className={styles["content-txt"]}
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.open("https://github.com/andrexxrojas/Anki-Generator-Project");
                                }}
                            >
                                Docs
                            </NavLink>
                        </li>
                    </ul>
                    {!user && (
                        <div className={styles["button-wrapper"]}>
                            <button className={`${styles["btn"]} ${styles["login"]}`}
                                    onClick={() => handleRedirect("/auth/login")}>
                                <span className={styles["btn-txt"]}>Login</span>
                            </button>
                            <button className={`${styles["btn"]} ${styles["signup"]}`}
                                    onClick={() => handleRedirect("/auth/signup")}>
                                <span className={styles["btn-txt"]}>Signup</span>
                            </button>
                        </div>
                    )}
                    {user && (
                        <div className={styles["button-wrapper"]}>
                            <button className={`${styles["btn"]} ${styles["logout"]}`} onClick={logout}>
                                <span className={styles["btn-txt"]}>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    )
}