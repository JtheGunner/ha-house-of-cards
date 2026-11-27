import { describe, expect, it } from "vitest";
import { fixtureHass } from "../../test/fixtures/hass";
import { deviceSelector, HocBaseEditor, layoutSelector } from "./editor";

class TestEditor extends HocBaseEditor<{ type: string; device?: string; layout?: string }> {
  protected schema() {
    return [deviceSelector("github_pulse"), layoutSelector(["compact", "standard"])];
  }
}
customElements.define("hoc-test-editor", TestEditor);

describe("HocBaseEditor", () => {
  it("dispatches config-changed with the merged config", async () => {
    const editor = document.createElement("hoc-test-editor") as TestEditor;
    editor.hass = fixtureHass();
    editor.setConfig({ type: "custom:x", layout: "compact" });
    document.body.append(editor);
    await editor.updateComplete;

    const received: unknown[] = [];
    editor.addEventListener("config-changed", (event) =>
      received.push((event as CustomEvent).detail.config),
    );
    editor.shadowRoot?.querySelector("ha-form")?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { type: "custom:x", layout: "compact", device: "d1" } },
      }),
    );

    expect(received).toEqual([{ type: "custom:x", layout: "compact", device: "d1" }]);
  });

  it("passes the schema to ha-form", async () => {
    const editor = document.createElement("hoc-test-editor") as TestEditor;
    editor.hass = fixtureHass();
    editor.setConfig({ type: "custom:x" });
    document.body.append(editor);
    await editor.updateComplete;
    const form = editor.shadowRoot?.querySelector("ha-form") as unknown as { schema: unknown[] };
    expect(form.schema).toHaveLength(2);
  });
});

describe("selectors", () => {
  it("deviceSelector filters by integration", () => {
    expect(deviceSelector("github_pulse")).toEqual({
      name: "device",
      selector: { device: { integration: "github_pulse" } },
    });
  });
  it("layoutSelector offers the given options", () => {
    expect(layoutSelector(["compact", "detailed"]).selector).toEqual({
      select: { mode: "dropdown", options: ["compact", "detailed"] },
    });
  });
});
