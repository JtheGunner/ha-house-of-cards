import type { FieldConfig } from "./fields";
import type { FieldsLayout } from "./fields-card";
import type { ResolvedEntities } from "./resolver";
import type { HomeAssistant } from "./types";

/** What the generic cards know about one integration. Presets are data only. */
export interface Preset {
  platform: string;
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
