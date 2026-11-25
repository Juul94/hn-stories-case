import { formatAbsoluteTime, formatRelativeTime, toIsoString } from "@/utils/time";
import { NOW_SECONDS } from "../mocks/fixtures";

const NOW_MS = NOW_SECONDS * 1000;

describe("toIsoString", () => {
  it("converts unix seconds to ISO 8601", () => {
    expect(toIsoString(NOW_SECONDS)).toBe("2026-11-25T12:00:00.000Z");
  });
});

describe("formatAbsoluteTime", () => {
  it("formats in Danish time (UTC+1 in winter)", () => {
    expect(formatAbsoluteTime(NOW_SECONDS)).toBe("25. nov. 2026, 13:00");
  });

  it("uses summer time (UTC+2) in July", () => {
    // 2026-07-01 12:32:00 UTC
    expect(formatAbsoluteTime(1782909120)).toBe("1. jul. 2026, 14:32");
  });

  it("pads hours and minutes", () => {
    // 2026-11-24 23:05:00 UTC → 00:05 the next day in Copenhagen
    expect(formatAbsoluteTime(1795561500)).toBe("25. nov. 2026, 00:05");
  });
});

describe("formatRelativeTime", () => {
  it.each([
    [10, "nu"],
    [60, "for 1 minut siden"],
    [45 * 60, "for 45 minutter siden"],
    [3 * 3600, "for 3 timer siden"],
    [86400, "i går"],
    [3 * 86400, "for 3 dage siden"],
    [14 * 86400, "for 2 uger siden"],
    [60 * 86400, "for 2 måneder siden"],
    [400 * 86400, "sidste år"],
  ])("%i seconds ago → %s", (secondsAgo, expected) => {
    expect(formatRelativeTime(NOW_SECONDS - secondsAgo, NOW_MS)).toBe(expected);
  });
});
