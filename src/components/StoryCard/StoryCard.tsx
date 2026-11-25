import Image from "next/image";
import type { Story } from "@/lib/hn/types";
import { formatAbsoluteTime, formatRelativeTime, toIsoString } from "@/utils/time";
import styles from "./StoryCard.module.scss";

type Props = { story: Story };

export function StoryCard({ story }: Props) {
  const { title, url, domain, time, score, author } = story;
  const hasKarma = author.karma !== null;
  const karmaLabel = hasKarma ? `${author.karma?.toLocaleString("da-DK")} karma` : "karma ukendt";

  return (
    <article className={styles.card}>
      <Image
        className={styles.image}
        src="/placeholder.svg"
        alt=""
        width={48}
        height={48}
        unoptimized
      />

      <div className={styles.body}>
        <h2 className={styles.title}>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {title}
            <span className="visually-hidden"> (åbner i nyt vindue)</span>
          </a>
        </h2>

        <p className={styles.meta}>
          <span>{domain ?? "news.ycombinator.com"}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={toIsoString(time)}>
            {formatAbsoluteTime(time)} ({formatRelativeTime(time)})
          </time>
        </p>

        <p className={styles.meta}>
          af <span className={styles.author}>{author.id}</span> ({karmaLabel})
        </p>
      </div>

      <p className={styles.score}>
        <span className={styles.scoreValue}>{score}</span> point
      </p>
    </article>
  );
}
