import { deviceSelector, HocBaseEditor, layoutSelector } from "../../../core/editor";
import type { GithubRepoConfig } from "./card";

export class GithubRepoEditor extends HocBaseEditor<GithubRepoConfig> {
  protected schema() {
    return [
      { ...deviceSelector("github_pulse"), required: true },
      layoutSelector(["compact", "standard", "detailed"]),
    ];
  }
}
