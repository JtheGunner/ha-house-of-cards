import { html, LitElement, nothing, type TemplateResult } from "lit";
import type { BaseConfig } from "./base-card";
import { discoverFieldOptions } from "./fields";
import type { HomeAssistant } from "./types";

export interface FormSchemaItem {
  name: string;
  selector: Record<string, unknown>;
  required?: boolean;
}

export function deviceSelector(integration: string, name = "device"): FormSchemaItem {
  return { name, selector: { device: { integration } } };
}

export function layoutSelector(options: string[], name = "layout"): FormSchemaItem {
  return { name, selector: { select: { mode: "dropdown", options } } };
}

export function fieldsSelector(
  hass: HomeAssistant | undefined,
  deviceId: string | undefined,
  name = "fields",
): FormSchemaItem {
  const options = hass && deviceId ? discoverFieldOptions(hass, deviceId) : [];
  return {
    name,
    selector: { select: { multiple: true, mode: "list", custom_value: true, options } },
  };
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

  protected abstract schema(): FormSchemaItem[];

  protected computeLabel = (item: FormSchemaItem): string => item.name.replace(/_/g, " ");

  protected valueChanged(event: CustomEvent<{ value: C }>): void {
    event.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: { ...this.config, ...event.detail.value } },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.config) return nothing;
    return html`<ha-form
      .hass=${this.hass}
      .data=${this.config}
      .schema=${this.schema()}
      .computeLabel=${this.computeLabel}
      @value-changed=${this.valueChanged}
    ></ha-form>`;
  }
}
