import { describe, expect, it } from "vitest";
import { fixtureHass } from "../../test/fixtures/hass";
import { findAccountDevice, listDevices, resolveDeviceEntities } from "./resolver";

const hass = fixtureHass({
  devices: [
    { id: "d-zeta", name: "zeta" },
    { id: "d-alpha", name: "alpha" },
    { id: "d-account", name: "GitHub octocat" },
    { id: "d-other", name: "Other" },
  ],
  entities: [
    { platform: "github_pulse", deviceId: "d-alpha", translationKey: "stars", state: "12" },
    { platform: "github_pulse", deviceId: "d-alpha", translationKey: "forks" },
    {
      platform: "github_pulse",
      deviceId: "d-alpha",
      translationKey: "ci_state",
      state: "unavailable",
    },
    { platform: "github_pulse", deviceId: "d-zeta", translationKey: "stars", state: "3" },
    {
      platform: "github_pulse",
      deviceId: "d-account",
      translationKey: "contributions_this_month",
      state: "40",
    },
    { platform: "youtrack", deviceId: "d-other", translationKey: "issues_open", state: "5" },
    { platform: "youtrack", deviceId: "d-alpha", translationKey: "stars", state: "99" },
  ],
});

describe("resolveDeviceEntities", () => {
  it("resolves entities by translation_key for one device", () => {
    const result = resolveDeviceEntities(hass, "d-alpha", "github_pulse");
    expect(result["stars"]?.state).toBe("12");
  });

  it("ignores entities of other devices and platforms", () => {
    const result = resolveDeviceEntities(hass, "d-alpha", "github_pulse");
    expect(result["stars"]?.state).not.toBe("99");
    expect(result["issues_open"]).toBeUndefined();
  });

  it("omits entities without a state (disabled)", () => {
    const result = resolveDeviceEntities(hass, "d-alpha", "github_pulse");
    expect(result["forks"]).toBeUndefined();
  });

  it("returns an unavailable state unchanged", () => {
    const result = resolveDeviceEntities(hass, "d-alpha", "github_pulse");
    expect(result["ci_state"]?.state).toBe("unavailable");
  });

  it("returns an empty record for an unknown device", () => {
    expect(resolveDeviceEntities(hass, "nope", "github_pulse")).toEqual({});
  });
});

describe("listDevices", () => {
  it("returns only devices of the platform, sorted by name", () => {
    expect(listDevices(hass, "github_pulse").map((d) => d.name)).toEqual([
      "alpha",
      "GitHub octocat",
      "zeta",
    ]);
  });
});

describe("findAccountDevice", () => {
  it("finds the device that owns the account marker sensor", () => {
    expect(findAccountDevice(hass, "github_pulse")).toBe("d-account");
  });

  it("returns undefined when no device has the marker", () => {
    expect(findAccountDevice(hass, "youtrack")).toBeUndefined();
  });
});
