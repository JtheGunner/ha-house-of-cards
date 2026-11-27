import {
  deviceSelector,
  fieldsSelector,
  HocBaseEditor,
  layoutSelector,
} from "../../../core/editor";
import type { GithubConfig } from "./card";

export class GithubEditor extends HocBaseEditor<GithubConfig> {
  protected override fieldListNames = ["fields"];

  protected schema() {
    return [
      { ...deviceSelector("github_pulse"), required: true },
      layoutSelector(this.hass, ["compact", "standard", "list"]),
      { name: "name", selector: { text: {} } },
      { name: "link", selector: { boolean: {} } },
      { name: "show_release", selector: { boolean: {} } },
      { name: "show_status", selector: { boolean: {} } },
      fieldsSelector(this.hass, this.config?.device),
    ];
  }
}
