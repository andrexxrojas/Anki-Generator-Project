import styles from "./styles.module.css";
import {CheckIcon} from "@phosphor-icons/react/ssr";
import Link from "next/link";

interface PriceBoxProps {
    title: 'Basic' | 'Pro' | "Premium",
    price: 'Free' | '$7.99/month' | '$14.99/month',
    features: string[]
}

export default function PriceBox({ title, price, features }: PriceBoxProps) {
    const isBasic = title === 'Basic';

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
                <button className={styles.submitBtn}>
                    Subscribe
                </button>
            )}
        </div>
    )
}