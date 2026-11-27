import { css } from "lit";

/** The card header shared by the cards: title with optional dot, and a badge on the far side. */
export const headerStyles = css`
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .title {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }
  .badge {
    flex: none;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 0.85em;
    color: var(--secondary-text-color);
    background: var(--secondary-background-color);
  }
  .badge--colored {
    color: var(--c);
    background: color-mix(in srgb, var(--c) 16%, transparent);
  }
  .name {
    font-weight: 500;
    color: var(--primary-text-color);
  }
  .name a {
    color: inherit;
    text-decoration: none;
  }
  .name a:hover {
    text-decoration: underline;
  }
`;
