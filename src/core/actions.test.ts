import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import {
  GestureTracker,
  isActionActive,
  resolveActionEntity,
  runAction,
  substitutePlaceholders,
  type ActionContext,
  type CardAction,
} from "./actions";
import type { ResolvedEntities } from "./resolver";

const entities: ResolvedEntities = {
  ci_state: { entity_id: "sensor.ci", state: "success", attributes: {} },
  stars: { entity_id: "sensor.stars", state: "5", attributes: {} },
};

const context: ActionContext = {
  entityId: "sensor.ci",
  deviceId: "dev1",
  deviceName: "owner/repo",
};

describe("substitutePlaceholders", () => {
  it("replaces placeholders in nested objects and arrays and leaves unknown ones", () => {
    const input = {
      title: "{{ device_name }}",
      list: ["{{ entity }}", { id: "{{ device_id }}" }],
      other: "{{ unknown }}",
      count: 3,
    };
    const copy = structuredClone(input);
    const result = substitutePlaceholders(input, {
      entity: "sensor.ci",
      device_id: "dev1",
      device_name: "owner/repo",
    });
    expect(result).toEqual({
      title: "owner/repo",
      list: ["sensor.ci", { id: "dev1" }],
      other: "{{ unknown }}",
      count: 3,
    });
    expect(input).toEqual(copy);
  });
});

describe("resolveActionEntity", () => {
  it("prefers the entity of the action", () => {
    expect(
      resolveActionEntity({ action: "more-info", entity: "stars" }, entities, "ci_state"),
    ).toBe("sensor.stars");
  });

  it("falls back to the default key, then to the first entity", () => {
    expect(resolveActionEntity({ action: "more-info" }, entities, "stars")).toBe("sensor.stars");
    expect(resolveActionEntity({ action: "more-info" }, entities, undefined)).toBe("sensor.ci");
  });

  it("returns undefined for an unknown key or without entities", () => {
    expect(resolveActionEntity({ action: "more-info", entity: "nope" }, entities, "ci_state")).toBe(
      undefined,
    );
    expect(resolveActionEntity({ action: "more-info" }, {}, undefined)).toBe(undefined);
  });
});

describe("isActionActive", () => {
  it("is false without an action or for none", () => {
    expect(isActionActive(undefined, context)).toBe(false);
    expect(isActionActive({ action: "none" }, context)).toBe(false);
  });

  it("needs an entity for more-info but not for fire-dom-event", () => {
    const noEntity = { ...context, entityId: undefined };
    expect(isActionActive({ action: "more-info" }, context)).toBe(true);
    expect(isActionActive({ action: "more-info" }, noEntity)).toBe(false);
    expect(isActionActive({ action: "fire-dom-event" }, noEntity)).toBe(true);
  });
});

describe("runAction", () => {
  function listen(type: string): CustomEvent[] {
    const received: CustomEvent[] = [];
    document.addEventListener(type, (event) => received.push(event as CustomEvent), {
      once: true,
    });
    return received;
  }

  it("opens the more-info dialog of the entity", () => {
    const received = listen("hass-more-info");
    const node = document.createElement("div");
    document.body.append(node);
    runAction(node, { action: "more-info" }, context);
    expect(received).toHaveLength(1);
    expect(received[0]?.detail).toEqual({ entityId: "sensor.ci" });
    expect(received[0]?.composed).toBe(true);
  });

  it("fires nothing for more-info without an entity", () => {
    const received = listen("hass-more-info");
    const node = document.createElement("div");
    document.body.append(node);
    runAction(node, { action: "more-info" }, { ...context, entityId: undefined });
    expect(received).toHaveLength(0);
  });

  it("fires ll-custom with the substituted config", () => {
    const received = listen("ll-custom");
    const node = document.createElement("div");
    document.body.append(node);
    const action: CardAction = {
      action: "fire-dom-event",
      browser_mod: { data: { title: "{{ device_name }}", entity: "{{ entity }}" } },
    };
    runAction(node, action, context);
    expect(received).toHaveLength(1);
    expect(received[0]?.detail).toEqual({
      action: "fire-dom-event",
      browser_mod: { data: { title: "owner/repo", entity: "sensor.ci" } },
    });
    expect(received[0]?.composed).toBe(true);
    expect(received[0]?.bubbles).toBe(true);
  });
});

describe("GestureTracker", () => {
  let onTap: Mock<() => void>;
  let onHold: Mock<() => void>;
  let tracker: GestureTracker;

  beforeEach(() => {
    vi.useFakeTimers();
    onTap = vi.fn<() => void>();
    onHold = vi.fn<() => void>();
    tracker = new GestureTracker(onTap, onHold);
  });
  afterEach(() => vi.useRealTimers());

  it("holds after 500 ms and then swallows the click", () => {
    tracker.onPointerDown();
    vi.advanceTimersByTime(500);
    expect(onHold).toHaveBeenCalledTimes(1);
    tracker.onPointerUp();
    const click = new MouseEvent("click", { cancelable: true });
    tracker.onClick(click);
    expect(onTap).not.toHaveBeenCalled();
    expect(click.defaultPrevented).toBe(true);
  });

  it("taps on a short press", () => {
    tracker.onPointerDown();
    vi.advanceTimersByTime(100);
    tracker.onPointerUp();
    tracker.onClick(new MouseEvent("click", { cancelable: true }));
    vi.advanceTimersByTime(1000);
    expect(onTap).toHaveBeenCalledTimes(1);
    expect(onHold).not.toHaveBeenCalled();
  });

  it("does nothing when the press is cancelled", () => {
    tracker.onPointerDown();
    tracker.onPointerCancel();
    vi.advanceTimersByTime(600);
    expect(onHold).not.toHaveBeenCalled();
    expect(onTap).not.toHaveBeenCalled();
  });

  it("taps the next click after a cancelled hold", () => {
    tracker.onPointerDown();
    vi.advanceTimersByTime(500);
    tracker.onPointerCancel();
    tracker.onClick(new MouseEvent("click", { cancelable: true }));
    expect(onTap).toHaveBeenCalledTimes(1);
  });

  it("taps on Enter and Space only", () => {
    tracker.onKeyDown(new KeyboardEvent("keydown", { key: "Enter", cancelable: true }));
    tracker.onKeyDown(new KeyboardEvent("keydown", { key: " ", cancelable: true }));
    tracker.onKeyDown(new KeyboardEvent("keydown", { key: "a", cancelable: true }));
    expect(onTap).toHaveBeenCalledTimes(2);
  });

  it("suppresses the context menu while a press is pending", () => {
    tracker.onPointerDown();
    const menu = new Event("contextmenu", { cancelable: true });
    tracker.onContextMenu(menu);
    expect(menu.defaultPrevented).toBe(true);
    tracker.onPointerUp();
    const later = new Event("contextmenu", { cancelable: true });
    tracker.onContextMenu(later);
    expect(later.defaultPrevented).toBe(false);
  });
});
