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

  it("shows any sensor or attribute as a column and sorts by it", async () => {
    const hass = fixtureHass({
      devices: [
        { id: "a", name: "alpha" },
        { id: "b", name: "bravo" },
      ],
      entities: [
        {
          platform: P,
          deviceId: "a",
          translationKey: "latest_release",
          state: "v1",
          attributes: { downloads: 5 },
        },
        {
          platform: P,
          deviceId: "b",
          translationKey: "latest_release",
          state: "v2",
          attributes: { downloads: 50 },
        },
        { platform: P, deviceId: "a", translationKey: "forks", state: "7" },
        { platform: P, deviceId: "b", translationKey: "forks", state: "3" },
      ],
    });
    const card = document.createElement("hoc-github-repos-card") as GithubReposCard;
    card.setConfig({
      type: "custom:hoc-github-repos-card",
      columns: ["forks", "latest_release:downloads"],
      sort_by: "latest_release:downloads",
      sort_order: "desc",
    } as never);
    card.hass = hass;
    document.body.append(card);
    await card.updateComplete;
    const root = card.shadowRoot as ShadowRoot;
    const names = [...root.querySelectorAll("tbody tr .name")].map((el) => el.textContent?.trim());
    const headers = [...root.querySelectorAll("thead th")].map((th) => th.textContent?.trim());
    expect(names).toEqual(["bravo", "alpha"]);
    expect(headers).toEqual(["Repository", "Forks", "Release › Downloads"]);
  });

  it("shows the repository name without the owner when hide_owner is on", async () => {
    const repos = [{ id: "a", name: "JtheGunner/bullseye-eye", stars: "1" }];
    const off = await mount(repos);
    expect(off.root.querySelector("tbody .name")?.textContent?.trim()).toBe(
      "JtheGunner/bullseye-eye",
    );
    const on = await mount(repos, { hide_owner: true });
    expect(on.root.querySelector("tbody .name")?.textContent?.trim()).toBe("bullseye-eye");
  });

  it("keeps names without an owner as they are", async () => {
    const { root } = await mount([{ id: "a", name: "plain", stars: "1" }], { hide_owner: true });
    expect(root.querySelector("tbody .name")?.textContent?.trim()).toBe("plain");
  });

  it("overrides a column's label, icon and colour", async () => {
    const { root } = await mount([{ id: "a", name: "o/a", stars: "5" }], {
      column_titles: "icon_text",
      columns: [{ key: "stars", name: "Fans", icon: "mdi:heart", color: "pink" }],
    });
    const header = root.querySelector("thead th:nth-child(2)");
    expect(header?.textContent).toContain("Fans");
    expect(header?.querySelector("ha-icon")?.getAttribute("icon")).toBe("mdi:heart");
    expect(root.querySelector("tbody .cell")?.getAttribute("style")).toContain("var(--pink-color)");
    expect(root.querySelector("tbody .cell")?.className).toContain("cell--tone");
  });

  it("shows column titles as text by default", async () => {
    const { root } = await mount(REPOS);
    expect(root.querySelector("thead th:nth-child(3)")?.textContent).toContain("Stars");
    expect(root.querySelector("thead th ha-icon, thead th ha-state-icon")).toBeNull();
  });

  it("shows column titles as icon only, with the title as tooltip", async () => {
    const { root } = await mount(REPOS, {
      column_titles: "icon",
      columns: [{ key: "stars", icon: "mdi:star" }],
    });
    const th = root.querySelector("thead th:nth-child(2)");
    expect(th?.querySelector("ha-icon")?.getAttribute("icon")).toBe("mdi:star");
    expect(th?.textContent?.trim()).toBe("");
    expect(th?.getAttribute("title")).toBe("Stars");
  });

  it("shows column titles as icon and text, using the sensor icon without an override", async () => {
    const { root } = await mount(REPOS, { column_titles: "icon_text", columns: ["stars"] });
    const th = root.querySelector("thead th:nth-child(2)");
    expect(th?.querySelector("ha-state-icon")).not.toBeNull();
    expect(th?.textContent).toContain("Stars");
  });

  it("shows a green dot for repositories with commits this month and a grey one otherwise", async () => {
    const { root } = await mount(
      [
        { id: "a", name: "active", commits: "4" },
        { id: "b", name: "idle", commits: "0" },
      ],
      { show_activity: true },
    );
    const dots = [...root.querySelectorAll("tbody tr .name .dot")].map((d) => d.className);
    expect(dots).toEqual(["dot dot--success", "dot dot--neutral"]);
  });

  it("shows no activity dots by default", async () => {
    const { root } = await mount(REPOS);
    expect(root.querySelector("tbody .name .dot")).toBeNull();
  });

  it("lists a repository once even when it is selected twice", async () => {
    const { names } = await mount(REPOS, { repositories: ["r1", "r1", "r2"] });
    expect(names).toEqual(["alpha", "bravo"]);
  });

  it("keeps the activity dot apart from the name text", async () => {
    const { root } = await mount([{ id: "a", name: "o/a", commits: "4" }], { show_activity: true });
    const cell = root.querySelector("tbody .name");
    expect(cell?.querySelector(".name__content .dot")).not.toBeNull();
    expect(cell?.querySelector(".name__content .name__text")?.textContent?.trim()).toBe("o/a");
  });

  it("aligns number columns right and text columns left by default, in header and cells", async () => {
    const { root } = await mount(REPOS, { columns: ["stars", "latest_release"] });
    const align = (selector: string) =>
      (root.querySelector(selector) as HTMLElement).style.textAlign;
    expect(align("thead th:nth-child(2)")).toBe("right");
    expect(align("tbody tr td:nth-child(2)")).toBe("right");
    expect(align("thead th:nth-child(3)")).toBe("left");
    expect(align("tbody tr td:nth-child(3)")).toBe("left");
  });

  it("lets a column set its own alignment", async () => {
    const { root } = await mount(REPOS, { columns: [{ key: "stars", align: "center" }] });
    expect((root.querySelector("tbody td:nth-child(2)") as HTMLElement).style.textAlign).toBe(
      "center",
    );
    expect((root.querySelector("thead th:nth-child(2)") as HTMLElement).style.textAlign).toBe(
      "center",
    );
  });

  it("aligns icon-only titles like the column content", async () => {
    const { root } = await mount(REPOS, { column_titles: "icon", columns: ["stars"] });
    expect((root.querySelector("thead th:nth-child(2)") as HTMLElement).style.textAlign).toBe(
      "center",
    );
    expect((root.querySelector("tbody td:nth-child(2)") as HTMLElement).style.textAlign).toBe(
      "right",
    );
  });

  it("treats a column with any non-numeric value as text", async () => {
    const mixed = [
      { id: "a", name: "a", stars: "5" },
      { id: "b", name: "b", stars: "n/a" },
    ];
    const { root } = await mount(mixed, { columns: ["stars"] });
    expect((root.querySelector("tbody td:nth-child(2)") as HTMLElement).style.textAlign).toBe(
      "left",
    );
  });
});
