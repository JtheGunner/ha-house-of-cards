import { HocFieldsCard, type FieldsConfig } from "../../../core/fields-card";
import type { FieldConfig } from "../../../core/fields";
import type { ResolvedEntities } from "../../../core/resolver";
import type { CardDefinition } from "../../../registry";
import { DeviceCardEditor } from "./editor";

export const DEVICE_CARD_TAG = "hoc-device-card";
const DEFAULT_FIELD_COUNT = 6;

export interface DeviceCardConfig extends FieldsConfig {
  device: string;
}

/** Any device of any integration: pick the sensors and attributes to show. */
export class DeviceCard extends HocFieldsCard<DeviceCardConfig> {
  static override requiredKeys = ["device"];

  protected get platform(): undefined {
    return undefined;
  }

  protected defaultFields(_layout: unknown, entities: ResolvedEntities): FieldConfig[] {
    return Object.keys(entities).slice(0, DEFAULT_FIELD_COUNT);
  }

  static getConfigElement(): HTMLElement {
    return document.createElement(`${DEVICE_CARD_TAG}-editor`);
  }
}

export const deviceCardDefinition: CardDefinition = {
  tag: DEVICE_CARD_TAG,
  ctor: DeviceCard,
  editorTag: `${DEVICE_CARD_TAG}-editor`,
  editorCtor: DeviceCardEditor,
  name: "Device",
  description: "Any device: choose which sensors and attributes to show, in colour.",
};
