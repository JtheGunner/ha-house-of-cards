import {
  deviceSelector,
  fieldsSelector,
  HocBaseEditor,
  layoutSelector,
} from "../../../core/editor";
import type { YoutrackProjectConfig } from "./card";

export class YoutrackProjectEditor extends HocBaseEditor<YoutrackProjectConfig> {
  protected schema() {
    return [
      { ...deviceSelector("youtrack"), required: true },
      layoutSelector(["compact", "standard", "list"]),
      fieldsSelector(this.hass, this.config?.device),
    ];
  }
}
