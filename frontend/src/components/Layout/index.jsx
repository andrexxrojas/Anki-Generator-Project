import styles from "./Layout.module.css";
import Nav from "../Nav/index.jsx";

export default function Layout({children}) {
    return (
        <div className={styles["layout-wrapper"]}>
            <Nav/>
            <main className={styles["main-wrapper"]}>
                {children}
            </main>
        </div>
    )
}