const LOCALE = "da-DK";
const TIME_ZONE = "Europe/Copenhagen";

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

const relativeFormat = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto" });

const dateFormat = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: TIME_ZONE,
});

const clockFormat = new Intl.DateTimeFormat(LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: TIME_ZONE,
});

/** Unix seconds → ISO 8601, for `<time dateTime>`. */
export function toIsoString(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toISOString();
}

/** Unix seconds → "25. nov. 2026, 14:32" in Danish time. */
export function formatAbsoluteTime(unixSeconds: number): string {
  const date = new Date(unixSeconds * 1000);
  const parts = clockFormat.formatToParts(date);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${dateFormat.format(date)}, ${hour}:${minute}`;
}

/** Unix seconds → "for 3 timer siden". `nowMs` is injectable for tests. */
export function formatRelativeTime(unixSeconds: number, nowMs: number = Date.now()): string {
  const diffSeconds = Math.round(unixSeconds - nowMs / 1000);
  const abs = Math.abs(diffSeconds);
  for (const [unit, size] of UNITS) {
    if (abs >= size) return relativeFormat.format(Math.trunc(diffSeconds / size), unit);
  }
  return relativeFormat.format(0, "second");
}
