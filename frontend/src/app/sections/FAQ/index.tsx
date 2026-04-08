import styles from "./styles.module.css";
import SectionHeader from "@/app/components/SectionHeader";
import Accordion from "@/app/components/Accordion";

const faqItems = [
    {
        question: "How do I create my first set of flashcards",
        answer: "Simply paste your text, notes, or upload a document (.pdf or .docx) into the generator. Our AI will automatically extract key concepts and create professional flashcards in seconds."
    },
    {
        question: "Do I need an account to use AnkiGen",
        answer: "No account is required for the Basic (Free) plan! You can generate and download flashcards immediately."
    },
    {
        question: "Can I export my flashcards to PDF or other formats?",
        answer: "Currently, only .apkg export is supported. More formats (PDF, CSV, and text) will be coming soon!"
    },
    {
        question: "Can I cancel my subscription anytime?",
        answer: "Absolutely. You can cancel your subscription anytime from your account settings. There are no long-term contracts or cancellation fees. Your Pro/Premium access will continue until the end of your current billing period, after which you'll be downgraded to the Free plan automatically."
    },
    {
        question: "How do I upgrade or downgrade my plan?",
        answer: "Go to your Account Settings -> Subscription card. From there, you can select your desired plan by pressing on the manage subscription button."
    },
];

export default function FAQ() {
    return (
        <div className={styles.sectionWrapper}>
            <section className={`${styles.sectionContainer} ${styles.grid}`}>
                <SectionHeader
                    microlabel="Got Questions?"
                    title="Frequent Questions"
                    subtitle={
                        <>
                            Everything you need to know.
                            <br/>
                            Can&#39;t find your answer? Reach out.
                        </>
                    }
                />
                <Accordion items={faqItems} />
            </section>
        </div>
    )
}