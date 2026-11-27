import { beforeAll, describe, expect, it } from "vitest";
import { fixtureHass, type FixtureEntity } from "../../../../test/fixtures/hass";
import { registerCards } from "../../../registry";
import { attentionCardDefinition, collectAttention, GithubAttentionCard } from "./card";

beforeAll(() => registerCards([attentionCardDefinition]));

const P = "github_pulse";
function sensor(deviceId: string, translationKey: string, state?: string): FixtureEntity {
  return { platform: P, deviceId, translationKey, state };
}

function build(entities: FixtureEntity[]) {
  return fixtureHass({
    devices: [
      { id: "account", name: "GitHub octocat" },
      { id: "r1", name: "alpha" },
      { id: "r2", name: "bravo" },
      { id: "r3", name: "charlie" },
      { id: "r4", name: "delta" },
    ],
    entities: [sensor("account", "contributions_this_month", "5"), ...entities],
  });
}

const CALM = [
  sensor("r1", "ci_state", "success"),
  sensor("r2", "ci_state", "pending"),
  sensor("account", "review_requests", "0"),
  sensor("account", "stale_pull_requests", "0"),
];

describe("collectAttention", () => {
  it("lists repositories with ci_state failure or error", () => {
    const hass = build([
      sensor("r1", "ci_state", "failure"),
      sensor("r2", "ci_state", "error"),
      sensor("r3", "ci_state", "success"),
    ]);
    expect(collectAttention(hass, {}).failingRepos).toEqual(["alpha", "bravo"]);
  });

  it("ignores pending, success and unknown states", () => {
    const hass = build([
      sensor("r1", "ci_state", "pending"),
      sensor("r2", "ci_state", "success"),
      sensor("r3", "ci_state", "unavailable"),
    ]);
    expect(collectAttention(hass, {}).failingRepos).toEqual([]);
  });

  it("reads review requests and stale pull requests from the account device", () => {
    const hass = build([
      sensor("account", "review_requests", "2"),
      sensor("account", "stale_pull_requests", "3"),
    ]);
    const result = collectAttention(hass, {});
    expect(result.reviewRequests).toBe(2);
    expect(result.stalePullRequests).toBe(3);
  });

  it("restricts the failing list with the repositories filter", () => {
    const hass = build([sensor("r1", "ci_state", "failure"), sensor("r2", "ci_state", "failure")]);
    expect(collectAttention(hass, { repositories: ["r2"] }).failingRepos).toEqual(["bravo"]);
  });

  it("treats non-numeric counts as 0", () => {
    const hass = build([
      sensor("account", "review_requests", "unavailable"),
      sensor("account", "stale_pull_requests", "garbage"),
    ]);
    const result = collectAttention(hass, {});
    expect(result.reviewRequests).toBe(0);
    expect(result.stalePullRequests).toBe(0);
  });
});

async function mount(entities: FixtureEntity[], config: Record<string, unknown> = {}) {
  const card = document.createElement("hoc-github-attention-card") as GithubAttentionCard;
  card.setConfig({ type: "custom:hoc-github-attention-card", ...config } as never);
  card.hass = build(entities);
  document.body.append(card);
  await card.updateComplete;
  const root = card.shadowRoot as ShadowRoot;
  return { root, text: root.textContent?.replace(/\s+/g, " ").trim() ?? "" };
}

describe("hoc-github-attention-card", () => {
  it("shows the failing repositories and the counts", async () => {
    const { text } = await mount([
      sensor("r1", "ci_state", "failure"),
      sensor("account", "review_requests", "2"),
      sensor("account", "stale_pull_requests", "1"),
    ]);
    expect(text).toContain("Failing CI");
    expect(text).toContain("alpha");
    expect(text).toContain("Review requests");
    expect(text).toContain("Stale pull requests");
  });

  it("shows one quiet line when everything is clean", async () => {
    const { text } = await mount(CALM);
    expect(text).toBe("All clear");
  });

  it("renders nothing when clean and show_when_clean is false", async () => {
    const { root } = await mount(CALM, { show_when_clean: false });
    expect(root.querySelector("ha-card")).toBeNull();
  });
});
