import styles from "../EditDeck.module.css";

const ViewAllDecks = ({cards}) => {
    return (
        <div className={styles["view-all-wrapper"]}>
            <div className={styles["view-all-container"]}>
                {cards.map((card, i) => (
                    <div key={i} className={styles["card-wrapper"]}>
                        <span className={styles["card-num"]}>{i + 1} / {cards.length}</span>
                        <div className={styles["card"]}>
                            <div className={styles["card-top-preview"]}>
                                <p>{card.front}</p>
                            </div>
                            <div className={styles["card-bottom-preview"]}>
                                <p>{card.back}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ViewAllDecks;