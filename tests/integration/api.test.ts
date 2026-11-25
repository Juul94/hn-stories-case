import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { getRandomStories, HN_API_BASE, HNApiError } from "@/lib/hn/api";
import { hnHandlers, type MockData } from "../mocks/handlers";
import { makeItem, makeUser } from "../mocks/fixtures";

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

/** 30 valid stories, each with its own author. */
function mockData(count = 30): MockData {
  const ids = Array.from({ length: count }, (_, i) => i + 1);
  return {
    ids,
    items: Object.fromEntries(ids.map((id) => [id, makeItem(id)])),
    users: Object.fromEntries(ids.map((id) => [`user${id}`, makeUser(`user${id}`)])),
  };
}

/** Keeps the list in its original order, so the tests know which ids are picked. */
const noShuffle = () => 0.999;

describe("getRandomStories", () => {
  it("returns 10 stories sorted by score, lowest first", async () => {
    server.use(...hnHandlers(mockData()));
    const stories = await getRandomStories(10, Math.random);
    expect(stories).toHaveLength(10);
    const scores = stories.map((s) => s.score);
    expect(scores).toEqual([...scores].sort((a, b) => a - b));
  });

  it("adds the author's karma", async () => {
    const data = mockData();
    data.users.user1 = makeUser("user1", { karma: 777 });
    server.use(...hnHandlers(data));
    const stories = await getRandomStories(10, noShuffle);
    expect(stories.find((s) => s.id === 1)?.author).toEqual({ id: "user1", karma: 777 });
  });

  it("replaces dead, deleted, null and non-story items so there are still 10", async () => {
    const data = mockData();
    data.items[1] = makeItem(1, { dead: true });
    data.items[2] = makeItem(2, { deleted: true });
    data.items[3] = null;
    data.items[4] = makeItem(4, { type: "job" });
    server.use(...hnHandlers(data));

    const stories = await getRandomStories(10, noShuffle);
    const ids = stories.map((s) => s.id);
    expect(ids).toHaveLength(10);
    expect(ids).not.toContain(1);
    expect(ids).not.toContain(2);
    expect(ids).not.toContain(3);
    expect(ids).not.toContain(4);
  });

  it("keeps fetching until it has 10 when many items are invalid", async () => {
    const data = mockData(40);
    for (let id = 1; id <= 20; id++) data.items[id] = makeItem(id, { dead: true });
    server.use(...hnHandlers(data));
    const stories = await getRandomStories(10, noShuffle);
    expect(stories).toHaveLength(10);
    expect(stories.every((s) => s.id > 20)).toBe(true);
  });

  it("treats a failing item request like a missing item", async () => {
    const data = mockData();
    server.use(
      http.get(`${HN_API_BASE}/item/1.json`, () => new HttpResponse(null, { status: 500 })),
      ...hnHandlers(data),
    );
    const stories = await getRandomStories(10, noShuffle);
    expect(stories).toHaveLength(10);
    expect(stories.map((s) => s.id)).not.toContain(1);
  });

  it("shows the story with unknown karma when the user request fails", async () => {
    server.use(
      http.get(`${HN_API_BASE}/user/user1.json`, () => new HttpResponse(null, { status: 500 })),
      ...hnHandlers(mockData()),
    );
    const stories = await getRandomStories(10, noShuffle);
    expect(stories.find((s) => s.id === 1)?.author.karma).toBeNull();
  });

  it("fetches each author only once", async () => {
    const data = mockData();
    for (const id of data.ids) data.items[id] = makeItem(id, { by: "same" });
    data.users.same = makeUser("same");
    let userRequests = 0;
    server.use(
      http.get(`${HN_API_BASE}/user/:id`, () => {
        userRequests++;
        return HttpResponse.json(makeUser("same"));
      }),
      ...hnHandlers(data),
    );
    await getRandomStories(10, noShuffle);
    expect(userRequests).toBe(1);
  });

  it("links Ask HN posts without URL to the HN thread", async () => {
    const data = mockData();
    data.items[1] = makeItem(1, { url: undefined, title: "Ask HN: Something?" });
    server.use(...hnHandlers(data));
    const stories = await getRandomStories(10, noShuffle);
    const ask = stories.find((s) => s.id === 1);
    expect(ask?.url).toBe("https://news.ycombinator.com/item?id=1");
    expect(ask?.domain).toBeNull();
  });

  it("returns fewer stories when the list runs out", async () => {
    server.use(...hnHandlers(mockData(3)));
    expect(await getRandomStories(10)).toHaveLength(3);
  });

  it("returns an empty list when there are no top stories", async () => {
    server.use(...hnHandlers({ ids: [], items: {}, users: {} }));
    expect(await getRandomStories(10)).toEqual([]);
  });

  it("throws HNApiError when the top list fails", async () => {
    server.use(
      http.get(`${HN_API_BASE}/topstories.json`, () => new HttpResponse(null, { status: 503 })),
    );
    await expect(getRandomStories(10)).rejects.toBeInstanceOf(HNApiError);
  });

  it("throws when the network is down", async () => {
    server.use(http.get(`${HN_API_BASE}/topstories.json`, () => HttpResponse.error()));
    await expect(getRandomStories(10)).rejects.toThrow();
  });
});
