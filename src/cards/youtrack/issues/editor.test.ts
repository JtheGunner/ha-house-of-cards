import { beforeAll, describe, expect, it } from "vitest";
import { fixtureHass } from "../../../../test/fixtures/hass";
import { registerCards } from "../../../registry";
import { issuesCardDefinition } from "./card";

beforeAll(() => registerCards([issuesCardDefinition]));

async function mountEditor(config: Record<string, unknown> = {}) {
  const hass = fixtureHass({
    language: "de",
    entities: [
      {
        platform: "youtrack",
        deviceId: "p1",
        translationKey: "mine",
        state: "3",
        attributes: { issues: [], query: "project: HHOC", friendly_name: "Mine" },
      },
      { platform: "youtrack", deviceId: "p1", translationKey: "issues_open", state: "9" },
    ],
  });
  const editor = document.createElement("hoc-youtrack-issues-card-editor") as HTMLElement & {
    hass: unknown;
    setConfig: (config: unknown) => void;
    updateComplete: Promise<unknown>;
  };
  editor.hass = hass;
  editor.setConfig({ type: "custom:hoc-youtrack-issues-card", ...config });
  document.body.append(editor);
  await editor.updateComplete;
  const form = editor.shadowRoot?.querySelector("ha-form") as unknown as {
    schema: { name: string; selector: Record<string, unknown> }[];
  } & HTMLElement;
  const received: Record<string, unknown>[] = [];
  editor.addEventListener("config-changed", (event: Event) =>
    received.push((event as CustomEvent).detail.config),
  );
  return { form, received, entityId: Object.keys(hass.entities)[0] };
}

describe("hoc-youtrack-issues-card editor", () => {
  it("offers only sensors that carry a list of issues", async () => {
    const { form, entityId } = await mountEditor();
    const entity = form.schema.find((item) => item.name === "entity")?.selector as {
      entity: { include_entities: string[] };
    };
    expect(entity.entity.include_entities).toEqual([entityId]);
  });

  it("offers the title, a badge, the item count and the expand switch", async () => {
    const { form } = await mountEditor();
    expect(form.schema.map((item) => item.name)).toEqual([
      "entity",
      "show_title",
      "name",
      "badge",
      "max_items",
      "expandable",
    ]);
  });

  it("hides the name field while the title is hidden", async () => {
    const { form } = await mountEditor({ show_title: false });
    const names = form.schema.map((item) => item.name);
    expect(names).toContain("show_title");
    expect(names).not.toContain("name");
  });

  it("offers the number of matches and text attributes of the sensor as badge", async () => {
    const { entityId } = await mountEditor();
    const withEntity = await mountEditor({ entity: entityId });
    const badge = withEntity.form.schema.find((item) => item.name === "badge")?.selector as {
      object: {
        fields: { key: { selector: { select: { options: { value: string; label: string }[] } } } };
      };
    };
    const options = badge.object.fields.key.selector.select.options;
    expect(options.map((o) => o.value)).toEqual(["count", "query"]);
    expect(options[0]?.label).toBe("Anzahl Treffer");
  });

  it("drops an empty badge", async () => {
    const { form, received } = await mountEditor();
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { badge: {} } } }));
    expect(received[0]).not.toHaveProperty("badge");
    form.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { badge: { key: "count", color: "" } } },
      }),
    );
    expect(received[1]?.["badge"]).toEqual({ key: "count" });
  });
});
