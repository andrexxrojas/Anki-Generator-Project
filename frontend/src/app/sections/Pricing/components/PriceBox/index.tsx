"use client";

import styles from "./styles.module.css";
import {CheckIcon} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {createCheckoutSession, createPortalSession} from "@/app/services/subscription.service";
import {useAuth} from "@/app/context/AuthContext/AuthContext";
import {GetProfile} from "@/app/services/auth.service";

interface PriceBoxProps {
    title: 'Basic' | 'Pro' | "Premium",
    price: 'Free' | '$7.99/month' | '$14.99/month',
    features: string[]
}

interface UserProfile {
    id: number;
    username: string;
    email: string;
    subscriptionTier: 'free' | 'pro' | 'premium';
    subscriptionStatus: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'inactive';
}

export default function PriceBox({ title, price, features }: PriceBoxProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const { user } = useAuth();
    const isBasic = title === 'Basic';

    // Fetch profile when user is authenticated
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                setProfile(null);
                setIsLoadingProfile(false);
                return;
            }

            try {
                setIsLoadingProfile(true);
                const data = await GetProfile();
                setProfile(data.user || data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                setProfile(null);
            } finally {
                setIsLoadingProfile(false);
            }
        };

        fetchProfile();
    }, [user]);

    const hasActiveSubscription = () => {
        if (!profile) return false;
        return profile.subscriptionStatus === 'active' && profile.subscriptionTier !== 'free';
    };

    const hasThisPlan = () => {
        if (!profile) return false;

        const planMap = {
            'Basic': 'free',
            'Pro': 'pro',
            'Premium': 'premium'
        };

        const dbTier = planMap[title];
        return profile.subscriptionTier === dbTier && profile.subscriptionStatus === 'active';
    };

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

        // Case 1: Not logged in
        if (!user) {
            router.push('/account/register');
            return;
        }

        // Case 2: Already has this plan -> manage subscription
        if (hasActiveSubscription()) {
            setIsLoading(true);
            try {
                const { url } = await createPortalSession();
                if (url) {
                    window.location.href = url;
                }
            } catch (error) {
                console.error('Error opening portal:', error);
                alert('Failed to open billing portal. Please try again.');
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // Case 3: Logged in, doesn't have this plan -> checkout
        setIsLoading(true);
        try {
            const priceId = getPriceId();
            if (!priceId) {
                throw new Error("Price ID not found");
            }

            const { url } = await createCheckoutSession(priceId);

            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error('Error creating checkout:', error);
            alert('Failed to start checkout. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getButtonText = () => {
        if (isBasic) return "Try it now";
        if (isLoadingProfile) return "Loading...";
        if (!user) return "Sign up to subscribe";
        if (isLoading) return "Processing...";
        return "Subscribe";
    };

    const isButtonDisabled = () => {
        if (isBasic) return false;
        if (isLoadingProfile) return true;
        if (isLoading) return true;
        return false;
    };

    // Basic tier
    if (isBasic) {
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
                <Link href="/generate" className={`${styles.submitBtn} ${styles.generate}`}>
                    {getButtonText()}
                </Link>
            </div>
        );
    }

    // Paid tiers
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
            <button
                className={styles.submitBtn}
                onClick={handleSubscribe}
                disabled={isButtonDisabled()}
            >
                {getButtonText()}
            </button>
        </div>
    );
}