import type { HNItem, HNUser, Story } from "@/lib/hn/types";
import { getDomain, hnItemUrl } from "@/utils/url";

export type ValidItem = HNItem & {
  type: "story";
  by: string;
  time: number;
  title: string;
  score: number;
};

/** A story we can show: exists, not deleted or dead, and has the fields the card needs. */
export function isValidStory(item: HNItem | null | undefined): item is ValidItem {
  return (
    !!item &&
    item.type === "story" &&
    !item.deleted &&
    !item.dead &&
    typeof item.title === "string" &&
    item.title.trim() !== "" &&
    typeof item.by === "string" &&
    typeof item.time === "number" &&
    typeof item.score === "number"
  );
}

/** Maps a valid item and its (possibly missing) author to a Story. */
export function toStory(item: ValidItem, user: HNUser | null): Story {
  const domain = getDomain(item.url);
  return {
    id: item.id,
    title: item.title,
    url: domain && item.url ? item.url : hnItemUrl(item.id),
    domain,
    time: item.time,
    score: item.score,
    author: { id: item.by, karma: user?.karma ?? null },
  };
}
