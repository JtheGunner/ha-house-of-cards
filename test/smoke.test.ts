import { describe, expect, it } from "vitest";
import { registerCards } from "../src/index";

describe("bundle entry", () => {
  it("exports registerCards", () => {
    expect(typeof registerCards).toBe("function");
  });
});
