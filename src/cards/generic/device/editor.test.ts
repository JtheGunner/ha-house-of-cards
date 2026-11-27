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

  it("offers status rules and a template, labelled in the Home Assistant language", async () => {
    const { form } = await mountEditor("other");
    const names = form.schema.map((item) => item.name);
    expect(names).toEqual(expect.arrayContaining(["status", "status_template"]));
    expect(form.computeLabel({ name: "status" })).toBe("Status-Regeln");
    expect(form.schema.find((item) => item.name === "status_template")?.selector).toEqual({
      template: {},
    });
  });

  it("drops incomplete rules and an empty template", async () => {
    const { form, received } = await mountEditor("other");
    form.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: {
            status: [
              { field: "stars", operator: ">", value: "5", state: "failure", extra: "" },
              { value: "1" },
            ],
            status_template: "  ",
          },
        },
      }),
    );
    expect(received[0]?.["status"]).toEqual([
      { field: "stars", operator: ">", value: "5", state: "failure" },
    ]);
    expect(received[0]).not.toHaveProperty("status_template");
  });

  it("removes the status option when all rules are deleted", async () => {
    const { form, received } = await mountEditor("other", {
      status: [{ field: "stars", state: "failure" }],
    });
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { status: [] } } }));
    expect(received[0]).not.toHaveProperty("status");
  });
});
