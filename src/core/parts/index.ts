import { css, html, nothing, type TemplateResult } from "lit";
import type { Trend } from "../format";

export type DotTone = "success" | "failure" | "pending" | "neutral";

export function dotTone(state: string | undefined): DotTone {
  switch (state) {
    case "success":
      return "success";
    case "failure":
    case "error":
      return "failure";
    case "pending":
      return "pending";
    default:
      return "neutral";
  }
}

export function statusDot(state: string | undefined): TemplateResult {
  return html`<span class="dot dot--${dotTone(state)}" aria-hidden="true"></span>`;
}

export function trendArrow(value: Trend): TemplateResult {
  const symbol = { up: "▲", down: "▼", flat: "▬" }[value.direction];
  const percent =
    value.direction !== "flat" && value.percent !== null
      ? ` ${Math.round(Math.abs(value.percent))} %`
      : "";
  return html`<span class="trend trend--${value.direction}">${symbol}${percent}</span>`;
}

export function statTile(label: string, value: string, unit?: string): TemplateResult {
  return html`<div class="tile">
    <div class="tile__value">
      ${value}${unit ? html` <span class="tile__unit">${unit}</span>` : nothing}
    </div>
    <div class="tile__label">${label}</div>
  </div>`;
}

export function releaseBadge(tag: string | undefined): TemplateResult | typeof nothing {
  return tag ? html`<span class="badge">${tag}</span>` : nothing;
}

export const partsStyles = css`
  .dot {
    display: inline-block;
    width: 0.6em;
    height: 0.6em;
    border-radius: 50%;
    background: var(--disabled-text-color);
  }
  .dot--success {
    background: var(--success-color, var(--state-active-color));
  }
  .dot--failure {
    background: var(--error-color);
  }
  .dot--pending {
    background: var(--warning-color);
  }
  .trend {
    font-size: 0.85em;
    color: var(--secondary-text-color);
  }
  .trend--up {
    color: var(--success-color, var(--primary-text-color));
  }
  .trend--down {
    color: var(--error-color);
  }
  .tile__value {
    font-size: 1.2em;
    font-weight: 500;
    color: var(--primary-text-color);
  }
  .tile__unit,
  .tile__label {
    font-size: 0.8em;
    color: var(--secondary-text-color);
  }
  .badge {
    padding: 0 0.5em;
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--secondary-background-color);
    font-size: 0.85em;
    color: var(--secondary-text-color);
  }
`;
