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

  it("proposes the first device that has sensors for a new card", () => {
    const hass = fixtureHass({
      devices: [
        { id: "empty", name: "Empty" },
        { id: "d1", name: "Thing" },
      ],
      entities: ENTITIES,
    });
    expect(DeviceCard.getStubConfig(hass)).toEqual({ device: "d1" });
    expect(DeviceCard.getStubConfig(fixtureHass())).toEqual({});
  });
});

describe("hoc-device-card status", () => {
  const COUNTS = [
    sensor("any_integration", "overdue", "3"),
    sensor("any_integration", "open", "9"),
  ];

  it("shows no status for a device without a preset or rules", async () => {
    const { root } = await mount(COUNTS);
    expect(root.querySelector(".dot")).toBeNull();
    expect(root.querySelector("ha-card")?.getAttribute("style") ?? "").toBe("");
  });

  it("colours the accent and dot from the first matching rule", async () => {
    const { root } = await mount(COUNTS, {
      status: [
        { field: "overdue", operator: ">", value: 5, state: "failure" },
        { field: "overdue", operator: ">", value: 0, state: "pending" },
      ],
    });
    expect(root.querySelector("ha-card")?.getAttribute("style")).toContain("--warning-color");
    expect(root.querySelector(".dot")?.getAttribute("style")).toContain("--warning-color");
    expect(root.querySelector(".alert")).toBeNull();
  });

  it("marks the card as alert for a failure rule", async () => {
    const { root } = await mount(COUNTS, {
      status: [{ field: "overdue", operator: ">", value: 0, state: "failure" }],
    });
    expect(root.querySelector(".alert")).not.toBeNull();
  });

  it("shows a grey dot when rules are set but none matches", async () => {
    const { root } = await mount(COUNTS, {
      status: [{ field: "overdue", operator: ">", value: 99, state: "failure" }],
    });
    expect(root.querySelector(".dot--neutral")).not.toBeNull();
    expect(root.querySelector(".alert")).toBeNull();
  });

  it("accepts a custom colour as the state of a rule", async () => {
    const { root } = await mount(COUNTS, {
      status: [{ field: "open", operator: ">=", value: 9, state: "purple" }],
    });
    expect(root.querySelector("ha-card")?.getAttribute("style")).toContain("var(--purple-color)");
  });

  it("hides rule-based status when show_status is off", async () => {
    const { root } = await mount(COUNTS, {
      show_status: false,
      status: [{ field: "overdue", operator: ">", value: 0, state: "failure" }],
    });
    expect(root.querySelector(".dot")).toBeNull();
    expect(root.querySelector(".alert")).toBeNull();
  });
});

describe("hoc-device-card badge and link", () => {
  const RELEASE = sensor("any_integration", "release", "v1.4.0", {
    url: "https://x/r",
    name: "First",
  });
  const OPEN = sensor("any_integration", "open", "9", { unit_of_measurement: "issues" });

  it("shows no badge by default", async () => {
    const { root } = await mount([RELEASE]);
    expect(root.querySelector(".badge")).toBeNull();
  });

  it("shows any sensor as a badge on the far side of the title", async () => {
    const { root } = await mount([RELEASE, OPEN], { badge: "release" });
    expect(root.querySelector(".header .badge")?.textContent?.trim()).toBe("v1.4.0");
    const header = root.querySelector(".header");
    expect([...(header?.children ?? [])].map((c) => c.className.split(" ")[0])).toEqual([
      "title",
      "badge",
    ]);
    const unit = await mount([OPEN], { badge: "open" });
    expect(unit.root.querySelector(".badge")?.textContent?.trim()).toBe("9 issues");
  });

  it("shows an attribute as a badge", async () => {
    const { root } = await mount([RELEASE], { badge: "release:name" });
    expect(root.querySelector(".badge")?.textContent?.trim()).toBe("First");
  });

  it("stays grey without a colour and takes a colour from the config", async () => {
    const plain = await mount([RELEASE], { badge: "release" });
    expect(plain.root.querySelector(".badge")?.getAttribute("style") ?? "").toBe("");
    const named = await mount([RELEASE], { badge: { key: "release", color: "purple" } });
    expect(named.root.querySelector(".badge")?.getAttribute("style")).toContain(
      "var(--purple-color)",
    );
    const css = await mount([RELEASE], { badge: { key: "release", color: "#ff8800" } });
    expect(css.root.querySelector(".badge")?.getAttribute("style")).toContain("#ff8800");
  });

  it("omits the badge while its sensor has no value", async () => {
    const { root } = await mount([{ ...RELEASE, state: "unknown" }], { badge: "release" });
    expect(root.querySelector(".badge")).toBeNull();
  });

  it("links the title to a fixed https URL", async () => {
    const { root } = await mount([RELEASE], { link_url: "https://example.com/p" });
    expect(root.querySelector(".name a")?.getAttribute("href")).toBe("https://example.com/p");
  });

  it("links the title to a URL held in an attribute", async () => {
    const { root } = await mount([RELEASE], { link: "release:url" });
    expect(root.querySelector(".name a")?.getAttribute("href")).toBe("https://x/r");
  });

  it("lets link win over link_url and falls back to link_url without a target", async () => {
    const { root } = await mount([RELEASE], {
      link: "release:url",
      link_url: "https://example.com/p",
    });
    expect(root.querySelector(".name a")?.getAttribute("href")).toBe("https://x/r");
    const fallback = await mount([RELEASE], { link: "device", link_url: "https://example.com/p" });
    expect(fallback.root.querySelector(".name a")?.getAttribute("href")).toBe(
      "https://example.com/p",
    );
  });

  it("never links to anything but https", async () => {
    for (const bad of ["http://x", "javascript:alert(1)", "//x", "release:name", "release:gone"]) {
      const { root } = await mount([RELEASE], { link_url: bad, link: bad });
      expect(root.querySelector(".name a"), bad).toBeNull();
    }
  });

  it("shows no link without any link option", async () => {
    const { root } = await mount([RELEASE]);
    expect(root.querySelector(".name a")).toBeNull();
  });
});
