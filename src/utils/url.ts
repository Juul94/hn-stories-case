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
