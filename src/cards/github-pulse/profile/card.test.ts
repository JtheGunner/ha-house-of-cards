import { beforeAll, describe, expect, it } from "vitest";
import { fixtureHass, type FixtureEntity } from "../../../../test/fixtures/hass";
import { registerCards } from "../../../registry";
import { GithubProfileCard, profileCardDefinition } from "./card";

beforeAll(() => registerCards([profileCardDefinition]));

const P = "github_pulse";
function sensor(translationKey: string, state?: string, deviceId = "account"): FixtureEntity {
  return { platform: P, deviceId, translationKey, state };
}

const PROFILE = [
  sensor("contributions_this_month", "1500"),
  sensor("commits_vs_last_month", "-8"),
  sensor("current_streak", "12"),
  sensor("longest_streak", "40"),
  sensor("top_language", "PHP"),
];

async function mount(entities: FixtureEntity[], config: Record<string, unknown> = {}) {
  const hass = fixtureHass({
    devices: [
      { id: "account", name: "GitHub octocat" },
      { id: "repo", name: "some-repo" },
    ],
    entities,
  });
  const card = document.createElement("hoc-github-profile-card") as GithubProfileCard;
  card.setConfig({ type: "custom:hoc-github-profile-card", ...config } as never);
  card.hass = hass;
  document.body.append(card);
  await card.updateComplete;
  const root = card.shadowRoot as ShadowRoot;
  return { root, text: root.textContent?.replace(/\s+/g, " ") ?? "" };
}

describe("hoc-github-profile-card", () => {
  it("renders the core fields from the account device", async () => {
    const { text } = await mount(PROFILE);
    expect(text).toContain("GitHub octocat");
    expect(text).toContain("1.5k");
    expect(text).toContain("▼ 8 %");
    expect(text).toContain("12 d");
    expect(text).toContain("40 d");
    expect(text).toContain("PHP");
  });

  it("defaults to the account device and ignores repository devices", async () => {
    const { text } = await mount([...PROFILE, sensor("stars", "99", "repo")]);
    expect(text).not.toContain("99");
  });

  it("uses an explicitly configured device", async () => {
    const other = [sensor("contributions_this_month", "7", "repo")];
    const { text } = await mount([...PROFILE, ...other], { device: "repo" });
    expect(text).toContain("some-repo");
  });

  it("omits the streak when its sensor is missing", async () => {
    const { text } = await mount(PROFILE.filter((e) => e.translationKey !== "current_streak"));
    expect(text).not.toContain("Current streak");
    expect(text).toContain("Longest streak");
  });

  it("shows no NaN or Infinity when the last-month value is unavailable", async () => {
    const entities = PROFILE.map((e) =>
      e.translationKey === "commits_vs_last_month" ? { ...e, state: "unavailable" } : e,
    );
    const { text } = await mount(entities);
    expect(text).not.toMatch(/NaN|Infinity/);
  });

  it("shows the error state without any account device", async () => {
    const { text } = await mount([sensor("stars", "1", "repo")]);
    expect(text).toContain("Device not found");
  });
});
