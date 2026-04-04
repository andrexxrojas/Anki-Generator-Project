import styles from "./styles.module.css";
import {UserCircleIcon} from "@phosphor-icons/react/ssr";

interface ProfileInfoProps {
    username: string;
    email: string;
}

export default function ProfileInfo({ username, email }: ProfileInfoProps) {
    return (
        <div className={styles.container}>
            <div className={styles.leftSection}>
                <div className={styles.infoContainer}>
                    <div className={styles.imageContainer}>
                        <UserCircleIcon size={32}/>
                    </div>
                    <div className={styles.detailsContainer}>
                        <h1 className={styles.name}>{username}</h1>
                        <span className={styles.email}>{email}</span>
                    </div>
                </div>
            </div>
            <div className={styles.rightSection}>
                <button className={styles.btn}>Logout</button>
            </div>
        </div>
    )
}