export type TrendDirection = "up" | "down" | "flat";

export interface Trend {
  direction: TrendDirection;
  percent: number | null;
}

const FLAT_BAND_PERCENT = 1;

export function trend(value: number | null): Trend {
  if (value === null || !Number.isFinite(value)) return { direction: "flat", percent: null };
  if (Math.abs(value) <= FLAT_BAND_PERCENT) return { direction: "flat", percent: value };
  return { direction: value > 0 ? "up" : "down", percent: value };
}

const MISSING_STATES = new Set(["unknown", "unavailable", ""]);

/** True when a state carries no usable value (no entity, `unknown`, `unavailable`). */
export function isMissing(state: string | undefined): boolean {
  return state === undefined || MISSING_STATES.has(state);
}

export function parseNumber(state: string | undefined): number | null {
  if (state === undefined || state.trim() === "") return null;
  const value = Number(state);
  return Number.isFinite(value) ? value : null;
}

export function formatCount(state: string | undefined): string {
  const value = parseNumber(state);
  if (value === null) return "—";
  if (Math.abs(value) < 1000) return String(value);
  return `${Number((value / 1000).toFixed(1))}k`;
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 86400],
  ["month", 30 * 86400],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

export function relativeTime(iso: string, now: Date, language: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const seconds = Math.round((then - now.getTime()) / 1000);
  const formatter = new Intl.RelativeTimeFormat(language, { numeric: "auto" });
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit);
  }
  return formatter.format(seconds, "second");
}

/** True for an absolute https URL; anything else (http, javascript:, relative) is rejected. */
export function isHttps(url: string | null | undefined): url is string {
  if (typeof url !== "string" || !url.startsWith("https://")) return false;
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}
