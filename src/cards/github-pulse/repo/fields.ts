import { formatCount, parseNumber, trend, type Trend } from "../../../core/format";
import type { LocaleKey } from "../../../core/i18n";
import type { ResolvedEntities } from "../../../core/resolver";

export type FieldKey =
  | "stars"
  | "forks"
  | "open_issues"
  | "open_pull_requests"
  | "commits_this_month"
  | "commits_vs_last_month"
  | "ci_state"
  | "latest_release"
  | "days_since_last_commit"
  | "unique_visitors_14d"
  | "views_14d"
  | "actions_last_result"
  | "actions_runs_today"
  | "total_downloads"
  | "days_since_last_release";

export type Layout = "compact" | "standard" | "detailed";

export interface Field {
  key: FieldKey;
  label: LocaleKey;
  value: string;
  unit?: string;
  trend?: Trend;
}

type Kind = "count" | "text" | "days";

const DEFINITIONS: Record<FieldKey, { label: LocaleKey; kind: Kind }> = {
  stars: { label: "stars", kind: "count" },
  forks: { label: "forks", kind: "count" },
  open_issues: { label: "issues", kind: "count" },
  open_pull_requests: { label: "pull_requests", kind: "count" },
  commits_this_month: { label: "commits_this_month", kind: "count" },
  commits_vs_last_month: { label: "vs_last_month", kind: "text" },
  ci_state: { label: "ci", kind: "text" },
  latest_release: { label: "release", kind: "text" },
  days_since_last_commit: { label: "days_since_commit", kind: "days" },
  unique_visitors_14d: { label: "visitors", kind: "count" },
  views_14d: { label: "views", kind: "count" },
  actions_last_result: { label: "workflow", kind: "text" },
  actions_runs_today: { label: "runs_today", kind: "count" },
  total_downloads: { label: "downloads", kind: "count" },
  days_since_last_release: { label: "days_since_release", kind: "days" },
};

const COMPACT: FieldKey[] = ["stars"];
const STANDARD: FieldKey[] = [
  ...COMPACT,
  "forks",
  "open_issues",
  "open_pull_requests",
  "commits_this_month",
];
const DETAILED: FieldKey[] = [
  ...STANDARD,
  "unique_visitors_14d",
  "views_14d",
  "actions_last_result",
  "actions_runs_today",
  "total_downloads",
  "days_since_last_commit",
  "days_since_last_release",
];

const LAYOUT_KEYS: Record<Layout, FieldKey[]> = {
  compact: COMPACT,
  standard: STANDARD,
  detailed: DETAILED,
};

/** One field for a key, or undefined if its sensor is missing (disabled). */
export function buildField(entities: ResolvedEntities, key: FieldKey): Field | undefined {
  const state = entities[key]?.state;
  if (state === undefined) return undefined;
  const { label, kind } = DEFINITIONS[key];
  const field: Field = { key, label, value: state };
  if (kind === "count") field.value = formatCount(state);
  if (kind === "days") {
    field.value = formatCount(state);
    field.unit = "d";
  }
  if (key === "commits_this_month") {
    const change = entities["commits_vs_last_month"]?.state;
    if (change !== undefined) field.trend = trend(parseNumber(change));
  }
  return field;
}

export function repoFields(entities: ResolvedEntities, layout: Layout): Field[] {
  return LAYOUT_KEYS[layout].flatMap((key) => {
    const field = buildField(entities, key);
    return field ? [field] : [];
  });
}
