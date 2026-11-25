import type { Story } from "@/lib/hn/types";
import { StoryRow } from "@/components/StoryRow/StoryRow";
import styles from "./StoryList.module.scss";

type Props = { stories: Story[] };

/** Ordered list, since the stories are sorted by score. */
export function StoryList({ stories }: Props) {
  return (
    <>
      {/* Visual column labels on desktop. Each row carries its own text labels for screen readers. */}
      <div className={styles.header} aria-hidden="true">
        <span className={styles.headerScore}>Score</span>
        <span>Historie</span>
        <span>Forfatter</span>
        <span>Tidspunkt</span>
      </div>
      <ol className={styles.list}>
        {stories.map((story) => (
          <li key={story.id} className={styles.item}>
            <StoryRow story={story} />
          </li>
        ))}
      </ol>
    </>
  );
}
