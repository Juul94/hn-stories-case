/** Sorts by score, lowest first. Returns a new array; equal scores keep their order. */
export function sortByScoreAsc<T extends { score: number }>(items: readonly T[]): T[] {
  return [...items].sort(byScoreAsc);
}

/** Comparators for Array.prototype.sort. Equal values keep their order (sort is stable). */
export const byScoreAsc = (a: { score: number }, b: { score: number }) => a.score - b.score;

export const byScoreDesc = (a: { score: number }, b: { score: number }) => b.score - a.score;

/** Newest first; `time` is a Unix timestamp. */
export const byNewest = (a: { time: number }, b: { time: number }) => b.time - a.time;

/** Highest karma first; unknown (null) karma goes last. */
export function byKarmaDesc(a: { karma: number | null }, b: { karma: number | null }): number {
  const hasA = a.karma !== null;
  const hasB = b.karma !== null;
  if (!hasA || !hasB) return Number(hasB) - Number(hasA);

  return (b.karma as number) - (a.karma as number);
}
