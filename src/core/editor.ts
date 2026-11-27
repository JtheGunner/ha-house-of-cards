import { html, LitElement, nothing, type TemplateResult } from "lit";
import type { BaseConfig } from "./base-card";
import { editorLabel, t, type LocaleKey } from "./i18n";
import { discoverFieldOptions, type FieldConfig, type FieldOption } from "./fields";
import type { HomeAssistant } from "./types";

export interface FormSchemaItem {
  name: string;
  selector: Record<string, unknown>;
  required?: boolean;
}

export function deviceSelector(integration: string, name = "device"): FormSchemaItem {
  return { name, selector: { device: { integration } } };
}

/** A dropdown whose values are labelled `<prefix>_<value>` in the Home Assistant language. */
export function choiceSelector(
  hass: HomeAssistant | undefined,
  prefix: string,
  values: string[],
  name: string,
): FormSchemaItem {
  const options = values.map((value) => ({
    value,
    label: hass ? t(hass, `${prefix}_${value}` as LocaleKey) : value,
  }));
  return { name, selector: { select: { mode: "dropdown", options } } };
}

export function layoutSelector(
  hass: HomeAssistant | undefined,
  options: string[],
  name = "layout",
): FormSchemaItem {
  return choiceSelector(hass, "layout", options, name);
}

export function fieldsSelectorFromOptions(
  hass: HomeAssistant | undefined,
  options: FieldOption[],
  name = "fields",
  withAlign = false,
): FormSchemaItem {
  const label = (key: string) => (hass ? editorLabel(hass, key) : key);
  const alignOptions = ["left", "center", "right"].map((value) => ({
    value,
    label: hass ? t(hass, `align_${value}` as LocaleKey) : value,
  }));
  return {
    name,
    selector: {
      object: {
        multiple: true,
        label_field: "key",
        fields: {
          key: {
            label: label("sensor"),
            required: true,
            selector: { select: { mode: "dropdown", custom_value: true, options } },
          },
          name: { label: label("name"), selector: { text: {} } },
          icon: { label: label("icon"), selector: { icon: {} } },
          color: { label: label("color"), selector: { ui_color: {} } },
          ...(withAlign
            ? {
                title_color: { label: label("title_color"), selector: { ui_color: {} } },
                align: {
                  label: label("align"),
                  selector: { select: { mode: "dropdown", options: alignOptions } },
                },
              }
            : {}),
        },
      },
    },
  };
}

export function fieldsSelector(
  hass: HomeAssistant | undefined,
  deviceId: string | undefined,
  name = "fields",
): FormSchemaItem {
  const options = hass && deviceId ? discoverFieldOptions(hass, deviceId) : [];
  return fieldsSelectorFromOptions(hass, options, name);
}

function toFormEntry(item: FieldConfig): Record<string, unknown> {
  if (typeof item === "string") return { key: item };
  const { attribute, ...rest } = item;
  return attribute ? { ...rest, key: `${item.key}:${attribute}` } : { ...rest };
}

function cleanEntries(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];
    const kept = Object.fromEntries(
      Object.entries(entry).filter(([, v]) => v !== undefined && v !== null && v !== ""),
    );
    return typeof kept["key"] === "string" ? [kept] : [];
  });
}

export abstract class HocBaseEditor<C extends BaseConfig> extends LitElement {
  static override properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  declare hass: HomeAssistant | undefined;
  declare config: C | undefined;

  setConfig(config: C): void {
    this.config = config;
  }

  /** Names of options that hold a list of fields; they are edited as objects and dropped when empty. */
  protected fieldListNames: string[] = [];

  protected abstract schema(): FormSchemaItem[];

  private formData(): Record<string, unknown> {
    const data: Record<string, unknown> = { ...(this.config as object) };
    for (const name of this.fieldListNames) {
      const list = data[name];
      if (Array.isArray(list)) data[name] = (list as FieldConfig[]).map(toFormEntry);
    }
    return data;
  }

  protected computeLabel = (item: FormSchemaItem): string =>
    this.hass ? editorLabel(this.hass, item.name) : item.name;

  protected valueChanged(event: CustomEvent<{ value: C }>): void {
    event.stopPropagation();
    const config = { ...this.config, ...event.detail.value } as Record<string, unknown>;
    for (const name of this.fieldListNames) {
      if (!(name in config)) continue;
      const entries = cleanEntries(config[name]);
      if (entries.length > 0) config[name] = entries;
      else delete config[name];
    }
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.config) return nothing;
    return html`<ha-form
      .hass=${this.hass}
      .data=${this.formData()}
      .schema=${this.schema()}
      .computeLabel=${this.computeLabel}
      @value-changed=${this.valueChanged}
    ></ha-form>`;
  }
}
