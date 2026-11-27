import { deviceSelector, HocBaseEditor } from "../../../core/editor";
import type { GithubProfileConfig } from "./card";

export class GithubProfileEditor extends HocBaseEditor<GithubProfileConfig> {
  protected schema() {
    return [deviceSelector("github_pulse")];
  }
}
