const HN_ITEM_URL = "https://news.ycombinator.com/item?id=";

/** Link to the story's thread on Hacker News. */
export function hnItemUrl(id: number): string {
  return `${HN_ITEM_URL}${id}`;
}

/** "https://www.example.com/a" → "example.com". Null for missing or invalid URLs. */
export function getDomain(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const { hostname, protocol } = new URL(url);
    const isWebUrl = protocol === "http:" || protocol === "https:";
    if (!isWebUrl) return null;

    return hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
