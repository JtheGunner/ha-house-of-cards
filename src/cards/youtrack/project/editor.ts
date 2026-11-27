import {
  deviceSelector,
  fieldsSelector,
  HocBaseEditor,
  layoutSelector,
} from "../../../core/editor";
import type { YoutrackProjectConfig } from "./card";

export class YoutrackProjectEditor extends HocBaseEditor<YoutrackProjectConfig> {
  protected override fieldListNames = ["fields"];

  protected schema() {
    return [
      { ...deviceSelector("youtrack"), required: true },
      layoutSelector(this.hass, ["compact", "standard", "list"]),
      { name: "name", selector: { text: {} } },
      { name: "link", selector: { boolean: {} } },
      { name: "show_status", selector: { boolean: {} } },
      fieldsSelector(this.hass, this.config?.device),
    ];
  }
}
