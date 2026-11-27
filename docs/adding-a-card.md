# Adding a card

A card is one folder plus one registry entry.

1. Create `src/cards/<integration>/<name>/` with `card.ts`, `editor.ts` and `card.test.ts`. Generic cards go under `src/cards/generic/`.
2. In `card.ts`, extend `HocBaseCard` and implement `renderContent()`. Set `static requiredKeys` for options that must be present. Find entities with `resolveDeviceEntities(hass, deviceId, platform)`; it returns the device's entities keyed by `translation_key`, and leaves out sensors that are disabled.
3. In `editor.ts`, extend `HocBaseEditor` and return the form schema. `deviceSelector(integration)` and `layoutSelector(options)` cover the common cases.
4. Export a `CardDefinition` from `card.ts` (`tag`, `ctor`, `editorTag`, `editorCtor`, `name`, `description`) and add it to the list in `src/registry.ts`. Use the tag pattern `hoc-<integration>-<name>-card`.
5. Add labels to `src/core/locales/en.ts` and `de.ts`.
6. Write `docs/cards/<tag>.md` with a YAML example. A test fails if a registered card has no doc or a doc names an unregistered card.
7. Run `npm test`, `npm run lint`, `npm run typecheck` and `npm run build`, and commit the rebuilt `dist/`.

Style only with Home Assistant theme variables so the card follows the active theme.
