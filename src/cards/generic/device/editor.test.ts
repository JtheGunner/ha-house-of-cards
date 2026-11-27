import { beforeAll, describe, expect, it } from "vitest";
import { fixtureHass } from "../../../../test/fixtures/hass";
import { registerCards } from "../../../registry";
import { deviceCardDefinition } from "./card";
import type { DeviceCardEditor } from "./editor";

beforeAll(() => registerCards([deviceCardDefinition]));

async function mountEditor(platform: string, config: Record<string, unknown> = {}) {
  const hass = fixtureHass({
    language: "de",
    devices: [{ id: "d1", name: "Thing" }],
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
  it("offers the release option only for integrations with a release badge", async () => {
    const github = await mountEditor("github_pulse");
    expect(github.form.schema.map((item) => item.name)).toContain("show_release");
    const other = await mountEditor("other");
    expect(other.form.schema.map((item) => item.name)).not.toContain("show_release");
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
