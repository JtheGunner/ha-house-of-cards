import { beforeAll, describe, expect, it } from "vitest";
import { fixtureHass } from "../../../../test/fixtures/hass";
import { registerCards } from "../../../registry";
import { devicesCardDefinition } from "./card";
import type { DevicesEditor } from "./editor";

beforeAll(() => registerCards([devicesCardDefinition]));

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
      schema: { name: string; selector: Record<string, unknown> }[];
      computeLabel: (item: { name: string; selector: Record<string, unknown> }) => string;
    } & HTMLElement;
    return { form, received };
  }

  it("offers the integrations that own devices, plus a choice for none", async () => {
    const { form } = await mountPlain({});
    const select = form.schema.find((item) => item.name === "platform")?.selector as {
      select: { options: { value: string; label: string }[] };
    };
    expect(select.select.options.map((o) => o.value)).toEqual(["none", "github_pulse", "youtrack"]);
    expect(select.select.options[1]?.label).toBe("GitHub Pulse");
  });

  it("offers a title and a title for the name column", async () => {
    const { form } = await mountPlain({ platform: "github_pulse" });
    const names = form.schema.map((item) => item.name);
    expect(names).toContain("name");
    expect(names).toContain("device_title");
    expect(names.indexOf("device_title")).toBe(names.indexOf("name") + 1);
    const labelOf = (name: string) => form.computeLabel({ name, selector: {} });
    expect(labelOf("name")).toBe("Title");
  });

  it("offers shorten_names only when a listed name contains a slash", async () => {
    const plain = await mountPlain({ platform: "github_pulse" });
    expect(plain.form.schema.map((item) => item.name)).not.toContain("shorten_names");
    const slashed = await mountPlain({ platform: "github_pulse" }, "owner/alpha");
    expect(slashed.form.schema.map((item) => item.name)).toContain("shorten_names");
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
    expect(off.form.schema.map((item) => item.name)).not.toContain("status");
    const on = await mountPlain({ platform: "github_pulse", show_status: true });
    expect(on.form.schema.map((item) => item.name)).toContain("status");
  });

  it("limits the device picker to the chosen integration", async () => {
    const { form } = await mountPlain({ platform: "youtrack" });
    const devices = form.schema.find((item) => item.name === "devices")?.selector as {
      device: { integration?: string; multiple: boolean };
    };
    expect(devices.device).toEqual({ multiple: true, integration: "youtrack" });
  });

  it("offers the device page as a link source", async () => {
    const { form } = await mountPlain({ platform: "github_pulse" });
    const link = form.schema.find((item) => item.name === "link")?.selector as {
      select: { options: { value: string }[] };
    };
    expect(link.select.options.map((o) => o.value)).toEqual(["none", "device"]);
  });
});
