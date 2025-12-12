import styles from './DeckGrid.module.css';

const DeckBox = ({title, numItems, tags, accountName}) => {
    return (
        <div className={styles["deck-box-wrapper"]}>
            <div className={styles["deck-box-container"]}>
                <div className={styles["info-container"]}>
                    <h6 className={styles["deck-title"]}>{title}</h6>
                    <p className={styles["deck-items"]}>{numItems} flashcards</p>

                    <div className={styles["tags-container"]}>
                        {tags.map((tag) => (
                            <span key={tag} className={styles["tag"]}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className={styles["deck-account"]}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 0C5.37328 0 0 5.37246 0 12C0 18.6275 5.37275 24 12 24C18.6278 24 24 18.6275 24 12C24 5.37246 18.6278 0 12 0ZM12 3.58814C14.1927 3.58814 15.9696 5.36561 15.9696 7.55739C15.9696 9.7497 14.1927 11.5266 12 11.5266C9.80831 11.5266 8.03145 9.7497 8.03145 7.55739C8.03145 5.36561 9.80831 3.58814 12 3.58814ZM11.9974 20.8626C9.81042 20.8626 7.80743 20.0661 6.2625 18.7477C5.88615 18.4267 5.66898 17.956 5.66898 17.4621C5.66898 15.2392 7.46798 13.4601 9.69129 13.4601H14.3098C16.5336 13.4601 18.3257 15.2392 18.3257 17.4621C18.3257 17.9565 18.1096 18.4262 17.7328 18.7472C16.1884 20.0661 14.1848 20.8626 11.9974 20.8626Z"
                            fill="#E5E5E5"/>
                    </svg>
                    <span className={styles["deck-account-name"]}>{accountName}</span>
                </div>
            </div>
        </div>
    )
}

export default function DeckGrid() {
    return (
        <div className={styles["grid-wrapper"]}>
            <div className={styles["grid-container"]}>
                <DeckBox
                    title="Nervous System"
                    numItems={20}
                    tags={["Biology", "Science"]}
                    accountName="andrexxrojas"
                />
            </div>
        </div>
    )
}