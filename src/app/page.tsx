import { connection } from "next/server";
import { StoryList } from "@/components/StoryList/StoryList";
import { getRandomStories } from "@/lib/hn/api";
import styles from "./page.module.scss";

export default async function Home() {
  // Render per request, so every visit gets a new random pick. The HN responses stay cached (revalidate).
  await connection();
  const stories = await getRandomStories();

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.heading}>Hacker News</h1>
        <p className={styles.intro}>
          10 tilfældige topnyheder, sorteret efter score – laveste først.
        </p>
      </header>
      <StoryList stories={stories} />
    </main>
  );
}
