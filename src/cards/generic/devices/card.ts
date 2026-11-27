import { css, html, nothing, type TemplateResult } from "lit";
import {
  GestureTracker,
  isActionActive,
  resolveActionEntity,
  runAction,
  type ActionContext,
  type CardAction,
} from "../../../core/actions";
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
import { resolveLink } from "../../../core/link";
import { colorDot, statusDot, trendArrow } from "../../../core/parts";
import { fieldIcon } from "../../../core/parts/field-tile";
import { headerStyles } from "../../../core/parts/header";
import { fontSecondary } from "../../../core/parts/typography";
import { listPlatforms, PRESETS, presetOfDevice, selectDevices } from "../../../core/presets";
import { resolveDeviceEntities, type ResolvedEntities } from "../../../core/resolver";
import { evaluateStatus, type StatusRule } from "../../../core/status";
import type { HomeAssistant } from "../../../core/types";
import type { CardDefinition } from "../../../registry";
import { DevicesEditor } from "./editor";

export const DEVICES_CARD_TAG = "hoc-devices-card";
const GENERIC_COLUMN_COUNT = 4;

export interface DevicesConfig extends BaseConfig {
  /** The devices to list. Without any, every device of `platform` is listed. */
  devices?: string[];
  /** An integration whose devices are all listed, and whose defaults the columns follow. */
  platform?: string;
  /** Sensors or `sensor:attribute` entries, like `fields` of the device card. */
  columns?: FieldConfig[];
  sort_by?: string;
  sort_order?: "asc" | "desc";
  max_height?: number;
  /** A title above the table. Without one, the card has no header. */
  name?: string;
  /** Replaces the title of the name column, which is "Device". */
  device_title?: string;
  /** Show the part after the last `/` of a name, such as `repo` instead of `owner/repo`. */
  shorten_names?: boolean;
  /** What the column titles show. Defaults to `text`. */
  column_titles?: "text" | "icon" | "icon_text";
  /** A status dot before each name. Off by default. */
  show_status?: boolean;
  /** Rules for the dot; the first match wins. Replaces the integration's default. */
  status?: StatusRule[];
  /** Link each name: `device` for the device's page or `sensor:attribute` for a URL in an attribute. */
  link?: boolean | string;
  /** Runs when a name is tapped; replaces the link. `more-info` or `fire-dom-event` (a `browser_mod` popup). */
  tap_action?: CardAction;
  /** Runs when a name is held for half a second. */
  hold_action?: CardAction;
}

interface Row {
  id: string;
  url: string | undefined;
  /** Whether a tap and a hold on the name run an action. */
  tapActive: boolean;
  holdActive: boolean;
  name: string;
  statusColor: string | undefined;
  views: Map<string, FieldView>;
}

interface ActionTarget {
  entities: ResolvedEntities;
  defaultKey: string | undefined;
  deviceId: string;
  deviceName: string;
}

type Alignment = "left" | "center" | "right";

function actionContext(action: CardAction | undefined, target: ActionTarget): ActionContext {
  return {
    entityId: resolveActionEntity(action, target.entities, target.defaultKey),
    deviceId: target.deviceId,
    deviceName: target.deviceName,
  };
}

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

export class DevicesCard extends HocBaseCard<DevicesConfig> {
  static override styles = [
    ...HocBaseCard.styles,
    headerStyles,
    css`
      ha-card {
        overflow: hidden;
      }
      .header {
        margin-bottom: 4px;
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
        font-size: ${fontSecondary};
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
      td.name {
        font-weight: 500;
        color: var(--secondary-text-color);
      }
      .name__content {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .name__text a {
        color: inherit;
        text-decoration: none;
      }
      .name__text a:hover {
        text-decoration: underline;
      }
      .action {
        cursor: pointer;
        user-select: none;
        -webkit-touch-callout: none;
      }
      .action:hover {
        text-decoration: underline;
      }
      .action:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
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
        font-size: ${fontSecondary};
        font-weight: 400;
        color: var(--secondary-text-color);
      }
    `,
  ];

  static getConfigElement(): HTMLElement {
    return document.createElement(`${DEVICES_CARD_TAG}-editor`);
  }

  static getStubConfig(hass: HomeAssistant): Partial<DevicesConfig> {
    const known = Object.keys(PRESETS).find((platform) =>
      Object.values(hass.entities).some((entry) => entry.platform === platform && entry.device_id),
    );
    const first = known ?? listPlatforms(hass)[0]?.value;
    return first ? { platform: first } : {};
  }

  /** The latest action target of every row; gestures read it when they fire, not when they start. */
  private readonly targets = new Map<string, ActionTarget>();
  /** One tracker per device, kept across renders so a hold survives a state update. */
  private readonly trackers = new Map<string, GestureTracker>();

  private run(deviceId: string, action: CardAction | undefined): void {
    const target = this.targets.get(deviceId);
    if (target) runAction(this, action, actionContext(action, target));
  }

  private tracker(deviceId: string): GestureTracker {
    let tracker = this.trackers.get(deviceId);
    if (!tracker) {
      tracker = new GestureTracker(
        () => this.run(deviceId, this.config?.tap_action),
        () => this.run(deviceId, this.config?.hold_action),
      );
      this.trackers.set(deviceId, tracker);
    }
    return tracker;
  }

  private renderName(row: Row): TemplateResult | string {
    const link = row.url
      ? html`<a href=${row.url} target="_blank" rel="noopener noreferrer">${row.name}</a>`
      : row.name;
    if (!row.tapActive && !row.holdActive) return link;
    const tracker = this.tracker(row.id);
    // Only a tap action makes the name a button; with just a hold action it stays a link or plain text.
    return html`<span
      class=${row.tapActive ? "action" : "action action--hold"}
      role=${row.tapActive ? "button" : nothing}
      tabindex=${row.tapActive ? "0" : nothing}
      @pointerdown=${tracker.onPointerDown}
      @pointerup=${tracker.onPointerUp}
      @pointerleave=${tracker.onPointerLeave}
      @pointercancel=${tracker.onPointerCancel}
      @click=${tracker.onClick}
      @keydown=${row.tapActive ? tracker.onKeyDown : nothing}
      @contextmenu=${tracker.onContextMenu}
      >${link}</span
    >`;
  }

  private rows(specs: FieldSpec[]): Row[] {
    const { hass, config } = this;
    if (!hass || !config) return [];
    return selectDevices(hass, config.devices, config.platform).map((device) => {
      const preset = presetOfDevice(hass, device.id);
      const entities = resolveDeviceEntities(hass, device.id, preset?.platform);
      const views = buildFieldViews(hass, entities, specs, device.name);
      const rules = config.status?.length ? config.status : (preset?.rowStatus ?? []);
      const status = evaluateStatus(rules, entities);
      const target: ActionTarget = {
        entities,
        defaultKey: specs[0]?.key,
        deviceId: device.id,
        deviceName: device.name,
      };
      const tapActive = isActionActive(config.tap_action, actionContext(config.tap_action, target));
      const holdActive = isActionActive(
        config.hold_action,
        actionContext(config.hold_action, target),
      );
      this.targets.set(device.id, target);
      return {
        id: device.id,
        url: tapActive
          ? undefined
          : resolveLink(config.link, undefined, hass.devices[device.id], entities),
        tapActive,
        holdActive,
        statusColor: status.color,
        name:
          config.shorten_names === true
            ? (device.name.split("/").pop() ?? device.name)
            : device.name,
        views: new Map(views.map((view) => [view.id, view])),
      };
    });
  }

  /** The configured columns, else the integration's, else the first sensors of the first device. */
  private columnSpecs(): FieldSpec[] {
    const { hass, config } = this;
    if (!hass || !config) return [];
    if (config.columns?.length) return config.columns.map(parseField);
    const devices = selectDevices(hass, config.devices, config.platform);
    const first = devices[0];
    const preset = config.platform ? PRESETS[config.platform] : undefined;
    const known = preset ?? (first ? presetOfDevice(hass, first.id) : undefined);
    if (known) return known.columns.map(parseField);
    if (!first) return [];
    return Object.keys(resolveDeviceEntities(hass, first.id))
      .slice(0, GENERIC_COLUMN_COUNT)
      .map((key) => ({ key }));
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
    const specs = this.columnSpecs();
    const column = config.sort_by ?? "name";
    const direction = config.sort_order === "desc" ? -1 : 1;
    const rows = this.rows(specs).sort((a, b) => compareRows(a, b, column, direction));
    if (rows.length === 0) {
      return this.renderMessage(
        config.devices?.length || config.platform ? "no_devices" : "choose_devices",
      );
    }

    const titles = config.column_titles ?? "text";
    const aligns = specs.map((spec) => columnAlignment(spec, rows));
    const headers = specs.map((spec) => {
      const id = fieldId(spec);
      const view = rows
        .map((row) => row.views.get(id))
        .find((candidate) => candidate !== undefined);
      return {
        text: spec.name ?? view?.entityLabel ?? humanize(spec.key),
        icon: view ? fieldIcon(hass, spec.icon ? { ...view, icon: spec.icon } : view) : nothing,
        color: spec.title_color ? colorValue(spec.title_color) : undefined,
      };
    });

    const title = config.name?.trim();
    return html`<ha-card>
      ${
        title
          ? html`<div class="header">
              <div class="title"><span class="name">${title}</span></div>
            </div>`
          : nothing
      }
      <div class="scroll" style="max-height: ${config.max_height ?? 400}px">
        <table>
          <thead>
            <tr>
              <th>${config.device_title?.trim() || t(hass, "device")}</th>
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
                      >${config.show_status ? colorDot(row.statusColor) : nothing}<span
                        class="name__text"
                        >${this.renderName(row)}</span
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

export const devicesCardDefinition: CardDefinition = {
  tag: DEVICES_CARD_TAG,
  ctor: DevicesCard,
  editorTag: `${DEVICES_CARD_TAG}-editor`,
  editorCtor: DevicesEditor,
  name: "Devices",
  description:
    "Several devices as a sortable table with selectable columns. GitHub Pulse and YouTrack come with defaults.",
};
