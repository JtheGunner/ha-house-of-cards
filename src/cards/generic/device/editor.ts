import {
  badgeSelector,
  fieldsSelector,
  HocBaseEditor,
  layoutSelector,
  linkSelector,
  statusSelector,
} from "../../../core/editor";
import { discoverFieldOptions } from "../../../core/fields";
import { isHttps } from "../../../core/format";
import type { DeviceCardConfig } from "./card";

export class DeviceCardEditor extends HocBaseEditor<DeviceCardConfig> {
  protected override fieldListNames = ["fields"];
  protected override singleFieldNames = ["badge"];
  protected override ruleListNames = ["status"];
  protected override linkNames = ["link"];

  protected schema() {
    const device = this.config?.device;
    const hass = this.hass;
    const options = hass && device ? discoverFieldOptions(hass, device) : [];
    const hasDevicePage = hass && device ? isHttps(hass.devices[device]?.configuration_url) : false;
    const attributeUrls = options.filter((option) => {
      const [key, attribute] = option.value.split(":");
      if (!hass || !key || !attribute) return false;
      return Object.values(hass.entities).some((entry) => {
        if (entry.device_id !== device || (entry.translation_key || entry.entity_id) !== key) {
          return false;
        }
        const value = hass.states[entry.entity_id]?.attributes[attribute];
        return typeof value === "string" && isHttps(value);
      });
    });
    return [
      { name: "device", required: true, selector: { device: {} } },
      layoutSelector(hass, ["compact", "standard", "list"]),
      { name: "name", selector: { text: {} } },
      badgeSelector(hass, options),
      linkSelector(hass, hasDevicePage, attributeUrls),
      { name: "link_url", selector: { text: { type: "url" } } },
      { name: "show_status", selector: { boolean: {} } },
      ...(this.config?.show_status !== false ? [statusSelector(hass, options)] : []),
      fieldsSelector(hass, device),
    ];
  }
}
