import type { HomeAssistant } from "../../src/core/types";

export interface FixtureEntity {
  platform: string;
  deviceId: string;
  translationKey: string;
  state?: string;
  attributes?: Record<string, unknown>;
  hidden?: boolean;
}

export interface FixtureOptions {
  devices?: { id: string; name: string }[];
  entities?: FixtureEntity[];
  language?: string;
}

/** Builds a minimal hass object. An entity without `state` is registered but has no state (disabled). */
export function fixtureHass(options: FixtureOptions = {}): HomeAssistant {
  const hass: HomeAssistant = {
    states: {},
    entities: {},
    devices: {},
    locale: { language: options.language ?? "en" },
  };
  for (const device of options.devices ?? []) {
    hass.devices[device.id] = { id: device.id, name: device.name };
  }
  for (const entity of options.entities ?? []) {
    const entityId = `sensor.${entity.platform}_${entity.deviceId}_${entity.translationKey}`;
    hass.entities[entityId] = {
      entity_id: entityId,
      device_id: entity.deviceId,
      platform: entity.platform,
      translation_key: entity.translationKey,
      hidden: entity.hidden,
    };
    if (entity.state !== undefined) {
      hass.states[entityId] = {
        entity_id: entityId,
        state: entity.state,
        attributes: entity.attributes ?? {},
      };
    }
  }
  return hass;
}
