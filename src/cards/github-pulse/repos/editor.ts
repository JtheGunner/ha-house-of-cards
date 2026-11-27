import { discoverFieldOptions, type FieldOption } from "../../../core/fields";
import {
  fieldsSelectorFromOptions,
  HocBaseEditor,
  type FormSchemaItem,
} from "../../../core/editor";
import { findAccountDevices, listDevices } from "../../../core/resolver";
import type { GithubReposConfig } from "./card";

export class GithubReposEditor extends HocBaseEditor<GithubReposConfig> {
  protected override fieldListNames = ["columns"];

  private columnOptions(): FieldOption[] {
    if (!this.hass) return [];
    const accounts = new Set(findAccountDevices(this.hass, "github_pulse"));
    const options = new Map<string, FieldOption>();
    for (const device of listDevices(this.hass, "github_pulse")) {
      if (accounts.has(device.id)) continue;
      for (const option of discoverFieldOptions(this.hass, device.id)) {
        options.set(option.value, option);
      }
    }
    return [...options.values()];
  }

  protected schema(): FormSchemaItem[] {
    const options = this.columnOptions();
    return [
      {
        name: "repositories",
        selector: { device: { integration: "github_pulse", multiple: true } },
      },
      fieldsSelectorFromOptions(this.hass, options, "columns"),
      {
        name: "sort_by",
        selector: {
          select: {
            mode: "dropdown",
            custom_value: true,
            options: [{ value: "name", label: "Name" }, ...options],
          },
        },
      },
      { name: "sort_order", selector: { select: { mode: "dropdown", options: ["asc", "desc"] } } },
      { name: "max_height", selector: { number: { min: 100, max: 2000, mode: "box" } } },
    ];
  }
}
