import { getDomain } from "@/utils/url";

describe("getDomain", () => {
  it.each([
    ["https://www.example.com/a/b?c=1", "example.com"],
    ["http://blog.example.co.uk", "blog.example.co.uk"],
    ["https://github.com/vercel/next.js", "github.com"],
  ])("%s → %s", (url, expected) => {
    expect(getDomain(url)).toBe(expected);
  });

  it.each([undefined, "", "not a url", "javascript:alert(1)", "ftp://example.com"])(
    "returns null for %s",
    (url) => {
      expect(getDomain(url)).toBeNull();
    },
  );
});
