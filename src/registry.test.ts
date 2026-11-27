import { afterEach, describe, expect, it } from "vitest";
import { cards, registerCards, type CardDefinition } from "./registry";

class Dummy extends HTMLElement {}

const definition: CardDefinition = {
  tag: "hoc-registry-dummy-card",
  ctor: Dummy,
  name: "Dummy",
  description: "Test card",
};

afterEach(() => {
  window.customCards = [];
});

describe("registerCards", () => {
  it("is idempotent", () => {
    registerCards([definition]);
    expect(() => registerCards([definition])).not.toThrow();
    expect(window.customCards?.filter((c) => c.type === "hoc-registry-dummy-card")).toHaveLength(1);
  });
  it("fills window.customCards with type, name and description", () => {
    registerCards([definition]);
    expect(window.customCards).toContainEqual({
      type: "hoc-registry-dummy-card",
      name: "Dummy",
      description: "Test card",
      preview: true,
    });
  });
  it("registers an editor element when given", () => {
    class Editor extends HTMLElement {}
    registerCards([
      {
        ...definition,
        tag: "hoc-registry-edit-card",
        ctor: class extends HTMLElement {},
        editorTag: "hoc-registry-edit-card-editor",
        editorCtor: Editor,
      },
    ]);
    expect(customElements.get("hoc-registry-edit-card-editor")).toBe(Editor);
  });
});

describe("cards", () => {
  it("contains the generic cards with a unique tag", () => {
    const tags = cards.map((card) => card.tag);
    expect(tags).toEqual(expect.arrayContaining(["hoc-device-card", "hoc-devices-card"]));
    for (const removed of [
      "hoc-github-card",
      "hoc-github-repos-card",
      "hoc-github-profile-card",
      "hoc-github-attention-card",
      "hoc-youtrack-project-card",
    ]) {
      expect(tags).not.toContain(removed);
    }
    expect(new Set(tags).size).toBe(tags.length);
  });

  it("offers a live preview in the card picker for every card", () => {
    registerCards(cards);
    for (const card of cards) {
      expect(window.customCards?.find((entry) => entry.type === card.tag)?.preview).toBe(true);
    }
  });
});
