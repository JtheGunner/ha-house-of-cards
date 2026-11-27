import { formatCount, isMissing, parseNumber, trend, type Trend } from "./format";
import { t, type LocaleKey } from "./i18n";
import type { ResolvedEntities } from "./resolver";
import type { HassEntityState, HomeAssistant } from "./types";

/** One value to show: a sensor, or one attribute of a sensor (`key:attribute`). */
export interface FieldSpec {
  key: string;
  attribute?: string;
  name?: string;
  icon?: string;
  color?: string;
  /** Key of another sensor whose percentage is shown as a trend arrow. */
  trend?: string;
  /** Text alignment in tables. Without it numbers align right and text left. */
  align?: "left" | "center" | "right";
  /** Colour of the column title in tables: a colour name or any CSS colour. */
  title_color?: string;
}

export type FieldConfig = string | FieldSpec;
export type Tone = "success" | "failure" | "pending";

export interface FieldView {
  id: string;
  label: string;
  value: string;
  unit?: string;
  color: string;
  icon?: string;
  /** The number when the value is numeric, otherwise the text; used for sorting. */
  raw: number | string;
  stateObj: HassEntityState;
  attribute?: string;
  tone?: Tone;
  trend?: Trend;
}

const KNOWN_LABELS: Record<string, LocaleKey> = {
  stars: "stars",
  forks: "forks",
  open_issues: "issues",
  open_pull_requests: "pull_requests",
  commits_this_month: "commits_this_month",
  commits_vs_last_month: "vs_last_month",
  ci_state: "ci",
  latest_release: "release",
  days_since_last_commit: "days_since_commit",
  days_since_last_release: "days_since_release",
  unique_visitors_14d: "visitors",
  views_14d: "views",
  actions_last_result: "workflow",
  actions_runs_today: "runs_today",
  total_downloads: "downloads",
  contributions_this_month: "contributions",
  current_streak: "current_streak",
  longest_streak: "longest_streak",
  top_language: "top_language",
  issues_open: "issues_open",
  issues_overdue: "issues_overdue",
  issues_critical_open: "issues_critical_open",
  issues_created_7d: "issues_created_7d",
  issues_resolved_7d: "issues_resolved_7d",
};

const PALETTE = ["blue", "purple", "teal", "orange", "pink", "green", "indigo", "amber"];
const TONE_COLORS: Record<Tone, string> = {
  success: "var(--success-color, var(--green-color))",
  failure: "var(--error-color, var(--red-color))",
  pending: "var(--warning-color, var(--amber-color))",
};
const INTERNAL_ATTRIBUTES = new Set([
  "friendly_name",
  "unit_of_measurement",
  "device_class",
  "icon",
  "state_class",
  "entity_picture",
  "supported_features",
  "attribution",
  "options",
  "restored",
  "editable",
]);

export function parseField(item: FieldConfig): FieldSpec {
  if (typeof item !== "string") {
    if (item.attribute === undefined && item.key.includes(":")) {
      const [key = "", ...rest] = item.key.split(":");
      return { ...item, key, attribute: rest.join(":") };
    }
    return item;
  }
  const [key = "", ...rest] = item.split(":");
  return rest.length > 0 ? { key, attribute: rest.join(":") } : { key };
}

export function fieldId(spec: FieldSpec): string {
  return spec.attribute ? `${spec.key}:${spec.attribute}` : spec.key;
}

export function humanize(key: string): string {
  const text = key.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function hash(text: string): number {
  let value = 0;
  for (const char of text) value = (value * 31 + char.charCodeAt(0)) >>> 0;
  return value;
}

function paletteColor(name: string): string {
  return `var(--${name}-color)`;
}

/** A colour name such as `purple` becomes its theme variable; anything else is used as given. */
export function colorValue(color: string): string {
  return /^[a-z-]+$/.test(color) ? paletteColor(color) : color;
}

function resolveColor(spec: FieldSpec, tone: Tone | undefined): string {
  if (spec.color) {
    return /^[a-z-]+$/.test(spec.color) ? paletteColor(spec.color) : spec.color;
  }
  if (tone) return TONE_COLORS[tone];
  return paletteColor(PALETTE[hash(spec.key) % PALETTE.length] ?? "blue");
}

function baseLabel(
  hass: Pick<HomeAssistant, "locale">,
  key: string,
  stateObj: HassEntityState,
  deviceName: string | undefined,
): string {
  const known = KNOWN_LABELS[key];
  if (known) return t(hass, known);
  const friendly = stateObj.attributes["friendly_name"];
  if (typeof friendly === "string" && friendly.trim() !== "") {
    const stripped =
      deviceName && friendly.startsWith(`${deviceName} `)
        ? friendly.slice(deviceName.length + 1)
        : friendly;
    return stripped.trim() || humanize(key);
  }
  return humanize(key);
}

function toneOf(key: string, state: string): Tone | undefined {
  if (state === "success") return "success";
  if (state === "failure" || state === "error") return "failure";
  if (state === "pending" || state === "queued") return "pending";
  if (key.startsWith("has_") && state === "on") return "failure";
  const value = parseNumber(state);
  if (value === null) return undefined;
  if (/(overdue|critical|failing|stale)/.test(key)) return value > 0 ? "failure" : undefined;
  if (/(_vs_|trend)/.test(key)) {
    if (value > 1) return "success";
    if (value < -1) return "failure";
  }
  return undefined;
}

function formatAttribute(raw: unknown): string | undefined {
  if (typeof raw === "number")
    return Math.abs(raw) >= 1000 ? formatCount(String(raw)) : String(raw);
  if (typeof raw === "string") return raw.trim() === "" ? undefined : raw;
  if (typeof raw === "boolean") return raw ? "✓" : "–";
  if (Array.isArray(raw)) return String(raw.length);
  return undefined;
}

function formatEntity(
  hass: HomeAssistant,
  stateObj: HassEntityState,
): { value: string; unit?: string } {
  const unitRaw = stateObj.attributes["unit_of_measurement"];
  const unit = typeof unitRaw === "string" && unitRaw !== "" ? unitRaw : undefined;
  const numeric = parseNumber(stateObj.state);
  if (numeric !== null) {
    return unit
      ? { value: String(numeric), unit }
      : { value: Math.abs(numeric) >= 1000 ? formatCount(stateObj.state) : String(numeric) };
  }
  return { value: hass.formatEntityState?.(stateObj) ?? stateObj.state };
}

export function buildFieldViews(
  hass: HomeAssistant,
  entities: ResolvedEntities,
  specs: FieldSpec[],
  deviceName?: string,
): FieldView[] {
  return specs.flatMap((spec): FieldView[] => {
    const stateObj = entities[spec.key];
    if (!stateObj || isMissing(stateObj.state)) return [];

    let formatted: { value: string; unit?: string };
    let raw: number | string;
    if (spec.attribute) {
      const rawAttribute = stateObj.attributes[spec.attribute];
      const value = formatAttribute(rawAttribute);
      if (value === undefined) return [];
      formatted = { value };
      raw = typeof rawAttribute === "number" ? rawAttribute : value;
    } else {
      formatted = formatEntity(hass, stateObj);
      raw = parseNumber(stateObj.state) ?? stateObj.state;
    }

    const tone = spec.attribute ? undefined : toneOf(spec.key, stateObj.state);
    const label =
      spec.name ??
      (spec.attribute
        ? `${baseLabel(hass, spec.key, stateObj, deviceName)} › ${humanize(spec.attribute)}`
        : baseLabel(hass, spec.key, stateObj, deviceName));
    const trendState = spec.trend ? entities[spec.trend]?.state : undefined;

    const view: FieldView = {
      id: fieldId(spec),
      label,
      ...formatted,
      raw,
      color: resolveColor(spec, tone),
      stateObj,
    };
    if (spec.icon) view.icon = spec.icon;
    if (spec.attribute) view.attribute = spec.attribute;
    if (tone) view.tone = tone;
    if (trendState !== undefined) view.trend = trend(parseNumber(trendState));
    return [view];
  });
}

/** The card accent: failure beats pending beats success; none without a tone. */
export function accentColor(views: FieldView[]): string | undefined {
  for (const tone of ["failure", "pending", "success"] as const) {
    if (views.some((view) => view.tone === tone)) return TONE_COLORS[tone];
  }
  return undefined;
}

export interface FieldOption {
  value: string;
  label: string;
}

/** Every sensor of a device plus its scalar attributes, for the editor's field picker. */
export function discoverFieldOptions(hass: HomeAssistant, deviceId: string): FieldOption[] {
  const deviceName = hass.devices[deviceId]?.name ?? undefined;
  const options: FieldOption[] = [];
  const seen = new Set<string>();
  for (const entry of Object.values(hass.entities)) {
    if (entry.device_id !== deviceId) continue;
    const stateObj = hass.states[entry.entity_id];
    if (!stateObj) continue;
    const key = entry.translation_key || entry.entity_id;
    if (seen.has(key)) continue;
    seen.add(key);
    const label = baseLabel(hass, key, stateObj, deviceName);
    options.push({ value: key, label });
    for (const [name, raw] of Object.entries(stateObj.attributes)) {
      if (INTERNAL_ATTRIBUTES.has(name) || formatAttribute(raw) === undefined) continue;
      if (Array.isArray(raw)) continue;
      options.push({ value: `${key}:${name}`, label: `${label} › ${humanize(name)}` });
    }
  }
  return options.sort((a, b) => {
    const left = a.value.split(":")[0] ?? "";
    const right = b.value.split(":")[0] ?? "";
    return left === right ? a.value.localeCompare(b.value) : left.localeCompare(right);
  });
}
