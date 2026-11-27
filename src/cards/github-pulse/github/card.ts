import { HocFieldsCard, type FieldsConfig, type FieldsLayout } from "../../../core/fields-card";
import type { FieldConfig } from "../../../core/fields";
import { isMissing } from "../../../core/format";
import { findAccountDevices, listDevices, type ResolvedEntities } from "../../../core/resolver";
import type { HomeAssistant } from "../../../core/types";
import type { CardDefinition } from "../../../registry";
import { GithubEditor } from "./editor";

export const PLATFORM = "github_pulse";
export const GITHUB_CARD_TAG = "hoc-github-card";

export interface GithubConfig extends FieldsConfig {
  device: string;
  /** Show the latest release version on the far side of the header. Off by default. */
  show_release?: boolean;
}

const STANDARD: FieldConfig[] = [
  "stars",
  "forks",
  "open_issues",
  "open_pull_requests",
  { key: "commits_this_month", trend: "commits_vs_last_month" },
  "latest_release",
];

const REPOSITORY_FIELDS: Record<FieldsLayout, FieldConfig[]> = {
  compact: ["stars", "latest_release"],
  standard: STANDARD,
  list: STANDARD,
};

const PROFILE: FieldConfig[] = [
  { key: "contributions_this_month", trend: "commits_vs_last_month" },
  "current_streak",
  "longest_streak",
  "top_language",
];

const PROFILE_FIELDS: Record<FieldsLayout, FieldConfig[]> = {
  compact: ["contributions_this_month", "current_streak"],
  standard: PROFILE,
  list: PROFILE,
};

/** Only the account device has this sensor. */
const ACCOUNT_MARKER = "contributions_this_month";

export class GithubCard extends HocFieldsCard<GithubConfig> {
  static override requiredKeys = ["device"];

  protected get platform(): string {
    return PLATFORM;
  }

  protected override get dotKey(): string {
    return "ci_state";
  }

  protected override headerBadge(entities: ResolvedEntities): string | undefined {
    if (this.config?.show_release !== true) return undefined;
    const state = entities["latest_release"]?.state;
    return state === undefined || isMissing(state) ? undefined : state;
  }

  protected defaultFields(layout: FieldsLayout, entities: ResolvedEntities): FieldConfig[] {
    return (ACCOUNT_MARKER in entities ? PROFILE_FIELDS : REPOSITORY_FIELDS)[layout];
  }

  static getStubConfig(hass: HomeAssistant): Partial<GithubConfig> {
    const accounts = new Set(findAccountDevices(hass, PLATFORM));
    const devices = listDevices(hass, PLATFORM);
    const first = devices.find((device) => !accounts.has(device.id)) ?? devices[0];
    return first ? { device: first.id } : {};
  }

  static getConfigElement(): HTMLElement {
    return document.createElement(`${GITHUB_CARD_TAG}-editor`);
  }
}

export const githubCardDefinition: CardDefinition = {
  tag: GITHUB_CARD_TAG,
  ctor: GithubCard,
  editorTag: `${GITHUB_CARD_TAG}-editor`,
  editorCtor: GithubEditor,
  name: "GitHub repository or profile",
  description:
    "A GitHub Pulse repository or your GitHub profile, with colourful, selectable fields.",
};
