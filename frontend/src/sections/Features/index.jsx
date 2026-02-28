import styles from "./Features.module.css";

export default function Features() {
    const features = [
        {
            title: "Smart Import",
            description: "Upload PDF, DOCX, or plain text. Our AI extracts key information and creates optimized flashcards automatically."
        },
        {
            title: "Automated Flashcard Creation",
            description: "Upload your materials and get professionally formatted Anki decks instantly - no more manual card creation."
        },
        {
            title: "Full Control",
            description: "Edit deck names, modify card content, and organize your flashcards exactly how you want them."
        }
    ];

    return (
        <section className={styles["features-section"]}>
            <div className={styles["features-container"]}>
                <div className={styles["features-header"]}>
                    <span className={styles["features-subtitle"]}>Why Choose Us</span>
                    <h2 className={styles["features-title"]}>
                        Everything you need to create <br />perfect Anki decks
                    </h2>
                </div>

                <div className={styles["features-grid"]}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles["feature-card"]}>
                            <div className={styles["feature-icon-wrapper"]}>
                                <div className={styles["feature-icon"]} />
                            </div>
                            <h3 className={styles["feature-card-title"]}>{feature.title}</h3>
                            <p className={styles["feature-card-desc"]}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}