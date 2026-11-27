import { render } from "lit";
import { describe, expect, it } from "vitest";
import { dotTone, statusDot, trendArrow } from "./index";

function text(template: unknown): string {
  const container = document.createElement("div");
  render(template as never, container);
  return container.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

describe("dotTone", () => {
  it("maps CI states to tones", () => {
    expect(dotTone("success")).toBe("success");
    expect(dotTone("failure")).toBe("failure");
    expect(dotTone("error")).toBe("failure");
    expect(dotTone("pending")).toBe("pending");
  });
  it("is neutral for unknown, unavailable and undefined", () => {
    expect(dotTone("unavailable")).toBe("neutral");
    expect(dotTone("banana")).toBe("neutral");
    expect(dotTone(undefined)).toBe("neutral");
  });
  it("renders a dot element with the tone class", () => {
    const container = document.createElement("div");
    render(statusDot("failure"), container);
    expect(container.querySelector(".dot--failure")).not.toBeNull();
  });
});

describe("trendArrow", () => {
  it("shows no percent when percent is null", () => {
    expect(text(trendArrow({ direction: "up", percent: null }))).toBe("▲");
  });
  it("shows the rounded percent for a rise and a drop", () => {
    expect(text(trendArrow({ direction: "up", percent: 12.4 }))).toBe("▲ 12 %");
    expect(text(trendArrow({ direction: "down", percent: -8 }))).toBe("▼ 8 %");
  });
  it("shows a flat marker", () => {
    expect(text(trendArrow({ direction: "flat", percent: 0.5 }))).toBe("▬");
  });
});
