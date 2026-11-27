import { discoverFieldOptions, type FieldOption } from "../../../core/fields";
import {
  choiceSelector,
  fieldsSelectorFromOptions,
  HocBaseEditor,
  type FormSchemaItem,
} from "../../../core/editor";
import { editorLabel } from "../../../core/i18n";
import { findAccountDevices, listDevices } from "../../../core/resolver";
import type { GithubReposConfig } from "./card";

export class GithubReposEditor extends HocBaseEditor<GithubReposConfig> {
  protected override fieldListNames = ["columns"];

  protected override valueChanged(event: CustomEvent<{ value: GithubReposConfig }>): void {
    const { repositories } = event.detail.value;
    if (Array.isArray(repositories)) {
      event.detail.value = { ...event.detail.value, repositories: [...new Set(repositories)] };
    }
    super.valueChanged(event);
  }

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
      fieldsSelectorFromOptions(this.hass, options, "columns", true),
      {
        name: "sort_by",
        selector: {
          select: {
            mode: "dropdown",
            custom_value: true,
            options: [
              { value: "name", label: this.hass ? editorLabel(this.hass, "name") : "Name" },
              ...options,
            ],
          },
        },
      },
      choiceSelector(this.hass, "order", ["asc", "desc"], "sort_order"),
      { name: "hide_owner", selector: { boolean: {} } },
      { name: "link", selector: { boolean: {} } },
      { name: "show_activity", selector: { boolean: {} } },
      choiceSelector(this.hass, "titles", ["text", "icon", "icon_text"], "column_titles"),
      { name: "max_height", selector: { number: { min: 100, max: 2000, mode: "box" } } },
    ];
  }
}
