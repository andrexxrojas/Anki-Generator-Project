"use client";

import styles from "./styles.module.css";
import {useRouter} from "next/navigation";
import {CheckIcon} from "@phosphor-icons/react";

export default function Pricing() {
    const router = useRouter();

    return (
        <div className={styles.sectionWrapper}>
            <section className={styles.sectionContainer}>
                <div className={styles.sectionInfo}>
                    <h1 className={styles.title}>
                        Choose the plan that feels right for you
                    </h1>
                    <p className={styles.subtitle}>
                        Simple, flexible, and always transparent.
                    </p>
                </div>
                <div className={styles.grid}>
                    <div className={styles.box}>
                        <div className={styles.pricingHeader}>
                            <h1 className={styles.boxTitle}>Basic</h1>
                            <h3 className={styles.boxPrice}>Free</h3>
                        </div>
                        <div className={styles.metadata} aria-label="What's included">
                            <ul className={styles.metadataList}>
                                <li className={styles.metadataItem}>
                                    <CheckIcon size={16} weight="bold" />
                                    4 generations per month
                                </li>
                                <li className={styles.metadataItem}>
                                    <CheckIcon size={16} weight="bold" />
                                    Paste text or upload files (5MB max)
                                </li>
                                <li className={styles.metadataItem}>
                                    <CheckIcon size={16} weight="bold" />
                                    Basic card formats
                                </li>
                                <li className={styles.metadataItem}>
                                    <CheckIcon size={16} weight="bold" />
                                    No credit card required
                                </li>
                            </ul>
                        </div>

                        <button
                            className={styles.submitBtn}
                            onClick={() => {router.push("/generate")}}
                        >
                            try now
                        </button>
                    </div>
                    <div className={styles.box}>
                        <div className={styles.pricingHeader}>
                            <h1 className={styles.boxTitle}>Pro</h1>
                            <h3 className={styles.boxPrice}>$7.99/month</h3>
                        </div>
                        <div className={styles.metadata} aria-label="What's included">
                            <ul className={styles.metadataList}>
                                <li className={styles.metadataItem}>
                                    <CheckIcon size={16} weight="bold" />
                                    75 deck generations per month
                                </li>
                                <li className={styles.metadataItem}>
                                    <CheckIcon size={16} weight="bold" />
                                    Paste text or upload files (10MB max)
                                </li>
                                <li className={styles.metadataItem}>
                                    <CheckIcon size={16} weight="bold" />
                                    All card formats
                                </li>
                            </ul>
                        </div>

                        <button className={styles.submitBtn}>
                            subscribe
                        </button>
                    </div>
                    <div className={styles.box}>
                        <div className={styles.pricingHeader}>
                            <h1 className={styles.boxTitle}>Premium</h1>
                            <h3 className={styles.boxPrice}>$14.99/month</h3>
                        </div>
                        <div className={styles.metadata} aria-label="What's included">
                            <ul className={styles.metadataList}>
                                <li className={styles.metadataItem}>
                                    <CheckIcon size={16} weight="bold" />
                                    300 deck generations per month
                                </li>
                                <li className={styles.metadataItem}>
                                    <CheckIcon size={16} weight="bold" />
                                    Paste text or upload files (50MB max),
                                    URLs, YouTube videos
                                </li>
                                <li className={styles.metadataItem}>
                                    <CheckIcon size={16} weight="bold" />
                                    All card formats
                                </li>
                            </ul>
                        </div>

                        <button className={styles.submitBtn}>
                            subscribe
                        </button>
                    </div>
                </div>

            </section>
        </div>
    )
}