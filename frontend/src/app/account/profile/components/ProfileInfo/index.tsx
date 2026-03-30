import styles from "./styles.module.css";
import {UserCircleIcon} from "@phosphor-icons/react/ssr";

export default function ProfileInfo() {
    return (
        <div className={styles.container}>
            <div className={styles.leftSection}>
                <div className={styles.infoContainer}>
                    <div className={styles.imageContainer}>
                        <UserCircleIcon size={32}/>
                    </div>
                    <div className={styles.detailsContainer}>
                        <h1 className={styles.name}>Jay Andre Rojas</h1>
                        <span className={styles.email}>jayandrerojas@gmail.com</span>
                    </div>
                </div>
            </div>
            <div className={styles.rightSection}>
                <button className={styles.btn}>Logout</button>
            </div>
        </div>
    )
}