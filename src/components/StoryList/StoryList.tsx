import { DEFAULT_SORT, type SortOption } from "@/lib/hn/sorting";
import type { Story } from "@/lib/hn/types";
import { StatusMessage } from "@/components/StatusMessage/StatusMessage";
import { StoryRow } from "@/components/StoryRow/StoryRow";
import styles from "./StoryList.module.scss";

type Props = { stories: Story[]; sort?: SortOption };

// The score arrow only shows when the list is sorted by score.
const SCORE_ARROWS: Partial<Record<SortOption, string>> = { "score-asc": "↑", "score-desc": "↓" };

/** Ordered list, since the stories are sorted. */
export function StoryList({ stories, sort = DEFAULT_SORT }: Props) {
  const isEmpty = stories.length === 0;
  if (isEmpty) {
    return (
      <StatusMessage title="Ingen historier lige nu" role="status">
        Hacker News returnerede ingen gyldige historier. Prøv at hente nye.
      </StatusMessage>
    );
  }

  return (
    <>
      {/* Visual column labels on desktop. Each row carries its own text labels for screen readers. */}
      <div className={styles.header} aria-hidden="true">
        <span className={styles.headerScore}>
          Score <span className={styles.sortArrow}>{SCORE_ARROWS[sort]}</span>
        </span>
        <span />
        {/* Keeps the grid columns aligned; the story column needs no label. */}
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
