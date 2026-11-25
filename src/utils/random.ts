/** Mulberry32: a small seeded PRNG. The same seed always gives the same sequence in [0, 1). */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a hash of a string to an unsigned 32-bit number, used to turn a text seed into a PRNG seed. */
export function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** A seeded random function from a text seed. */
export function seededRandom(seed: string): () => number {
  return mulberry32(hashString(seed));
}

/** Short random id (6 base-36 characters), e.g. for a URL seed. */
export function createSeed(random: () => number = Math.random): string {
  return Math.floor(random() * 36 ** 6)
    .toString(36)
    .padStart(6, "0");
}

/** True for a seed made by createSeed or a similar short id. */
export function isValidSeed(value: unknown): value is string {
  if (typeof value !== "string") return false;

  return /^[a-z0-9]{1,16}$/i.test(value);
}
