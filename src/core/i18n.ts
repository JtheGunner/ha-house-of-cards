import type { HomeAssistant } from "./types";
import { de } from "./locales/de";
import { en, type LocaleKey } from "./locales/en";

export type { LocaleKey };

const dictionaries: Record<string, Record<LocaleKey, string>> = { en, de };

export function t(hass: Pick<HomeAssistant, "locale">, key: LocaleKey): string {
  const base = hass.locale.language.toLowerCase().split("-")[0] ?? "en";
  return (dictionaries[base] ?? en)[key];
}
