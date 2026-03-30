import styles from "./styles.module.css";
import ProfileInfo from "@/app/account/profile/components/ProfileInfo";
import UsageDetails from "@/app/account/profile/components/UsageDetails";
import TotalDecks from "@/app/account/profile/components/TotalDecks";
import Subscription from "@/app/account/profile/components/Subscription";
import DeleteAccount from "@/app/account/profile/components/DeleteAccount";

export default function Profile() {
    return (
        <div className={styles.pageWrapper}>
            <div className={`${styles.pageContainer} ${styles.grid}`}>
                <ProfileInfo />
                <UsageDetails />
                <TotalDecks />
                <Subscription />
                <DeleteAccount />
            </div>
        </div>
    )
}