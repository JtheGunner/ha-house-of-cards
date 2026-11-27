import { HocBaseEditor, type FormSchemaItem } from "../../../core/editor";
import { COLUMN_KEYS, type GithubReposConfig } from "./card";

export class GithubReposEditor extends HocBaseEditor<GithubReposConfig> {
  protected schema(): FormSchemaItem[] {
    return [
      {
        name: "repositories",
        selector: { device: { integration: "github_pulse", multiple: true } },
      },
      {
        name: "columns",
        selector: { select: { multiple: true, mode: "list", options: [...COLUMN_KEYS] } },
      },
      {
        name: "sort_by",
        selector: { select: { mode: "dropdown", options: ["name", ...COLUMN_KEYS] } },
      },
      {
        name: "sort_order",
        selector: { select: { mode: "dropdown", options: ["asc", "desc"] } },
      },
      { name: "max_height", selector: { number: { min: 100, max: 2000, mode: "box" } } },
    ];
  }
}
