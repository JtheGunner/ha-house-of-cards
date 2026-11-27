import type { ResolvedEntities } from "./resolver";

export type ActionKind = "none" | "more-info" | "fire-dom-event";

/** A tap or hold action in the Home Assistant style. Other keys are passed on by `fire-dom-event`. */
export interface CardAction {
  action: ActionKind;
  /** Sensor key of the row's device whose dialog `more-info` opens. */
  entity?: string;
  [key: string]: unknown;
}

export interface ActionContext {
  entityId?: string;
  deviceId: string;
  deviceName: string;
}

export const HOLD_MS = 500;

/** A copy of `value` in which `{{ name }}` is replaced in every string; unknown names stay as written. */
export function substitutePlaceholders(value: unknown, vars: Record<string, string>): unknown {
  if (typeof value === "string") {
    return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) => vars[name] ?? match);
  }
  if (Array.isArray(value)) return value.map((item) => substitutePlaceholders(item, vars));
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, substitutePlaceholders(item, vars)]),
    );
  }
  return value;
}

/** The entity id an action targets: its `entity` key, else `defaultKey`, else the first entity. */
export function resolveActionEntity(
  action: CardAction | undefined,
  entities: ResolvedEntities,
  defaultKey: string | undefined,
): string | undefined {
  const key = action?.entity ?? defaultKey;
  if (key !== undefined) return entities[key]?.entity_id;
  return Object.values(entities).find((state) => state !== undefined)?.entity_id;
}

export function isActionActive(action: CardAction | undefined, context: ActionContext): boolean {
  if (!action || action.action === "none") return false;
  if (action.action === "more-info") return context.entityId !== undefined;
  return action.action === "fire-dom-event";
}

function fire(node: HTMLElement, type: string, detail: unknown): void {
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}

export function runAction(
  node: HTMLElement,
  action: CardAction | undefined,
  context: ActionContext,
): void {
  if (!action || !isActionActive(action, context)) return;
  if (action.action === "more-info") {
    fire(node, "hass-more-info", { entityId: context.entityId });
    return;
  }
  fire(
    node,
    "ll-custom",
    substitutePlaceholders(action, {
      entity: context.entityId ?? "",
      device_id: context.deviceId,
      device_name: context.deviceName,
    }),
  );
}

/** Tells a tap from a hold: a press of `holdMs` runs `onHold` and swallows the click that follows. */
export class GestureTracker {
  private timer: ReturnType<typeof setTimeout> | undefined;
  private pressed = false;
  private held = false;

  constructor(
    private readonly onTap: () => void,
    private readonly onHold: () => void,
    private readonly holdMs = HOLD_MS,
  ) {}

  readonly onPointerDown = (): void => {
    this.clearTimer();
    this.pressed = true;
    this.held = false;
    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.held = true;
      this.onHold();
    }, this.holdMs);
  };

  readonly onPointerUp = (): void => {
    this.clearTimer();
    this.pressed = false;
  };

  readonly onPointerCancel = (): void => {
    this.clearTimer();
    this.pressed = false;
    this.held = false;
  };

  readonly onClick = (event: Event): void => {
    if (this.held) {
      this.held = false;
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.onTap();
  };

  readonly onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    this.onTap();
  };

  readonly onContextMenu = (event: Event): void => {
    if (this.pressed || this.held) event.preventDefault();
  };

  private clearTimer(): void {
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
  }
}
