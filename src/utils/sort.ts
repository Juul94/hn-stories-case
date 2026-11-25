/** Sorts by score, lowest first. Returns a new array; equal scores keep their order. */
export function sortByScoreAsc<T extends { score: number }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => a.score - b.score);
}
