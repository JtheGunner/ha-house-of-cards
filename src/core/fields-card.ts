import { css, html, nothing, type TemplateResult } from "lit";
import { HocBaseCard, type BaseConfig } from "./base-card";
import {
  accentColor,
  buildFieldViews,
  colorValue,
  parseField,
  type FieldConfig,
  type FieldView,
} from "./fields";
import { fieldStyles, fieldTile } from "./parts/field-tile";
import { resolveLink } from "./link";
import { colorDot, statusDot } from "./parts";
import { resolveDeviceEntities, type ResolvedEntities } from "./resolver";
import { evaluateStatus, type Status, type StatusRule } from "./status";

export type FieldsLayout = "compact" | "standard" | "list";

export interface FieldsConfig extends BaseConfig {
  device?: string;
  fields?: FieldConfig[];
  layout?: FieldsLayout;
  /** Replaces the device name in the header. */
  name?: string;
  /** Link the title: `device` for the device's page, `sensor:attribute` for a URL in an attribute. */
  link?: boolean | string;
  /** Link the title to this https URL. Wins over `link`. */
  link_url?: string;
  /** A value shown as a coloured badge next to the title: a sensor, `sensor:attribute` or an object. */
  badge?: FieldConfig;
  /** Show the status dot and the accent edge. On by default. */
  show_status?: boolean;
  /** Rules that decide the status; the first match wins. Replaces the integration's default. */
  status?: StatusRule[];
}

function assertFields(fields: unknown): void {
  if (fields === undefined) return;
  const valid =
    Array.isArray(fields) &&
    fields.every(
      (item) =>
        typeof item === "string" ||
        (typeof item === "object" &&
          item !== null &&
          typeof (item as { key?: unknown }).key === "string"),
    );
  if (!valid) throw new Error("`fields` must be a list of sensor keys or objects with a `key`");
}

/**
 * A card that shows the chosen sensors and attributes of one device. Subclasses decide the
 * integration, the default fields and which sensors drive the status dot and the accent.
 */
export abstract class HocFieldsCard<C extends FieldsConfig> extends HocBaseCard<C> {
  static override styles = [
    ...HocBaseCard.styles,
    fieldStyles,
    css`
      ha-card {
        box-shadow: inset 0 3px 0 var(--hoc-accent, transparent);
        overflow: hidden;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .title {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .badge {
        flex: none;
        padding: 2px 10px;
        border-radius: 999px;
        font-size: 0.85em;
        color: var(--secondary-text-color);
        background: var(--secondary-background-color);
      }
      .badge--colored {
        color: var(--c);
        background: color-mix(in srgb, var(--c) 16%, transparent);
      }
      .name {
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .name a {
        color: inherit;
        text-decoration: none;
      }
      .name a:hover {
        text-decoration: underline;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 14px 12px;
        margin-top: 14px;
      }
      .inline-fields {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 14px;
        margin-top: 8px;
      }
      .rows {
        margin-top: 8px;
      }
    `,
  ];

  /** The status the card defines itself, or undefined to use the integration's default. */
  private customStatus(entities: ResolvedEntities): Status | undefined {
    const rules = this.config?.status;
    return rules?.length ? evaluateStatus(rules, entities) : undefined;
  }

  /** The integration whose entities this card reads; none means every entity of the device. */
  protected abstract get platform(): string | undefined;

  protected abstract defaultFields(layout: FieldsLayout, entities: ResolvedEntities): FieldConfig[];

  /** Sensor that drives the dot in the header. */
  protected get dotKey(): string | undefined {
    return undefined;
  }

  /** Sensors whose tone colours the card accent; they need not be shown as fields. */
  protected get statusKeys(): string[] {
    return this.dotKey ? [this.dotKey] : [];
  }

  protected deviceId(): string | undefined {
    return this.config?.device;
  }

  override setConfig(config: C): void {
    assertFields(config.fields);
    super.setConfig(config);
  }

  /** The badge on the far side of the header: the chosen value, optionally coloured. */
  private renderBadge(
    entities: ResolvedEntities,
    deviceName: string,
  ): TemplateResult | typeof nothing {
    const { hass, config } = this;
    if (!hass || !config?.badge) return nothing;
    const spec = parseField(config.badge);
    const [view] = buildFieldViews(hass, entities, [spec], deviceName);
    if (!view) return nothing;
    const color = spec.color ? colorValue(spec.color) : view.tone ? view.color : undefined;
    return html`<span
      class="badge ${color ? "badge--colored" : ""}"
      style=${color ? `--c: ${color}` : ""}
      title=${view.label}
      >${view.value}${view.unit ? ` ${view.unit}` : ""}</span
    >`;
  }

  private renderFields(views: FieldView[], layout: FieldsLayout): TemplateResult | typeof nothing {
    const { hass } = this;
    if (!hass || views.length === 0) return nothing;
    if (layout === "compact") {
      return html`<div class="inline-fields">
        ${views.map((view) => fieldTile(hass, view, "inline"))}
      </div>`;
    }
    if (layout === "list") {
      return html`<div class="rows">${views.map((view) => fieldTile(hass, view, "row"))}</div>`;
    }
    return html`<div class="grid">${views.map((view) => fieldTile(hass, view, "tile"))}</div>`;
  }

  protected renderContent(): TemplateResult {
    const { hass, config } = this;
    if (!hass || !config) return html``;
    const deviceId = this.deviceId();
    const device = deviceId ? hass.devices[deviceId] : undefined;
    if (!deviceId || !device) return this.renderMessage("device_not_found", true);

    const deviceName = device.name_by_user ?? device.name ?? deviceId;
    const name = config.name?.trim() || deviceName;
    const showStatus = config.show_status !== false;
    const entities = resolveDeviceEntities(hass, deviceId, this.platform);
    const layout: FieldsLayout =
      config.layout === "compact" || config.layout === "list" ? config.layout : "standard";
    const chosen = config.fields?.length ? config.fields : this.defaultFields(layout, entities);
    const views = buildFieldViews(hass, entities, chosen.map(parseField), deviceName);

    const statusViews = buildFieldViews(
      hass,
      entities,
      this.statusKeys.map((key) => ({ key })),
      deviceName,
    );
    const custom = showStatus ? this.customStatus(entities) : undefined;
    const accent = custom ? custom.color : showStatus ? accentColor(statusViews) : undefined;
    const alert = custom
      ? custom.tone === "failure"
      : statusViews.some((view) => view.tone === "failure");
    const linkTarget = resolveLink(config.link, config.link_url, device, entities);
    const dotState = this.dotKey ? entities[this.dotKey]?.state : undefined;
    const dot = !showStatus
      ? nothing
      : custom
        ? colorDot(custom.color)
        : dotState !== undefined
          ? statusDot(dotState)
          : nothing;

    const badge = this.renderBadge(entities, deviceName);

    return html`<ha-card
      class=${alert ? "alert" : ""}
      style=${accent ? `--hoc-accent: ${accent}` : ""}
    >
      <div class="header">
        <div class="title">
          ${dot}
          <span class="name"
            >${
              linkTarget
                ? html`<a href=${linkTarget} target="_blank" rel="noopener noreferrer">${name}</a>`
                : name
            }</span
          >
        </div>
        ${badge}
      </div>
      ${this.renderFields(views, layout)}
    </ha-card>`;
  }
}
