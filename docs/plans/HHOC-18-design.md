# HHOC-18: Devices card — popup actions on the title

## Intent

A row of the devices table should be able to open a popup instead of linking away: Home Assistant's
standard more-info dialog, or a custom UI Minimalist popup (a `browser_mod` popup). Tap and long-tap
on the title each get their own action, in the Home Assistant style (`tap_action`, `hold_action`).

## Goals

- `tap_action` and `hold_action` on `hoc-devices-card`, applied to the title of every row.
- Actions: `more-info` (standard popup), `fire-dom-event` (custom `browser_mod` popup), `none`.
- Existing `link` configurations behave exactly as before.
- Visual editor, tests and docs cover the new options.

## Non-goals

- The device card and the YouTrack card.
- Per-device overrides (`devices: [{ device, tap_action }]`) — can build on this later.
- Actions on cells or columns; other HA actions (`navigate`, `call-service`, `url`).
- Building the custom popup itself — it stays the user's `browser_mod` / UI Minimalist setup.

## Approaches

- **A. Card-level actions (chosen).** One `tap_action` / `hold_action` for all rows; rows differ
  through placeholders. Smallest change; no change to the `devices` type.
- B. A plus per-device overrides. Matches "per entry" literally but changes the `devices` type, the
  editor and the device resolution, and does not work with `platform:` rows.
- C. Actions per cell/column. Much larger; not requested.

## Design

```yaml
type: custom:hoc-devices-card
platform: github_pulse
tap_action:
  action: more-info
  entity: ci_state            # sensor key of the row's device; optional
hold_action:
  action: fire-dom-event
  browser_mod:
    service: browser_mod.popup
    data:
      title: "{{ device_name }}"
      content:
        type: custom:hoc-device-card
        device: "{{ device_id }}"
```

- **`more-info`:** dispatches `hass-more-info` with the resolved entity id. `entity` is a sensor key
  resolved against the row's device (same keys as `columns`). Without it: the entity of the first
  column, else the first entity of the device. No resolvable entity → the action does nothing.
- **`fire-dom-event`:** dispatches `ll-custom` (bubbling, composed) with the action config, as Home
  Assistant does, so `browser_mod` picks it up. Before dispatch, `{{ entity }}`, `{{ device_id }}`
  and `{{ device_name }}` are replaced in every string value of the config (plain substitution, no
  template engine; unknown placeholders stay untouched).
- **Gestures:** tap is a click; hold is a press of at least 500 ms, after which the click that
  follows is suppressed. A title with an action is rendered as a focusable element
  (`role="button"`, Enter/Space trigger the tap action).
- **Link precedence:** a set `tap_action` (other than `none`) replaces the link on tap, so the title
  is no longer an `<a>`. With only `hold_action`, the link keeps working on tap.
- **Editor:** dropdowns for `none` / `more-info` per gesture; `fire-dom-event` is configured in YAML
  (the editor keeps it untouched, like other YAML-only options).
- **Docs:** new options in `docs/cards/hoc-devices-card.md`, including a UI Minimalist popup example.

## Left to the builder

Names of the helper module and its tests, the exact hold threshold handling (pointer events,
movement cancels), and the i18n strings.
