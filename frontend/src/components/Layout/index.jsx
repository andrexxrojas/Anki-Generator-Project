import styles from "./Layout.module.css";
import Nav from "../Nav/index.jsx";
import { AuthProvider } from "../../context/authContext.jsx";

export default function Layout({children}) {
    return (
        <AuthProvider>
            <div className={styles["layout-wrapper"]}>
                <Nav/>
                <main className={styles["main-wrapper"]}>
                    {children}
                </main>
            </div>
        </AuthProvider>
    )
}