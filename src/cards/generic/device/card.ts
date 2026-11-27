import { HocFieldsCard, type FieldsConfig, type FieldsLayout } from "../../../core/fields-card";
import type { FieldConfig } from "../../../core/fields";
import { defaultFieldsFor, presetOfDevice, type Preset } from "../../../core/presets";
import type { ResolvedEntities } from "../../../core/resolver";
import type { HomeAssistant } from "../../../core/types";
import type { CardDefinition } from "../../../registry";
import { DeviceCardEditor } from "./editor";

export const DEVICE_CARD_TAG = "hoc-device-card";

export interface DeviceCardConfig extends FieldsConfig {
  device: string;
}

/**
 * Any device of any integration: pick the sensors and attributes to show. Devices of an
 * integration with a preset (GitHub Pulse, YouTrack) start with sensible fields and status.
 */
export class DeviceCard extends HocFieldsCard<DeviceCardConfig> {
  static override requiredKeys = ["device"];

  private preset(): Preset | undefined {
    const device = this.config?.device;
    return this.hass && device ? presetOfDevice(this.hass, device) : undefined;
  }

  protected get platform(): string | undefined {
    return this.preset()?.platform;
  }

  protected override get dotKey(): string | undefined {
    return this.preset()?.dotKey;
  }

  protected override get statusKeys(): string[] {
    const preset = this.preset();
    return [...(preset?.dotKey ? [preset.dotKey] : []), ...(preset?.statusKeys ?? [])];
  }

  protected defaultFields(layout: FieldsLayout, entities: ResolvedEntities): FieldConfig[] {
    return defaultFieldsFor(this.preset(), layout, entities);
  }

  static getStubConfig(hass: HomeAssistant): Partial<DeviceCardConfig> {
    const entry = Object.values(hass.entities).find(
      (candidate) => candidate.device_id && hass.states[candidate.entity_id],
    );
    return entry?.device_id ? { device: entry.device_id } : {};
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
  description:
    "Any device: choose which sensors and attributes to show, in colour. GitHub Pulse and YouTrack devices come with defaults.",
};
