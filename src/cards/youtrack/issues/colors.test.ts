import { describe, expect, it } from "vitest";
import { priorityColor, stateColor } from "./colors";

describe("stateColor", () => {
  it("colours resolved, blocked, in-progress and open states", () => {
    expect(stateColor("Done")).toContain("--success-color");
    expect(stateColor("Erledigt")).toContain("--success-color");
    expect(stateColor("Blocked")).toContain("--error-color");
    expect(stateColor("In Progress")).toContain("--warning-color");
    expect(stateColor("Open")).toBe("var(--blue-color)");
    expect(stateColor("To Do")).toBe("var(--blue-color)");
  });

  it("gives an unknown state a stable palette colour", () => {
    expect(stateColor("Waiting for design")).toMatch(/^var\(--[a-z]+-color\)$/);
    expect(stateColor("Waiting for design")).toBe(stateColor("Waiting for design"));
  });

  it("lets overrides win, ignoring case and accepting CSS colours", () => {
    expect(stateColor("done", { Done: "purple" })).toBe("var(--purple-color)");
    expect(stateColor("Open", { open: "#ff8800" })).toBe("#ff8800");
  });
});

describe("priorityColor", () => {
  it("maps critical to red, major to amber and minor to grey", () => {
    expect(priorityColor("Show-stopper")).toContain("--error-color");
    expect(priorityColor("Critical")).toContain("--error-color");
    expect(priorityColor("Major")).toContain("--warning-color");
    expect(priorityColor("Minor")).toContain("--disabled-text-color");
  });

  it("keeps normal priorities quiet and honours overrides", () => {
    expect(priorityColor("Normal")).toBe("var(--divider-color)");
    expect(priorityColor("Normal", { normal: "teal" })).toBe("var(--teal-color)");
  });
});
