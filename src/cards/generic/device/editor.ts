import { HocBaseEditor, fieldsSelector, layoutSelector } from "../../../core/editor";
import type { DeviceCardConfig } from "./card";

export class DeviceCardEditor extends HocBaseEditor<DeviceCardConfig> {
  protected override fieldListNames = ["fields"];

  protected schema() {
    return [
      { name: "device", required: true, selector: { device: {} } },
      layoutSelector(this.hass, ["compact", "standard", "list"]),
      { name: "name", selector: { text: {} } },
      { name: "link", selector: { boolean: {} } },
      { name: "show_status", selector: { boolean: {} } },
      fieldsSelector(this.hass, this.config?.device),
    ];
  }
}
