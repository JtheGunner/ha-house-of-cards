import { css, html, nothing, type TemplateResult } from "lit";
import { HocBaseCard, type BaseConfig } from "../../../core/base-card";
import {
  buildFieldViews,
  colorValue,
  fieldId,
  humanize,
  parseField,
  type FieldConfig,
  type FieldSpec,
  type FieldView,
} from "../../../core/fields";
import { t } from "../../../core/i18n";
import { statusDot, trendArrow } from "../../../core/parts";
import { fieldIcon } from "../../../core/parts/field-tile";
import { findAccountDevices, listDevices, resolveDeviceEntities } from "../../../core/resolver";
import type { CardDefinition } from "../../../registry";
import { PLATFORM } from "../github/card";
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
  /** Show `repo` instead of `owner/repo`. Off by default. */
  hide_owner?: boolean;
  /** What the column titles show. Defaults to `text`. */
  column_titles?: "text" | "icon" | "icon_text";
  /** A dot before each name: green when the repository had commits this month, grey otherwise. */
  show_activity?: boolean;
}

interface Row {
  id: string;
  name: string;
  commits: string | undefined;
  views: Map<string, FieldView>;
}

type Alignment = "left" | "center" | "right";

/** An explicit `align` wins; otherwise a column of only numbers aligns right and anything else left. */
function columnAlignment(spec: FieldSpec, rows: Row[]): Alignment {
  if (spec.align) return spec.align;
  if (spec.key === "ci_state" && !spec.attribute) return "left";
  const values = rows.flatMap((row) => row.views.get(fieldId(spec)) ?? []);
  return values.length > 0 && values.every((view) => typeof view.raw === "number")
    ? "right"
    : "left";
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
      .name__content {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .name__content .dot {
        flex: none;
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
          commits: entities["commits_this_month"]?.state,
          name:
            config.hide_owner === true
              ? (device.name.split("/").pop() ?? device.name)
              : device.name,
          views: new Map(views.map((view) => [view.id, view])),
        };
      });
  }

  private activityDot(row: Row): TemplateResult {
    const commits = Number(row.commits);
    return statusDot(commits > 0 ? "success" : undefined);
  }

  private renderCell(
    view: FieldView | undefined,
    spec: FieldSpec,
    align: Alignment,
  ): TemplateResult {
    const style = `text-align: ${align}`;
    if (!view) return html`<td style=${style}>—</td>`;
    if (spec.key === "ci_state" && !spec.attribute) {
      return html`<td style=${style}>${statusDot(view.stateObj.state)}</td>`;
    }
    return html`<td style=${style}>
      <span class="cell ${view.tone || spec.color ? "cell--tone" : ""}" style="--c: ${view.color}"
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

    const titles = config.column_titles ?? "text";
    const aligns = specs.map((spec) => columnAlignment(spec, rows));
    const headers = specs.map((spec) => {
      const id = fieldId(spec);
      const view = rows
        .map((row) => row.views.get(id))
        .find((candidate) => candidate !== undefined);
      return {
        text: spec.name ?? view?.label ?? humanize(spec.key),
        icon: view ? fieldIcon(hass, spec.icon ? { ...view, icon: spec.icon } : view) : nothing,
        color: spec.title_color ? colorValue(spec.title_color) : undefined,
      };
    });

    return html`<ha-card>
      <div class="scroll" style="max-height: ${config.max_height ?? 400}px">
        <table>
          <thead>
            <tr>
              <th>${t(hass, "repository")}</th>
              ${headers.map(
                (header, index) =>
                  html`<th
                    title=${header.text}
                    style=${[
                      `text-align: ${aligns[index] ?? "left"}`,
                      header.color ? `color: ${header.color}` : "",
                    ]
                      .filter(Boolean)
                      .join("; ")}
                  >
                    ${titles === "text" ? nothing : header.icon}${
                      titles === "icon" ? nothing : header.text
                    }
                  </th>`,
              )}
            </tr>
          </thead>
          <tbody>
            ${rows.map(
              (row) =>
                html`<tr>
                  <td class="name">
                    <span class="name__content"
                      >${config.show_activity ? this.activityDot(row) : nothing}<span
                        class="name__text"
                        >${row.name}</span
                      ></span
                    >
                  </td>
                  ${specs.map((spec, index) => this.renderCell(row.views.get(fieldId(spec)), spec, aligns[index] ?? "left"))}
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
