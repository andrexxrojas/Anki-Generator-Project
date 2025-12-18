import styles from "../Step3.module.css";

const Header = ({title, subtitle}) => {
    return (
        <div className={styles["header"]}>
            <h4 className={styles["header-title"]}>{title}</h4>
            <p className={styles["header-subtitle"]}>{subtitle}</p>
        </div>
    )
}

export default Header;