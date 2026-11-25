import Image from "next/image";
import { hnUserUrl } from "@/lib/hn/story";
import type { Story } from "@/lib/hn/types";
import { formatAbsoluteTime, formatRelativeTime, toIsoString } from "@/utils/time";
import styles from "./StoryRow.module.scss";

type Props = { story: Story };

/**
 * One story as a table-like row. The same markup is laid out with grid areas per breakpoint.
 * The title link is stretched over the whole row, so the row is clickable without wrapping it in <a>.
 */
export function StoryRow({ story }: Props) {
  const { title, url, time, score, author } = story;
  const hasKarma = author.karma !== null;
  const karmaLabel = hasKarma ? `${author.karma?.toLocaleString("da-DK")} karma` : "karma ukendt";

  return (
    <article className={styles.row}>
      <div className={styles.story}>
        <Image
          className={styles.image}
          src="/placeholder.svg"
          alt=""
          width={40}
          height={40}
          unoptimized
        />
        <div className={styles.text}>
          <h3 className={styles.title}>
            <a className={styles.titleLink} href={url} target="_blank" rel="noopener noreferrer">
              {title}
              <span className="visually-hidden"> (åbner i nyt vindue)</span>
            </a>
          </h3>
          <span className={styles.url} title={url}>
            {url}
          </span>
        </div>
      </div>

      <p className={styles.meta}>
        <span className={styles.score}>
          <span className={styles.scoreValue}>{score}</span>
          <span className={styles.scoreUnit}> point</span>
        </span>{" "}
        <span className={styles.author}>
          <span className={styles.authorPrefix}>af </span>
          <a
            className={styles.authorLink}
            href={hnUserUrl(author.id)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {author.id}
            <span className="visually-hidden"> (profil, åbner i nyt vindue)</span>
          </a>{" "}
          <span className={styles.karma}>({karmaLabel})</span>
        </span>{" "}
        <time className={styles.time} dateTime={toIsoString(time)}>
          <span className={styles.nowrap}>{formatAbsoluteTime(time)}</span>{" "}
          <span className={styles.nowrap}>({formatRelativeTime(time)})</span>
        </time>
      </p>
    </article>
  );
}
