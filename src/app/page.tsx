import { connection } from "next/server";
import { StoryList } from "@/components/StoryList/StoryList";
import { TopBar } from "@/components/TopBar/TopBar";
import { getRandomStories } from "@/lib/hn/api";
import styles from "./page.module.scss";

export default async function Home() {
  // Render per request, so every visit gets a new random pick. The HN responses stay cached (revalidate).
  await connection();
  const stories = await getRandomStories();

  return (
    <>
      <TopBar />
      <main className={styles.main}>
        <h2 className="visually-hidden">
          10 tilfældige Hacker News-historier, sorteret efter score, laveste først
        </h2>
        <StoryList stories={stories} />
      </main>
    </>
  );
}
