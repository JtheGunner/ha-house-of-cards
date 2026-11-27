import { discoverFieldOptions, type FieldOption } from "../../../core/fields";
import {
  choiceSelector,
  fieldsSelectorFromOptions,
  HocBaseEditor,
  linkSelector,
  linkSources,
  statusSelector,
  type FormSchemaItem,
} from "../../../core/editor";
import { editorLabel, t } from "../../../core/i18n";
import { listPlatforms, selectDevices } from "../../../core/presets";
import type { DevicesConfig } from "./card";

export class DevicesEditor extends HocBaseEditor<DevicesConfig> {
  protected override fieldListNames = ["columns"];
  protected override ruleListNames = ["status"];
  protected override linkNames = ["link"];
  protected override noneNames = ["platform"];

  /** The same device twice would tie two entries together, so duplicates are dropped. */
  protected override valueChanged(event: CustomEvent<{ value: DevicesConfig }>): void {
    const { devices } = event.detail.value;
    if (Array.isArray(devices)) {
      event.detail.value = { ...event.detail.value, devices: [...new Set(devices)] };
    }
    super.valueChanged(event);
  }

  private deviceIds(): string[] {
    const { hass, config } = this;
    if (!hass || !config) return [];
    return selectDevices(hass, config.devices, config.platform).map((device) => device.id);
  }

  private columnOptions(ids: string[]): FieldOption[] {
    const { hass } = this;
    if (!hass) return [];
    const options = new Map<string, FieldOption>();
    for (const id of ids) {
      for (const option of discoverFieldOptions(hass, id)) options.set(option.value, option);
    }
    return [...options.values()];
  }

  protected schema(): FormSchemaItem[] {
    const { hass, config } = this;
    const ids = this.deviceIds();
    const options = this.columnOptions(ids);
    const { hasDevicePage, attributeUrls } = linkSources(hass, ids);
    const platforms = hass ? listPlatforms(hass) : [];
    const platformOptions = [
      { value: "none", label: hass ? t(hass, "platform_none") : "none" },
      ...platforms,
    ];
    return [
      { name: "platform", selector: { select: { mode: "dropdown", options: platformOptions } } },
      {
        name: "devices",
        selector: {
          device: { multiple: true, ...(config?.platform ? { integration: config.platform } : {}) },
        },
      },
      fieldsSelectorFromOptions(hass, options, "columns", true),
      {
        name: "sort_by",
        selector: {
          select: {
            mode: "dropdown",
            custom_value: true,
            options: [
              { value: "name", label: hass ? editorLabel(hass, "name") : "Name" },
              ...options,
            ],
          },
        },
      },
      choiceSelector(hass, "order", ["asc", "desc"], "sort_order"),
      { name: "hide_owner", selector: { boolean: {} } },
      linkSelector(hass, hasDevicePage, attributeUrls),
      { name: "show_status", selector: { boolean: {} } },
      ...(config?.show_status ? [statusSelector(hass, options)] : []),
      choiceSelector(hass, "titles", ["text", "icon", "icon_text"], "column_titles"),
      { name: "max_height", selector: { number: { min: 100, max: 2000, mode: "box" } } },
    ];
  }
}
