import styles from "./Home.module.css";
import {useNavigate} from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    const handleRedirect = (e, redirectTo) => {
        e.preventDefault();
        navigate(redirectTo);
    }

    return (
        <div className={styles["home-wrapper"]}>
            <section className={styles["hero-section"]}>
                <div className={styles["hero-container"]}>
                    <div className={styles["tags-container"]}>
                        <div className={`${styles["tag"]} ${styles["green"]}`}>
                            <span className={styles["tag-txt"]}>Effortless</span>
                        </div>
                        <div className={`${styles["tag"]} ${styles["blue"]}`}>
                            <span className={styles["tag-txt"]}>Fast</span>
                        </div>
                        <div className={`${styles["tag"]} ${styles["pink"]}`}>
                            <span className={styles["tag-txt"]}>Organized</span>
                        </div>
                        <div className={`${styles["tag"]} ${styles["red"]}`}>
                            <span className={styles["tag-txt"]}>Smart Learning</span>
                        </div>
                    </div>
                    <h1 className={styles["hero-title"]}>Transform notes seamlessly.</h1>
                    <p className={styles["hero-desc"]}>
                        Turn your study notes into organized Anki decks instantly,
                        and spend more time mastering them.
                    </p>
                    <button className={styles["hero-btn"]} onClick={(e) => handleRedirect(e, "/generate-deck")}>
                        <span className={styles["hero-btn-txt"]}>Generate Flashcards</span>
                    </button>
                </div>
            </section>
        </div>
    )
}