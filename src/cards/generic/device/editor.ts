import { HocBaseEditor, fieldsSelector, layoutSelector } from "../../../core/editor";
import type { DeviceCardConfig } from "./card";

export class DeviceCardEditor extends HocBaseEditor<DeviceCardConfig> {
  protected schema() {
    return [
      { name: "device", required: true, selector: { device: {} } },
      layoutSelector(["compact", "standard", "list"]),
      fieldsSelector(this.hass, this.config?.device),
    ];
  }
}
