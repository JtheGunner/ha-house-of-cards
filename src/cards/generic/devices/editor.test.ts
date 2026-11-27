import { beforeAll, describe, expect, it } from "vitest";
import { fixtureHass } from "../../../../test/fixtures/hass";
import { registerCards } from "../../../registry";
import { devicesCardDefinition } from "./card";
import type { DevicesEditor } from "./editor";

beforeAll(() => registerCards([devicesCardDefinition]));

interface SchemaEntry {
  name: string;
  selector: Record<string, unknown>;
  schema?: SchemaEntry[];
}

/** The schema without its rows, so a test finds an option wherever it is placed. */
const flat = (form: { schema: SchemaEntry[] }): SchemaEntry[] =>
  form.schema.flatMap((item) => item.schema ?? [item]);

describe("hoc-devices-card-editor", () => {
  it("never stores the same repository twice", async () => {
    const editor = document.createElement("hoc-devices-card-editor") as DevicesEditor;
    editor.hass = fixtureHass();
    editor.setConfig({ type: "custom:hoc-devices-card", devices: ["a"] });
    const received: Record<string, unknown>[] = [];
    editor.addEventListener("config-changed", (e: Event) =>
      received.push((e as CustomEvent).detail.config),
    );
    document.body.append(editor);
    await editor.updateComplete;
    const form = editor.shadowRoot?.querySelector("ha-form") as HTMLElement;
    form.dispatchEvent(
      new CustomEvent("value-changed", { detail: { value: { devices: ["a", "b", "a"] } } }),
    );
    expect(received[0]?.devices).toEqual(["a", "b"]);
  });

  async function mountPlain(config: Record<string, unknown>, deviceName = "alpha") {
    const editor = document.createElement("hoc-devices-card-editor") as DevicesEditor;
    editor.hass = fixtureHass({
      devices: [{ id: "a", name: deviceName, configuration_url: "https://github.com/o/a" }],
      entities: [
        { platform: "github_pulse", deviceId: "a", translationKey: "stars", state: "1" },
        { platform: "youtrack", deviceId: "a", translationKey: "issues_open", state: "2" },
      ],
    });
    editor.setConfig({ type: "custom:hoc-devices-card", ...config });
    const received: Record<string, unknown>[] = [];
    editor.addEventListener("config-changed", (e: Event) =>
      received.push((e as CustomEvent).detail.config),
    );
    document.body.append(editor);
    await editor.updateComplete;
    const form = editor.shadowRoot?.querySelector("ha-form") as unknown as {
      schema: SchemaEntry[];
      computeLabel: (item: { name: string; selector: Record<string, unknown> }) => string;
    } & HTMLElement;
    return { form, received };
  }

  it("offers the integrations that own devices, plus a choice for none", async () => {
    const { form } = await mountPlain({});
    const select = flat(form).find((item) => item.name === "platform")?.selector as {
      select: { options: { value: string; label: string }[] };
    };
    expect(select.select.options.map((o) => o.value)).toEqual(["none", "github_pulse", "youtrack"]);
    expect(select.select.options[1]?.label).toBe("GitHub Pulse");
  });

  it("places related options side by side", async () => {
    const { form } = await mountPlain({ platform: "github_pulse" }, "owner/alpha");
    const rows = form.schema
      .filter((item) => item.schema)
      .map((item) => item.schema?.map((entry) => entry.name));
    expect(rows).toEqual([
      ["name", "device_title"],
      ["sort_by", "sort_order"],
      ["link", "shorten_names"],
      ["tap_action", "hold_action"],
    ]);
  });

  it("builds rows as plain grids without a selector", async () => {
    const { form } = await mountPlain({ platform: "github_pulse" });
    const grid = form.schema.find((item) => item.schema) as unknown as Record<string, unknown>;
    expect(grid["type"]).toBe("grid");
    expect(grid).not.toHaveProperty("selector");
  });

  it("keeps an option alone when its partner is not offered", async () => {
    const { form } = await mountPlain({ platform: "github_pulse" });
    const rows = form.schema.filter((item) => item.schema).length;
    expect(rows).toBe(3);
    expect(flat(form).map((item) => item.name)).toContain("link");
  });

  it("offers a title and a title for the name column", async () => {
    const { form } = await mountPlain({ platform: "github_pulse" });
    const names = flat(form).map((item) => item.name);
    expect(names).toContain("name");
    expect(names).toContain("device_title");
    expect(names.indexOf("device_title")).toBe(names.indexOf("name") + 1);
    const labelOf = (name: string) => form.computeLabel({ name, selector: {} });
    expect(labelOf("name")).toBe("Title");
  });

  it("offers shorten_names only when a listed name contains a slash", async () => {
    const plain = await mountPlain({ platform: "github_pulse" });
    expect(flat(plain.form).map((item) => item.name)).not.toContain("shorten_names");
    const slashed = await mountPlain({ platform: "github_pulse" }, "owner/alpha");
    expect(flat(slashed.form).map((item) => item.name)).toContain("shorten_names");
  });

  it("stores no platform when none is chosen", async () => {
    const { form, received } = await mountPlain({ platform: "youtrack" });
    form.dispatchEvent(
      new CustomEvent("value-changed", { detail: { value: { platform: "none" } } }),
    );
    expect(received[0]).not.toHaveProperty("platform");
  });

  it("shows the status rules only while the status dot is on", async () => {
    const off = await mountPlain({ platform: "github_pulse" });
    expect(flat(off.form).map((item) => item.name)).not.toContain("status");
    const on = await mountPlain({ platform: "github_pulse", show_status: true });
    expect(flat(on.form).map((item) => item.name)).toContain("status");
  });

  it("limits the device picker to the chosen integration", async () => {
    const { form } = await mountPlain({ platform: "youtrack" });
    const devices = flat(form).find((item) => item.name === "devices")?.selector as {
      device: { integration?: string; multiple: boolean };
    };
    expect(devices.device).toEqual({ multiple: true, integration: "youtrack" });
  });

  it("offers the device page as a link source", async () => {
    const { form } = await mountPlain({ platform: "github_pulse" });
    const link = flat(form).find((item) => item.name === "link")?.selector as {
      select: { options: { value: string }[] };
    };
    expect(link.select.options.map((o) => o.value)).toEqual(["none", "device"]);
  });

  describe("actions", () => {
    const optionsOf = (form: { schema: SchemaEntry[] }, name: string): string[] =>
      (
        flat(form).find((item) => item.name === name)?.selector as {
          select: { options: { value: string }[] };
        }
      ).select.options.map((o) => o.value);

    const dataOf = (form: HTMLElement): Record<string, unknown> =>
      (form as unknown as { data: Record<string, unknown> }).data;

    it("offers none and more-info for both gestures", async () => {
      const { form } = await mountPlain({ platform: "github_pulse" });
      expect(optionsOf(form, "tap_action")).toEqual(["none", "more-info"]);
      expect(optionsOf(form, "hold_action")).toEqual(["none", "more-info"]);
      expect(form.computeLabel({ name: "tap_action", selector: {} })).toBe("Tap action");
      expect(form.computeLabel({ name: "hold_action", selector: {} })).toBe("Hold action");
    });

    it("shows an action object as its kind and none when unset", async () => {
      const { form } = await mountPlain({
        platform: "github_pulse",
        tap_action: { action: "more-info", entity: "stars" },
      });
      expect(dataOf(form)["tap_action"]).toBe("more-info");
      expect(dataOf(form)["hold_action"]).toBe("none");
    });

    it("keeps the entity of an unchanged action and stores a new kind as an object", async () => {
      const { form, received } = await mountPlain({
        platform: "github_pulse",
        tap_action: { action: "more-info", entity: "stars" },
      });
      form.dispatchEvent(
        new CustomEvent("value-changed", {
          detail: { value: { tap_action: "more-info", hold_action: "more-info" } },
        }),
      );
      expect(received[0]?.["tap_action"]).toEqual({ action: "more-info", entity: "stars" });
      expect(received[0]?.["hold_action"]).toEqual({ action: "more-info" });
    });

    it("removes an action that is set to none", async () => {
      const { form, received } = await mountPlain({
        platform: "github_pulse",
        tap_action: { action: "more-info" },
      });
      form.dispatchEvent(
        new CustomEvent("value-changed", { detail: { value: { tap_action: "none" } } }),
      );
      expect(received[0]).not.toHaveProperty("tap_action");
    });

    it("leaves a YAML fire-dom-event action untouched by other edits", async () => {
      const hold = {
        action: "fire-dom-event",
        browser_mod: { service: "browser_mod.popup", data: { title: "{{ device_name }}" } },
      };
      const { form, received } = await mountPlain({ platform: "github_pulse", hold_action: hold });
      expect(optionsOf(form, "hold_action")).toEqual(["none", "more-info", "fire-dom-event"]);
      form.dispatchEvent(
        new CustomEvent("value-changed", {
          detail: { value: { hold_action: "fire-dom-event", max_height: 300 } },
        }),
      );
      expect(received[0]?.["hold_action"]).toEqual(hold);
      expect(received[0]?.["max_height"]).toBe(300);
    });
  });
});
