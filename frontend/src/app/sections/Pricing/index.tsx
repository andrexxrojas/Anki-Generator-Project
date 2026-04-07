import styles from "./styles.module.css";
import SectionHeader from "@/app/components/SectionHeader";
import PriceGrid from "@/app/sections/Pricing/components/PriceGrid";
import PriceBox from "@/app/sections/Pricing/components/PriceBox";

export default function Pricing() {
    return (
        <div id="pricing-section" className={styles.sectionWrapper}>
            <section className={`${styles.sectionContainer} ${styles.grid}`}>
                <SectionHeader
                    microlabel="Pricing"
                    title="Invest in Your Learning"
                    subtitle="
                        Affordable plans to help you learn smarter,
                        faster, and on your terms.
                    "
                />
                <PriceGrid>
                    <PriceBox
                        title="Basic"
                        price="Free"
                        features={
                            [
                                "4 generations per month",
                                "Paste text or upload files (5MB max)",
                                "Basic card formats",
                                "No credit card required"
                            ]
                        }
                    />
                    <PriceBox
                        title="Pro"
                        price="$7.99/month"
                        features={
                            [
                                "75 generations per month",
                                "Paste text or upload files (10MB max)",
                                "All card formats"
                            ]
                        }
                    />
                    <PriceBox
                        title="Premium"
                        price="$14.99/month"
                        features={
                            [
                                "300 generations per month",
                                "Paste text or upload files (30MB max)",
                                "All card formats",
                            ]
                        }
                    />
                </PriceGrid>
            </section>
        </div>
    )
}