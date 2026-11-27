import { HocFieldsCard, type FieldsConfig } from "../../../core/fields-card";
import type { FieldConfig } from "../../../core/fields";
import { listDevices } from "../../../core/resolver";
import type { HomeAssistant } from "../../../core/types";
import type { CardDefinition } from "../../../registry";
import { YoutrackProjectEditor } from "./editor";

export const YOUTRACK_PLATFORM = "youtrack";
export const PROJECT_CARD_TAG = "hoc-youtrack-project-card";

export interface YoutrackProjectConfig extends FieldsConfig {
  device: string;
}

const DEFAULT_FIELDS: FieldConfig[] = [
  "issues_open",
  "issues_overdue",
  "issues_critical_open",
  "issues_created_7d",
  "issues_resolved_7d",
];

export class YoutrackProjectCard extends HocFieldsCard<YoutrackProjectConfig> {
  static override requiredKeys = ["device"];

  protected get platform(): string {
    return YOUTRACK_PLATFORM;
  }

  protected override get statusKeys(): string[] {
    return ["has_overdue", "has_critical_open"];
  }

  protected defaultFields(): FieldConfig[] {
    return DEFAULT_FIELDS;
  }

  static getStubConfig(hass: HomeAssistant): Partial<YoutrackProjectConfig> {
    const first = listDevices(hass, YOUTRACK_PLATFORM)[0];
    return first ? { device: first.id } : {};
  }

  static getConfigElement(): HTMLElement {
    return document.createElement(`${PROJECT_CARD_TAG}-editor`);
  }
}

export const projectCardDefinition: CardDefinition = {
  tag: PROJECT_CARD_TAG,
  ctor: YoutrackProjectCard,
  editorTag: `${PROJECT_CARD_TAG}-editor`,
  editorCtor: YoutrackProjectEditor,
  name: "YouTrack project",
  description: "A YouTrack project with colourful, selectable fields.",
};
