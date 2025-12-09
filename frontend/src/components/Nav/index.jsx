import styles from "./Nav.module.css";
import {NavLink, useNavigate} from "react-router-dom";

export default function Nav() {
    const navigate = useNavigate();

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
                        <li className={styles["list-content"]}>
                            <NavLink to="/" className={styles["content-txt"]}>
                                Features
                            </NavLink>
                        </li>
                        <li className={styles["list-content"]}>
                            <NavLink to="/" className={styles["content-txt"]}>
                                Docs
                            </NavLink>
                        </li>
                    </ul>
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
                </div>
            </nav>
        </div>
    )
}