import { HocFieldsCard, type FieldsConfig, type FieldsLayout } from "../../../core/fields-card";
import type { FieldConfig } from "../../../core/fields";
import { findAccountDevices, listDevices } from "../../../core/resolver";
import type { HomeAssistant } from "../../../core/types";
import type { CardDefinition } from "../../../registry";
import { GithubRepoEditor } from "./editor";

export const PLATFORM = "github_pulse";
export const REPO_CARD_TAG = "hoc-github-repo-card";

export interface GithubRepoConfig extends FieldsConfig {
  device: string;
}

const STANDARD: FieldConfig[] = [
  "stars",
  "forks",
  "open_issues",
  "open_pull_requests",
  { key: "commits_this_month", trend: "commits_vs_last_month" },
  "latest_release",
];

const DEFAULT_FIELDS: Record<FieldsLayout, FieldConfig[]> = {
  compact: ["stars", "latest_release"],
  standard: STANDARD,
  list: STANDARD,
};

export class GithubRepoCard extends HocFieldsCard<GithubRepoConfig> {
  static override requiredKeys = ["device"];

  protected get platform(): string {
    return PLATFORM;
  }

  protected override get dotKey(): string {
    return "ci_state";
  }

  protected defaultFields(layout: FieldsLayout): FieldConfig[] {
    return DEFAULT_FIELDS[layout];
  }

  static getStubConfig(hass: HomeAssistant): Partial<GithubRepoConfig> {
    const accounts = new Set(findAccountDevices(hass, PLATFORM));
    const first = listDevices(hass, PLATFORM).find((device) => !accounts.has(device.id));
    return first ? { device: first.id } : {};
  }

  static getConfigElement(): HTMLElement {
    return document.createElement(`${REPO_CARD_TAG}-editor`);
  }
}

export const repoCardDefinition: CardDefinition = {
  tag: REPO_CARD_TAG,
  ctor: GithubRepoCard,
  editorTag: `${REPO_CARD_TAG}-editor`,
  editorCtor: GithubRepoEditor,
  name: "GitHub repository",
  description: "One GitHub Pulse repository with colourful, selectable fields.",
};
