import { afterEach, describe, expect, it } from "vitest";
import { registerCards, type CardDefinition } from "./registry";

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
      preview: false,
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
