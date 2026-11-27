import { css, html, nothing, type TemplateResult } from "lit";
import { HocBaseCard, type BaseConfig } from "../../../core/base-card";
import { formatCount } from "../../../core/format";
import { t, type LocaleKey } from "../../../core/i18n";
import { statTile } from "../../../core/parts";
import { resolveDeviceEntities } from "../../../core/resolver";
import type { CardDefinition } from "../../../registry";
import { YoutrackProjectEditor } from "./editor";

export const YOUTRACK_PLATFORM = "youtrack";
export const PROJECT_CARD_TAG = "hoc-youtrack-project-card";

export interface YoutrackProjectConfig extends BaseConfig {
  device: string;
}

const COUNTS: LocaleKey[] = [
  "issues_open",
  "issues_overdue",
  "issues_critical_open",
  "issues_created_7d",
  "issues_resolved_7d",
];

export class YoutrackProjectCard extends HocBaseCard<YoutrackProjectConfig> {
  static override requiredKeys = ["device"];

  static override styles = [
    ...HocBaseCard.styles,
    css`
      .alert {
        border-left: 4px solid var(--error-color);
      }
      .title {
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
    return document.createElement(`${PROJECT_CARD_TAG}-editor`);
  }

  protected renderContent(): TemplateResult {
    const { hass, config } = this;
    if (!hass || !config) return html``;
    const device = hass.devices[config.device];
    if (!device) return this.renderMessage("device_not_found", true);

    const entities = resolveDeviceEntities(hass, config.device, YOUTRACK_PLATFORM);
    const alert =
      entities["has_overdue"]?.state === "on" || entities["has_critical_open"]?.state === "on";

    return html`<ha-card class=${alert ? "alert" : ""}>
      <div class="title">${device.name_by_user ?? device.name ?? config.device}</div>
      <div class="grid">
        ${COUNTS.map((key) => {
          const state = entities[key]?.state;
          return state === undefined ? nothing : statTile(t(hass, key), formatCount(state));
        })}
      </div>
    </ha-card>`;
  }
}

export const projectCardDefinition: CardDefinition = {
  tag: PROJECT_CARD_TAG,
  ctor: YoutrackProjectCard,
  editorTag: `${PROJECT_CARD_TAG}-editor`,
  editorCtor: YoutrackProjectEditor,
  name: "YouTrack project",
  description:
    "Issue counts of one YouTrack project, with an accent for overdue or critical issues.",
};
