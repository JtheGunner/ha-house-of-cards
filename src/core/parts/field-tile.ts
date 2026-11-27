import { css, html, nothing, type TemplateResult } from "lit";
import type { FieldView } from "../fields";
import type { HomeAssistant } from "../types";
import { trendArrow } from "./index";

export type FieldDisplay = "tile" | "inline" | "row";

function fieldIcon(hass: HomeAssistant, view: FieldView): TemplateResult {
  if (view.icon) return html`<ha-icon icon=${view.icon}></ha-icon>`;
  if (view.attribute) return html`<ha-icon icon="mdi:information-outline"></ha-icon>`;
  return html`<ha-state-icon .hass=${hass} .stateObj=${view.stateObj}></ha-state-icon>`;
}

/** A field as a coloured icon chip with its value; `tile` and `row` also show the label. */
export function fieldTile(
  hass: HomeAssistant,
  view: FieldView,
  display: FieldDisplay = "tile",
): TemplateResult {
  const value = html`<span class="field__value"
      >${view.value}${view.unit ? html` <span class="field__unit">${view.unit}</span>` : nothing}</span
    >${view.trend ? trendArrow(view.trend) : nothing}`;
  return html`<div
    class="field field--${display} ${view.tone ? "field--tone" : ""}"
    style="--c: ${view.color}"
    title=${view.label}
  >
    <span class="chip">${fieldIcon(hass, view)}</span>
    ${
      display === "inline"
        ? html`<span class="field__text">${value}</span>`
        : html`<span class="field__text">
            <span class="field__main">${value}</span>
            <span class="field__label">${view.label}</span>
          </span>`
    }
  </div>`;
}

export const fieldStyles = css`
  .field {
    --c: var(--primary-color);
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
  .chip {
    flex: none;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    color: var(--c);
    background: color-mix(in srgb, var(--c) 16%, transparent);
    --mdc-icon-size: 20px;
  }
  .field__text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .field__main {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }
  .field__value {
    font-size: 1.15em;
    font-weight: 600;
    line-height: 1.2;
    color: var(--primary-text-color);
  }
  .field--tone .field__value {
    color: var(--c);
  }
  .field__unit {
    font-size: 0.7em;
    font-weight: 400;
    color: var(--secondary-text-color);
  }
  .field__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.8em;
    color: var(--secondary-text-color);
  }
  .field--inline .chip {
    width: 28px;
    height: 28px;
    --mdc-icon-size: 16px;
  }
  .field--row {
    padding: 4px 0;
  }
  .field--row .field__text {
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .field--row .field__main {
    order: 2;
  }
`;
