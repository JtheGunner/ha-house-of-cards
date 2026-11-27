import { css, html, nothing, type TemplateResult } from "lit";
import { HocBaseCard, type BaseConfig } from "./base-card";
import {
  accentColor,
  buildFieldViews,
  parseField,
  type FieldConfig,
  type FieldView,
} from "./fields";
import { fieldStyles, fieldTile } from "./parts/field-tile";
import { statusDot } from "./parts";
import { resolveDeviceEntities, type ResolvedEntities } from "./resolver";

export type FieldsLayout = "compact" | "standard" | "detailed" | "list";

export interface FieldsConfig extends BaseConfig {
  device?: string;
  fields?: FieldConfig[];
  layout?: FieldsLayout;
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
        gap: 8px;
      }
      .name {
        flex: 1;
        font-weight: 500;
        color: var(--primary-text-color);
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

    const name = device.name_by_user ?? device.name ?? deviceId;
    const entities = resolveDeviceEntities(hass, deviceId, this.platform);
    const layout = config.layout ?? "standard";
    const specs = (config.fields ?? this.defaultFields(layout, entities)).map(parseField);
    const views = buildFieldViews(hass, entities, specs, name);

    const statusViews = buildFieldViews(
      hass,
      entities,
      this.statusKeys.map((key) => ({ key })),
      name,
    );
    const accent = accentColor(statusViews);
    const alert = statusViews.some((view) => view.tone === "failure");
    const dotState = this.dotKey ? entities[this.dotKey]?.state : undefined;

    return html`<ha-card
      class=${alert ? "alert" : ""}
      style=${accent ? `--hoc-accent: ${accent}` : ""}
    >
      <div class="header">
        ${dotState !== undefined ? statusDot(dotState) : nothing}
        <span class="name">${name}</span>
      </div>
      ${this.renderFields(views, layout)}
    </ha-card>`;
  }
}
