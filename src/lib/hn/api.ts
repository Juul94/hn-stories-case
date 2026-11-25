import "server-only";
import type { HNItem, HNUser, Story } from "@/lib/hn/types";
import { shuffle } from "@/utils/shuffle";
import { sortByScoreAsc } from "@/utils/sort";
import { isValidStory, toStory, type ValidItem } from "@/utils/story";

export const HN_API_BASE = process.env.HN_API_BASE ?? "https://hacker-news.firebaseio.com/v0";

/** Seconds each response may be cached. The top list changes often; items and users rarely. */
const REVALIDATE = { topStories: 60, item: 300, user: 3600 } as const;

/** Extra items fetched per round, so dead or deleted ones can be replaced without a new round. */
const BUFFER = 5;

export const STORY_COUNT = 10;

export class HNApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "HNApiError";
  }
}

async function fetchJson<T>(path: string, revalidate: number): Promise<T> {
  const res = await fetch(`${HN_API_BASE}/${path}`, { next: { revalidate } });
  if (!res.ok) throw new HNApiError(`HN API ${path} failed`, res.status);
  return (await res.json()) as T;
}

export async function fetchTopStoryIds(): Promise<number[]> {
  const ids = await fetchJson<number[] | null>("topstories.json", REVALIDATE.topStories);
  return Array.isArray(ids) ? ids : [];
}

export function fetchItem(id: number): Promise<HNItem | null> {
  return fetchJson<HNItem | null>(`item/${id}.json`, REVALIDATE.item);
}

export function fetchUser(id: string): Promise<HNUser | null> {
  return fetchJson<HNUser | null>(`user/${encodeURIComponent(id)}.json`, REVALIDATE.user);
}

/** Value of a settled promise, or null if it was rejected. */
function valueOrNull<T>(result: PromiseSettledResult<T | null>): T | null {
  return result.status === "fulfilled" ? result.value : null;
}

/**
 * `count` random top stories with their authors, sorted by score (lowest first).
 * Items and users are fetched in parallel with Promise.allSettled, so one failed request never breaks the page:
 * - a failed, null, dead, deleted or non-story item is skipped and replaced from the shuffled list,
 * - a failed user gives karma null.
 * Throws HNApiError only when the top list cannot be fetched. Returns fewer stories only if the list runs out.
 */
export async function getRandomStories(
  count: number = STORY_COUNT,
  random: () => number = Math.random,
): Promise<Story[]> {
  const ids = shuffle(await fetchTopStoryIds(), random);

  const items: ValidItem[] = [];
  let offset = 0;
  while (items.length < count && offset < ids.length) {
    const batch = ids.slice(offset, offset + count - items.length + BUFFER);
    offset += batch.length;
    const results = await Promise.allSettled(batch.map((id) => fetchItem(id)));
    const valid = results.map(valueOrNull).filter(isValidStory);
    items.push(...valid.slice(0, count - items.length));
  }

  const authorIds = [...new Set(items.map((item) => item.by))];
  const results = await Promise.allSettled(authorIds.map((id) => fetchUser(id)));
  const users = results.map(valueOrNull).filter((user) => user !== null);
  const usersById = new Map(users.map((user) => [user.id, user]));

  return sortByScoreAsc(items.map((item) => toStory(item, usersById.get(item.by) ?? null)));
}
