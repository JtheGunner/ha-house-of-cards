import { css, html, nothing, type TemplateResult } from "lit";
import { HocBaseCard, type BaseConfig } from "../../../core/base-card";
import {
  buildFieldViews,
  fieldId,
  humanize,
  parseField,
  type FieldConfig,
  type FieldSpec,
  type FieldView,
} from "../../../core/fields";
import { t } from "../../../core/i18n";
import { statusDot, trendArrow } from "../../../core/parts";
import { findAccountDevices, listDevices, resolveDeviceEntities } from "../../../core/resolver";
import type { CardDefinition } from "../../../registry";
import { PLATFORM } from "../repo/card";
import { GithubReposEditor } from "./editor";

export const REPOS_CARD_TAG = "hoc-github-repos-card";

export const DEFAULT_COLUMNS: FieldConfig[] = [
  "ci_state",
  "stars",
  { key: "commits_this_month", trend: "commits_vs_last_month" },
  "latest_release",
];

export interface GithubReposConfig extends BaseConfig {
  repositories?: string[] | "all";
  /** Sensors or `sensor:attribute` entries, like `fields` of the other cards. */
  columns?: FieldConfig[];
  sort_by?: string;
  sort_order?: "asc" | "desc";
  max_height?: number;
}

interface Row {
  id: string;
  name: string;
  views: Map<string, FieldView>;
}

function sortValue(row: Row, column: string): number | string | null {
  if (column === "name") return row.name;
  return row.views.get(column)?.raw ?? null;
}

function compareRows(a: Row, b: Row, column: string, direction: 1 | -1): number {
  const left = sortValue(a, column);
  const right = sortValue(b, column);
  if (left === null && right === null) return a.name.localeCompare(b.name);
  if (left === null) return 1;
  if (right === null) return -1;
  let order: number;
  if (typeof left === "number" && typeof right === "number") order = left - right;
  else if (typeof left === "number") order = -1;
  else if (typeof right === "number") order = 1;
  else order = left.localeCompare(right);
  return order === 0 ? a.name.localeCompare(b.name) : order * direction;
}

export class GithubReposCard extends HocBaseCard<GithubReposConfig> {
  static override styles = [
    ...HocBaseCard.styles,
    css`
      ha-card {
        overflow: hidden;
      }
      .scroll {
        overflow: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th {
        position: sticky;
        top: 0;
        background: var(--ha-card-background, var(--card-background-color));
        text-align: left;
        font-weight: 500;
        font-size: 0.8em;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--secondary-text-color);
      }
      th,
      td {
        padding: 8px 12px 8px 0;
      }
      tbody tr + tr td {
        border-top: 1px solid var(--divider-color);
      }
      .name {
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .cell {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .cell--tone {
        color: var(--c);
      }
      .cell__unit {
        font-size: 0.8em;
        font-weight: 400;
        color: var(--secondary-text-color);
      }
    `,
  ];

  static getConfigElement(): HTMLElement {
    return document.createElement(`${REPOS_CARD_TAG}-editor`);
  }

  private rows(specs: FieldSpec[]): Row[] {
    const { hass, config } = this;
    if (!hass || !config) return [];
    const accounts = new Set(findAccountDevices(hass, PLATFORM));
    const devices = listDevices(hass, PLATFORM).filter((device) => !accounts.has(device.id));
    const wanted =
      config.repositories === undefined ||
      config.repositories === "all" ||
      config.repositories.length === 0
        ? null
        : new Set(config.repositories);
    return devices
      .filter((device) => wanted === null || wanted.has(device.id))
      .map((device) => {
        const entities = resolveDeviceEntities(hass, device.id, PLATFORM);
        const views = buildFieldViews(hass, entities, specs, device.name);
        return {
          id: device.id,
          name: device.name,
          views: new Map(views.map((view) => [view.id, view])),
        };
      });
  }

  private renderCell(view: FieldView | undefined, spec: FieldSpec): TemplateResult {
    if (!view) return html`<td>—</td>`;
    if (spec.key === "ci_state" && !spec.attribute) {
      return html`<td>${statusDot(view.stateObj.state)}</td>`;
    }
    return html`<td>
      <span class="cell ${view.tone ? "cell--tone" : ""}" style="--c: ${view.color}"
        >${view.value}${view.unit ? html`<span class="cell__unit">${view.unit}</span>` : nothing}${
          view.trend ? trendArrow(view.trend) : nothing
        }</span
      >
    </td>`;
  }

  protected renderContent(): TemplateResult {
    const { hass, config } = this;
    if (!hass || !config) return html``;
    const specs = (config.columns?.length ? config.columns : DEFAULT_COLUMNS).map(parseField);
    const column = config.sort_by ?? "name";
    const direction = config.sort_order === "desc" ? -1 : 1;
    const rows = this.rows(specs).sort((a, b) => compareRows(a, b, column, direction));
    if (rows.length === 0) return this.renderMessage("no_repositories");

    const headers = specs.map((spec) => {
      const id = fieldId(spec);
      const label = rows
        .map((row) => row.views.get(id)?.label)
        .find((value) => value !== undefined);
      return spec.name ?? label ?? humanize(spec.key);
    });

    return html`<ha-card>
      <div class="scroll" style="max-height: ${config.max_height ?? 400}px">
        <table>
          <thead>
            <tr>
              <th>${t(hass, "repository")}</th>
              ${headers.map((header) => html`<th>${header}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${rows.map(
              (row) =>
                html`<tr>
                  <td class="name">${row.name}</td>
                  ${specs.map((spec) => this.renderCell(row.views.get(fieldId(spec)), spec))}
                </tr>`,
            )}
          </tbody>
        </table>
      </div>
    </ha-card>`;
  }
}

export const reposCardDefinition: CardDefinition = {
  tag: REPOS_CARD_TAG,
  ctor: GithubReposCard,
  editorTag: `${REPOS_CARD_TAG}-editor`,
  editorCtor: GithubReposEditor,
  name: "GitHub repositories",
  description: "Several GitHub Pulse repositories as a sortable table with selectable columns.",
};
