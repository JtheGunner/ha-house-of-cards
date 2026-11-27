import { deviceSelector, HocBaseEditor } from "../../../core/editor";
import type { YoutrackProjectConfig } from "./card";

export class YoutrackProjectEditor extends HocBaseEditor<YoutrackProjectConfig> {
  protected schema() {
    return [{ ...deviceSelector("youtrack"), required: true }];
  }
}
