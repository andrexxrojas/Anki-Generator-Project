import styles from "./styles.module.css";
import Link from "next/link";

interface SubscriptionProps {
    subscriptionStatus: 'inactive' | 'active' | 'past_due' | 'canceled' | 'incomplete';
    subscriptionTier: 'free' | 'pro' | 'premium';
    nextBillingDate: number | null;
}

export default function Subscription({ subscriptionStatus, subscriptionTier, nextBillingDate }: SubscriptionProps) {
    return (
        <div className={styles.card}>
            <h1 className={styles.title}>Billing & Subscription</h1>
            <h2 className={styles.currentPlan}>{subscriptionTier}</h2>
            <p className={styles.description}>
                {subscriptionTier === 'free' ? (
                    <>No active subscription. <Link href="/" className={styles.linkItem}>View plans</Link> to get started.</>
                ) : (
                    <>Next billing date: {nextBillingDate}</>
                )}
            </p>
        </div>
    )
}