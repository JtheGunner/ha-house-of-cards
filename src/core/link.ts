import { parseField } from "./fields";
import { isHttps } from "./format";
import type { ResolvedEntities } from "./resolver";
import type { HassDevice } from "./types";

/**
 * The target of the title link. `link` is `device` (or `true`) for the device's own page,
 * `sensor:attribute` for a URL held in an attribute, or an https URL. `link` wins over
 * `link_url`, which only applies while `link` gives no target. Only https targets are ever returned.
 */
export function resolveLink(
  link: unknown,
  linkUrl: unknown,
  device: HassDevice | undefined,
  entities: ResolvedEntities,
): string | undefined {
  for (const candidate of [link, linkUrl]) {
    const target = resolveOne(candidate, device, entities);
    if (target) return target;
  }
  return undefined;
}

function resolveOne(
  candidate: unknown,
  device: HassDevice | undefined,
  entities: ResolvedEntities,
): string | undefined {
  if (candidate === true || candidate === "device") {
    const url = device?.configuration_url;
    return isHttps(url) ? url : undefined;
  }
  if (typeof candidate !== "string") return undefined;
  const text = candidate.trim();
  if (text.startsWith("https://")) return isHttps(text) ? text : undefined;
  const spec = parseField(text);
  if (!spec.attribute) return undefined;
  const value = entities[spec.key]?.attributes[spec.attribute];
  return typeof value === "string" && isHttps(value) ? value : undefined;
}
