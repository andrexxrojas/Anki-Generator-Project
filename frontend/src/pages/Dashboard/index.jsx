import styles from "./Dashboard.module.css";
import {useState, useRef} from "react";
import DeckGrid from "./components/DeckGrid/index.jsx";

const HeaderInfo = ({title, subtitle}) => {
    return (
        <div className={styles["header-info"]}>
            <h5 className={styles["header-title"]}>{title}</h5>
            <p className={styles["header-subtitle"]}>{subtitle}</p>
        </div>
    )
}

const HeaderControls = () => {
    const [query, setQuery] = useState("");
    const searchRef = useRef(null);

    const handleSearch = (e) => {
        setQuery(e.target.value);
    }

    const handleFocus = () => {
        searchRef.current.focus();
    }

    return (
        <div className={styles["header-controls"]}>
            <div className={styles["header-search-container"]} onClick={handleFocus}>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path
                        d="M7.60861 7.61728L10.5 10.5M8.83333 4.66667C8.83333 6.96783 6.96783 8.83333 4.66667 8.83333C2.36548 8.83333 0.5 6.96783 0.5 4.66667C0.5 2.36548 2.36548 0.5 4.66667 0.5C6.96783 0.5 8.83333 2.36548 8.83333 4.66667Z"
                        stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input
                    type="text"
                    placeholder="Search decks..."
                    value={query}
                    onChange={handleSearch}
                    className={styles["header-search-input"]}
                    ref={searchRef}
                />
            </div>
            <button className={styles["header-create-btn"]}>Create Deck</button>
        </div>
    )
}

const Header = () => {
    return (
        <div className={styles["header-container"]}>
            <HeaderInfo
                title="Dashboard"
                subtitle="Quick access to your deck and learning stats"
            />
            <HeaderControls/>
        </div>
    )
}

export default function Dashboard() {
    return (
        <div className={styles["dashboard-wrapper"]}>
            <div className={styles["dashboard-container"]}>
                <Header/>
                <DeckGrid/>
            </div>
        </div>
    )
}