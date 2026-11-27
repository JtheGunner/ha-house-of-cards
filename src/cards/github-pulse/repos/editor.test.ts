import { beforeAll, describe, expect, it } from "vitest";
import { fixtureHass } from "../../../../test/fixtures/hass";
import { registerCards } from "../../../registry";
import { reposCardDefinition } from "./card";
import type { GithubReposEditor } from "./editor";

beforeAll(() => registerCards([reposCardDefinition]));

describe("hoc-github-repos-card-editor", () => {
  it("never stores the same repository twice", async () => {
    const editor = document.createElement("hoc-github-repos-card-editor") as GithubReposEditor;
    editor.hass = fixtureHass();
    editor.setConfig({ type: "custom:hoc-github-repos-card", repositories: ["a"] });
    const received: Record<string, unknown>[] = [];
    editor.addEventListener("config-changed", (e) =>
      received.push((e as CustomEvent).detail.config),
    );
    document.body.append(editor);
    await editor.updateComplete;
    const form = editor.shadowRoot?.querySelector("ha-form") as HTMLElement;
    form.dispatchEvent(
      new CustomEvent("value-changed", { detail: { value: { repositories: ["a", "b", "a"] } } }),
    );
    expect(received[0]?.repositories).toEqual(["a", "b"]);
  });
});
