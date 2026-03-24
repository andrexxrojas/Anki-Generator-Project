"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import styles from "./styles.module.css";
import Link from "next/link";

export default function Hero() {
    const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);

    const tags = [
        { text: "Any Subject", class: styles.one },
        { text: "Productivity", class: styles.two },
        { text: "Export Ready", class: styles.three },
        { text: "Instant Cards", class: styles.four },
        { text: "Drag & Drop", class: styles.five },
        { text: "Save Time", class: styles.six },
    ];

    useGSAP(() => {
        tagRefs.current.forEach((tag) => {
            if (!tag) return;

            const amplitude = gsap.utils.random(6, 10);
            const duration = gsap.utils.random(0.8, 1);
            const delay = gsap.utils.random(0, 2);

            gsap.to(tag, {
                y: amplitude,
                duration: duration,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: delay,
                overwrite: true,
            });
        });
    }, []);

    return (
        <div className={styles.sectionWrapper}>
            <section className={styles.sectionContainer}>
                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>
                        Focus on Learning. We&#39;ll Handle the Cards.
                    </h1>
                    <div className={styles.tagContainer}>
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                ref={el => { tagRefs.current[index] = el; }}
                                className={`${styles.tag} ${tag.class}`}
                            >
                                {tag.text}
                            </span>
                        ))}
                    </div>
                </div>
                <Link href="/generate" className={styles.cta}>Generate Flashcards</Link>
                <p className={styles.freeHint}>
                    4 free monthly generations
                </p>
            </section>
        </div>
    );
}