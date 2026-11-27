import { describe, expect, it } from "vitest";
import { formatCount, relativeTime, trend } from "./format";

describe("trend", () => {
  it("is flat at exactly 1 and -1", () => {
    expect(trend(1).direction).toBe("flat");
    expect(trend(-1).direction).toBe("flat");
  });
  it("is up at 1.1 and keeps the percent", () => {
    expect(trend(1.1)).toEqual({ direction: "up", percent: 1.1 });
  });
  it("is down below -1", () => {
    expect(trend(-12).direction).toBe("down");
  });
  it("has no percent for null, NaN and Infinity", () => {
    for (const value of [null, NaN, Infinity]) {
      expect(trend(value)).toEqual({ direction: "flat", percent: null });
    }
  });
});

describe("formatCount", () => {
  it("returns an em dash for non-numeric states", () => {
    expect(formatCount("unavailable")).toBe("—");
    expect(formatCount(undefined)).toBe("—");
  });
  it("keeps small numbers and abbreviates thousands", () => {
    expect(formatCount("999")).toBe("999");
    expect(formatCount("1234")).toBe("1.2k");
    expect(formatCount("1000")).toBe("1k");
  });
});

describe("relativeTime", () => {
  const now = new Date("2026-11-27T12:00:00Z");
  it("formats days in English and German", () => {
    expect(relativeTime("2026-11-24T12:00:00Z", now, "en")).toBe("3 days ago");
    expect(relativeTime("2026-11-24T12:00:00Z", now, "de")).toBe("vor 3 Tagen");
  });
  it("returns an em dash for an invalid date", () => {
    expect(relativeTime("garbage", now, "en")).toBe("—");
  });
});
