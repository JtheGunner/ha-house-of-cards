import {
  deviceSelector,
  fieldsSelector,
  HocBaseEditor,
  layoutSelector,
} from "../../../core/editor";
import type { FieldsConfig } from "../../../core/fields-card";
import { findAccountDevice } from "../../../core/resolver";

export class GithubProfileEditor extends HocBaseEditor<FieldsConfig> {
  protected schema() {
    const device =
      this.config?.device ?? (this.hass ? findAccountDevice(this.hass, "github_pulse") : undefined);
    return [
      deviceSelector("github_pulse"),
      layoutSelector(["compact", "standard", "list"]),
      fieldsSelector(this.hass, device),
    ];
  }
}
