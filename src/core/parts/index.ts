import { css, html, type TemplateResult } from "lit";
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

/** A dot in an explicit colour; neutral grey without one. */
export function colorDot(color: string | undefined): TemplateResult {
  return color
    ? html`<span class="dot" style="background: ${color}" aria-hidden="true"></span>`
    : html`<span class="dot dot--neutral" aria-hidden="true"></span>`;
}

export function trendArrow(value: Trend): TemplateResult {
  const symbol = { up: "▲", down: "▼", flat: "▬" }[value.direction];
  const percent =
    value.direction !== "flat" && value.percent !== null
      ? ` ${Math.round(Math.abs(value.percent))} %`
      : "";
  return html`<span class="trend trend--${value.direction}">${symbol}${percent}</span>`;
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
`;
