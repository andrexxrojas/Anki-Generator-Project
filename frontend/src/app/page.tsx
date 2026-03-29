import styles from "./page.module.css";
import Hero from "@/app/sections/Hero";

export default function Home() {
  return (
      <div className={styles.pageContainer}>
        <Hero />
      </div>
  )
}