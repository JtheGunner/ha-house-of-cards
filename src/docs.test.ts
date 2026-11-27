import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cards } from "./registry";

const DOCS = join(__dirname, "..", "docs", "cards");
const files = existsSync(DOCS) ? readdirSync(DOCS).filter((f) => f.endsWith(".md")) : [];

describe("card documentation", () => {
  it("has one doc file per registered card", () => {
    for (const card of cards) {
      expect(files, `docs/cards/${card.tag}.md`).toContain(`${card.tag}.md`);
    }
  });

  it("references only registered card types", () => {
    const registered = new Set(cards.map((card) => card.tag));
    for (const file of files) {
      const text = readFileSync(join(DOCS, file), "utf8");
      for (const match of text.matchAll(/custom:(hoc-[a-z-]+)/g)) {
        expect(registered.has(match[1] ?? ""), `${file}: ${match[0]}`).toBe(true);
      }
    }
  });
});
