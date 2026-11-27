import { beforeAll, describe, expect, it } from "vitest";
import { registerCards } from "../../../registry";
import { fixtureHass, type FixtureEntity } from "../../../../test/fixtures/hass";
import { GithubRepoCard, repoCardDefinition } from "./card";

beforeAll(() => registerCards([repoCardDefinition]));

const P = "github_pulse";
function sensor(translationKey: string, state?: string): FixtureEntity {
  return { platform: P, deviceId: "d1", translationKey, state };
}

const ALWAYS_ON = [
  sensor("stars", "1234"),
  sensor("forks", "3"),
  sensor("open_issues", "2"),
  sensor("open_pull_requests", "1"),
  sensor("commits_this_month", "41"),
  sensor("commits_vs_last_month", "12.4"),
  sensor("latest_release", "v1.4.0"),
  sensor("ci_state", "success"),
];
const OPTIONAL = [
  sensor("unique_visitors_14d", "88"),
  sensor("views_14d", "210"),
  sensor("actions_last_result", "success"),
  sensor("actions_runs_today", "4"),
  sensor("total_downloads", "540"),
  sensor("days_since_last_commit", "2"),
];

async function mount(
  entities: FixtureEntity[],
  config: Record<string, unknown> = {},
  deviceId = "d1",
) {
  const hass = fixtureHass({ devices: [{ id: "d1", name: "ha-github-pulse" }], entities });
  const card = document.createElement("hoc-github-repo-card") as GithubRepoCard;
  card.setConfig({ type: "custom:hoc-github-repo-card", device: deviceId, ...config } as never);
  card.hass = hass;
  document.body.append(card);
  await card.updateComplete;
  const root = card.shadowRoot as ShadowRoot;
  return { root, text: root.textContent?.replace(/\s+/g, " ") ?? "" };
}

describe("hoc-github-repo-card", () => {
  it("compact shows name, ci dot, stars and release only", async () => {
    const { root, text } = await mount(ALWAYS_ON, { layout: "compact" });
    expect(text).toContain("ha-github-pulse");
    expect(text).toContain("1.2k");
    expect(text).toContain("v1.4.0");
    expect(root.querySelector(".dot--success")).not.toBeNull();
    expect(text).not.toContain("Forks");
  });

  it("standard adds forks, issues, pull requests and commits with a trend", async () => {
    const { text } = await mount(ALWAYS_ON);
    for (const label of ["Forks", "Issues", "Pull requests", "Commits this month"]) {
      expect(text).toContain(label);
    }
    expect(text).toContain("▲ 12 %");
    expect(text).not.toContain("Visitors");
  });

  it("detailed adds traffic, workflow and downloads when the sensors exist", async () => {
    const { text } = await mount([...ALWAYS_ON, ...OPTIONAL], { layout: "detailed" });
    for (const label of [
      "Visitors",
      "Views",
      "Workflow",
      "Runs today",
      "Downloads",
      "Days since commit",
    ]) {
      expect(text).toContain(label);
    }
  });

  it("omits fields whose sensor is missing", async () => {
    const { text } = await mount(
      ALWAYS_ON.filter((e) => e.translationKey !== "forks"),
      { layout: "detailed" },
    );
    expect(text).not.toContain("Forks");
    expect(text).not.toContain("Visitors");
  });

  it("shows a neutral dot for a ci_state outside the enum", async () => {
    const entities = ALWAYS_ON.map((e) =>
      e.translationKey === "ci_state" ? { ...e, state: "banana" } : e,
    );
    const { root } = await mount(entities);
    expect(root.querySelector(".dot--neutral")).not.toBeNull();
  });

  it("renders the error state when the device does not exist", async () => {
    const { root, text } = await mount(ALWAYS_ON, {}, "deleted");
    expect(text).toContain("Device not found");
    expect(root.querySelector(".message--error")).not.toBeNull();
  });

  it("shows an arrow without percent or NaN when the change is not numeric", async () => {
    const entities = ALWAYS_ON.map((e) =>
      e.translationKey === "commits_vs_last_month" ? { ...e, state: "unknown" } : e,
    );
    const { text } = await mount(entities);
    expect(text).toContain("▬");
    expect(text).not.toMatch(/NaN|Infinity/);
  });

  it("requires a device in the config", () => {
    const card = document.createElement("hoc-github-repo-card") as GithubRepoCard;
    expect(() => card.setConfig({ type: "custom:hoc-github-repo-card" } as never)).toThrow(
      /device/,
    );
  });

  it("hides the release badge and workflow tile for unknown or unavailable values", async () => {
    const entities = [
      ...ALWAYS_ON.filter((e) => e.translationKey !== "latest_release"),
      sensor("latest_release", "unknown"),
      sensor("actions_last_result", "unavailable"),
    ];
    const { root, text } = await mount(entities, { layout: "detailed" });
    expect(root.querySelector(".badge")).toBeNull();
    expect(text).not.toMatch(/unknown|unavailable/);
    expect(text).not.toContain("Workflow");
  });

  it("offers a stub config with the first repository device", () => {
    const hass = fixtureHass({
      devices: [
        { id: "d1", name: "ha-github-pulse" },
        { id: "account", name: "GitHub octocat" },
      ],
      entities: [
        sensor("stars", "1"),
        {
          platform: P,
          deviceId: "account",
          translationKey: "contributions_this_month",
          state: "9",
        },
      ],
    });
    expect(GithubRepoCard.getStubConfig(hass)).toEqual({ device: "d1" });
  });

  it("shows exactly the fields chosen in the config, including attributes", async () => {
    const entities = ALWAYS_ON.map((e) =>
      e.translationKey === "latest_release"
        ? { ...e, attributes: { url: "https://x/r", name: "First" } }
        : e,
    );
    const { text } = await mount(entities, { fields: ["forks", "latest_release:name"] });
    expect(text).toContain("Forks");
    expect(text).toContain("First");
    expect(text).not.toContain("Stars");
  });

  it("colours the card accent red while CI fails", async () => {
    const entities = ALWAYS_ON.map((e) =>
      e.translationKey === "ci_state" ? { ...e, state: "failure" } : e,
    );
    const { root } = await mount(entities);
    expect(root.querySelector("ha-card")?.getAttribute("style")).toContain("--error-color");
  });
});
