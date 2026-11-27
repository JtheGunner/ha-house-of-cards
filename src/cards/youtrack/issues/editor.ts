import { HocBaseEditor, type FormSchemaItem } from "../../../core/editor";
import type { YoutrackIssuesConfig } from "./card";

export class YoutrackIssuesEditor extends HocBaseEditor<YoutrackIssuesConfig> {
  protected schema(): FormSchemaItem[] {
    return [
      {
        name: "entity",
        required: true,
        selector: { entity: { integration: "youtrack", domain: "sensor" } },
      },
      { name: "max_items", selector: { number: { min: 1, max: 20, mode: "box" } } },
    ];
  }
}
