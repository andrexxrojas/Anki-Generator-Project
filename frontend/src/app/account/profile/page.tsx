"use client";

import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { GetProfile } from "@/app/services/auth.service";
import ProfileInfo from "@/app/account/profile/components/ProfileInfo";
import UsageDetails from "@/app/account/profile/components/UsageDetails";
import TotalDecks from "@/app/account/profile/components/TotalDecks";
import Subscription from "@/app/account/profile/components/Subscription";
import DeleteAccount from "@/app/account/profile/components/DeleteAccount";

interface ProfileData {
    username: string;
    email: string;
    totalDecksGenerated: number;
    monthlyDecksGenerated: number;
    generationsLeft: number;
    monthlyLimit: number;
    subscriptionTier: 'free' | 'pro' | 'premium';
    subscriptionStatus: 'inactive' | 'active' | 'past_due' | 'canceled' | 'incomplete';
}


export default function Profile() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await GetProfile();
                console.log(data);
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchProfile();
    }, []);

    if (loading) return <div></div>;

    return (
        <div className={styles.pageWrapper}>
            <div className={`${styles.pageContainer} ${styles.grid}`}>
                <ProfileInfo
                    username={profile!.username}
                    email={profile!.email}
                />
                <UsageDetails
                    monthlyDecksGenerated={profile!.monthlyDecksGenerated}
                    monthlyLimit={profile!.monthlyLimit}
                    generationsLeft={profile!.generationsLeft}
                />
                <TotalDecks
                    totalDecksGenerated={profile!.totalDecksGenerated}
                />
                <Subscription
                    subscriptionStatus={profile!.subscriptionStatus}
                    subscriptionTier={profile!.subscriptionTier}
                />
                <DeleteAccount />
            </div>
        </div>
    )
}
