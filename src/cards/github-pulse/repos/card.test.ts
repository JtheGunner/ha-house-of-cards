import { beforeAll, describe, expect, it } from "vitest";
import { fixtureHass, type FixtureEntity } from "../../../../test/fixtures/hass";
import { registerCards } from "../../../registry";
import { GithubReposCard, reposCardDefinition } from "./card";

beforeAll(() => registerCards([reposCardDefinition]));

const P = "github_pulse";
interface Repo {
  id: string;
  name: string;
  stars?: string;
  ci?: string;
  commits?: string;
  release?: string;
}

function repoEntities(repo: Repo): FixtureEntity[] {
  const make = (translationKey: string, state?: string): FixtureEntity => ({
    platform: P,
    deviceId: repo.id,
    translationKey,
    state,
  });
  return [
    make("stars", repo.stars),
    make("ci_state", repo.ci),
    make("commits_this_month", repo.commits),
    make("latest_release", repo.release),
  ];
}

async function mount(repos: Repo[], config: Record<string, unknown> = {}) {
  const hass = fixtureHass({
    devices: [
      { id: "account", name: "GitHub octocat" },
      ...repos.map((repo) => ({ id: repo.id, name: repo.name })),
    ],
    entities: [
      { platform: P, deviceId: "account", translationKey: "contributions_this_month", state: "9" },
      ...repos.flatMap(repoEntities),
    ],
  });
  const card = document.createElement("hoc-github-repos-card") as GithubReposCard;
  card.setConfig({
    type: "custom:hoc-github-repos-card",
    ...("repositories" in config ? {} : { repositories: "all" }),
    ...config,
  } as never);
  card.hass = hass;
  document.body.append(card);
  await card.updateComplete;
  const root = card.shadowRoot as ShadowRoot;
  const names = [...root.querySelectorAll("tbody tr .name")].map((el) => el.textContent?.trim());
  return { root, names, text: root.textContent?.replace(/\s+/g, " ") ?? "" };
}

const REPOS: Repo[] = [
  { id: "r1", name: "bravo", stars: "5", ci: "success", commits: "10", release: "v1" },
  { id: "r2", name: "alpha", stars: "50", ci: "failure", commits: "2", release: "v2" },
  { id: "r3", name: "charlie", stars: "unavailable", ci: "pending", commits: "30", release: "v3" },
];

describe("hoc-github-repos-card", () => {
  it("all lists every repository device but not the account device", async () => {
    const { names } = await mount(REPOS);
    expect(names).toEqual(["alpha", "bravo", "charlie"]);
  });

  it("an explicit list restricts the rows and skips unknown devices", async () => {
    const { names } = await mount(REPOS, { repositories: ["r2", "gone"] });
    expect(names).toEqual(["alpha"]);
  });

  it("treats an empty repositories list as all repositories", async () => {
    const { names } = await mount(REPOS, { repositories: [] });
    expect(names).toEqual(["alpha", "bravo", "charlie"]);
  });

  it("applies the default columns", async () => {
    const { root } = await mount(REPOS);
    const headers = [...root.querySelectorAll("thead th")].map((th) => th.textContent?.trim());
    expect(headers).toEqual(["Repository", "CI", "Stars", "Commits this month", "Release"]);
  });

  it("sorts by a column ascending and descending", async () => {
    const asc = await mount(REPOS, { sort_by: "commits_this_month", sort_order: "asc" });
    expect(asc.names).toEqual(["alpha", "bravo", "charlie"]);
    const desc = await mount(REPOS, { sort_by: "commits_this_month", sort_order: "desc" });
    expect(desc.names).toEqual(["charlie", "bravo", "alpha"]);
  });

  it("sorts non-numeric values last in both directions", async () => {
    const asc = await mount(REPOS, { sort_by: "stars", sort_order: "asc" });
    expect(asc.names).toEqual(["bravo", "alpha", "charlie"]);
    const desc = await mount(REPOS, { sort_by: "stars", sort_order: "desc" });
    expect(desc.names).toEqual(["alpha", "bravo", "charlie"]);
  });

  it("shows an empty message without repositories", async () => {
    const { text } = await mount([]);
    expect(text).toContain("No repositories");
  });

  it("renders 50 repositories inside a scroll container", async () => {
    const many = Array.from({ length: 50 }, (_, i) => ({
      id: `m${i}`,
      name: `repo-${i}`,
      stars: "1",
    }));
    const { root, names } = await mount(many);
    expect(names).toHaveLength(50);
    expect(root.querySelector(".scroll tbody")).not.toBeNull();
  });

  it("renders a column without a sensor as an em dash", async () => {
    const { text } = await mount([{ id: "r9", name: "solo" }], { columns: ["stars"] });
    expect(text).toContain("—");
  });

  it("works from the card picker without any option", async () => {
    const { names } = await mount(REPOS, { repositories: undefined });
    expect(names).toEqual(["alpha", "bravo", "charlie"]);
  });

  it("excludes every account device, not only the first", async () => {
    const hass = fixtureHass({
      devices: [
        { id: "acc1", name: "GitHub one" },
        { id: "acc2", name: "GitHub two" },
        { id: "r1", name: "alpha" },
      ],
      entities: [
        { platform: P, deviceId: "acc1", translationKey: "contributions_this_month", state: "1" },
        { platform: P, deviceId: "acc2", translationKey: "contributions_this_month", state: "2" },
        ...repoEntities({ id: "r1", name: "alpha", stars: "1" }),
      ],
    });
    const card = document.createElement("hoc-github-repos-card") as GithubReposCard;
    card.setConfig({ type: "custom:hoc-github-repos-card" } as never);
    card.hass = hass;
    document.body.append(card);
    await card.updateComplete;
    const names = [...(card.shadowRoot as ShadowRoot).querySelectorAll("tbody tr .name")].map(
      (el) => el.textContent?.trim(),
    );
    expect(names).toEqual(["alpha"]);
  });
});
