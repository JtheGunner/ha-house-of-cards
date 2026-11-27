import {
  fieldsSelector,
  HocBaseEditor,
  layoutSelector,
  statusSelector,
} from "../../../core/editor";
import { discoverFieldOptions } from "../../../core/fields";
import { presetOfDevice } from "../../../core/presets";
import type { DeviceCardConfig } from "./card";

export class DeviceCardEditor extends HocBaseEditor<DeviceCardConfig> {
  protected override fieldListNames = ["fields"];
  protected override ruleListNames = ["status"];

  protected schema() {
    const device = this.config?.device;
    const hasBadge =
      this.hass && device ? presetOfDevice(this.hass, device)?.badgeKey !== undefined : false;
    const options = this.hass && device ? discoverFieldOptions(this.hass, device) : [];
    return [
      { name: "device", required: true, selector: { device: {} } },
      layoutSelector(this.hass, ["compact", "standard", "list"]),
      { name: "name", selector: { text: {} } },
      { name: "link", selector: { boolean: {} } },
      ...(hasBadge ? [{ name: "show_release", selector: { boolean: {} } }] : []),
      { name: "show_status", selector: { boolean: {} } },
      ...(this.config?.show_status !== false ? [statusSelector(this.hass, options)] : []),
      fieldsSelector(this.hass, device),
    ];
  }
}
