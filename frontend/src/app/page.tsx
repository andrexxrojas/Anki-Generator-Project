import styles from "./page.module.css";
import Hero from "@/app/sections/Hero";
import Features from "@/app/sections/Features";
import Pricing from "@/app/sections/Pricing";

export default function Home() {
  return (
      <div className={styles.pageContainer}>
        <Hero />
        <Features />
        <Pricing />
      </div>
  )
}