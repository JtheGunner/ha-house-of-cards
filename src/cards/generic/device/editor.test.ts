import { beforeAll, describe, expect, it } from "vitest";
import { fixtureHass } from "../../../../test/fixtures/hass";
import { registerCards } from "../../../registry";
import { deviceCardDefinition } from "./card";
import type { DeviceCardEditor } from "./editor";

beforeAll(() => registerCards([deviceCardDefinition]));

async function mountEditor(platform: string, config: Record<string, unknown> = {}, url?: string) {
  const hass = fixtureHass({
    language: "de",
    devices: [{ id: "d1", name: "Thing", configuration_url: url }],
    entities: [{ platform, deviceId: "d1", translationKey: "stars", state: "1" }],
  });
  const editor = document.createElement("hoc-device-card-editor") as DeviceCardEditor;
  editor.hass = hass;
  editor.setConfig({ type: "custom:hoc-device-card", device: "d1", ...config } as never);
  document.body.append(editor);
  await editor.updateComplete;
  const form = editor.shadowRoot?.querySelector("ha-form") as unknown as {
    schema: { name: string; selector: Record<string, unknown> }[];
    computeLabel: (item: { name: string }) => string;
  } & HTMLElement;
  const received: Record<string, unknown>[] = [];
  editor.addEventListener("config-changed", (event) =>
    received.push((event as CustomEvent).detail.config),
  );
  return { form, received };
}

describe("hoc-device-card editor", () => {
  it("offers a badge, a link source and a link URL instead of the release switch", async () => {
    const { form } = await mountEditor("github_pulse");
    const names = form.schema.map((item) => item.name);
    expect(names).toEqual(expect.arrayContaining(["badge", "link", "link_url"]));
    expect(names).not.toContain("show_release");
  });

  it("offers the device page as a link source only when the device has one", async () => {
    const withUrl = await mountEditor("github_pulse", {}, "https://github.com/o/r");
    const options = (form: typeof withUrl.form) =>
      (
        form.schema.find((item) => item.name === "link")?.selector as {
          select: { options: { value: string }[] };
        }
      ).select.options.map((o) => o.value);
    expect(options(withUrl.form)).toEqual(["none", "device"]);
    const without = await mountEditor("github_pulse");
    expect(options(without.form)).toEqual(["none"]);
  });

  it("offers attributes that hold an https URL as link sources", async () => {
    const hass = fixtureHass({
      devices: [{ id: "d1", name: "Thing" }],
      entities: [
        {
          platform: "github_pulse",
          deviceId: "d1",
          translationKey: "latest_release",
          state: "v1",
          attributes: { url: "https://x/r", tag: "v1" },
        },
      ],
    });
    const editor = document.createElement("hoc-device-card-editor") as DeviceCardEditor;
    editor.hass = hass;
    editor.setConfig({ type: "x", device: "d1" } as never);
    document.body.append(editor);
    await editor.updateComplete;
    const form = editor.shadowRoot?.querySelector("ha-form") as unknown as {
      schema: { name: string; selector: { select: { options: { value: string }[] } } }[];
    };
    const values = form.schema
      .find((item) => item.name === "link")
      ?.selector.select.options.map((o) => o.value);
    expect(values).toEqual(["none", "latest_release:url"]);
  });

  it("stores no link when the source is none and cleans the badge", async () => {
    const { form, received } = await mountEditor("other");
    form.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { link: "none", badge: { key: "stars", color: "" } } },
      }),
    );
    expect(received[0]).not.toHaveProperty("link");
    expect(received[0]?.["badge"]).toEqual({ key: "stars" });
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { badge: {} } } }));
    expect(received[1]).not.toHaveProperty("badge");
  });

  it("offers status rules, labelled in the Home Assistant language", async () => {
    const { form } = await mountEditor("other");
    expect(form.schema.map((item) => item.name)).toContain("status");
    expect(form.computeLabel({ name: "status" })).toBe("Status-Regeln");
  });

  it("offers the rule states with translated labels and no free text", async () => {
    const { form } = await mountEditor("other");
    const rules = form.schema.find((item) => item.name === "status")?.selector as {
      object: { fields: { state: { selector: { select: Record<string, unknown> } } } };
    };
    const select = rules.object.fields.state.selector.select;
    expect(select["custom_value"]).toBeUndefined();
    expect((select["options"] as { label: string }[]).map((o) => o.label)).toEqual([
      "In Ordnung",
      "Warnung",
      "Fehler",
      "Kein Status",
    ]);
  });

  it("hides name and link options while the title is hidden", async () => {
    const { form } = await mountEditor("other", { show_title: false });
    const names = form.schema.map((item) => item.name);
    expect(names).toContain("show_title");
    expect(names).toContain("badge");
    for (const hidden of ["name", "link", "link_url"]) expect(names).not.toContain(hidden);
  });

  it("hides the status rules while the status is switched off", async () => {
    const { form } = await mountEditor("other", { show_status: false });
    expect(form.schema.map((item) => item.name)).not.toContain("status");
    expect(form.schema.map((item) => item.name)).toContain("show_status");
  });

  it("drops incomplete rules", async () => {
    const { form, received } = await mountEditor("other");
    form.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: {
            status: [
              { field: "stars", operator: ">", value: "5", state: "failure", extra: "" },
              { value: "1" },
            ],
          },
        },
      }),
    );
    expect(received[0]?.["status"]).toEqual([
      { field: "stars", operator: ">", value: "5", state: "failure" },
    ]);
  });

  it("removes the status option when all rules are deleted", async () => {
    const { form, received } = await mountEditor("other", {
      status: [{ field: "stars", state: "failure" }],
    });
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { status: [] } } }));
    expect(received[0]).not.toHaveProperty("status");
  });

  it("hides the link URL and drops it once a link source is chosen", async () => {
    const free = await mountEditor("github_pulse", {}, "https://github.com/o/r");
    expect(free.form.schema.map((item) => item.name)).toContain("link_url");
    const chosen = await mountEditor("github_pulse", { link: "device", link_url: "https://x/y" });
    expect(chosen.form.schema.map((item) => item.name)).not.toContain("link_url");
    free.form.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { link: "device", link_url: "https://x/y" } },
      }),
    );
    expect(free.received[0]).not.toHaveProperty("link_url");
    expect(free.received[0]?.["link"]).toBe("device");
  });
});

describe("hoc-device-card editor fields prefill", () => {
  const github = [
    "stars",
    "forks",
    "open_issues",
    "open_pull_requests",
    "commits_this_month",
    "latest_release",
  ].map((translationKey) => ({
    platform: "github_pulse",
    deviceId: "d1",
    translationKey,
    state: "1",
  }));

  async function mountGithub(config: Record<string, unknown> = {}) {
    const hass = fixtureHass({ devices: [{ id: "d1", name: "repo" }], entities: github });
    const editor = document.createElement("hoc-device-card-editor") as unknown as HTMLElement & {
      hass: unknown;
      setConfig: (config: unknown) => void;
      updateComplete: Promise<unknown>;
    };
    editor.hass = hass;
    editor.setConfig({ type: "x", device: "d1", ...config });
    document.body.append(editor);
    await editor.updateComplete;
    const form = editor.shadowRoot?.querySelector("ha-form") as unknown as {
      data: Record<string, unknown>;
    } & HTMLElement;
    const received: Record<string, unknown>[] = [];
    editor.addEventListener("config-changed", (event) =>
      received.push((event as CustomEvent).detail.config),
    );
    return { form, received };
  }

  const keys = (data: Record<string, unknown>) =>
    (data["fields"] as { key: string }[]).map((entry) => entry.key);

  it("lists the default fields of the layout while fields is empty", async () => {
    const standard = await mountGithub();
    expect(keys(standard.form.data)).toEqual([
      "stars",
      "forks",
      "open_issues",
      "open_pull_requests",
      "commits_this_month",
      "latest_release",
    ]);
    const compact = await mountGithub({ layout: "compact" });
    expect(keys(compact.form.data)).toEqual(["stars", "latest_release"]);
  });

  it("shows the chosen fields instead of the defaults", async () => {
    const { form } = await mountGithub({ fields: ["forks"] });
    expect(keys(form.data)).toEqual(["forks"]);
  });

  it("keeps fields unset while the shown defaults are untouched, so they follow the layout", async () => {
    const { form, received } = await mountGithub();
    form.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { layout: "compact", fields: form.data["fields"] } },
      }),
    );
    expect(received[0]?.["layout"]).toBe("compact");
    expect(received[0]).not.toHaveProperty("fields");
  });

  it("stores the fields once one of them is changed", async () => {
    const { form, received } = await mountGithub();
    const edited = (form.data["fields"] as Record<string, unknown>[]).slice(0, 2);
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { fields: edited } } }));
    expect((received[0]?.["fields"] as { key: string }[]).map((f) => f.key)).toEqual([
      "stars",
      "forks",
    ]);
  });
});
