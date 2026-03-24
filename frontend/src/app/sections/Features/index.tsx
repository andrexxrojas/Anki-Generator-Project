"use client";

import styles from "./styles.module.css";
import {BoxArrowDownIcon, CardsIcon, FileTextIcon, GlobeIcon, ImageSquareIcon, TargetIcon} from "@phosphor-icons/react";

export default function Features() {
    return (
        <div className={styles.sectionWrapper}>
            <section className={styles.sectionContainer}>
                <div className={styles.sectionInfo}>
                    <h1 className={styles.title}>Supercharge your workflow</h1>
                    <p className={styles.subtitle}>
                        Turn hours of card creation into seconds with AI-powered
                        generation. Just paste, click, and import to Anki.
                    </p>
                </div>
                <div className={styles.grid}>
                    <div className={styles.box}>
                        <div className={styles.iconContainer}>
                            <BoxArrowDownIcon size={24} />
                        </div>
                        <div className={styles.boxInfo}>
                            <h2 className={styles.boxTitle}>Instant export</h2>
                            <p className={styles.boxSubtitle}>
                                One-click export to Anki. Works on phone, tablet,
                                and desktop. Zero setup, start studying instantly.
                            </p>
                        </div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.iconContainer}>
                            <FileTextIcon size={24} />
                        </div>
                        <div className={styles.boxInfo}>
                            <h2 className={styles.boxTitle}>Flexible input</h2>
                            <p className={styles.boxSubtitle}>
                                PDF, PowerPoint, Word, EPUB — whatever your notes 
                                look like, we&#39;ll convert them to Anki cards.
                            </p>
                        </div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.iconContainer}>
                            <TargetIcon size={24} />
                        </div>
                        <div className={styles.boxInfo}>
                            <h2 className={styles.boxTitle}>Built for Anki</h2>
                            <p className={styles.boxSubtitle}>
                                Creates properly formatted cards that work 
                                seamlessly with Anki&#39;s spaced repetition system.
                            </p>
                        </div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.iconContainer}>
                            <CardsIcon size={24} />
                        </div>
                        <div className={styles.boxInfo}>
                            <h2 className={styles.boxTitle}>Flashcard Types</h2>
                            <p className={styles.boxSubtitle}>
                                Q&A, Cloze, Multiple Choice, and Image Occlusion.
                                Auto-tagged, with clean formatting.
                            </p>
                        </div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.iconContainer}>
                            <ImageSquareIcon size={24} />
                        </div>
                        <div className={styles.boxInfo}>
                            <h2 className={styles.boxTitle}>Image Occlusion</h2>
                            <p className={styles.boxSubtitle}>
                                Identifies diagrams, charts, and labeled images.
                                Text is automatically covered for instant occlusion cards.
                            </p>
                        </div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.iconContainer}>
                            <GlobeIcon size={24} />
                        </div>
                        <div className={styles.boxInfo}>
                            <h2 className={styles.boxTitle}>Language Agnostic</h2>
                            <p className={styles.boxSubtitle}>
                                Upload in any language. Your flashcards will
                                be translated to your chosen language automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}