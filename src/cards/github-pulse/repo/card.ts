import { css, html, nothing, type TemplateResult } from "lit";
import { HocBaseCard, type BaseConfig } from "../../../core/base-card";
import { t } from "../../../core/i18n";
import { releaseBadge, statTile, statusDot, trendArrow } from "../../../core/parts";
import { resolveDeviceEntities } from "../../../core/resolver";
import type { CardDefinition } from "../../../registry";
import { GithubRepoEditor } from "./editor";
import { repoFields, type Layout } from "./fields";

export const PLATFORM = "github_pulse";
export const REPO_CARD_TAG = "hoc-github-repo-card";

export interface GithubRepoConfig extends BaseConfig {
  device: string;
  layout?: Layout;
}

export class GithubRepoCard extends HocBaseCard<GithubRepoConfig> {
  static override requiredKeys = ["device"];

  static override styles = [
    ...HocBaseCard.styles,
    css`
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
        grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
        gap: 12px;
        margin-top: 12px;
      }
    `,
  ];

  static getConfigElement(): HTMLElement {
    return document.createElement(`${REPO_CARD_TAG}-editor`);
  }

  protected renderContent(): TemplateResult {
    const { hass, config } = this;
    if (!hass || !config) return html``;
    const device = hass.devices[config.device];
    if (!device) return this.renderMessage("device_not_found", true);

    const layout = config.layout ?? "standard";
    const entities = resolveDeviceEntities(hass, config.device, PLATFORM);
    const fields = repoFields(entities, layout);
    const ci = entities["ci_state"];
    const release = entities["latest_release"]?.state;
    const name = device.name_by_user ?? device.name ?? config.device;

    if (layout === "compact") {
      const stars = fields.find((field) => field.key === "stars");
      return html`<ha-card>
        <div class="header">
          ${ci ? statusDot(ci.state) : nothing}
          <span class="name">${name}</span>
          ${stars ? html`<span>★ ${stars.value}</span>` : nothing} ${releaseBadge(release)}
        </div>
      </ha-card>`;
    }

    return html`<ha-card>
      <div class="header">
        ${ci ? statusDot(ci.state) : nothing}
        <span class="name">${name}</span>
        ${releaseBadge(release)}
      </div>
      <div class="grid">
        ${fields.map(
          (field) =>
            html`<div>
              ${statTile(t(hass, field.label), field.value, field.unit)}
              ${field.trend ? trendArrow(field.trend) : nothing}
            </div>`,
        )}
      </div>
    </ha-card>`;
  }
}

export const repoCardDefinition: CardDefinition = {
  tag: REPO_CARD_TAG,
  ctor: GithubRepoCard,
  editorTag: `${REPO_CARD_TAG}-editor`,
  editorCtor: GithubRepoEditor,
  name: "GitHub repository",
  description: "One GitHub Pulse repository: CI state, stars, pull requests, commits and more.",
};
