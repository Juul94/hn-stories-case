import type { Story } from "@/lib/hn/types";
import { byKarmaDesc, byNewest, byScoreAsc, byScoreDesc } from "@/utils/sort";

/** Sort options for the story list. The first one is the default and the task's requirement. */
export const SORT_OPTIONS = [
  { value: "score-asc", label: "Score, laveste først" },
  { value: "score-desc", label: "Score, højeste først" },
  { value: "newest", label: "Nyeste først" },
  { value: "karma", label: "Forfatterens karma" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export const DEFAULT_SORT: SortOption = "score-asc";

const COMPARATORS: Record<SortOption, (a: Story, b: Story) => number> = {
  "score-asc": byScoreAsc,
  "score-desc": byScoreDesc,
  newest: byNewest,
  karma: (a, b) => byKarmaDesc(a.author, b.author),
};

/** A known sort option from a URL value, or the default. */
export function parseSort(value: unknown): SortOption {
  const option = SORT_OPTIONS.find((o) => o.value === value);
  return option?.value ?? DEFAULT_SORT;
}

export function sortStories(stories: readonly Story[], sort: SortOption): Story[] {
  return [...stories].sort(COMPARATORS[sort]);
}

export function sortLabel(sort: SortOption): string {
  return SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "";
}
