import { beforeAll, describe, expect, it } from "vitest";
import { fixtureHass, type FixtureEntity } from "../../../../test/fixtures/hass";
import { registerCards } from "../../../registry";
import { DevicesCard, devicesCardDefinition } from "./card";

beforeAll(() => registerCards([devicesCardDefinition]));

const P = "github_pulse";
interface Repo {
  id: string;
  name: string;
  stars?: string;
  ci?: string;
  commits?: string;
  release?: string;
  url?: string;
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
      ...repos.map((repo) => ({ id: repo.id, name: repo.name, configuration_url: repo.url })),
    ],
    entities: [
      { platform: P, deviceId: "account", translationKey: "contributions_this_month", state: "9" },
      ...repos.flatMap(repoEntities),
    ],
  });
  const card = document.createElement("hoc-devices-card") as DevicesCard;
  card.setConfig({
    type: "custom:hoc-devices-card",
    ...("devices" in config ? {} : { platform: P }),
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

describe("hoc-devices-card", () => {
  it("all lists every repository device but not the account device", async () => {
    const { names } = await mount(REPOS);
    expect(names).toEqual(["alpha", "bravo", "charlie"]);
  });

  it("an explicit list restricts the rows and skips unknown devices", async () => {
    const { names } = await mount(REPOS, { devices: ["r2", "gone"] });
    expect(names).toEqual(["alpha"]);
  });

  it("treats an empty devices list as every device of the platform", async () => {
    const { names } = await mount(REPOS, { devices: [], platform: P });
    expect(names).toEqual(["alpha", "bravo", "charlie"]);
  });

  it("applies the default columns", async () => {
    const { root } = await mount(REPOS);
    const headers = [...root.querySelectorAll("thead th")].map((th) => th.textContent?.trim());
    expect(headers).toEqual(["Device", "CI", "Stars", "Commits this month", "Release"]);
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

  it("shows an empty message without devices", async () => {
    const { text } = await mount([]);
    expect(text).toContain("No devices");
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

  it("works from the card picker with the stub config", async () => {
    const hass = fixtureHass({
      devices: REPOS.map((repo) => ({ id: repo.id, name: repo.name })),
      entities: REPOS.flatMap(repoEntities),
    });
    expect(DevicesCard.getStubConfig(hass)).toEqual({ platform: P });
    expect(DevicesCard.getStubConfig(fixtureHass())).toEqual({});
    const { names } = await mount(REPOS, DevicesCard.getStubConfig(hass));
    expect(names).toEqual(["alpha", "bravo", "charlie"]);
  });

  it("asks for devices or an integration when neither is set", async () => {
    const { text } = await mount(REPOS, { devices: undefined });
    expect(text).toContain("Choose devices or an integration");
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
    const card = document.createElement("hoc-devices-card") as DevicesCard;
    card.setConfig({ type: "custom:hoc-devices-card", platform: P } as never);
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
    const card = document.createElement("hoc-devices-card") as DevicesCard;
    card.setConfig({
      type: "custom:hoc-devices-card",
      platform: P,
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
    expect(headers).toEqual(["Device", "Forks", "Release › Downloads"]);
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
      { show_status: true },
    );
    const dots = [...root.querySelectorAll("tbody tr .name .dot")].map((d) => d.className);
    expect(dots).toEqual(["dot", "dot dot--neutral"]);
    expect(root.querySelector("tbody tr .name .dot")?.getAttribute("style")).toContain(
      "--success-color",
    );
  });

  it("shows no activity dots by default", async () => {
    const { root } = await mount(REPOS);
    expect(root.querySelector("tbody .name .dot")).toBeNull();
  });

  it("lists a repository once even when it is selected twice", async () => {
    const { names } = await mount(REPOS, { devices: ["r1", "r1", "r2"] });
    expect(names).toEqual(["alpha", "bravo"]);
  });

  it("keeps the activity dot apart from the name text", async () => {
    const { root } = await mount([{ id: "a", name: "o/a", commits: "4" }], { show_status: true });
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
      "right",
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

  it("colours a column title with title_color, independent of the value colour", async () => {
    const { root } = await mount(REPOS, {
      columns: [
        { key: "stars", title_color: "purple" },
        { key: "commits_this_month", color: "pink" },
        { key: "latest_release", title_color: "#ff0000" },
      ],
    });
    const style = (n: number) =>
      root.querySelector(`thead th:nth-child(${n})`)?.getAttribute("style");
    expect(style(2)).toContain("color: var(--purple-color)");
    expect(style(3)).not.toContain("color:");
    expect(style(4)).toContain("color: #ff0000");
    expect(root.querySelector("tbody td:nth-child(2) .cell")?.className).not.toContain(
      "cell--tone",
    );
  });

  it("links the name to the device page only when link is device and the url is https", async () => {
    const repos = [
      { id: "a", name: "o/a", url: "https://github.com/o/a" },
      { id: "b", name: "o/b", url: "javascript:alert(1)" },
      { id: "c", name: "o/c" },
    ];
    const off = await mount(repos);
    expect(off.root.querySelector("tbody .name a")).toBeNull();
    for (const link of ["device", true]) {
      const on = await mount(repos, { link });
      const anchors = [...on.root.querySelectorAll("tbody .name a")];
      expect(anchors).toHaveLength(1);
      expect(anchors[0]?.getAttribute("href")).toBe("https://github.com/o/a");
      expect(anchors[0]?.getAttribute("rel")).toContain("noopener");
      expect(anchors[0]?.textContent?.trim()).toBe("o/a");
    }
  });
});

describe("hoc-devices-card with other integrations", () => {
  const T = "youtrack";
  const sensor = (deviceId: string, translationKey: string, state: string, attributes = {}) => ({
    platform: T,
    deviceId,
    translationKey,
    state,
    attributes,
  });

  async function mountTable(config: Record<string, unknown>, extra: FixtureEntity[] = []) {
    const hass = fixtureHass({
      devices: [
        { id: "p1", name: "HHOC" },
        { id: "p2", name: "DEV" },
        { id: "x1", name: "Other thing" },
        { id: "p3", name: "ZED" },
      ],
      entities: [
        sensor("p1", "issues_open", "14"),
        sensor("p1", "issues_overdue", "2"),
        sensor("p1", "issues_critical_open", "0"),
        sensor("p1", "has_overdue", "on"),
        sensor("p2", "issues_open", "3"),
        sensor("p2", "issues_overdue", "0"),
        sensor("p2", "issues_critical_open", "0"),
        sensor("p2", "has_overdue", "off"),
        { platform: "other", deviceId: "x1", translationKey: "temp", state: "21" },
        { platform: "other", deviceId: "x1", translationKey: "humidity", state: "40" },
        ...extra,
      ],
    });
    const card = document.createElement("hoc-devices-card") as DevicesCard;
    card.setConfig({ type: "custom:hoc-devices-card", ...config } as never);
    card.hass = hass;
    document.body.append(card);
    await card.updateComplete;
    const root = card.shadowRoot as ShadowRoot;
    return {
      root,
      names: [...root.querySelectorAll("tbody tr .name")].map((el) => el.textContent?.trim()),
      headers: [...root.querySelectorAll("thead th")].map((th) => th.textContent?.trim()),
    };
  }

  it("uses the columns of the integration's preset", async () => {
    const { names, headers } = await mountTable({ platform: T });
    expect(names).toEqual(["DEV", "HHOC"]);
    expect(headers).toEqual(["Device", "Open", "Overdue", "Critical"]);
  });

  it("lists chosen devices of any integration with the first sensors as columns", async () => {
    const { names, headers } = await mountTable({ devices: ["x1"] });
    expect(names).toEqual(["Other thing"]);
    expect(headers).toEqual(["Device", "Temp", "Humidity"]);
  });

  it("lists devices of different integrations together", async () => {
    const { names } = await mountTable({ devices: ["p1", "x1"], columns: ["issues_open"] });
    expect(names).toEqual(["HHOC", "Other thing"]);
  });

  it("uses the preset's default status per row", async () => {
    const { root } = await mountTable({ platform: T, show_status: true });
    const dots = [...root.querySelectorAll("tbody tr .name .dot")];
    expect(dots[0]?.className).toBe("dot dot--neutral");
    expect(dots[1]?.getAttribute("style")).toContain("--error-color");
  });

  it("lets status rules replace the preset's default", async () => {
    const { root } = await mountTable({
      platform: T,
      show_status: true,
      status: [{ field: "issues_open", operator: ">", value: 10, state: "pending" }],
    });
    const dots = [...root.querySelectorAll("tbody tr .name .dot")];
    expect(dots[0]?.className).toBe("dot dot--neutral");
    expect(dots[1]?.getAttribute("style")).toContain("--warning-color");
  });

  it("shows no dots without show_status", async () => {
    const { root } = await mountTable({ platform: T });
    expect(root.querySelector("tbody .name .dot")).toBeNull();
  });

  it("links the name to a URL held in an attribute, skipping devices without one", async () => {
    const { root } = await mountTable({ platform: T, link: "issues_open:url" }, []);
    expect(root.querySelector("tbody .name a")).toBeNull();
    const withUrl = await mountTable(
      { devices: ["p3"], columns: ["issues_open"], link: "issues_open:url" },
      [sensor("p3", "issues_open", "1", { url: "https://tracker.example/p3" })],
    );
    expect(withUrl.root.querySelector("tbody .name a")?.getAttribute("href")).toBe(
      "https://tracker.example/p3",
    );
  });

  it("shows the shortened name for any integration with hide_owner", async () => {
    const { names } = await mountTable({ platform: T, hide_owner: true });
    expect(names).toEqual(["DEV", "HHOC"]);
  });
});
