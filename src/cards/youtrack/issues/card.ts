import { css, html, type TemplateResult } from "lit";
import { HocBaseCard, type BaseConfig } from "../../../core/base-card";
import type { CardDefinition } from "../../../registry";
import { YoutrackIssuesEditor } from "./editor";

export const ISSUES_CARD_TAG = "hoc-youtrack-issues-card";
const DEFAULT_MAX_ITEMS = 5;

export interface YoutrackIssuesConfig extends BaseConfig {
  entity: string;
  max_items?: number;
}

interface IssueView {
  id: string;
  summary: string;
  state: string;
  url: string | undefined;
}

function toIssueViews(attributes: Record<string, unknown>): IssueView[] {
  const raw = attributes["issues"];
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item): IssueView[] => {
    if (typeof item !== "object" || item === null) return [];
    const issue = item as Record<string, unknown>;
    if (typeof issue["id"] !== "string") return [];
    const url = typeof issue["url"] === "string" ? issue["url"] : undefined;
    return [
      {
        id: issue["id"],
        summary: typeof issue["summary"] === "string" ? issue["summary"] : "",
        state: typeof issue["state"] === "string" ? issue["state"] : "",
        url: url && /^https?:\/\//i.test(url) ? url : undefined,
      },
    ];
  });
}

export class YoutrackIssuesCard extends HocBaseCard<YoutrackIssuesConfig> {
  static override requiredKeys = ["entity"];

  static override styles = [
    ...HocBaseCard.styles,
    css`
      .issue {
        display: flex;
        gap: 8px;
        padding: 4px 0;
        color: var(--primary-text-color);
      }
      .issue__id {
        flex: none;
        color: var(--secondary-text-color);
      }
      .issue__summary {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      a {
        color: inherit;
        text-decoration: none;
      }
    `,
  ];

  static getConfigElement(): HTMLElement {
    return document.createElement(`${ISSUES_CARD_TAG}-editor`);
  }

  protected renderContent(): TemplateResult {
    const { hass, config } = this;
    if (!hass || !config) return html``;
    const state = hass.states[config.entity];
    if (!state) return this.renderMessage("entity_not_found", true);

    const issues = toIssueViews(state.attributes).slice(0, config.max_items ?? DEFAULT_MAX_ITEMS);
    if (issues.length === 0) return this.renderMessage("no_issues");

    return html`<ha-card>
      ${issues.map(
        (issue) =>
          html`<div class="issue">
            ${
              issue.url
                ? html`<a
                    class="issue__id"
                    href=${issue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    >${issue.id}</a
                  >`
                : html`<span class="issue__id">${issue.id}</span>`
            }
            <span class="issue__summary">${issue.summary}</span>
            <span>${issue.state}</span>
          </div>`,
      )}
    </ha-card>`;
  }
}

export const issuesCardDefinition: CardDefinition = {
  tag: ISSUES_CARD_TAG,
  ctor: YoutrackIssuesCard,
  editorTag: `${ISSUES_CARD_TAG}-editor`,
  editorCtor: YoutrackIssuesEditor,
  name: "YouTrack issues",
  description: "The first issues of a YouTrack query sensor.",
};
