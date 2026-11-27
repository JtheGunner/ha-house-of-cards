import { describe, expect, it } from "vitest";
import { fixtureHass, type FixtureEntity } from "../../test/fixtures/hass";
import {
  accentColor,
  buildFieldViews,
  discoverFieldOptions,
  parseField,
  type FieldSpec,
} from "./fields";
import { resolveDeviceEntities } from "./resolver";

function entity(
  translationKey: string,
  state: string,
  attributes: Record<string, unknown> = {},
): FixtureEntity {
  return { platform: "github_pulse", deviceId: "d1", translationKey, state, attributes };
}

function views(entities: FixtureEntity[], specs: (string | FieldSpec)[], language = "en") {
  const hass = fixtureHass({ devices: [{ id: "d1", name: "my-repo" }], entities, language });
  const resolved = resolveDeviceEntities(hass, "d1");
  return buildFieldViews(hass, resolved, specs.map(parseField), "my-repo");
}

describe("parseField", () => {
  it("parses a plain key, a key with attribute and an object", () => {
    expect(parseField("stars")).toEqual({ key: "stars" });
    expect(parseField("latest_release:url")).toEqual({ key: "latest_release", attribute: "url" });
    expect(parseField({ key: "stars", name: "Sterne" })).toEqual({ key: "stars", name: "Sterne" });
  });
});

describe("buildFieldViews", () => {
  it("uses the configured name, then the known label, then the Home Assistant name, then the key", () => {
    const [custom, known, ha, humanized] = views(
      [
        entity("stars", "5"),
        entity("forks", "2"),
        entity("custom_thing", "1", { friendly_name: "my-repo Custom thing" }),
        entity("other_thing", "1"),
      ],
      [{ key: "stars", name: "Sterne" }, "forks", "custom_thing", "other_thing"],
    );
    expect(custom?.label).toBe("Sterne");
    expect(known?.label).toBe("Forks");
    expect(ha?.label).toBe("Custom thing");
    expect(humanized?.label).toBe("Other thing");
  });

  it("translates known labels", () => {
    expect(views([entity("forks", "2")], ["forks"], "de")[0]?.label).toBe("Forks");
    expect(views([entity("stars", "2")], ["stars"], "de")[0]?.label).toBe("Sterne");
  });

  it("keeps the short known label but also exposes the Home Assistant name as entityLabel", () => {
    const [known, plain] = views(
      [
        entity("issues_open", "3", { friendly_name: "my-repo Offene Issues" }),
        entity("stars", "5"),
      ],
      ["issues_open", "stars"],
      "de",
    );
    expect(known?.label).toBe("Offen");
    expect(known?.entityLabel).toBe("Offene Issues");
    expect(plain?.label).toBe("Sterne");
    expect(plain?.entityLabel).toBe("Sterne");
  });

  it("appends the attribute to entityLabel and lets a configured name win over both", () => {
    const [attribute, named] = views(
      [
        entity("issues_open", "3", { friendly_name: "my-repo Offene Issues", url: "https://x" }),
        entity("stars", "5", { friendly_name: "my-repo Sterne (HA)" }),
      ],
      ["issues_open:url", { key: "stars", name: "Fans" }],
      "de",
    );
    expect(attribute?.entityLabel).toBe("Offene Issues › Url");
    expect(named?.label).toBe("Fans");
    expect(named?.entityLabel).toBe("Fans");
  });

  it("omits missing sensors, unusable states and missing attributes", () => {
    const result = views(
      [
        entity("stars", "unknown"),
        entity("forks", "3"),
        entity("latest_release", "v1", { url: "https://x" }),
      ],
      ["stars", "nope", "forks", "latest_release:name", "latest_release:url"],
    );
    expect(result.map((v) => v.id)).toEqual(["forks", "latest_release:url"]);
  });

  it("abbreviates large plain counts and keeps units", () => {
    const [count, withUnit] = views(
      [entity("stars", "1234"), entity("current_streak", "12", { unit_of_measurement: "d" })],
      ["stars", "current_streak"],
    );
    expect(count?.value).toBe("1.2k");
    expect(withUnit?.value).toBe("12");
    expect(withUnit?.unit).toBe("d");
  });

  it("formats attribute values", () => {
    const [text, num, bool, list] = views(
      [entity("x", "ok", { name: "v1", n: 1500, b: true, l: [1, 2, 3], o: { a: 1 } })],
      ["x:name", "x:n", "x:b", "x:l", "x:o"],
    );
    expect(text?.value).toBe("v1");
    expect(num?.value).toBe("1.5k");
    expect(bool?.value).toBe("✓");
    expect(list?.value).toBe("3");
  });

  it("derives a tone from states, flags and counts", () => {
    const result = views(
      [
        entity("ci_state", "failure"),
        entity("actions_last_result", "success"),
        entity("has_overdue", "on"),
        entity("issues_overdue", "2"),
        entity("issues_critical_open", "0"),
      ],
      ["ci_state", "actions_last_result", "has_overdue", "issues_overdue", "issues_critical_open"],
    );
    expect(result.map((v) => v.tone)).toEqual([
      "failure",
      "success",
      "failure",
      "failure",
      undefined,
    ]);
  });

  it("colours tones with the theme and fields with a stable palette colour", () => {
    const [ci, stars, again] = views(
      [entity("ci_state", "success"), entity("stars", "1")],
      ["ci_state", "stars", "stars"],
    );
    expect(ci?.color).toContain("--success-color");
    expect(stars?.color).toMatch(/^var\(--[a-z-]+-color\)$/);
    expect(again?.color).toBe(stars?.color);
  });

  it("lets a field override its colour with a palette name or a CSS colour", () => {
    const [named, raw] = views(
      [entity("stars", "1"), entity("forks", "1")],
      [
        { key: "stars", color: "purple" },
        { key: "forks", color: "#ff0000" },
      ],
    );
    expect(named?.color).toBe("var(--purple-color)");
    expect(raw?.color).toBe("#ff0000");
  });

  it("builds a trend from another sensor, flat without percent when it is not numeric", () => {
    const [up, flat] = views(
      [
        entity("commits_this_month", "41"),
        entity("commits_vs_last_month", "12.4"),
        entity("a", "1"),
        entity("b", "unknown"),
      ],
      [
        { key: "commits_this_month", trend: "commits_vs_last_month" },
        { key: "a", trend: "b" },
      ],
    );
    expect(up?.trend).toEqual({ direction: "up", percent: 12.4 });
    expect(flat?.trend).toEqual({ direction: "flat", percent: null });
  });

  it("passes the icon override through", () => {
    expect(views([entity("stars", "1")], [{ key: "stars", icon: "mdi:star" }])[0]?.icon).toBe(
      "mdi:star",
    );
  });
});

describe("accentColor", () => {
  it("prefers failure over pending over success and is undefined without tones", () => {
    const mixed = views(
      [entity("ci_state", "failure"), entity("actions_last_result", "success")],
      ["ci_state", "actions_last_result"],
    );
    expect(accentColor(mixed)).toContain("--error-color");
    expect(accentColor(views([entity("stars", "1")], ["stars"]))).toBeUndefined();
  });
});

describe("discoverFieldOptions", () => {
  it("lists sensors and their scalar attributes, without internal attributes or disabled sensors", () => {
    const hass = fixtureHass({
      devices: [{ id: "d1", name: "my-repo" }],
      entities: [
        entity("latest_release", "v1", {
          url: "https://x",
          friendly_name: "my-repo Release",
          unit_of_measurement: "x",
          items: [1],
        }),
        entity("stars", "5"),
        { platform: "github_pulse", deviceId: "d1", translationKey: "forks" },
      ],
    });
    const options = discoverFieldOptions(hass, "d1");
    expect(options.map((o) => o.value)).toEqual(["latest_release", "latest_release:url", "stars"]);
    expect(options[1]?.label).toBe("Release › Url");
  });

  it("labels options with the Home Assistant entity name, falling back to the known label", () => {
    const hass = fixtureHass({
      devices: [{ id: "d1", name: "my-repo" }],
      language: "de",
      entities: [
        entity("issues_open", "3", { friendly_name: "my-repo Offene Issues", url: "https://x" }),
        entity("stars", "5"),
      ],
    });
    const options = discoverFieldOptions(hass, "d1");
    expect(options.map((o) => [o.value, o.label])).toEqual([
      ["issues_open", "Offene Issues"],
      ["issues_open:url", "Offene Issues › Url"],
      ["stars", "Sterne"],
    ]);
  });
});
