import { describe, expect, it } from "vitest";
import { oppositeTheme, resolveTheme } from "@/lib/theme/theme";

describe("resolveTheme", () => {
  it("uses the stored choice over the system preference", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("follows the system when nothing is stored", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(undefined, false)).toBe("light");
  });

  it("ignores an invalid stored value", () => {
    expect(resolveTheme("purple", true)).toBe("dark");
    expect(resolveTheme("", false)).toBe("light");
  });
});

describe("oppositeTheme", () => {
  it("switches between light and dark", () => {
    expect(oppositeTheme("light")).toBe("dark");
    expect(oppositeTheme("dark")).toBe("light");
  });
});
