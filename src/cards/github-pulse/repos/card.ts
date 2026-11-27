import { css, html, type TemplateResult } from "lit";
import { HocBaseCard, type BaseConfig } from "../../../core/base-card";
import { parseNumber, trend } from "../../../core/format";
import { t } from "../../../core/i18n";
import { statusDot, trendArrow } from "../../../core/parts";
import {
  findAccountDevice,
  listDevices,
  resolveDeviceEntities,
  type ResolvedEntities,
} from "../../../core/resolver";
import type { CardDefinition } from "../../../registry";
import { PLATFORM } from "../repo/card";
import { buildField, type FieldKey } from "../repo/fields";
import { GithubReposEditor } from "./editor";

export const REPOS_CARD_TAG = "hoc-github-repos-card";

export const COLUMN_KEYS = [
  "stars",
  "forks",
  "open_issues",
  "open_pull_requests",
  "commits_this_month",
  "commits_vs_last_month",
  "ci_state",
  "latest_release",
  "days_since_last_commit",
] as const satisfies readonly FieldKey[];

export type ColumnKey = (typeof COLUMN_KEYS)[number];

export const DEFAULT_COLUMNS: ColumnKey[] = [
  "ci_state",
  "stars",
  "commits_this_month",
  "latest_release",
];

export interface GithubReposConfig extends BaseConfig {
  repositories: string[] | "all";
  columns?: ColumnKey[];
  sort_by?: ColumnKey | "name";
  sort_order?: "asc" | "desc";
  max_height?: number;
}

interface Row {
  id: string;
  name: string;
  entities: ResolvedEntities;
}

const NO_VALUE = new Set(["unavailable", "unknown", ""]);
const TEXT_COLUMNS = new Set<string>(["ci_state", "latest_release"]);

function sortValue(row: Row, key: ColumnKey | "name"): number | string | null {
  if (key === "name") return row.name;
  const state = row.entities[key]?.state;
  if (state === undefined || NO_VALUE.has(state)) return null;
  return TEXT_COLUMNS.has(key) ? state : parseNumber(state);
}

function compareRows(a: Row, b: Row, key: ColumnKey | "name", direction: 1 | -1): number {
  const left = sortValue(a, key);
  const right = sortValue(b, key);
  if (left === null && right === null) return a.name.localeCompare(b.name);
  if (left === null) return 1;
  if (right === null) return -1;
  const order =
    typeof left === "number" && typeof right === "number"
      ? left - right
      : String(left).localeCompare(String(right));
  return order === 0 ? a.name.localeCompare(b.name) : order * direction;
}

export class GithubReposCard extends HocBaseCard<GithubReposConfig> {
  static override requiredKeys = ["repositories"];

  static override styles = [
    ...HocBaseCard.styles,
    css`
      .scroll {
        overflow: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th {
        text-align: left;
        font-weight: 400;
        font-size: 0.85em;
        color: var(--secondary-text-color);
      }
      th,
      td {
        padding: 6px 8px 6px 0;
      }
      .name {
        font-weight: 500;
        color: var(--primary-text-color);
      }
    `,
  ];

  static getConfigElement(): HTMLElement {
    return document.createElement(`${REPOS_CARD_TAG}-editor`);
  }

  private rows(): Row[] {
    const { hass, config } = this;
    if (!hass || !config) return [];
    const account = findAccountDevice(hass, PLATFORM);
    const devices = listDevices(hass, PLATFORM).filter((device) => device.id !== account);
    const wanted =
      config.repositories === "all" || config.repositories.length === 0
        ? null
        : new Set(config.repositories);
    return devices
      .filter((device) => wanted === null || wanted.has(device.id))
      .map((device) => ({
        id: device.id,
        name: device.name,
        entities: resolveDeviceEntities(hass, device.id, PLATFORM),
      }));
  }

  private renderCell(row: Row, key: ColumnKey): TemplateResult {
    const state = row.entities[key]?.state;
    if (state === undefined || NO_VALUE.has(state)) return html`<td>—</td>`;
    if (key === "ci_state") return html`<td>${statusDot(state)}</td>`;
    if (key === "commits_vs_last_month") {
      return html`<td>${trendArrow(trend(parseNumber(state)))}</td>`;
    }
    return html`<td>${buildField(row.entities, key)?.value ?? "—"}</td>`;
  }

  protected renderContent(): TemplateResult {
    const { hass, config } = this;
    if (!hass || !config) return html``;
    const columns = config.columns ?? DEFAULT_COLUMNS;
    const sortKey = config.sort_by ?? "name";
    const direction = config.sort_order === "desc" ? -1 : 1;
    const rows = this.rows().sort((a, b) => compareRows(a, b, sortKey, direction));
    if (rows.length === 0) return this.renderMessage("no_repositories");

    const maxHeight = config.max_height ?? 400;
    return html`<ha-card>
      <div class="scroll" style="max-height: ${maxHeight}px">
        <table>
          <thead>
            <tr>
              <th>${t(hass, "repository")}</th>
              ${columns.map((key) => html`<th>${t(hass, buildLabel(key))}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${rows.map(
              (row) =>
                html`<tr>
                  <td class="name">${row.name}</td>
                  ${columns.map((key) => this.renderCell(row, key))}
                </tr>`,
            )}
          </tbody>
        </table>
      </div>
    </ha-card>`;
  }
}

function buildLabel(key: ColumnKey) {
  const labels = {
    stars: "stars",
    forks: "forks",
    open_issues: "issues",
    open_pull_requests: "pull_requests",
    commits_this_month: "commits_this_month",
    commits_vs_last_month: "vs_last_month",
    ci_state: "ci",
    latest_release: "release",
    days_since_last_commit: "days_since_commit",
  } as const;
  return labels[key];
}

export const reposCardDefinition: CardDefinition = {
  tag: REPOS_CARD_TAG,
  ctor: GithubReposCard,
  editorTag: `${REPOS_CARD_TAG}-editor`,
  editorCtor: GithubReposEditor,
  name: "GitHub repositories",
  description: "Several GitHub Pulse repositories as a sortable table.",
};
