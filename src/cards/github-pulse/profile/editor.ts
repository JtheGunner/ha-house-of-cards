import {
  deviceSelector,
  fieldsSelector,
  HocBaseEditor,
  layoutSelector,
} from "../../../core/editor";
import type { FieldsConfig } from "../../../core/fields-card";
import { findAccountDevice } from "../../../core/resolver";

export class GithubProfileEditor extends HocBaseEditor<FieldsConfig> {
  protected override fieldListNames = ["fields"];

  protected schema() {
    const device =
      this.config?.device ?? (this.hass ? findAccountDevice(this.hass, "github_pulse") : undefined);
    return [
      deviceSelector("github_pulse"),
      layoutSelector(["compact", "standard", "list"]),
      { name: "name", selector: { text: {} } },
      { name: "link", selector: { boolean: {} } },
      { name: "show_status", selector: { boolean: {} } },
      fieldsSelector(this.hass, device),
    ];
  }
}
