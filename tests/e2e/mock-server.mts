// Stable stand-in for the HN API, used by the e2e tests via HN_API_BASE. Run with plain Node (type stripping).
import { createServer } from "node:http";

const PORT = Number(process.env.MOCK_PORT ?? 4010);
const NOW_SECONDS = Math.floor(Date.now() / 1000);

/** 30 valid stories plus items the app must skip, so a refresh almost always gives a new set. */
const STORY_IDS = Array.from({ length: 30 }, (_, index) => index + 1);
const DEAD_ID = 900;
const JOB_ID = 901;
const ASK_ID = 31; // No url: the app links to the HN thread instead.

function makeItem(id: number) {
  if (id === DEAD_ID) return { id, type: "story", dead: true };
  if (id === JOB_ID) return { id, type: "job", title: "Job", by: "acme", time: NOW_SECONDS };

  const isAsk = id === ASK_ID;
  const isKnownStory = id <= ASK_ID;
  if (!isKnownStory) return null;

  return {
    id,
    type: "story",
    by: `user${id}`,
    time: NOW_SECONDS - id * 600,
    title: isAsk ? "Ask HN: Mock story without a URL" : `Mock story ${id}`,
    ...(isAsk ? {} : { url: `https://example${id}.com/articles/${id}` }),
    score: (id * 37) % 500,
  };
}

function makeUser(id: string) {
  return { id, karma: id.length * 1234, created: NOW_SECONDS - 86400 * 365 };
}

function route(path: string): unknown {
  if (path === "/topstories.json") return [...STORY_IDS, ASK_ID, DEAD_ID, JOB_ID];

  const itemMatch = path.match(/^\/item\/(\d+)\.json$/);
  if (itemMatch) return makeItem(Number(itemMatch[1]));

  const userId = path.match(/^\/user\/([^/]+)\.json$/)?.[1];
  if (userId) return makeUser(decodeURIComponent(userId));

  return undefined;
}

createServer((req, res) => {
  const body = route(new URL(req.url ?? "/", "http://localhost").pathname);
  const isKnownRoute = body !== undefined;
  res.writeHead(isKnownRoute ? 200 : 404, { "Content-Type": "application/json" });
  res.end(isKnownRoute ? JSON.stringify(body) : "null");
}).listen(PORT, () => console.log(`HN mock API on http://127.0.0.1:${PORT}`));
