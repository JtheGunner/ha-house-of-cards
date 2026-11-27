import { badgeSelector, HocBaseEditor, type FormSchemaItem } from "../../../core/editor";
import type { FieldOption } from "../../../core/fields";
import { t } from "../../../core/i18n";
import type { YoutrackIssuesConfig } from "./card";

export class YoutrackIssuesEditor extends HocBaseEditor<YoutrackIssuesConfig> {
  protected override singleFieldNames = ["badge"];
  protected override onByDefaultNames = ["show_title", "expandable"];

  /** Only sensors that carry a list of issues make sense here. */
  private querySensors(): string[] {
    const { hass } = this;
    if (!hass) return [];
    return Object.values(hass.entities)
      .filter(
        (entry) =>
          entry.platform === "youtrack" &&
          Array.isArray(hass.states[entry.entity_id]?.attributes["issues"]),
      )
      .map((entry) => entry.entity_id);
  }

  /** The number of matches, and the text attributes of the chosen sensor, such as the query. */
  private badgeOptions(): FieldOption[] {
    const { hass, config } = this;
    const options: FieldOption[] = [
      { value: "count", label: hass ? t(hass, "badge_count") : "count" },
    ];
    const attributes = config?.entity ? hass?.states[config.entity]?.attributes : undefined;
    for (const [name, value] of Object.entries(attributes ?? {})) {
      if (name === "friendly_name" || name === "issues") continue;
      if (typeof value === "string" && value.trim() !== "") {
        options.push({ value: name, label: name.charAt(0).toUpperCase() + name.slice(1) });
      }
    }
    return options;
  }

  protected schema(): FormSchemaItem[] {
    return [
      {
        name: "entity",
        required: true,
        selector: { entity: { domain: "sensor", include_entities: this.querySensors() } },
      },
      { name: "show_title", selector: { boolean: {} } },
      ...(this.config?.show_title !== false ? [{ name: "name", selector: { text: {} } }] : []),
      badgeSelector(this.hass, this.badgeOptions()),
      { name: "max_items", selector: { number: { min: 1, max: 50, mode: "box" } } },
      { name: "expandable", selector: { boolean: {} } },
    ];
  }
}
