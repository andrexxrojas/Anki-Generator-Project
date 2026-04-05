"use client";

import styles from "./styles.module.css";
import {CheckIcon} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import {useState} from "react";
import {createCheckoutSession} from "@/app/services/subscription.service";

interface PriceBoxProps {
    title: 'Basic' | 'Pro' | "Premium",
    price: 'Free' | '$7.99/month' | '$14.99/month',
    features: string[]
}

export default function PriceBox({ title, price, features }: PriceBoxProps) {
    const [isLoading, setIsLoading] = useState(false);
    const isBasic = title === 'Basic';

    const getPriceId = () => {
        switch (title) {
            case 'Pro':
                return process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY;
            case 'Premium':
                return process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY;
            default:
                return null;
        }
    };

    const handleSubscribe = async () => {
        if (isBasic) return;

        setIsLoading(true);

        try {
            const priceId = getPriceId();
            if (!priceId) {
                throw new Error("Price ID not found");
            }

            const { url } = await createCheckoutSession(priceId);

            if (url) {
                // Redirect to Stripe checkout page
                window.location.href = url;
            }
        } catch (error) {
            console.error('Error creating checkout:', error);
            alert('Failed to start checkout. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
                <h2 className={styles.price}>{price}</h2>
            </div>
            <div className={styles.featuresContainer}>
                <ul className={styles.featuresList}>
                    {features.map((feature, index) => (
                        <li key={index} className={styles.featureItem}>
                            <CheckIcon size={14} weight="bold"/>
                            <span className={styles.featureTxt}>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
            {isBasic ? (
                <Link href="/generate" className={`${styles.submitBtn} ${styles.generate}`}>
                    Try it now
                </Link>
            ) : (
                <button
                    className={styles.submitBtn}
                    onClick={handleSubscribe}
                    disabled={isLoading}
                >
                    {isLoading ? "Processing..." : "Subscribe"}
                </button>
            )}
        </div>
    )
}