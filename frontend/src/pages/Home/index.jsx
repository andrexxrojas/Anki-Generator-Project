import styles from "./Home.module.css";
import Hero from "../../sections/Hero/index.jsx";
import Features from "../../sections/Features/index.jsx";

export default function Home() {
    return (
        <div className={styles["home-wrapper"]}>
            <Hero/>
            <Features/>
        </div>
    )
}