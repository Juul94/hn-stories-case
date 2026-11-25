import type { HNItem, HNUser } from "@/lib/hn/types";

/** Fixed "now" for tests: 2026-11-25 12:00:00 UTC. */
export const NOW_SECONDS = 1795608000;

export function makeItem(id: number, overrides: Partial<HNItem> = {}): HNItem {
  return {
    id,
    type: "story",
    by: `user${id}`,
    time: NOW_SECONDS - id * 60,
    title: `Story ${id}`,
    url: `https://www.example${id}.com/post`,
    score: id * 10,
    ...overrides,
  };
}

export function makeUser(id: string, overrides: Partial<HNUser> = {}): HNUser {
  return { id, karma: 1000, created: NOW_SECONDS - 86400 * 365, ...overrides };
}
