import styles from "./page.module.css";
import Hero from "@/app/sections/Hero";
import Features from "@/app/sections/Features";

export default function Home() {
  return (
      <div className={styles.pageContainer}>
          <Hero />
          <Features />
      </div>
  )
}