"use client";

import { useState } from "react";
import styles from "./styles.module.css";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day money-back guarantee for all our plans. If you're not satisfied, contact our support team for a full refund."
        },
        {
            question: "Can I upgrade or downgrade my plan?",
            answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
        },
        {
            question: "Do you offer customer support?",
            answer: "Absolutely! We offer 24/7 customer support via email and live chat. Premium plans include priority phone support."
        },
        {
            question: "Is there a free trial available?",
            answer: "Yes, we offer a 14-day free trial on all plans. No credit card required to get started."
        },
        {
            question: "How does billing work?",
            answer: "We bill monthly or annually depending on your preference. Annual plans come with a 20% discount."
        }
    ];

    const toggleAccordion = (index: number | null) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={styles.sectionWrapper}>
            <section className={styles.sectionContainer}>
                <div className={styles.faqContainer}>
                    <div className={styles.sectionInfo}>
                        <h1 className={styles.title}>
                            Frequently asked questions
                        </h1>
                    </div>
                    <div className={styles.faq}>
                        {faqs.map((faq, index) => (
                            <div key={index} className={styles.accordionItem}>
                                <button
                                    className={`${styles.accordionButton} ${openIndex === index ? styles.active : ""}`}
                                    onClick={() => toggleAccordion(index)}
                                    aria-expanded={openIndex === index}
                                    aria-controls={`faq-answer-${index}`}
                                >
                                    <span className={styles.question}>{faq.question}</span>
                                    <span className={styles.icon}>
                                        {openIndex === index ? "−" : "+"}
                                    </span>
                                </button>
                                <div
                                    id={`faq-answer-${index}`}
                                    className={`${styles.accordionContent} ${openIndex === index ? styles.show : ""}`}
                                >
                                    <p className={styles.answer}>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}