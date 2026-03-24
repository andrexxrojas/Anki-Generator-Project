import styles from "./styles.module.css";

type ViewType = "upload-file" | "paste-text";

interface ViewTabProps {
    handleView: (view: ViewType) => void;
    activeView: ViewType;
}

export default function ViewTab({handleView, activeView}: ViewTabProps) {
    return (
        <div className={styles.tabsContainer}>
            <div
                className={`${styles.tab} ${activeView === "upload-file" ? styles.active : ""}`}
                onClick={() => handleView("upload-file")}
            >
                <span className={styles.tabTxt}>Upload File</span>
            </div>
            <div
                className={`${styles.tab} ${activeView === "paste-text" ? styles.active : ""}`}
                onClick={() => handleView("paste-text")}
            >
                <span className={styles.tabTxt} onClick={() => handleView("paste-text")}>Paste Text</span>
            </div>
        </div>
    )
}
