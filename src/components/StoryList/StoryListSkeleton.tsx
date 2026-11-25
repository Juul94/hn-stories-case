import { STORY_COUNT } from "@/lib/hn/api";
import sortStyles from "@/components/SortSelect/SortSelect.module.scss";
import listStyles from "./StoryList.module.scss";
import styles from "./StoryListSkeleton.module.scss";

const rows = Array.from({ length: STORY_COUNT }, (_, index) => index);

/** Gray placeholder rows in the shape of a story row. Decorative; loading.tsx announces the state. */
export function StoryListSkeleton() {
  return (
    <div aria-hidden="true">
      {/* Invisible copies of the sort select and the desktop column header, so the list starts at the same height. */}
      <div className={`${sortStyles.wrapper} ${styles.header}`}>
        <span className={sortStyles.label}>Sortér efter</span>
        <span className={sortStyles.select}>Score, laveste først</span>
      </div>
      <div className={`${listStyles.header} ${styles.header}`}>
        <span>Score</span>
        <span />
        <span>Forfatter</span>
        <span>Tidspunkt</span>
      </div>
      <ol className={styles.list}>
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
    </div>
  );
}
