import { css, html, nothing, type TemplateResult } from "lit";
import { HocBaseCard, type BaseConfig } from "../../../core/base-card";
import { formatCount, parseNumber, trend } from "../../../core/format";
import { t, type LocaleKey } from "../../../core/i18n";
import { statTile, trendArrow } from "../../../core/parts";
import { findAccountDevice, resolveDeviceEntities } from "../../../core/resolver";
import type { CardDefinition } from "../../../registry";
import { PLATFORM } from "../repo/card";
import { GithubProfileEditor } from "./editor";

export const PROFILE_CARD_TAG = "hoc-github-profile-card";

export interface GithubProfileConfig extends BaseConfig {
  device?: string;
}

interface Tile {
  key: string;
  label: LocaleKey;
  format: (state: string) => string;
  unit?: string;
}

const TILES: Tile[] = [
  { key: "current_streak", label: "current_streak", format: formatCount, unit: "d" },
  { key: "longest_streak", label: "longest_streak", format: formatCount, unit: "d" },
  { key: "top_language", label: "top_language", format: (state) => state },
];

export class GithubProfileCard extends HocBaseCard<GithubProfileConfig> {
  static override styles = [
    ...HocBaseCard.styles,
    css`
      .title {
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .headline {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin: 8px 0 12px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
        gap: 12px;
      }
    `,
  ];

  static getConfigElement(): HTMLElement {
    return document.createElement(`${PROFILE_CARD_TAG}-editor`);
  }

  protected renderContent(): TemplateResult {
    const { hass, config } = this;
    if (!hass || !config) return html``;
    const deviceId = config.device ?? findAccountDevice(hass, PLATFORM);
    const device = deviceId ? hass.devices[deviceId] : undefined;
    if (!deviceId || !device) return this.renderMessage("device_not_found", true);

    const entities = resolveDeviceEntities(hass, deviceId, PLATFORM);
    const contributions = entities["contributions_this_month"]?.state;
    const change = entities["commits_vs_last_month"]?.state;

    return html`<ha-card>
      <div class="title">${device.name_by_user ?? device.name ?? deviceId}</div>
      <div class="headline">
        ${
          contributions !== undefined
            ? statTile(t(hass, "contributions"), formatCount(contributions))
            : nothing
        }
        ${change !== undefined ? trendArrow(trend(parseNumber(change))) : nothing}
      </div>
      <div class="grid">
        ${TILES.map((tile) => {
          const state = entities[tile.key]?.state;
          return state === undefined
            ? nothing
            : statTile(t(hass, tile.label), tile.format(state), tile.unit);
        })}
      </div>
    </ha-card>`;
  }
}

export const profileCardDefinition: CardDefinition = {
  tag: PROFILE_CARD_TAG,
  ctor: GithubProfileCard,
  editorTag: `${PROFILE_CARD_TAG}-editor`,
  editorCtor: GithubProfileEditor,
  name: "GitHub profile",
  description: "Your GitHub activity: contributions, trend, streaks and top language.",
};
