import styles from "./Hero.module.css";
import {useRef} from "react";
import {useNavigate} from "react-router-dom";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";

export default function Hero() {
    const tagsRef = useRef(null);
    const navigate = useNavigate();

    const handleRedirect = (e, redirectTo) => {
        e.preventDefault();
        navigate(redirectTo);
    }

    useGSAP(() => {
        const tags = tagsRef.current.querySelectorAll(`.${styles["tag"]}`);

        tags.forEach((tag, i) => {
            gsap.to(tag, {
                y: -10,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.1,
                duration: 0.5
            });
        })

    }, {scope: tagsRef})

    return (
        <section className={styles["hero-section"]}>
            <div className={styles["hero-container"]}>
                <div ref={tagsRef} className={styles["tags-container"]}>
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
    )
}