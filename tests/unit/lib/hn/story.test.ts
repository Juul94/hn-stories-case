import { hnItemUrl, isValidStory, toStory, type ValidItem } from "@/lib/hn/story";
import { makeItem, makeUser } from "../../../mocks/fixtures";

describe("hnItemUrl", () => {
  it("links to the HN thread", () => {
    expect(hnItemUrl(123)).toBe("https://news.ycombinator.com/item?id=123");
  });
});

describe("isValidStory", () => {
  it("accepts a normal story", () => {
    expect(isValidStory(makeItem(1))).toBe(true);
  });

  it("accepts a story without URL (Ask HN)", () => {
    expect(isValidStory(makeItem(1, { url: undefined }))).toBe(true);
  });

  it.each([
    ["null", null],
    ["undefined", undefined],
    ["deleted", makeItem(1, { deleted: true })],
    ["dead", makeItem(1, { dead: true })],
    ["a job", makeItem(1, { type: "job" })],
    ["a comment", makeItem(1, { type: "comment" })],
    ["missing title", makeItem(1, { title: undefined })],
    ["blank title", makeItem(1, { title: "  " })],
    ["missing author", makeItem(1, { by: undefined })],
    ["missing score", makeItem(1, { score: undefined })],
    ["missing time", makeItem(1, { time: undefined })],
  ])("rejects %s", (_, item) => {
    expect(isValidStory(item)).toBe(false);
  });
});

describe("toStory", () => {
  const item = makeItem(7) as ValidItem;

  it("maps fields and author karma", () => {
    expect(toStory(item, makeUser("user7", { karma: 4321 }))).toEqual({
      id: 7,
      title: "Story 7",
      url: "https://www.example7.com/post",
      domain: "example7.com",
      time: item.time,
      score: 70,
      author: { id: "user7", karma: 4321 },
    });
  });

  it("links to the HN thread and has no domain when the URL is missing", () => {
    const story = toStory({ ...item, url: undefined }, null);
    expect(story.url).toBe("https://news.ycombinator.com/item?id=7");
    expect(story.domain).toBeNull();
  });

  it("falls back to the HN thread for an unsafe URL", () => {
    const story = toStory({ ...item, url: "javascript:alert(1)" }, null);
    expect(story.url).toBe("https://news.ycombinator.com/item?id=7");
  });

  it("sets karma to null when the user is missing", () => {
    expect(toStory(item, null).author).toEqual({ id: "user7", karma: null });
  });
});
