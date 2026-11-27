import type { HomeAssistant } from "./types";
import { de } from "./locales/de";
import { en, type LocaleKey } from "./locales/en";

export type { LocaleKey };

const dictionaries: Record<string, Record<LocaleKey, string>> = { en, de };

/** Option names the visual editors label; each has an `editor_<name>` entry in every locale. */
export const EDITOR_OPTION_NAMES = [
  "device",
  "layout",
  "fields",
  "columns",
  "name",
  "show_title",
  "title",
  "device_title",
  "link",
  "link_url",
  "badge",
  "expandable",
  "show_status",
  "shorten_names",
  "column_titles",
  "align",
  "title_color",
  "status",
  "field",
  "operator",
  "value",
  "state",
  "platform",
  "devices",
  "sort_by",
  "sort_order",
  "max_height",
  "max_items",
  "show_when_clean",
  "entity",
  "sensor",
  "icon",
  "color",
] as const;

/** The label of an editor option in the Home Assistant language, starting with a capital letter. */
export function editorLabel(hass: Pick<HomeAssistant, "locale">, name: string): string {
  const key = `editor_${name}` as LocaleKey;
  const base = hass.locale.language.toLowerCase().split("-")[0] ?? "en";
  const text = (dictionaries[base] ?? en)[key] ?? en[key];
  if (text) return text;
  const plain = name.replace(/_/g, " ");
  return plain.charAt(0).toUpperCase() + plain.slice(1);
}

export function t(hass: Pick<HomeAssistant, "locale">, key: LocaleKey): string {
  const base = hass.locale.language.toLowerCase().split("-")[0] ?? "en";
  return (dictionaries[base] ?? en)[key];
}
