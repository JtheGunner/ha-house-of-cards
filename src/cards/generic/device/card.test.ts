import { beforeAll, describe, expect, it } from "vitest";
import { fixtureHass, type FixtureEntity } from "../../../../test/fixtures/hass";
import { registerCards } from "../../../registry";
import { DeviceCard, deviceCardDefinition } from "./card";

beforeAll(() => registerCards([deviceCardDefinition]));

function sensor(
  platform: string,
  translationKey: string,
  state: string,
  attributes: Record<string, unknown> = {},
): FixtureEntity {
  return { platform, deviceId: "d1", translationKey, state, attributes };
}

async function mount(entities: FixtureEntity[], config: Record<string, unknown> = {}) {
  const hass = fixtureHass({ devices: [{ id: "d1", name: "Thing" }], entities });
  const card = document.createElement("hoc-device-card") as DeviceCard;
  card.setConfig({ type: "custom:hoc-device-card", device: "d1", ...config } as never);
  card.hass = hass;
  document.body.append(card);
  await card.updateComplete;
  const root = card.shadowRoot as ShadowRoot;
  return { root, text: root.textContent?.replace(/\s+/g, " ") ?? "" };
}

const ENTITIES = [
  sensor("any_integration", "temperature", "21.5", {
    unit_of_measurement: "°C",
    friendly_name: "Thing Temperature",
  }),
  sensor("other_integration", "battery", "80", { unit_of_measurement: "%" }),
  sensor("any_integration", "release", "v1", { url: "https://x/y", name: "First" }),
];

describe("hoc-device-card", () => {
  it("shows the sensors of any integration by default", async () => {
    const { text } = await mount(ENTITIES);
    expect(text).toContain("Temperature");
    expect(text).toContain("21.5");
    expect(text).toContain("°C");
    expect(text).toContain("Battery");
  });

  it("shows only the chosen sensors and attributes", async () => {
    const { text } = await mount(ENTITIES, { fields: ["battery", "release:name"] });
    expect(text).toContain("Battery");
    expect(text).toContain("First");
    expect(text).not.toContain("Temperature");
    expect(text).not.toContain("https://x/y");
  });

  it("gives every field a coloured icon chip", async () => {
    const { root } = await mount(ENTITIES, { fields: ["battery", "temperature"] });
    const chips = [...root.querySelectorAll(".field")].map((el) => el.getAttribute("style"));
    expect(chips).toHaveLength(2);
    for (const style of chips) expect(style).toMatch(/--c: var\(--[a-z-]+-color\)/);
  });

  it("applies a name, icon and colour override from an object field", async () => {
    const { root, text } = await mount(ENTITIES, {
      fields: [{ key: "battery", name: "Akku", icon: "mdi:battery", color: "teal" }],
    });
    expect(text).toContain("Akku");
    expect(root.querySelector("ha-icon")?.getAttribute("icon")).toBe("mdi:battery");
    expect(root.querySelector(".field")?.getAttribute("style")).toContain("var(--teal-color)");
  });

  it("supports the list and compact layouts", async () => {
    expect(
      (await mount(ENTITIES, { layout: "list" })).root.querySelector(".field--row"),
    ).not.toBeNull();
    expect(
      (await mount(ENTITIES, { layout: "compact" })).root.querySelector(".field--inline"),
    ).not.toBeNull();
  });

  it("rejects malformed fields in the config", () => {
    const card = document.createElement("hoc-device-card") as DeviceCard;
    expect(() => card.setConfig({ type: "x", device: "d1", fields: "battery" } as never)).toThrow(
      /fields/,
    );
    expect(() => card.setConfig({ type: "x", device: "d1", fields: [5] } as never)).toThrow(
      /fields/,
    );
  });

  it("shows the error state for a deleted device", async () => {
    const { text } = await mount(ENTITIES, { device: "gone" });
    expect(text).toContain("Device not found");
  });
});
