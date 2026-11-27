import { css, html, nothing, type TemplateResult } from "lit";
import { HocBaseCard, type BaseConfig } from "../../../core/base-card";
import { parseNumber } from "../../../core/format";
import { t } from "../../../core/i18n";
import { statusDot } from "../../../core/parts";
import { findAccountDevice, listDevices, resolveDeviceEntities } from "../../../core/resolver";
import type { HomeAssistant } from "../../../core/types";
import type { CardDefinition } from "../../../registry";
import { PLATFORM } from "../repo/card";
import { GithubAttentionEditor } from "./editor";

export const ATTENTION_CARD_TAG = "hoc-github-attention-card";

export interface GithubAttentionConfig extends BaseConfig {
  device?: string;
  repositories?: string[] | "all";
  show_when_clean?: boolean;
}

export interface Attention {
  failingRepos: string[];
  reviewRequests: number;
  stalePullRequests: number;
}

const FAILING = new Set(["failure", "error"]);

export function collectAttention(
  hass: HomeAssistant,
  config: Partial<GithubAttentionConfig>,
): Attention {
  const account = config.device ?? findAccountDevice(hass, PLATFORM);
  const wanted =
    config.repositories === undefined ||
    config.repositories === "all" ||
    config.repositories.length === 0
      ? null
      : new Set(config.repositories);

  const failingRepos = listDevices(hass, PLATFORM)
    .filter((device) => device.id !== account && (wanted === null || wanted.has(device.id)))
    .filter((device) => {
      const state = resolveDeviceEntities(hass, device.id, PLATFORM)["ci_state"]?.state;
      return state !== undefined && FAILING.has(state);
    })
    .map((device) => device.name);

  const entities = account ? resolveDeviceEntities(hass, account, PLATFORM) : {};
  return {
    failingRepos,
    reviewRequests: parseNumber(entities["review_requests"]?.state) ?? 0,
    stalePullRequests: parseNumber(entities["stale_pull_requests"]?.state) ?? 0,
  };
}

export class GithubAttentionCard extends HocBaseCard<GithubAttentionConfig> {
  static override styles = [
    ...HocBaseCard.styles,
    css`
      .item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 2px 0;
        color: var(--primary-text-color);
      }
      .item__label {
        color: var(--secondary-text-color);
      }
    `,
  ];

  static getConfigElement(): HTMLElement {
    return document.createElement(`${ATTENTION_CARD_TAG}-editor`);
  }

  protected renderContent(): TemplateResult | typeof nothing {
    const { hass, config } = this;
    if (!hass || !config) return nothing;
    const attention = collectAttention(hass, config);
    const clean =
      attention.failingRepos.length === 0 &&
      attention.reviewRequests === 0 &&
      attention.stalePullRequests === 0;

    if (clean) {
      return config.show_when_clean === false ? nothing : this.renderMessage("all_clear");
    }

    return html`<ha-card>
      ${
        attention.failingRepos.length > 0
          ? html`<div class="item">
              ${statusDot("failure")}
              <span class="item__label">${t(hass, "failing_ci")}</span>
              <span>${attention.failingRepos.join(", ")}</span>
            </div>`
          : nothing
      }
      ${
        attention.reviewRequests > 0
          ? html`<div class="item">
              <span class="item__label">${t(hass, "review_requests")}</span>
              <span>${attention.reviewRequests}</span>
            </div>`
          : nothing
      }
      ${
        attention.stalePullRequests > 0
          ? html`<div class="item">
              <span class="item__label">${t(hass, "stale_pull_requests")}</span>
              <span>${attention.stalePullRequests}</span>
            </div>`
          : nothing
      }
    </ha-card>`;
  }
}

export const attentionCardDefinition: CardDefinition = {
  tag: ATTENTION_CARD_TAG,
  ctor: GithubAttentionCard,
  editorTag: `${ATTENTION_CARD_TAG}-editor`,
  editorCtor: GithubAttentionEditor,
  name: "GitHub attention",
  description: "Only what needs attention: failing CI, review requests, stale pull requests.",
};
