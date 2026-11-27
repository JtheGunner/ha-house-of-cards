import { beforeAll, describe, expect, it } from "vitest";
import { fixtureHass } from "../../../../test/fixtures/hass";
import { registerCards } from "../../../registry";
import { deviceCardDefinition } from "./card";
import type { DeviceCardEditor } from "./editor";

beforeAll(() => registerCards([deviceCardDefinition]));

async function mountEditor(platform: string, config: Record<string, unknown> = {}, url?: string) {
  const hass = fixtureHass({
    language: "de",
    devices: [{ id: "d1", name: "Thing", configuration_url: url }],
    entities: [{ platform, deviceId: "d1", translationKey: "stars", state: "1" }],
  });
  const editor = document.createElement("hoc-device-card-editor") as DeviceCardEditor;
  editor.hass = hass;
  editor.setConfig({ type: "custom:hoc-device-card", device: "d1", ...config } as never);
  document.body.append(editor);
  await editor.updateComplete;
  const form = editor.shadowRoot?.querySelector("ha-form") as unknown as {
    schema: { name: string; selector: Record<string, unknown> }[];
    computeLabel: (item: { name: string }) => string;
  } & HTMLElement;
  const received: Record<string, unknown>[] = [];
  editor.addEventListener("config-changed", (event) =>
    received.push((event as CustomEvent).detail.config),
  );
  return { form, received };
}

describe("hoc-device-card editor", () => {
  it("offers a badge, a link source and a link URL instead of the release switch", async () => {
    const { form } = await mountEditor("github_pulse");
    const names = form.schema.map((item) => item.name);
    expect(names).toEqual(expect.arrayContaining(["badge", "link", "link_url"]));
    expect(names).not.toContain("show_release");
  });

  it("offers the device page as a link source only when the device has one", async () => {
    const withUrl = await mountEditor("github_pulse", {}, "https://github.com/o/r");
    const options = (form: typeof withUrl.form) =>
      (
        form.schema.find((item) => item.name === "link")?.selector as {
          select: { options: { value: string }[] };
        }
      ).select.options.map((o) => o.value);
    expect(options(withUrl.form)).toEqual(["none", "device"]);
    const without = await mountEditor("github_pulse");
    expect(options(without.form)).toEqual(["none"]);
  });

  it("offers attributes that hold an https URL as link sources", async () => {
    const hass = fixtureHass({
      devices: [{ id: "d1", name: "Thing" }],
      entities: [
        {
          platform: "github_pulse",
          deviceId: "d1",
          translationKey: "latest_release",
          state: "v1",
          attributes: { url: "https://x/r", tag: "v1" },
        },
      ],
    });
    const editor = document.createElement("hoc-device-card-editor") as DeviceCardEditor;
    editor.hass = hass;
    editor.setConfig({ type: "x", device: "d1" } as never);
    document.body.append(editor);
    await editor.updateComplete;
    const form = editor.shadowRoot?.querySelector("ha-form") as unknown as {
      schema: { name: string; selector: { select: { options: { value: string }[] } } }[];
    };
    const values = form.schema
      .find((item) => item.name === "link")
      ?.selector.select.options.map((o) => o.value);
    expect(values).toEqual(["none", "latest_release:url"]);
  });

  it("stores no link when the source is none and cleans the badge", async () => {
    const { form, received } = await mountEditor("other");
    form.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { link: "none", badge: { key: "stars", color: "" } } },
      }),
    );
    expect(received[0]).not.toHaveProperty("link");
    expect(received[0]?.["badge"]).toEqual({ key: "stars" });
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { badge: {} } } }));
    expect(received[1]).not.toHaveProperty("badge");
  });

  it("offers status rules, labelled in the Home Assistant language", async () => {
    const { form } = await mountEditor("other");
    expect(form.schema.map((item) => item.name)).toContain("status");
    expect(form.computeLabel({ name: "status" })).toBe("Status-Regeln");
  });

  it("offers the rule states with translated labels and no free text", async () => {
    const { form } = await mountEditor("other");
    const rules = form.schema.find((item) => item.name === "status")?.selector as {
      object: { fields: { state: { selector: { select: Record<string, unknown> } } } };
    };
    const select = rules.object.fields.state.selector.select;
    expect(select["custom_value"]).toBeUndefined();
    expect((select["options"] as { label: string }[]).map((o) => o.label)).toEqual([
      "In Ordnung",
      "Warnung",
      "Fehler",
      "Kein Status",
    ]);
  });

  it("hides the status rules while the status is switched off", async () => {
    const { form } = await mountEditor("other", { show_status: false });
    expect(form.schema.map((item) => item.name)).not.toContain("status");
    expect(form.schema.map((item) => item.name)).toContain("show_status");
  });

  it("drops incomplete rules", async () => {
    const { form, received } = await mountEditor("other");
    form.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: {
            status: [
              { field: "stars", operator: ">", value: "5", state: "failure", extra: "" },
              { value: "1" },
            ],
          },
        },
      }),
    );
    expect(received[0]?.["status"]).toEqual([
      { field: "stars", operator: ">", value: "5", state: "failure" },
    ]);
  });

  it("removes the status option when all rules are deleted", async () => {
    const { form, received } = await mountEditor("other", {
      status: [{ field: "stars", state: "failure" }],
    });
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { status: [] } } }));
    expect(received[0]).not.toHaveProperty("status");
  });
});
