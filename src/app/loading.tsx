import { StoryListSkeleton } from "@/components/StoryList/StoryListSkeleton";
import styles from "./page.module.scss";

export default function Loading() {
  return (
    <main className={styles.main} aria-busy="true">
      <p className="visually-hidden" role="status">
        Henter historier…
      </p>
      <StoryListSkeleton />
    </main>
  );
}
