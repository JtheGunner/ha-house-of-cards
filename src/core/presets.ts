import type { FieldConfig } from "./fields";
import type { StatusRule } from "./status";
import type { FieldsLayout } from "./fields-card";
import type { ResolvedEntities } from "./resolver";
import { listDevices } from "./resolver";
import type { HomeAssistant } from "./types";

/** What the generic cards know about one integration. Presets are data only. */
export interface Preset {
  platform: string;
  /** Shown in the integration dropdown of the table card. */
  label: string;
  /** Default columns of the table card. */
  columns: FieldConfig[];
  /** Default status dot per row in the table card, when `show_status` is on. */
  rowStatus?: StatusRule[];
  /** Default fields per layout, used while the card has no `fields` of its own. */
  layouts: Record<FieldsLayout, FieldConfig[]>;
  /** A device that owns this sensor uses `layouts` of the variant instead. */
  variant?: { marker: string; layouts: Record<FieldsLayout, FieldConfig[]> };
  /** Sensor whose state (`success`, `failure`, ...) drives the dot in the header. */
  dotKey?: string;
  /** Sensors whose tone colours the accent edge when the card defines no status. */
  statusKeys?: string[];
}

export const GITHUB_PLATFORM = "github_pulse";
export const YOUTRACK_PLATFORM = "youtrack";

const GITHUB_STANDARD: FieldConfig[] = [
  "stars",
  "forks",
  "open_issues",
  "open_pull_requests",
  { key: "commits_this_month", trend: "commits_vs_last_month" },
  "latest_release",
];

const GITHUB_PROFILE: FieldConfig[] = [
  { key: "contributions_this_month", trend: "commits_vs_last_month" },
  "current_streak",
  "longest_streak",
  "top_language",
];

const YOUTRACK_FIELDS: FieldConfig[] = [
  "issues_open",
  "issues_overdue",
  "issues_critical_open",
  "issues_created_7d",
  "issues_resolved_7d",
];

export const PRESETS: Record<string, Preset> = {
  [GITHUB_PLATFORM]: {
    platform: GITHUB_PLATFORM,
    label: "GitHub Pulse",
    columns: [
      "ci_state",
      "stars",
      { key: "commits_this_month", trend: "commits_vs_last_month" },
      "latest_release",
    ],
    rowStatus: [{ field: "commits_this_month", operator: ">", value: 0, state: "success" }],
    layouts: {
      compact: ["stars", "latest_release"],
      standard: GITHUB_STANDARD,
      list: GITHUB_STANDARD,
    },
    variant: {
      marker: "contributions_this_month",
      layouts: {
        compact: ["contributions_this_month", "current_streak"],
        standard: GITHUB_PROFILE,
        list: GITHUB_PROFILE,
      },
    },
    dotKey: "ci_state",
  },
  [YOUTRACK_PLATFORM]: {
    platform: YOUTRACK_PLATFORM,
    label: "YouTrack",
    columns: ["issues_open", "issues_overdue", "issues_critical_open"],
    rowStatus: [
      { field: "has_overdue", value: "on", state: "failure" },
      { field: "has_critical_open", value: "on", state: "failure" },
    ],
    layouts: { compact: YOUTRACK_FIELDS, standard: YOUTRACK_FIELDS, list: YOUTRACK_FIELDS },
    statusKeys: ["has_overdue", "has_critical_open"],
  },
};

/** The preset of the integration a device belongs to, if the bundle knows it. */
export function presetOfDevice(hass: HomeAssistant, deviceId: string): Preset | undefined {
  for (const entry of Object.values(hass.entities)) {
    if (entry.device_id !== deviceId) continue;
    const preset = PRESETS[entry.platform];
    if (preset) return preset;
  }
  return undefined;
}

const GENERIC_FIELD_COUNT = 6;

/** The fields a card shows while its own `fields` is empty. */
export function defaultFieldsFor(
  preset: Preset | undefined,
  layout: FieldsLayout,
  entities: ResolvedEntities,
): FieldConfig[] {
  if (!preset) return Object.keys(entities).slice(0, GENERIC_FIELD_COUNT);
  const variant = preset.variant;
  return (variant && variant.marker in entities ? variant.layouts : preset.layouts)[layout];
}

/** Devices of the account variant (such as the GitHub profile) are not listed when scanning an integration. */
function isVariantDevice(hass: HomeAssistant, deviceId: string, preset: Preset): boolean {
  const marker = preset.variant?.marker;
  if (!marker) return false;
  return Object.values(hass.entities).some(
    (entry) =>
      entry.device_id === deviceId &&
      entry.platform === preset.platform &&
      entry.translation_key === marker,
  );
}

export interface DeviceRef {
  id: string;
  name: string;
}

/**
 * The devices of a table card: the chosen ones, or else every device of the integration.
 * Unknown ids and duplicates are skipped.
 */
export function selectDevices(
  hass: HomeAssistant,
  devices: string[] | "all" | undefined,
  platform: string | undefined,
): DeviceRef[] {
  const nameOf = (id: string) => {
    const device = hass.devices[id];
    return device?.name_by_user ?? device?.name ?? id;
  };
  if (Array.isArray(devices) && devices.length > 0) {
    return [...new Set(devices)]
      .filter((id) => id in hass.devices)
      .map((id) => ({ id, name: nameOf(id) }));
  }
  if (!platform) return [];
  const preset = PRESETS[platform];
  return listDevices(hass, platform).filter(
    (device) => !preset || !isVariantDevice(hass, device.id, preset),
  );
}

/** Every integration that owns at least one device, for the table card's dropdown. */
export function listPlatforms(hass: HomeAssistant): { value: string; label: string }[] {
  const platforms = new Set<string>();
  for (const entry of Object.values(hass.entities)) {
    if (entry.device_id && hass.devices[entry.device_id]) platforms.add(entry.platform);
  }
  return [...platforms]
    .map((value) => ({ value, label: PRESETS[value]?.label ?? value }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
