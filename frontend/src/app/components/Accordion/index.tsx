"use client";

import { useState } from "react";
import { PlusIcon, MinusIcon } from "@phosphor-icons/react/ssr";
import styles from "./styles.module.css";

interface AccordionItem {
    question: string;
    answer: string;
}

interface AccordionProps {
    items: AccordionItem[];
    allowMultiple?: boolean; // Allow multiple items open at once
}

export default function Accordion({ items, allowMultiple = false }: AccordionProps) {
    const [openIndexes, setOpenIndexes] = useState<number[]>([]);

    const toggleItem = (index: number) => {
        if (allowMultiple) {
            setOpenIndexes(prev =>
                prev.includes(index)
                    ? prev.filter(i => i !== index)
                    : [...prev, index]
            );
        } else {
            setOpenIndexes(prev =>
                prev.includes(index) ? [] : [index]
            );
        }
    };

    return (
        <div className={styles.accordion}>
            {items.map((item, index) => (
                <div key={index} className={styles.accordionItem}>
                    <button
                        className={styles.accordionHeader}
                        onClick={() => toggleItem(index)}
                        aria-expanded={openIndexes.includes(index)}
                    >
                        <span className={styles.question}>{item.question}</span>
                        <span className={`${styles.icon} ${openIndexes.includes(index) ? styles.active : ""}`}>
                            <PlusIcon size={20} weight="bold"/>
                        </span>
                    </button>
                    <div
                        className={`${styles.accordionContent} ${
                            openIndexes.includes(index) ? styles.open : ""
                        }`}
                    >
                        <div className={styles.answer}>{item.answer}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}