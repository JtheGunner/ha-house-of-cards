import { describe, expect, it } from "vitest";
import { fixtureHass } from "../../test/fixtures/hass";
import type { BaseConfig } from "./base-card";
import {
  choiceSelector,
  deviceSelector,
  fieldsSelectorFromOptions,
  HocBaseEditor,
  layoutSelector,
} from "./editor";

class TestEditor extends HocBaseEditor<{ type: string; device?: string; layout?: string }> {
  protected schema() {
    return [deviceSelector("github_pulse"), layoutSelector(undefined, ["compact", "standard"])];
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
    expect(layoutSelector(undefined, ["compact", "list"]).selector).toEqual({
      select: {
        mode: "dropdown",
        options: [
          { value: "compact", label: "compact" },
          { value: "list", label: "list" },
        ],
      },
    });
  });
});

describe("field list editing", () => {
  class FieldEditor extends HocBaseEditor<BaseConfig & { fields?: unknown[] }> {
    protected override fieldListNames = ["fields"];
    protected schema() {
      return [fieldsSelectorFromOptions(undefined, [{ value: "stars", label: "Stars" }])];
    }
  }
  customElements.define("hoc-field-test-editor", FieldEditor);

  async function mountEditor(config: Record<string, unknown>) {
    const editor = document.createElement("hoc-field-test-editor") as FieldEditor;
    editor.hass = fixtureHass();
    editor.setConfig({ type: "custom:x", ...config } as never);
    const received: Record<string, unknown>[] = [];
    editor.addEventListener("config-changed", (e) =>
      received.push((e as CustomEvent).detail.config),
    );
    document.body.append(editor);
    await editor.updateComplete;
    const form = editor.shadowRoot?.querySelector("ha-form") as unknown as {
      data: Record<string, unknown>;
      dispatchEvent: (e: Event) => boolean;
    };
    return { form, received };
  }

  it("offers name, icon and colour per field", () => {
    const schema = fieldsSelectorFromOptions(undefined, [{ value: "stars", label: "Stars" }]);
    const fields = (schema.selector as { object: { fields: Record<string, unknown> } }).object
      .fields;
    expect(Object.keys(fields)).toEqual(["key", "name", "icon", "color"]);
  });

  it("shows string entries as objects in the form", async () => {
    const { form } = await mountEditor({
      fields: ["stars", "latest_release:url", { key: "forks", name: "F" }],
    });
    expect(form.data.fields).toEqual([
      { key: "stars" },
      { key: "latest_release:url" },
      { key: "forks", name: "F" },
    ]);
  });

  it("drops the option when the last field is removed", async () => {
    const { form, received } = await mountEditor({ fields: ["stars"] });
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { fields: [] } } }));
    expect(received[0]).not.toHaveProperty("fields");
  });

  it("removes empty strings and rows without a key", async () => {
    const { form, received } = await mountEditor({});
    form.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: { fields: [{ key: "stars", name: "", icon: "mdi:star" }, { name: "x" }] },
        },
      }),
    );
    expect(received[0]?.fields).toEqual([{ key: "stars", icon: "mdi:star" }]);
  });
});

describe("editor labels", () => {
  it("labels options and field parts in the Home Assistant language, capitalised", async () => {
    const editor = document.createElement("hoc-test-editor") as TestEditor;
    editor.hass = fixtureHass({ language: "de" });
    editor.setConfig({ type: "custom:x" });
    document.body.append(editor);
    await editor.updateComplete;
    const form = editor.shadowRoot?.querySelector("ha-form") as unknown as {
      computeLabel: (item: { name: string }) => string;
    };
    expect(form.computeLabel({ name: "device" })).toBe("Gerät");
    const hass = fixtureHass({ language: "de" });
    const fields = (
      fieldsSelectorFromOptions(hass, []).selector as {
        object: { fields: Record<string, { label: string }> };
      }
    ).object.fields;
    expect(Object.values(fields).map((f) => f.label)).toEqual(["Sensor", "Name", "Icon", "Farbe"]);
  });
});

describe("release option label", () => {
  it("says the version is shown in the title", () => {
    expect(editorLabel(fixtureHass({ language: "de" }), "show_release")).toBe(
      "Release-Version im Titel anzeigen",
    );
    expect(editorLabel(fixtureHass(), "show_release")).toBe("Show release version in title");
  });
});

describe("choice labels", () => {
  it("translates layout and order values", () => {
    const de = fixtureHass({ language: "de" });
    const en = fixtureHass();
    const labels = (item: { selector: unknown }) =>
      (item.selector as { select: { options: { label: string }[] } }).select.options.map(
        (o) => o.label,
      );
    expect(labels(layoutSelector(de, ["compact", "standard", "list"]))).toEqual([
      "Kompakt",
      "Standard",
      "Liste",
    ]);
    expect(labels(layoutSelector(en, ["compact", "list"]))).toEqual(["Compact", "List"]);
    expect(labels(choiceSelector(de, "order", ["asc", "desc"], "sort_order"))).toEqual([
      "Aufsteigend",
      "Absteigend",
    ]);
  });
});
