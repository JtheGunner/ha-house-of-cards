import { beforeAll, describe, expect, it } from "vitest";
import { fixtureHass, type FixtureEntity } from "../../../../test/fixtures/hass";
import { registerCards } from "../../../registry";
import { projectCardDefinition, YoutrackProjectCard } from "./card";

beforeAll(() => registerCards([projectCardDefinition]));

function sensor(translationKey: string, state?: string): FixtureEntity {
  return { platform: "youtrack", deviceId: "p1", translationKey, state };
}

const COUNTS = [
  sensor("issues_open", "14"),
  sensor("issues_overdue", "2"),
  sensor("issues_critical_open", "1"),
  sensor("issues_created_7d", "6"),
  sensor("issues_resolved_7d", "9"),
];
const CALM_FLAGS = [sensor("has_overdue", "off"), sensor("has_critical_open", "off")];

async function mount(entities: FixtureEntity[], device = "p1") {
  const hass = fixtureHass({ devices: [{ id: "p1", name: "HHOC" }], entities });
  const card = document.createElement("hoc-youtrack-project-card") as YoutrackProjectCard;
  card.setConfig({ type: "custom:hoc-youtrack-project-card", device } as never);
  card.hass = hass;
  document.body.append(card);
  await card.updateComplete;
  const root = card.shadowRoot as ShadowRoot;
  return { root, text: root.textContent?.replace(/\s+/g, " ") ?? "" };
}

describe("hoc-youtrack-project-card", () => {
  it("shows the project name and the counts", async () => {
    const { text } = await mount([...COUNTS, ...CALM_FLAGS]);
    expect(text).toContain("HHOC");
    for (const label of ["Open", "Overdue", "Critical", "Created (7 days)", "Resolved (7 days)"]) {
      expect(text).toContain(label);
    }
    expect(text).toContain("14");
  });

  it("shows an accent when has_overdue is on", async () => {
    const { root } = await mount([...COUNTS, sensor("has_overdue", "on")]);
    expect(root.querySelector(".alert")).not.toBeNull();
  });

  it("shows an accent when has_critical_open is on", async () => {
    const { root } = await mount([...COUNTS, sensor("has_critical_open", "on")]);
    expect(root.querySelector(".alert")).not.toBeNull();
  });

  it("shows no accent when the flags are off or missing", async () => {
    expect((await mount([...COUNTS, ...CALM_FLAGS])).root.querySelector(".alert")).toBeNull();
    expect((await mount(COUNTS)).root.querySelector(".alert")).toBeNull();
  });

  it("omits counts whose sensor is missing", async () => {
    const { text } = await mount(COUNTS.filter((e) => e.translationKey !== "issues_overdue"));
    expect(text).not.toContain("Overdue");
  });

  it("renders the error state when the device does not exist", async () => {
    const { text } = await mount(COUNTS, "deleted");
    expect(text).toContain("Device not found");
  });
});
