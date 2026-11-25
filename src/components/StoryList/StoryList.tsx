import type { Story } from "@/lib/hn/types";
import { StoryCard } from "@/components/StoryCard/StoryCard";
import styles from "./StoryList.module.scss";

type Props = { stories: Story[] };

/** Ordered list, since the stories are sorted by score. */
export function StoryList({ stories }: Props) {
  return (
    <ol className={styles.list}>
      {stories.map((story) => (
        <li key={story.id}>
          <StoryCard story={story} />
        </li>
      ))}
    </ol>
  );
}
