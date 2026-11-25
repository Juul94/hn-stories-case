import { STORY_COUNT } from "@/lib/hn/api";
import styles from "./StoryListSkeleton.module.scss";

const rows = Array.from({ length: STORY_COUNT }, (_, index) => index);

/** Gray placeholder rows in the shape of a story row. Decorative; loading.tsx announces the state. */
export function StoryListSkeleton() {
  return (
    <ol className={styles.list} aria-hidden="true">
      {rows.map((row) => (
        <li key={row} className={styles.row}>
          <span className={styles.image} />
          <span className={styles.lines}>
            <span className={`${styles.bar} ${styles.title}`} />
            <span className={`${styles.bar} ${styles.url}`} />
            <span className={`${styles.bar} ${styles.meta}`} />
          </span>
        </li>
      ))}
    </ol>
  );
}
