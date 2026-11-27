import {
  badgeSelector,
  fieldsSelector,
  HocBaseEditor,
  layoutSelector,
  linkSelector,
  linkSources,
  statusSelector,
} from "../../../core/editor";
import { discoverFieldOptions, parseField, type FieldConfig } from "../../../core/fields";
import { layoutOf } from "../../../core/fields-card";
import { defaultFieldsFor, presetOfDevice } from "../../../core/presets";
import { resolveDeviceEntities } from "../../../core/resolver";
import type { DeviceCardConfig } from "./card";

export class DeviceCardEditor extends HocBaseEditor<DeviceCardConfig> {
  protected override fieldListNames = ["fields"];
  protected override singleFieldNames = ["badge"];
  protected override ruleListNames = ["status"];
  protected override linkNames = ["link"];
  protected override onByDefaultNames = ["show_title", "show_status"];

  /** The fields of the chosen layout that the card would show, so they can be edited in place. */
  protected override defaultFields(name: string): FieldConfig[] | undefined {
    const { hass, config } = this;
    const device = config?.device;
    if (name !== "fields" || !hass || !device) return undefined;
    const preset = presetOfDevice(hass, device);
    const entities = resolveDeviceEntities(hass, device, preset?.platform);
    return defaultFieldsFor(preset, layoutOf(config.layout), entities).filter(
      (field) => parseField(field).key in entities,
    );
  }

  /** The link source wins over the URL, so the URL is dropped once a source is chosen. */
  protected override finalizeConfig(config: Record<string, unknown>): void {
    if (config["link"]) delete config["link_url"];
  }

  protected schema() {
    const device = this.config?.device;
    const hass = this.hass;
    const options = hass && device ? discoverFieldOptions(hass, device) : [];
    const titleShown = this.config?.show_title !== false;
    const { hasDevicePage, attributeUrls } = linkSources(hass, device ? [device] : []);
    return [
      { name: "device", required: true, selector: { device: {} } },
      layoutSelector(hass, ["compact", "standard", "list"]),
      { name: "show_title", selector: { boolean: {} } },
      ...(titleShown ? [{ name: "name", selector: { text: {} } }] : []),
      badgeSelector(hass, options),
      ...(titleShown ? [linkSelector(hass, hasDevicePage, attributeUrls)] : []),
      ...(titleShown && !this.config?.link
        ? [{ name: "link_url", selector: { text: { type: "url" } } }]
        : []),
      { name: "show_status", selector: { boolean: {} } },
      ...(this.config?.show_status !== false ? [statusSelector(hass, options)] : []),
      fieldsSelector(hass, device),
    ];
  }
}
