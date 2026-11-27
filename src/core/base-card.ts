import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { partsStyles } from "./parts";
import { t, type LocaleKey } from "./i18n";
import type { HomeAssistant } from "./types";

export interface BaseConfig {
  type: string;
}

export abstract class HocBaseCard<C extends BaseConfig> extends LitElement {
  static requiredKeys: string[] = [];

  static override properties = {
    hass: { attribute: false },
    config: { state: true },
  };

  static override styles = [
    partsStyles,
    css`
      ha-card {
        padding: 12px 16px;
      }
      .message {
        color: var(--secondary-text-color);
      }
      .message--error {
        color: var(--error-color);
      }
    `,
  ];

  declare hass: HomeAssistant | undefined;
  declare config: C | undefined;

  setConfig(config: C): void {
    const missing = (this.constructor as typeof HocBaseCard).requiredKeys.filter(
      (key) => (config as Record<string, unknown>)[key] === undefined,
    );
    if (missing.length > 0) throw new Error(`Missing required option: ${missing.join(", ")}`);
    this.config = config;
  }

  getCardSize(): number {
    return 3;
  }

  getGridOptions(): { columns: number; rows: "auto"; min_columns: number } {
    return { columns: 6, rows: "auto", min_columns: 3 };
  }

  protected abstract renderContent(): TemplateResult | typeof nothing | null;

  protected renderMessage(key: LocaleKey, error = false): TemplateResult {
    const message = this.hass ? t(this.hass, key) : key;
    return html`<ha-card
      ><div class="message ${error ? "message--error" : ""}">${message}</div></ha-card
    >`;
  }

  protected override render(): TemplateResult | typeof nothing | null {
    if (!this.config || !this.hass) return nothing;
    return this.renderContent();
  }
}
