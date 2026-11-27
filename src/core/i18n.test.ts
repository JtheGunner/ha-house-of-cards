import { describe, expect, it } from "vitest";
import { EDITOR_OPTION_NAMES, editorLabel, t } from "./i18n";

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

describe("editorLabel", () => {
  const de = { locale: { language: "de-CH" } };
  const en = { locale: { language: "en" } };

  it("translates option names and starts with a capital letter", () => {
    expect(editorLabel(en, "show_status")).toBe("Show status");
    expect(editorLabel(de, "show_status")).toBe("Status anzeigen");
    expect(editorLabel(de, "fields")).toBe("Felder");
  });

  it("capitalises unknown names instead of showing them raw", () => {
    expect(editorLabel(en, "some_new_option")).toBe("Some new option");
  });

  it("starts every label of every language with a capital letter", () => {
    for (const hass of [en, de]) {
      for (const name of EDITOR_OPTION_NAMES) {
        const label = editorLabel(hass, name);
        expect(label.charAt(0)).toBe(label.charAt(0).toUpperCase());
        expect(label).not.toContain("_");
      }
    }
  });
});
