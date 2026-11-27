# HHOC-18: Devices card popup actions — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `hoc-devices-card` gets `tap_action` and `hold_action` for the row title: the Home Assistant more-info popup or a `browser_mod` popup fired as `ll-custom`.

**Architecture:** A new `src/core/actions.ts` holds the pure parts (placeholder substitution, entity resolution, firing the events) and a small gesture tracker (tap vs. hold). The devices card resolves each row's action context and renders the title through the tracker. The shared editor base class learns one new option kind (`actionNames`) that shows an action object as a dropdown.

**Tech Stack:** TypeScript, Lit 3, Vitest + happy-dom, Prettier/ESLint (`npm test`, `npm run lint`, `npm run typecheck`, `npx prettier --check .`).

**Spec:** `docs/plans/HHOC-18-design.md`

## Global Constraints

- Actions: `more-info`, `fire-dom-event`, `none` only. Hold threshold: 500 ms.
- Placeholders (plain substitution in every string value, unknown ones untouched): `{{ entity }}`, `{{ device_id }}`, `{{ device_name }}`.
- A set `tap_action` (not `none`) replaces the link on tap; with only `hold_action` the link keeps working. Without actions nothing changes.
- Device card, YouTrack card, per-device overrides and other HA actions are out of scope.
- English identifiers and comments; German and English strings in `src/core/locales/`. Run Prettier before each commit.

## Review Focus

- Title with an action but no resolvable entity (`more-info`): nothing fires, no error, and the title stays a link/plain text.
- Long press followed by release must not also run the tap action or follow the link.
- Pointer moved away or cancelled before 500 ms: no hold, no tap.
- Placeholders inside nested objects and arrays of the `fire-dom-event` config; config objects are never mutated (the card config is reused for every row).
- Existing `link` configs and the editor round trip keep a YAML-only `fire-dom-event` action untouched.

---

### Task 1: Action helpers and gesture tracker

**Files:**

- Create: `src/core/actions.ts`, `src/core/actions.test.ts`

**Interfaces:**

- Produces:
  - `type ActionKind = "none" | "more-info" | "fire-dom-event"`
  - `interface CardAction { action: ActionKind; entity?: string; [key: string]: unknown }`
  - `interface ActionContext { entityId?: string; deviceId: string; deviceName: string }`
  - `substitutePlaceholders(value: unknown, vars: Record<string, string>): unknown` — returns a new structure.
  - `resolveActionEntity(action: CardAction | undefined, entities: ResolvedEntities, defaultKey: string | undefined): string | undefined` — `entity` key, else `defaultKey`, else the first entity; returns an entity id.
  - `isActionActive(action: CardAction | undefined, context: ActionContext): boolean` — false for `undefined`/`none`; `more-info` needs `context.entityId`.
  - `runAction(node: HTMLElement, action: CardAction | undefined, context: ActionContext): void` — `more-info` dispatches `hass-more-info` `{ entityId }`; `fire-dom-event` dispatches `ll-custom` with the substituted config; both `bubbles` and `composed`. Does nothing when `!isActionActive`.
  - `class GestureTracker` — `constructor(onTap: () => void, onHold: () => void, holdMs = 500)`; fields `onPointerDown`, `onPointerUp`, `onPointerCancel`, `onClick`, `onKeyDown`, `onContextMenu` as arrow-function handlers to bind in Lit templates.

- [ ] **Step 1: Write failing tests** in `src/core/actions.test.ts`:
  - `substitutePlaceholders` replaces `{{ entity }}` in a nested object/array, leaves `{{ unknown }}` untouched, and the input object is unchanged (`toEqual` on a deep copy).
  - `resolveActionEntity`: explicit `entity: "ci_state"` wins; without it `defaultKey` is used; without both the first entity; an unknown key returns `undefined`.
  - `runAction` more-info: a listener on `document` receives `hass-more-info` with `detail.entityId === "sensor.x"`; with no `entityId` no event is dispatched.
  - `runAction` fire-dom-event: `ll-custom` detail equals the config with placeholders replaced and `composed === true`.
  - `GestureTracker` with `vi.useFakeTimers()`: pointerdown + 500 ms → `onHold` once; the following pointerup/click do not call `onTap`; pointerdown + pointerup after 100 ms + click → `onTap` once; pointerdown + pointercancel + 600 ms → neither; Enter and Space keydown → `onTap`; contextmenu is `preventDefault`ed while a hold is pending or fired.
- [ ] **Step 2: Run** `npx vitest run src/core/actions.test.ts` — expect FAIL (module missing).
- [ ] **Step 3: Implement** `src/core/actions.ts` to the signatures above (hold timer started on pointerdown, cleared on up/cancel; a `held` flag set when the timer fires makes the next `onClick` a no-op and resets itself).
- [ ] **Step 4: Run** the same command — expect PASS; then `npm run typecheck && npm run lint`.
- [ ] **Step 5: Commit** — `git add src/core/actions.ts src/core/actions.test.ts && git commit -m "feat: add card action helpers and a tap/hold gesture tracker"`

### Task 2: Devices card uses the actions

**Files:**

- Modify: `src/cards/generic/devices/card.ts` (`DevicesConfig`, `Row`, `rows()`, title cell in `renderContent()`, styles)
- Test: `src/cards/generic/devices/card.test.ts`

**Interfaces:**

- Consumes: everything from Task 1.
- Produces: `DevicesConfig.tap_action?: CardAction`, `DevicesConfig.hold_action?: CardAction`; `Row` gains `context: ActionContext`.

- [ ] **Step 1: Write failing tests** with the existing `mount()` helper (extend it to return `card`):
  - `tap_action: { action: "more-info" }` on a github_pulse row: clicking the name button dispatches `hass-more-info` with the entity id of the first column's entity (`sensor.github_pulse_r1_ci_state`) and the title is not an `<a>` even with `link: device` set.
  - `tap_action.entity: "stars"` uses the stars entity.
  - `hold_action: { action: "fire-dom-event", browser_mod: { data: { title: "{{ device_name }}" } } }`: pointerdown + 500 ms (fake timers) dispatches `ll-custom` whose `browser_mod.data.title` is the row's device name; the second row gets its own name (config not mutated).
  - Only `hold_action` set and `link: device` with a URL: the `<a>` is still rendered.
  - `tap_action: { action: "none" }` and no actions: markup identical to today (existing tests stay green).
  - A device without entities and `more-info`: no button, no event.
- [ ] **Step 2: Run** `npx vitest run src/cards/generic/devices/card.test.ts` — expect the new tests FAIL.
- [ ] **Step 3: Implement.** In `rows()` build `context` (`entityId` via `resolveActionEntity(config.tap_action ?? config.hold_action, entities, columnSpecs[0]?.key)`; the default entity of each action is resolved per action when firing, so keep `entities` reachable on the row instead of one id if that is simpler). In `renderContent()` wrap the name in `<span class="action" role="button" tabindex="0">` bound to one `GestureTracker` per row (tap → `runAction(..., config.tap_action)`, hold → `runAction(..., config.hold_action)`) when either action `isActionActive`; render the `<a>` only when `tap_action` is not active. Add `.action { cursor: pointer; user-select: none }` and a focus-visible outline in the card styles.
- [ ] **Step 4: Run** the card tests, then `npm test` — expect all PASS.
- [ ] **Step 5: Commit** — `git commit -am "feat: open popups from the devices card title"` (add new files if any).

### Task 3: Editor support

**Files:**

- Modify: `src/core/editor.ts` (`HocBaseEditor`: `actionNames`, `formData()`, `valueChanged()`; new `actionSelector`), `src/core/i18n.ts` (`EDITOR_OPTION_NAMES` + `tap_action`, `hold_action`), `src/core/locales/en.ts`, `src/core/locales/de.ts`, `src/cards/generic/devices/editor.ts`
- Test: `src/cards/generic/devices/editor.test.ts`

**Interfaces:**

- Produces: `actionSelector(hass: HomeAssistant | undefined, name: string, current: CardAction | undefined): FormSchemaItem` — options `none`, `more-info`, plus `fire-dom-event` only while `current?.action === "fire-dom-event"`; `HocBaseEditor.actionNames: string[]` (protected, default `[]`).
- Locale keys: `editor_tap_action` ("Tap action" / "Tipp-Aktion"), `editor_hold_action` ("Hold action" / "Halten-Aktion"), `action_none` ("None" / "Keine"), `action_more_info` ("More info" / "Mehr Infos"), `action_fire_dom_event` ("Custom popup (YAML)" / "Eigenes Popup (YAML)").

- [ ] **Step 1: Write failing tests** in the devices `editor.test.ts` style:
  - schema contains `tap_action` and `hold_action` dropdowns with options `none`, `more-info`.
  - config `tap_action: { action: "more-info", entity: "stars" }` shows `"more-info"` in the form data; selecting `none` removes the option from the emitted config; selecting `more-info` from nothing emits `{ action: "more-info" }`.
  - config with `hold_action: { action: "fire-dom-event", browser_mod: {…} }`: the dropdown offers `fire-dom-event`, and an unrelated edit (e.g. `max_height`) emits the config with the object unchanged (deep equal).
  - every locale has `editor_tap_action` / `editor_hold_action` (the existing locale-completeness test covers `EDITOR_OPTION_NAMES`).
- [ ] **Step 2: Run** `npx vitest run src/cards/generic/devices/editor.test.ts` — expect FAIL.
- [ ] **Step 3: Implement.** `formData()`: for each `actionNames` entry map an object to its `action` string, missing to `"none"`. `valueChanged()`: a string equal to the previous object's `action` keeps the previous object; `"none"` deletes the option; any other string becomes `{ action: <string> }`. Register `tap_action`/`hold_action` in `DevicesEditor` (`actionNames`, schema entries after the link selector, `pairs` entry `["tap_action", "hold_action"]`).
- [ ] **Step 4: Run** the editor tests, then `npm test && npm run lint && npm run typecheck` — expect PASS.
- [ ] **Step 5: Commit** — `git commit -am "feat: edit tap and hold actions in the devices card editor"`

### Task 4: Documentation

**Files:**

- Modify: `docs/cards/hoc-devices-card.md` (add `src/core/actions.ts` to the drift comment, two rows in the options table, an "Actions" section), `CHANGELOG.md` (Unreleased → Added), `README.md` only if its devices section lists options.
- Test: `src/docs.test.ts` (existing)

- [ ] **Step 1: Write the docs.** The Actions section covers: both options, the three actions, `entity` and its defaults, the three placeholders, the link-precedence rule, hold = 500 ms, and a UI Minimalist example (a `browser_mod.popup` whose content is a `custom:hoc-device-card` for `{{ device_id }}`; the YAML from `HHOC-18-design.md`). No conversation history, no test counts.
- [ ] **Step 2: Run** `npm test && npx prettier --check .` — expect PASS.
- [ ] **Step 3: Commit** — `git commit -am "docs: describe tap and hold actions of the devices card"`

## Self-review

Spec coverage: actions and gestures (Tasks 1–2), entity default and placeholders (1–2), link precedence (2), editor (3), docs (4). Names used across tasks: `CardAction`, `ActionContext`, `runAction`, `isActionActive`, `resolveActionEntity`, `GestureTracker`, `actionNames`, `actionSelector`.
