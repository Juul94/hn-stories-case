import { shuffle } from "@/utils/shuffle";

/** Small deterministic PRNG (mulberry32) so the tests do not depend on Math.random. */
function seeded(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("shuffle", () => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it("returns the same elements in a new array", () => {
    const result = shuffle(input, seeded(1));
    expect(result).not.toBe(input);
    expect([...result].sort((a, b) => a - b)).toEqual(input);
  });

  it("does not mutate the input", () => {
    const copy = [...input];
    shuffle(input, seeded(2));
    expect(input).toEqual(copy);
  });

  it("is deterministic for the same random source", () => {
    expect(shuffle(input, seeded(42))).toEqual(shuffle(input, seeded(42)));
  });

  it("swaps each position with an index picked by random (Fisher-Yates)", () => {
    // random() = 0 always picks j = 0, so each step swaps index i with 0.
    expect(shuffle([1, 2, 3, 4], () => 0)).toEqual([2, 3, 4, 1]);
    // random() close to 1 picks j = i, so nothing moves.
    expect(shuffle([1, 2, 3, 4], () => 0.999)).toEqual([1, 2, 3, 4]);
  });

  it("handles empty and single-item arrays", () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle(["a"])).toEqual(["a"]);
  });

  it("gives every element a chance at every position", () => {
    const random = seeded(7);
    const seenFirst = new Set<number>();
    for (let i = 0; i < 200; i++) seenFirst.add(shuffle([1, 2, 3, 4], random)[0] as number);
    expect(seenFirst).toEqual(new Set([1, 2, 3, 4]));
  });
});
