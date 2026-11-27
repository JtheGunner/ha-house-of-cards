import { deviceSelector, HocBaseEditor, type FormSchemaItem } from "../../../core/editor";
import type { GithubAttentionConfig } from "./card";

export class GithubAttentionEditor extends HocBaseEditor<GithubAttentionConfig> {
  protected schema(): FormSchemaItem[] {
    return [
      deviceSelector("github_pulse"),
      {
        name: "repositories",
        selector: { device: { integration: "github_pulse", multiple: true } },
      },
      { name: "show_when_clean", selector: { boolean: {} } },
    ];
  }
}
