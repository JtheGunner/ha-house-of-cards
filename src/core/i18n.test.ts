import { describe, expect, it } from "vitest";
import { t } from "./i18n";

describe("t", () => {
  it("returns German for de", () => {
    expect(t({ locale: { language: "de" } }, "all_clear")).toBe("Alles in Ordnung");
  });
  it("falls back to English for an unknown language", () => {
    expect(t({ locale: { language: "fr" } }, "all_clear")).toBe("All clear");
  });
  it("uses the base language of a regional code", () => {
    expect(t({ locale: { language: "de-CH" } }, "all_clear")).toBe("Alles in Ordnung");
  });
});
