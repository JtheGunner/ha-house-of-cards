import { describe, expect, it } from "vitest";
import { HocBaseCard } from "./base-card";
import { fixtureHass } from "../../test/fixtures/hass";

class TestCard extends HocBaseCard<{ type: string; device: string }> {
  static override requiredKeys = ["device"];
  protected renderContent() {
    return null;
  }
}
customElements.define("hoc-test-card", TestCard);

describe("HocBaseCard", () => {
  it("setConfig throws without a required key", () => {
    const card = document.createElement("hoc-test-card") as TestCard;
    expect(() => card.setConfig({ type: "custom:hoc-test-card" } as never)).toThrow(/device/);
  });
  it("setConfig accepts a complete config", () => {
    const card = document.createElement("hoc-test-card") as TestCard;
    expect(() => card.setConfig({ type: "custom:hoc-test-card", device: "d1" })).not.toThrow();
  });
  it("has a default card size and grid options", () => {
    const card = document.createElement("hoc-test-card") as TestCard;
    expect(card.getCardSize()).toBeGreaterThan(0);
    expect(card.getGridOptions().columns).toBeDefined();
  });
  it("stores hass", () => {
    const card = document.createElement("hoc-test-card") as TestCard;
    const hass = fixtureHass();
    card.hass = hass;
    expect(card.hass).toBe(hass);
  });
});
