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
) {
  const hass = fixtureHass();
  if (attributes) hass.states[ENTITY] = { entity_id: ENTITY, state: "3", attributes };
  const card = document.createElement("hoc-youtrack-issues-card") as YoutrackIssuesCard;
  card.setConfig({ type: "custom:hoc-youtrack-issues-card", entity, ...config } as never);
  card.hass = hass;
  document.body.append(card);
  await card.updateComplete;
  const root = card.shadowRoot as ShadowRoot;
  return { root, text: root.textContent?.replace(/\s+/g, " ") ?? "" };
}

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
    expect((await mount({})).text).toContain("No issues");
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
