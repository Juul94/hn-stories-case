import { createSeed, hashString, isValidSeed, mulberry32, seededRandom } from "@/utils/random";
import { shuffle } from "@/utils/shuffle";

const take = (random: () => number, n: number) => Array.from({ length: n }, () => random());

describe("mulberry32", () => {
  it("gives the same sequence for the same seed", () => {
    expect(take(mulberry32(42), 5)).toEqual(take(mulberry32(42), 5));
  });

  it("gives a different sequence for another seed", () => {
    expect(take(mulberry32(42), 5)).not.toEqual(take(mulberry32(43), 5));
  });

  it("returns numbers in [0, 1)", () => {
    for (const value of take(mulberry32(7), 1000)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe("seededRandom", () => {
  it("shuffles the same way for the same text seed", () => {
    const ids = Array.from({ length: 50 }, (_, i) => i);
    expect(shuffle(ids, seededRandom("abc123"))).toEqual(shuffle(ids, seededRandom("abc123")));
    expect(shuffle(ids, seededRandom("abc123"))).not.toEqual(shuffle(ids, seededRandom("xyz789")));
  });

  it("hashes strings to stable unsigned 32-bit numbers", () => {
    expect(hashString("abc")).toBe(hashString("abc"));
    expect(hashString("abc")).toBeGreaterThanOrEqual(0);
    expect(hashString("abc")).toBeLessThan(2 ** 32);
  });
});

describe("createSeed / isValidSeed", () => {
  it("creates a 6-character base-36 seed", () => {
    expect(createSeed(() => 0)).toBe("000000");
    expect(createSeed()).toMatch(/^[a-z0-9]{6}$/);
  });

  it("accepts short alphanumeric seeds only", () => {
    expect(isValidSeed("abc123")).toBe(true);
    expect(isValidSeed("")).toBe(false);
    expect(isValidSeed("a b")).toBe(false);
    expect(isValidSeed("x".repeat(17))).toBe(false);
    expect(isValidSeed(["abc"])).toBe(false);
  });
});
