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

describe("hoc-device-card status template", () => {
  const COUNTS = [sensor("any_integration", "overdue", "3")];

  function connection() {
    const state: {
      callback?: (message: { result: unknown }) => void;
      message?: Record<string, unknown>;
      unsubscribed: number;
      calls: number;
    } = { unsubscribed: 0, calls: 0 };
    return {
      state,
      connection: {
        subscribeMessage: <T>(callback: (message: T) => void, message: Record<string, unknown>) => {
          state.calls += 1;
          state.callback = callback as never;
          state.message = message;
          return Promise.resolve(() => {
            state.unsubscribed += 1;
          });
        },
      },
    };
  }

  async function mountWithTemplate(config: Record<string, unknown>) {
    const hass = fixtureHass({ devices: [{ id: "d1", name: "Thing" }], entities: COUNTS });
    const { state, connection: conn } = connection();
    hass.connection = conn;
    const card = document.createElement("hoc-device-card") as DeviceCard;
    card.setConfig({ type: "custom:hoc-device-card", device: "d1", ...config } as never);
    card.hass = hass;
    document.body.append(card);
    await card.updateComplete;
    return { card, state, root: card.shadowRoot as ShadowRoot };
  }

  it("subscribes to the template with the device id and applies its result", async () => {
    const { card, state, root } = await mountWithTemplate({
      status_template: "{{ 'failure' if true else 'success' }}",
    });
    expect(state.message).toMatchObject({
      type: "render_template",
      variables: { device_id: "d1" },
    });
    state.callback?.({ result: "failure\n" });
    await card.updateComplete;
    expect(root.querySelector(".alert")).not.toBeNull();
    expect(root.querySelector("ha-card")?.getAttribute("style")).toContain("--error-color");
  });

  it("wins over rules and shows a grey dot until the first result arrives", async () => {
    const { root } = await mountWithTemplate({
      status_template: "{{ 'success' }}",
      status: [{ field: "overdue", operator: ">", value: 0, state: "failure" }],
    });
    expect(root.querySelector(".dot--neutral")).not.toBeNull();
    expect(root.querySelector(".alert")).toBeNull();
  });

  it("subscribes once and unsubscribes when the card is removed", async () => {
    const { card, state } = await mountWithTemplate({ status_template: "{{ 'success' }}" });
    card.hass = { ...(card.hass as object) } as never;
    await card.updateComplete;
    expect(state.calls).toBe(1);
    card.remove();
    await Promise.resolve();
    expect(state.unsubscribed).toBe(1);
  });

  it("treats a failing subscription as no result", async () => {
    const hass = fixtureHass({ devices: [{ id: "d1", name: "Thing" }], entities: COUNTS });
    hass.connection = { subscribeMessage: () => Promise.reject(new Error("bad template")) };
    const card = document.createElement("hoc-device-card") as DeviceCard;
    card.setConfig({ type: "x", device: "d1", status_template: "{{" } as never);
    card.hass = hass;
    document.body.append(card);
    await card.updateComplete;
    await Promise.resolve();
    expect(card.shadowRoot?.querySelector(".dot--neutral")).not.toBeNull();
  });
});
