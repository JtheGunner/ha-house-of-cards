import { isMissing, parseNumber } from "./format";
import { colorValue, parseField, TONE_COLORS, type Tone } from "./fields";
import type { ResolvedEntities } from "./resolver";

export type StatusOperator = "=" | "!=" | ">" | ">=" | "<" | "<=" | "contains";

/** One condition of a card's status; the first rule that matches decides. */
export interface StatusRule {
  /** A sensor key or `sensor:attribute`. */
  field: string;
  operator?: StatusOperator;
  value?: string | number | boolean;
  /** `success`, `pending`, `failure`, `none`, a colour name or any CSS colour. */
  state: string;
}

/** The outcome. An empty status means neutral: no accent and a grey dot. */
export interface Status {
  tone?: Tone;
  color?: string;
}

export const STATUS_OPERATORS: StatusOperator[] = ["=", "!=", ">", ">=", "<", "<=", "contains"];
export const STATUS_STATES = ["success", "pending", "failure", "none"];

const TONES = new Set<string>(["success", "pending", "failure"]);

/** Turns a state word, colour name or CSS colour into a status. Anything else is neutral. */
export function parseStatusState(text: string): Status {
  const word = text.trim();
  if (word === "" || word.toLowerCase() === "none" || /[;{}"<>]/.test(word)) return {};
  const lower = word.toLowerCase();
  if (TONES.has(lower)) {
    const tone = lower as Tone;
    return { tone, color: TONE_COLORS[tone] };
  }
  return { color: colorValue(word) };
}

function fieldValue(entities: ResolvedEntities, field: string): unknown {
  const spec = parseField(field);
  const stateObj = entities[spec.key];
  if (!stateObj || isMissing(stateObj.state)) return undefined;
  return spec.attribute ? stateObj.attributes[spec.attribute] : stateObj.state;
}

function matches(actual: unknown, operator: StatusOperator, expected: unknown): boolean {
  if (actual === undefined || actual === null) return false;
  const left = String(actual).toLowerCase();
  const right = String(expected ?? "").toLowerCase();
  if (operator === "contains") return left.includes(right);
  const a = parseNumber(String(actual));
  const b = parseNumber(String(expected));
  if (a !== null && b !== null) {
    switch (operator) {
      case "=":
        return a === b;
      case "!=":
        return a !== b;
      case ">":
        return a > b;
      case ">=":
        return a >= b;
      case "<":
        return a < b;
      case "<=":
        return a <= b;
    }
  }
  if (operator === "=") return left === right;
  if (operator === "!=") return left !== right;
  return false;
}

export function evaluateStatus(rules: StatusRule[], entities: ResolvedEntities): Status {
  for (const rule of rules) {
    const actual = fieldValue(entities, rule.field);
    if (matches(actual, rule.operator ?? "=", rule.value)) return parseStatusState(rule.state);
  }
  return {};
}
