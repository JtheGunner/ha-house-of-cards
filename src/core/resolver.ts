import type { HassEntityState, HomeAssistant } from "./types";

export type ResolvedEntities = Record<string, HassEntityState | undefined>;

/** Sensor that only the account-level device of github_pulse owns. */
const ACCOUNT_MARKER_KEY = "contributions_this_month";

export function resolveDeviceEntities(
  hass: HomeAssistant,
  deviceId: string,
  platform: string,
): ResolvedEntities {
  const resolved: ResolvedEntities = {};
  for (const entry of Object.values(hass.entities)) {
    if (entry.device_id !== deviceId || entry.platform !== platform || !entry.translation_key) {
      continue;
    }
    const state = hass.states[entry.entity_id];
    if (state) resolved[entry.translation_key] = state;
  }
  return resolved;
}

export function listDevices(hass: HomeAssistant, platform: string): { id: string; name: string }[] {
  const ids = new Set<string>();
  for (const entry of Object.values(hass.entities)) {
    if (entry.platform === platform && entry.device_id) ids.add(entry.device_id);
  }
  return [...ids]
    .map((id) => {
      const device = hass.devices[id];
      return { id, name: device?.name_by_user ?? device?.name ?? id };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Every account-level device (one per GitHub Pulse config entry). */
export function findAccountDevices(
  hass: HomeAssistant,
  platform: string,
  markerKey: string = ACCOUNT_MARKER_KEY,
): string[] {
  const ids = new Set<string>();
  for (const entry of Object.values(hass.entities)) {
    if (entry.platform === platform && entry.translation_key === markerKey && entry.device_id) {
      ids.add(entry.device_id);
    }
  }
  return [...ids];
}

export function findAccountDevice(
  hass: HomeAssistant,
  platform: string,
  markerKey: string = ACCOUNT_MARKER_KEY,
): string | undefined {
  return (
    Object.values(hass.entities).find(
      (entry) =>
        entry.platform === platform && entry.translation_key === markerKey && entry.device_id,
    )?.device_id ?? undefined
  );
}
