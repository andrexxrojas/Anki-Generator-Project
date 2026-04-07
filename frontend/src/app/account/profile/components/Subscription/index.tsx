"use client";

import styles from "./styles.module.css";
import Link from "next/link";
import { useState } from "react";
import { createPortalSession } from "@/app/services/subscription.service";

interface SubscriptionProps {
    subscriptionStatus: 'inactive' | 'active' | 'past_due' | 'canceled' | 'incomplete';
    subscriptionTier: 'free' | 'pro' | 'premium';
    nextBillingDate: number | null;
    pendingDowngradeTier?: 'free' | 'pro' | 'premium' | null;
    pendingDowngradeDate?: string | null;
    cancelAtPeriodEnd?: boolean;
}

export default function Subscription({
                                         subscriptionStatus,
                                         subscriptionTier,
                                         nextBillingDate,
                                         pendingDowngradeTier,
                                         pendingDowngradeDate,
                                         cancelAtPeriodEnd
                                     }: SubscriptionProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleManageSubscription = async () => {
        setIsLoading(true);
        try {
            const data = await createPortalSession();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to open subscription manager. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatDateFromISO = (dateString: string | null): string => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formattedPendingDate = pendingDowngradeDate ? formatDateFromISO(pendingDowngradeDate) : null;

    const getSubscriptionMessage = () => {
        if (subscriptionTier === 'free') {
            return <>No active subscription. <Link href="/pricing" className={styles.linkItem}>View plans</Link> to get started.</>;
        }

        if (pendingDowngradeTier === 'free' && formattedPendingDate) {
            return <>Your subscription will end on {formattedPendingDate}. <br/>You&#39;ll be downgraded to Free.</>;
        }

        if (pendingDowngradeTier && pendingDowngradeTier !== 'free' && formattedPendingDate) {
            const downgradeTier = pendingDowngradeTier.charAt(0).toUpperCase() + pendingDowngradeTier.slice(1);
            const currentTier = subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1);
            return <>You'll be downgraded to {downgradeTier} on {formattedPendingDate}. You keep {currentTier} features until then.</>;
        }

        if (nextBillingDate) {
            return <>Next billing date: {nextBillingDate}</>;
        }

        return null;
    };

    const getButtonText = () => {
        if (isLoading) return 'Loading...';
        if (subscriptionTier !== 'free') return 'Manage Subscription';
    };

    return (
        <div className={styles.card}>
            <h1 className={styles.title}>Billing & Subscription</h1>
            <h2 className={styles.currentPlan}>
                {subscriptionTier === 'free' ? 'Free' :
                    subscriptionTier === 'pro' ? 'Pro' : 'Premium'}
            </h2>
            <p className={styles.description}>
                {getSubscriptionMessage()}
            </p>
            {subscriptionTier !== 'free' && (
                <button
                    className={styles.btn}
                    onClick={handleManageSubscription}
                    disabled={isLoading}
                >
                    {getButtonText()}
                </button>
            )}
        </div>
    );
}