import type { HNItem, HNUser, Story } from "@/lib/hn/types";
import { getDomain } from "@/utils/url";

const HN_ITEM_URL = "https://news.ycombinator.com/item?id=";
const HN_USER_URL = "https://news.ycombinator.com/user?id=";

/** Link to the story's thread on Hacker News. */
export function hnItemUrl(id: number): string {
  return `${HN_ITEM_URL}${id}`;
}

/** Link to a user's profile on Hacker News. */
export function hnUserUrl(id: string): string {
  return `${HN_USER_URL}${encodeURIComponent(id)}`;
}

export type ValidItem = HNItem & {
  type: "story";
  by: string;
  time: number;
  title: string;
  score: number;
};

/** A story we can show: exists, not deleted or dead, and has the fields the card needs. */
export function isValidStory(item: HNItem | null | undefined): item is ValidItem {
  if (!item) return false;

  const isStory = item.type === "story";
  const isAlive = !item.deleted && !item.dead;
  const hasTitle = typeof item.title === "string" && item.title.trim() !== "";
  const hasAuthor = typeof item.by === "string";
  const hasTimestamp = typeof item.time === "number";
  const hasScore = typeof item.score === "number";

  return isStory && isAlive && hasTitle && hasAuthor && hasTimestamp && hasScore;
}

/** Maps a valid item and its (possibly missing) author to a Story. */
export function toStory(item: ValidItem, user: HNUser | null): Story {
  const externalUrl = item.url;
  const domain = getDomain(externalUrl);
  const hasSafeUrl = domain !== null && externalUrl !== undefined;

  return {
    id: item.id,
    title: item.title,
    url: hasSafeUrl ? externalUrl : hnItemUrl(item.id),
    domain,
    time: item.time,
    score: item.score,
    author: { id: item.by, karma: user?.karma ?? null },
  };
}
