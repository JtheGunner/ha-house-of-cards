import { css, html, nothing, type TemplateResult } from "lit";
import { HocBaseCard, type BaseConfig } from "../../../core/base-card";
import { colorValue } from "../../../core/fields";
import { parseNumber } from "../../../core/format";
import { t } from "../../../core/i18n";
import { headerStyles } from "../../../core/parts/header";
import type { HassEntityState, HomeAssistant } from "../../../core/types";
import { fontSecondary } from "../../../core/parts/typography";
import type { CardDefinition } from "../../../registry";
import { priorityColor, stateColor, type ColorOverrides } from "./colors";
import { YoutrackIssuesEditor } from "./editor";

export const ISSUES_CARD_TAG = "hoc-youtrack-issues-card";
const DEFAULT_MAX_ITEMS = 5;

export interface BadgeSpec {
  /** `count` for the number of matches, or the name of an attribute of the sensor. */
  key: string;
  color?: string;
}

export interface YoutrackIssuesConfig extends BaseConfig {
  entity: string;
  /** Hide the title; a badge, if set, stays. */
  show_title?: boolean;
  /** Replaces the title, which is the project and the name of the query. */
  name?: string;
  max_items?: number;
  /** Let the card show every issue of the sensor on click. On by default. */
  expandable?: boolean;
  /** A value shown as a badge on the far side of the title. */
  badge?: string | BadgeSpec;
  /** Colour overrides by state or priority name, such as `{ "In Review": "purple" }`. */
  colors?: ColorOverrides;
}

interface IssueView {
  id: string;
  summary: string;
  state: string;
  priority: string;
  assignee: string;
  url: string | undefined;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function safeUrl(value: unknown): string | undefined {
  return typeof value === "string" && /^https?:\/\//i.test(value) ? value : undefined;
}

function toIssueViews(attributes: Record<string, unknown>): IssueView[] {
  const raw = attributes["issues"];
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item): IssueView[] => {
    if (typeof item !== "object" || item === null) return [];
    const issue = item as Record<string, unknown>;
    if (typeof issue["id"] !== "string") return [];
    return [
      {
        id: issue["id"],
        summary: text(issue["summary"]),
        state: text(issue["state"]),
        priority: text(issue["priority"]),
        assignee: text(issue["assignee"]),
        url: safeUrl(issue["url"]),
      },
    ];
  });
}

/** `Project · Query`, or whichever of the two the sensor has. */
function defaultTitle(hass: HomeAssistant, entityId: string, state: HassEntityState): string {
  const deviceId = hass.entities[entityId]?.device_id;
  const device = deviceId ? hass.devices[deviceId] : undefined;
  const project = device?.name_by_user ?? device?.name ?? "";
  const friendly = text(state.attributes["friendly_name"]).trim();
  const query =
    project && friendly.startsWith(`${project} `) ? friendly.slice(project.length + 1) : friendly;
  if (project && query && query !== project) return `${project} · ${query}`;
  return project || query || entityId;
}

/** The YouTrack search that shows the same issues, derived from the sensor's own issue links. */
function searchUrl(issues: IssueView[], query: unknown): string | undefined {
  const first = issues.find((issue) => issue.url)?.url;
  if (!first || typeof query !== "string" || query.trim() === "") return undefined;
  try {
    return `${new URL(first).origin}/issues?q=${encodeURIComponent(query)}`;
  } catch {
    return undefined;
  }
}

export class YoutrackIssuesCard extends HocBaseCard<YoutrackIssuesConfig> {
  static override requiredKeys = ["entity"];

  static override properties = {
    ...HocBaseCard.properties,
    showAll: { state: true },
    openIssues: { state: true },
  };

  declare showAll: boolean;
  declare openIssues: ReadonlySet<string>;

  constructor() {
    super();
    this.showAll = false;
    this.openIssues = new Set();
  }

  static override styles = [
    ...HocBaseCard.styles,
    headerStyles,
    css`
      .issues {
        display: flex;
        flex-direction: column;
        margin-top: 10px;
      }
      .issue {
        --p: var(--divider-color);
        border-left: 3px solid var(--p);
        border-radius: 2px;
        padding-left: 10px;
      }
      .issue + .issue {
        margin-top: 2px;
      }
      .issue__row {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .issue__id {
        flex: none;
        font-size: ${fontSecondary};
        font-weight: 500;
        color: var(--secondary-text-color);
        text-decoration: none;
      }
      a.issue__id:hover {
        color: var(--primary-color);
        text-decoration: underline;
      }
      button {
        font: inherit;
        color: inherit;
        background: none;
        border: 0;
        cursor: pointer;
        text-align: left;
      }
      .issue__toggle {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        padding: 6px 4px;
        border-radius: 6px;
        color: var(--primary-text-color);
      }
      .issue__toggle:hover,
      .more:hover {
        background: var(--secondary-background-color);
      }
      .issue__toggle:focus-visible,
      .more:focus-visible {
        outline: 2px solid var(--primary-color);
      }
      .issue__summary {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .issue__chevron {
        flex: none;
        font-size: ${fontSecondary};
        color: var(--secondary-text-color);
        transition: transform 0.15s;
      }
      .issue--open .issue__chevron {
        transform: rotate(90deg);
      }
      .badge {
        font-size: ${fontSecondary};
        white-space: nowrap;
      }
      .detail {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 2px 4px 10px;
      }
      .detail__summary {
        color: var(--primary-text-color);
        overflow-wrap: anywhere;
      }
      .detail__meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 12px;
        font-size: ${fontSecondary};
        color: var(--secondary-text-color);
      }
      .detail__meta a {
        color: var(--primary-color);
        text-decoration: none;
      }
      .detail__meta a:hover {
        text-decoration: underline;
      }
      .assignee {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        --mdc-icon-size: 16px;
      }
      .footer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 4px 12px;
        margin-top: 6px;
        font-size: ${fontSecondary};
        color: var(--secondary-text-color);
      }
      .more {
        padding: 4px 8px;
        margin-left: -8px;
        border-radius: 6px;
        color: var(--primary-color);
      }
      .more--static {
        padding: 4px 0;
        margin-left: 0;
        color: var(--secondary-text-color);
        cursor: default;
      }
      .footer a {
        color: var(--primary-color);
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }
    `,
  ];

  static getStubConfig(hass: HomeAssistant): Partial<YoutrackIssuesConfig> {
    const entry = Object.values(hass.entities).find(
      (candidate) =>
        candidate.platform === "youtrack" &&
        Array.isArray(hass.states[candidate.entity_id]?.attributes["issues"]),
    );
    return entry ? { entity: entry.entity_id } : {};
  }

  static getConfigElement(): HTMLElement {
    return document.createElement(`${ISSUES_CARD_TAG}-editor`);
  }

  private toggleIssue(id: string): void {
    const next = new Set(this.openIssues);
    if (!next.delete(id)) next.add(id);
    this.openIssues = next;
  }

  private badge(state: HassEntityState): TemplateResult | typeof nothing {
    const spec = this.config?.badge;
    if (!spec) return nothing;
    const { key, color } = typeof spec === "string" ? { key: spec, color: undefined } : spec;
    const raw = key === "count" ? state.state : state.attributes[key];
    const value = typeof raw === "string" || typeof raw === "number" ? String(raw).trim() : "";
    if (value === "" || value === "unknown" || value === "unavailable") return nothing;
    const css = color ? colorValue(color) : undefined;
    return html`<span class="badge ${css ? "badge--colored" : ""}" style=${css ? `--c: ${css}` : ""}
      >${value}</span
    >`;
  }

  private renderIssue(issue: IssueView): TemplateResult {
    const { hass, config } = this;
    const overrides = config?.colors;
    const open = this.openIssues.has(issue.id);
    const state = issue.state
      ? html`<span class="badge badge--colored" style="--c: ${stateColor(issue.state, overrides)}"
          >${issue.state}</span
        >`
      : nothing;
    const idCell = issue.url
      ? html`<a class="issue__id" href=${issue.url} target="_blank" rel="noopener noreferrer"
          >${issue.id}</a
        >`
      : html`<span class="issue__id">${issue.id}</span>`;
    return html`<div
      class="issue ${open ? "issue--open" : ""}"
      style="--p: ${issue.priority ? priorityColor(issue.priority, overrides) : "var(--divider-color)"}"
    >
      <div class="issue__row">
        ${idCell}
        <button
          class="issue__toggle"
          aria-expanded=${open ? "true" : "false"}
          @click=${() => this.toggleIssue(issue.id)}
        >
          <span class="issue__summary">${issue.summary}</span>
          ${state}
          <span class="issue__chevron" aria-hidden="true">▸</span>
        </button>
      </div>
      ${
        open
          ? html`<div class="detail">
              <div class="detail__summary">${issue.summary}</div>
              <div class="detail__meta">
                ${
                  issue.priority
                    ? html`<span
                        class="badge badge--colored"
                        style="--c: ${priorityColor(issue.priority, overrides) === "var(--divider-color)" ? "var(--secondary-text-color)" : priorityColor(issue.priority, overrides)}"
                        >${hass ? t(hass, "priority") : "Priority"}: ${issue.priority}</span
                      >`
                    : nothing
                }
                ${
                  issue.assignee
                    ? html`<span class="assignee"
                        ><ha-icon icon="mdi:account-outline"></ha-icon>${issue.assignee}</span
                      >`
                    : nothing
                }
                ${
                  issue.url
                    ? html`<a href=${issue.url} target="_blank" rel="noopener noreferrer"
                        >${hass ? t(hass, "open_issue") : "Open issue"} ↗</a
                      >`
                    : nothing
                }
              </div>
            </div>`
          : nothing
      }
    </div>`;
  }

  private renderFooter(
    listed: IssueView[],
    total: number,
    max: number,
    query: unknown,
  ): TemplateResult | typeof nothing {
    const { hass, config } = this;
    if (!hass || !config) return nothing;
    const expandable = config.expandable !== false;
    const canToggle = expandable && listed.length > max;
    const beyond = Math.max(0, total - listed.length);
    const hidden = this.showAll ? beyond : Math.max(0, total - max);
    if (hidden === 0 && !(canToggle && this.showAll)) return nothing;
    const more = t(hass, "more");
    const url = beyond > 0 ? searchUrl(listed, query) : undefined;
    const label = this.showAll ? t(hass, "show_less") : `+${hidden} ${more}`;
    return html`<div class="footer">
      ${
        canToggle
          ? html`<button
              class="more"
              aria-expanded=${this.showAll ? "true" : "false"}
              @click=${() => {
                this.showAll = !this.showAll;
              }}
            >
              ${label}
            </button>`
          : html`<span class="more more--static">+${hidden} ${more}</span>`
      }
      ${this.showAll && beyond > 0 && canToggle ? html`<span>+${beyond} ${more}</span>` : nothing}
      ${
        url
          ? html`<a href=${url} target="_blank" rel="noopener noreferrer"
              >${t(hass, "open_in_youtrack")} ↗</a
            >`
          : nothing
      }
    </div>`;
  }

  protected renderContent(): TemplateResult {
    const { hass, config } = this;
    if (!hass || !config) return html``;
    const state = hass.states[config.entity];
    if (!state) return this.renderMessage("entity_not_found", true);
    if (!Array.isArray(state.attributes["issues"])) return this.renderMessage("no_issue_list");

    const listed = toIssueViews(state.attributes);
    const max = config.max_items ?? DEFAULT_MAX_ITEMS;
    const total = Math.max(parseNumber(state.state) ?? 0, listed.length);
    const visible = this.showAll ? listed : listed.slice(0, max);
    const title = config.name?.trim() || defaultTitle(hass, config.entity, state);
    const badge = this.badge(state);

    return html`<ha-card>
      ${
        config.show_title === false
          ? badge === nothing
            ? nothing
            : html`<div class="header header--badge-only">${badge}</div>`
          : html`<div class="header">
              <div class="title"><span class="name">${title}</span></div>
              ${badge}
            </div>`
      }
      ${
        visible.length === 0
          ? html`<div class="message">${t(hass, "no_issues")}</div>`
          : html`<div class="issues">${visible.map((issue) => this.renderIssue(issue))}</div>`
      }
      ${this.renderFooter(listed, total, max, state.attributes["query"])}
    </ha-card>`;
  }
}

export const issuesCardDefinition: CardDefinition = {
  tag: ISSUES_CARD_TAG,
  ctor: YoutrackIssuesCard,
  editorTag: `${ISSUES_CARD_TAG}-editor`,
  editorCtor: YoutrackIssuesEditor,
  name: "YouTrack issues",
  description: "The issues of a YouTrack query sensor, with coloured states and priorities.",
};
