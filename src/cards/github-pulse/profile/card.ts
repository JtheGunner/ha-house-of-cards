import { HocFieldsCard, type FieldsConfig } from "../../../core/fields-card";
import type { FieldConfig } from "../../../core/fields";
import { findAccountDevice } from "../../../core/resolver";
import type { CardDefinition } from "../../../registry";
import { PLATFORM } from "../repo/card";
import { GithubProfileEditor } from "./editor";

export const PROFILE_CARD_TAG = "hoc-github-profile-card";

const DEFAULT_FIELDS: FieldConfig[] = [
  { key: "contributions_this_month", trend: "commits_vs_last_month" },
  "current_streak",
  "longest_streak",
  "top_language",
];

export class GithubProfileCard extends HocFieldsCard<FieldsConfig> {
  protected get platform(): string {
    return PLATFORM;
  }

  protected defaultFields(): FieldConfig[] {
    return DEFAULT_FIELDS;
  }

  protected override deviceId(): string | undefined {
    return this.config?.device ?? (this.hass ? findAccountDevice(this.hass, PLATFORM) : undefined);
  }

  static getConfigElement(): HTMLElement {
    return document.createElement(`${PROFILE_CARD_TAG}-editor`);
  }
}

export const profileCardDefinition: CardDefinition = {
  tag: PROFILE_CARD_TAG,
  ctor: GithubProfileCard,
  editorTag: `${PROFILE_CARD_TAG}-editor`,
  editorCtor: GithubProfileEditor,
  name: "GitHub profile",
  description: "Your GitHub activity with colourful, selectable fields.",
};
