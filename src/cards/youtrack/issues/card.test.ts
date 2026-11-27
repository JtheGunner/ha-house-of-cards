import { beforeAll, describe, expect, it } from "vitest";
import { fixtureHass } from "../../../../test/fixtures/hass";
import { registerCards } from "../../../registry";
import { issuesCardDefinition, YoutrackIssuesCard } from "./card";

beforeAll(() => registerCards([issuesCardDefinition]));

const ENTITY = "sensor.my_query";

function issue(n: number, url = `https://yt.example/issue/HHOC-${n}`) {
  return {
    id: `HHOC-${n}`,
    summary: `Summary ${n}`,
    state: "Open",
    priority: "Normal",
    assignee: "jthegunner",
    url,
  };
}

async function mount(
  attributes: Record<string, unknown> | undefined,
  config = {},
  entity = ENTITY,
  count = "3",
  project?: string,
) {
  const hass = fixtureHass();
  if (attributes) hass.states[ENTITY] = { entity_id: ENTITY, state: count, attributes };
  if (project) {
    hass.devices["p1"] = { id: "p1", name: project };
    hass.entities[ENTITY] = { entity_id: ENTITY, device_id: "p1", platform: "youtrack" };
  }
  const card = document.createElement("hoc-youtrack-issues-card") as YoutrackIssuesCard;
  card.setConfig({ type: "custom:hoc-youtrack-issues-card", entity, ...config } as never);
  card.hass = hass;
  document.body.append(card);
  await card.updateComplete;
  const root = card.shadowRoot as ShadowRoot;
  return { root, card, text: root.textContent?.replace(/\s+/g, " ") ?? "" };
}

const many = (n: number) => Array.from({ length: n }, (_, i) => issue(i + 1));
const text = (root: ShadowRoot, selector: string) =>
  root.querySelector(selector)?.textContent?.replace(/\s+/g, " ").trim();

describe("hoc-youtrack-issues-card", () => {
  it("renders id, summary and state of each issue", async () => {
    const { text } = await mount({ issues: [issue(1), issue(2)] });
    expect(text).toContain("HHOC-1");
    expect(text).toContain("Summary 2");
    expect(text).toContain("Open");
  });

  it("renders at most max_items issues", async () => {
    const { root } = await mount({ issues: [1, 2, 3, 4].map((n) => issue(n)) }, { max_items: 2 });
    expect(root.querySelectorAll(".issue")).toHaveLength(2);
  });

  it("defaults to five issues", async () => {
    const { root } = await mount({ issues: [1, 2, 3, 4, 5, 6, 7].map((n) => issue(n)) });
    expect(root.querySelectorAll(".issue")).toHaveLength(5);
  });

  it("links to the issue and opens it in a new tab", async () => {
    const { root } = await mount({ issues: [issue(1)] });
    const link = root.querySelector("a") as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("https://yt.example/issue/HHOC-1");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("does not link a URL with an unsafe scheme", async () => {
    const { root, text } = await mount({ issues: [issue(1, "javascript:alert(1)")] });
    expect(root.querySelector("a")).toBeNull();
    expect(text).toContain("HHOC-1");
  });

  it("shows an empty message without issues", async () => {
    const { text } = await mount({ issues: [] });
    expect(text).toContain("No issues");
  });

  it("renders the error state when the entity does not exist", async () => {
    const { text } = await mount(undefined);
    expect(text).toContain("Entity not found");
  });

  it("offers a stub config with the first sensor that carries issues", () => {
    const hass = fixtureHass({
      devices: [{ id: "p1", name: "HHOC" }],
      entities: [
        {
          platform: "youtrack",
          deviceId: "p1",
          translationKey: "",
          state: "3",
          attributes: { issues: [] },
        },
      ],
    });
    const entityId = Object.keys(hass.entities)[0];
    expect(YoutrackIssuesCard.getStubConfig(hass)).toEqual({ entity: entityId });
  });
});

describe("hoc-youtrack-issues-card title and badge", () => {
  const attributes = (extra = {}) => ({
    friendly_name: "HHOC Open bugs",
    query: "project: HHOC #Unresolved",
    issues: [issue(1)],
    ...extra,
  });

  it("titles the card with the project and the query name", async () => {
    const { root } = await mount(attributes(), {}, ENTITY, "1", "HHOC");
    expect(text(root, ".header .name")).toBe("HHOC · Open bugs");
  });

  it("falls back to the sensor name without a project", async () => {
    const { root } = await mount(attributes());
    expect(text(root, ".header .name")).toBe("HHOC Open bugs");
  });

  it("lets name replace the title", async () => {
    const { root } = await mount(attributes(), { name: "My bugs" }, ENTITY, "1", "HHOC");
    expect(text(root, ".header .name")).toBe("My bugs");
  });

  it("hides the title with show_title: false and keeps the badge", async () => {
    const hidden = await mount(attributes(), { show_title: false });
    expect(hidden.root.querySelector(".header")).toBeNull();
    const badged = await mount(attributes(), { show_title: false, badge: "count" }, ENTITY, "7");
    expect(badged.root.querySelector(".name")).toBeNull();
    expect(text(badged.root, ".header--badge-only .badge")).toBe("7");
  });

  it("shows no badge by default", async () => {
    const { root } = await mount(attributes());
    expect(root.querySelector(".header .badge")).toBeNull();
  });

  it("shows the number of matches or an attribute as a badge, optionally coloured", async () => {
    const count = await mount(attributes(), { badge: "count" }, ENTITY, "42");
    expect(text(count.root, ".header .badge")).toBe("42");
    const query = await mount(attributes(), { badge: { key: "query", color: "purple" } });
    expect(text(query.root, ".header .badge")).toBe("project: HHOC #Unresolved");
    expect(query.root.querySelector(".header .badge")?.getAttribute("style")).toContain(
      "var(--purple-color)",
    );
    const gone = await mount(attributes(), { badge: "nope" });
    expect(gone.root.querySelector(".header .badge")).toBeNull();
  });
});

describe("hoc-youtrack-issues-card colours", () => {
  it("colours the state as a badge and the priority as the left edge", async () => {
    const { root } = await mount({
      issues: [
        { ...issue(1), state: "In Progress", priority: "Critical" },
        { ...issue(2), state: "Done", priority: "Normal" },
      ],
    });
    const states = [...root.querySelectorAll(".issue__toggle .badge")].map((el) =>
      el.getAttribute("style"),
    );
    expect(states[0]).toContain("--warning-color");
    expect(states[1]).toContain("--success-color");
    const edges = [...root.querySelectorAll(".issue")].map((el) => el.getAttribute("style"));
    expect(edges[0]).toContain("--error-color");
    expect(edges[1]).toContain("--divider-color");
  });

  it("applies colour overrides from the config", async () => {
    const { root } = await mount(
      { issues: [{ ...issue(1), state: "In Review" }] },
      { colors: { "in review": "purple" } },
    );
    expect(root.querySelector(".issue__toggle .badge")?.getAttribute("style")).toContain(
      "var(--purple-color)",
    );
  });
});

describe("hoc-youtrack-issues-card more issues", () => {
  it("shows no footer when every issue is visible", async () => {
    const { root } = await mount({ issues: many(3) }, {}, ENTITY, "3");
    expect(root.querySelector(".footer")).toBeNull();
  });

  it("counts the remaining issues even when the sensor lists fewer", async () => {
    const { root } = await mount({ issues: many(5) }, {}, ENTITY, "12");
    expect(text(root, ".footer")).toContain("+7 more");
  });

  it("expands to every listed issue and collapses again", async () => {
    const { root, card } = await mount({ issues: many(8) }, { max_items: 3 }, ENTITY, "8");
    expect(root.querySelectorAll(".issue")).toHaveLength(3);
    const more = root.querySelector(".footer .more") as HTMLButtonElement;
    expect(more.textContent?.trim()).toBe("+5 more");
    more.click();
    await card.updateComplete;
    expect(root.querySelectorAll(".issue")).toHaveLength(8);
    const less = root.querySelector(".footer .more") as HTMLButtonElement;
    expect(less.textContent?.trim()).toBe("Show less");
    expect(less.getAttribute("aria-expanded")).toBe("true");
    less.click();
    await card.updateComplete;
    expect(root.querySelectorAll(".issue")).toHaveLength(3);
  });

  it("keeps the count but cannot expand when expandable is off", async () => {
    const { root } = await mount(
      { issues: many(8) },
      { max_items: 3, expandable: false },
      ENTITY,
      "8",
    );
    expect(root.querySelector(".footer button")).toBeNull();
    expect(text(root, ".footer")).toContain("+5 more");
  });

  it("points to the YouTrack search for issues the sensor does not list", async () => {
    const { root, card } = await mount(
      { query: "project: HHOC #Unresolved", issues: many(5) },
      { max_items: 2 },
      ENTITY,
      "20",
    );
    const link = () => root.querySelector(".footer a") as HTMLAnchorElement;
    expect(link().getAttribute("href")).toBe(
      "https://yt.example/issues?q=project%3A%20HHOC%20%23Unresolved",
    );
    expect(link().getAttribute("rel")).toContain("noopener");
    (root.querySelector(".footer .more") as HTMLButtonElement).click();
    await card.updateComplete;
    expect(text(root, ".footer")).toContain("+15 more");
    expect(link()).not.toBeNull();
  });

  it("offers no search link when the query or the issue links are missing", async () => {
    const noQuery = await mount({ issues: many(2) }, {}, ENTITY, "20");
    expect(noQuery.root.querySelector(".footer a")).toBeNull();
    const noUrl = await mount(
      { query: "x", issues: [issue(1, "javascript:alert(1)")] },
      {},
      ENTITY,
      "20",
    );
    expect(noUrl.root.querySelector(".footer a")).toBeNull();
  });
});

describe("hoc-youtrack-issues-card details", () => {
  const detailed = {
    issues: [{ ...issue(1), summary: "A long summary", priority: "Major", assignee: "jthegunner" }],
  };

  it("starts collapsed and opens an issue on click", async () => {
    const { root, card } = await mount(detailed);
    expect(root.querySelector(".detail")).toBeNull();
    const toggle = root.querySelector(".issue__toggle") as HTMLButtonElement;
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    toggle.click();
    await card.updateComplete;
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    const detail = text(root, ".detail") ?? "";
    expect(detail).toContain("A long summary");
    expect(detail).toContain("Priority: Major");
    expect(detail).toContain("jthegunner");
    expect(root.querySelector(".detail a")?.getAttribute("href")).toBe(
      "https://yt.example/issue/HHOC-1",
    );
    toggle.click();
    await card.updateComplete;
    expect(root.querySelector(".detail")).toBeNull();
  });

  it("opens issues independently of each other", async () => {
    const { root, card } = await mount({ issues: many(3) });
    (root.querySelectorAll(".issue__toggle")[0] as HTMLButtonElement).click();
    (root.querySelectorAll(".issue__toggle")[2] as HTMLButtonElement).click();
    await card.updateComplete;
    expect(root.querySelectorAll(".detail")).toHaveLength(2);
  });

  it("leaves out detail rows the issue has no data for", async () => {
    const { root, card } = await mount({
      issues: [{ id: "HHOC-9", summary: "Bare", state: "Open", url: "javascript:void(0)" }],
    });
    (root.querySelector(".issue__toggle") as HTMLButtonElement).click();
    await card.updateComplete;
    expect(root.querySelector(".detail .assignee")).toBeNull();
    expect(root.querySelector(".detail a")).toBeNull();
    expect(text(root, ".detail__meta")).toBe("");
  });

  it("explains when the chosen sensor lists no issues", async () => {
    const { text: message } = await mount({ friendly_name: "Open issues" });
    expect(message).toContain("This sensor lists no issues");
  });
});
