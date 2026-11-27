import { colorValue, paletteColorFor, TONE_COLORS } from "../../../core/fields";

/** Colour overrides by state or priority name, matched without regard to case. */
export type ColorOverrides = Record<string, string>;

const RESOLVED =
  /^(done|fixed|verified|resolved|closed|complete|completed|erledigt|behoben|geschlossen|gelöst)/i;
const PROGRESS = /(progress|review|testing|test|doing|implement|bearbeitung|prüf)/i;
const BLOCKED = /(blocked|won'?t|rejected|duplicate|obsolete|blockiert|abgelehnt)/i;
const OPEN = /^(open|submitted|new|to ?do|backlog|offen|neu)/i;

const CRITICAL = /(show-?stopper|blocker|critical|kritisch)/i;
const MAJOR = /(major|high|hoch|wichtig)/i;
const MINOR = /(minor|low|trivial|niedrig|gering)/i;

function override(name: string, overrides: ColorOverrides | undefined): string | undefined {
  if (!overrides) return undefined;
  const wanted = name.trim().toLowerCase();
  const key = Object.keys(overrides).find((candidate) => candidate.trim().toLowerCase() === wanted);
  const color = key ? overrides[key] : undefined;
  return color ? colorValue(color) : undefined;
}

/** Green when resolved, red when blocked, amber while in progress, blue while open; else a stable colour. */
export function stateColor(name: string, overrides?: ColorOverrides): string {
  const custom = override(name, overrides);
  if (custom) return custom;
  if (RESOLVED.test(name)) return TONE_COLORS.success;
  if (BLOCKED.test(name)) return TONE_COLORS.failure;
  if (PROGRESS.test(name)) return TONE_COLORS.pending;
  if (OPEN.test(name)) return colorValue("blue");
  return paletteColorFor(name);
}

/** Red for critical, amber for major, grey for minor; normal priorities stay quiet. */
export function priorityColor(name: string, overrides?: ColorOverrides): string {
  const custom = override(name, overrides);
  if (custom) return custom;
  if (CRITICAL.test(name)) return TONE_COLORS.failure;
  if (MAJOR.test(name)) return TONE_COLORS.pending;
  if (MINOR.test(name)) return "var(--disabled-text-color)";
  return "var(--divider-color)";
}
