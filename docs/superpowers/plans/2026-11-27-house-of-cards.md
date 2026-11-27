# House of Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `ha-house-of-cards`, a HACS dashboard repo that ships one JS bundle with Home Assistant cards for `github_pulse` (phase 1) and `youtrack` (phase 2), extensible by adding a folder.

**Architecture:** A shared `core` (entity resolver, base card, UI parts, editor helpers, i18n) and one folder per card under `src/cards/<integration>/`. A registry lists every card; the entry file registers them and `window.customCards`. Vite builds a single `dist/ha-house-of-cards.js`.

**Tech Stack:** TypeScript, Lit, Vite (library mode), Vitest + happy-dom, ESLint, Prettier. Pin all versions.

**Spec:** `docs/superpowers/specs/2026-11-27-house-of-cards-design.md`

## Global Constraints

- Bundle: one file `dist/ha-house-of-cards.js`, committed; `hacs.json` category `dashboard`-style (`"filename": "ha-house-of-cards.js"`).
- Element prefix `hoc-`; YAML type `custom:hoc-<integration>-<name>-card` (e.g. `custom:hoc-github-repo-card`).
- Entities are matched by `platform` (`github_pulse` / `youtrack`) and `translation_key`; never by hand-written entity IDs.
- A missing or disabled sensor is omitted silently; an unavailable one renders as "unavailable", never throws.
- Colours, radius and fonts come from HA theme CSS variables only (no hard-coded theme colours).
- Language: code, docs, config keys in English; labels English + German via `hass.locale.language`, fallback `en`.
- HA 2026.9+: assume `getGridOptions`, `ha-form`/`ha-selector`, `window.customCards`.
- Trend arrow: flat within ±1 %; previous value 0 → arrow without percentage.
- Repos card keys (stable API): `stars`, `forks`, `open_issues`, `open_pull_requests`, `commits_this_month`, `commits_vs_last_month`, `ci_state`, `latest_release`, `days_since_last_commit`; defaults `ci_state`, `stars`, `commits_this_month`, `latest_release`; `sort_by` = any column key or `name`.
- Attention card: shows repos with `ci_state` `failure`/`error`, the `review_requests` count, the `stale_pull_requests` count (no own threshold); options `repositories` (default all), `show_when_clean` (default true → one line "All clear").
- MIT licence. Test fixtures derive from the integrations' source (`~/Projects/ha-github-pulse/custom_components/github_pulse/sensor_*.py`, `~/Projects/ha-youtrack/custom_components/youtrack/sensor.py`, `binary_sensor.py`), not invented data.
- Git: English conventional commits, no attribution trailers; work on a branch, never on `main`.

## Review Focus

1. Repository has zero enabled optional sensors → card still renders the always-on fields, no empty rows.
2. `ci_state` is `unavailable`/`unknown` or a value outside the enum → neutral dot, no crash.
3. `repositories: all` with 0 repos, or 50 repos → empty message / scrollable list.
4. Selected device was deleted from HA → card shows a clear "device not found" state.
5. `commits_vs_last_month` previous value 0 or sensor state non-numeric → no `NaN`/`Infinity` in the UI.

---

## File Structure

```text
package.json, tsconfig.json, vite.config.ts, vitest.config.ts, eslint.config.js, .prettierrc
hacs.json, LICENSE, README.md, .gitignore
src/index.ts                      registers all cards + window.customCards
src/registry.ts                   CardDefinition[]
src/core/types.ts                 minimal HomeAssistant / entity typings
src/core/resolver.ts              resolveDeviceEntities, listDevices
src/core/format.ts                trend(), relativeTime(), formatCount()
src/core/i18n.ts                  t(hass, key)
src/core/base-card.ts             HocBaseCard (Lit)
src/core/parts/                   stat-tile.ts, status-dot.ts, trend-arrow.ts, release-badge.ts
src/core/editor.ts                device picker + layout select helpers
src/cards/github-pulse/{repo,repos,profile,attention}/   card.ts, editor.ts, card.test.ts
src/cards/youtrack/{project,issues}/                      (phase 2)
test/fixtures/                    hass fixtures built from integration source
docs/cards/*.md, docs/adding-a-card.md
.github/workflows/ci.yaml, release.yaml
```

---

### Task 1: Repository scaffold and toolchain

**Files:**
- Create: all root config files above, `src/index.ts`, `test/smoke.test.ts`, `LICENSE` (MIT), `README.md` (house style, minimal), `.gitignore`
- Do: `git init`, branch `chore/scaffold` (initial commit of the spec/plan docs on `main` first)

**Interfaces:**
- Produces: scripts `npm run build` (writes `dist/ha-house-of-cards.js`, single ES module, Lit bundled), `npm test`, `npm run lint`, `npm run typecheck`.

- [ ] **Step 1: Failing test** `test/smoke.test.ts`: `it("bundle entry exports registerCards", ...)` importing `registerCards` from `src/index.ts` and asserting `typeof registerCards === "function"`.
- [ ] **Step 2:** Run `npm test` → FAIL (module missing).
- [ ] **Step 3:** Add toolchain with pinned versions; `src/index.ts` exports `registerCards(): void` (empty for now); Vite lib config outputs the single file.
- [ ] **Step 4:** `npm test && npm run lint && npm run typecheck && npm run build` → all pass; `dist/ha-house-of-cards.js` exists. Build twice and confirm identical hash (deterministic).
- [ ] **Step 5:** Commit `chore: scaffold toolchain and bundle`.

### Task 2: Entity resolver

**Files:** Create `src/core/types.ts`, `src/core/resolver.ts`, `test/fixtures/hass.ts`, `src/core/resolver.test.ts`

**Interfaces:**
- Produces:
  - `type ResolvedEntities = Record<string, HassEntityState | undefined>` (keyed by `translation_key`)
  - `resolveDeviceEntities(hass: HomeAssistant, deviceId: string, platform: string): ResolvedEntities`
  - `listDevices(hass: HomeAssistant, platform: string): { id: string; name: string }[]` (sorted by name)
  - `findAccountDevice(hass, platform): string | undefined` (device without `via_device_id`... use the device whose identifiers equal the config entry id; builder reads `entity.py` to confirm)
  - `fixtureHass(opts)` in test fixtures building `hass.entities`, `hass.devices`, `hass.states`.

- [ ] **Step 1: Tests** (Vitest): `resolves entities by translation_key for one device`; `ignores entities of other devices and platforms`; `omits disabled entities (hidden by registry) as undefined`; `returns unavailable state object unchanged`; `listDevices returns only devices of the platform, sorted`; `unknown device id returns empty record`.
- [ ] **Step 2:** Run `npx vitest run src/core/resolver.test.ts` → FAIL.
- [ ] **Step 3:** Implement the functions above using `hass.entities[entityId].{device_id,platform,translation_key}` and `hass.states`.
- [ ] **Step 4:** Tests pass.
- [ ] **Step 5:** Commit `feat: add device entity resolver`.

### Task 3: Formatting and i18n

**Files:** Create `src/core/format.ts`, `src/core/i18n.ts`, `src/core/locales/{en,de}.ts`, tests.

**Interfaces:**
- Produces:
  - `trend(value: number | null): { direction: "up" | "down" | "flat"; percent: number | null }`: flat when |value| ≤ 1; `percent` null when value is `null`/non-finite.
  - `formatCount(state: string | undefined): string` ("1.2k" style from 1000; `—` for non-numeric).
  - `relativeTime(iso: string, now: Date, lang: string): string`
  - `t(hass: Pick<HomeAssistant, "locale">, key: LocaleKey): string`: language from `hass.locale.language`, fallback `en`.

- [ ] **Step 1: Tests:** `trend flat at 1 and -1`, `trend up at 1.1`, `trend null for NaN/Infinity`, `formatCount returns — for "unavailable"`, `t falls back to en for unknown language`, `t returns German for de`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement (German strings written by you, English keys identical in both files). **Step 4:** Pass. **Step 5:** Commit `feat: add formatting and translations`.

### Task 4: Base card, registry and UI parts

**Files:** Create `src/core/base-card.ts`, `src/core/parts/*.ts`, `src/registry.ts`, update `src/index.ts`; tests `src/core/base-card.test.ts`, `src/core/parts/parts.test.ts`.

**Interfaces:**
- Produces:
  - `abstract class HocBaseCard<C extends BaseConfig> extends LitElement` with `setConfig(config: C): void` (throws on missing required key), `set hass(hass)`, `getCardSize(): number`, `getGridOptions()`, abstract `renderContent()`, built-in states `renderEmpty(messageKey)` / `renderError`.
  - `interface CardDefinition { tag: string; ctor: CustomElementConstructor; editorTag?: string; name: string; description: string; preview?: boolean }`
  - `cards: CardDefinition[]` in `registry.ts`; `registerCards()` calls `customElements.define` once per tag (idempotent) and pushes to `window.customCards`.
  - Parts (Lit templates): `statTile(label, value, unit?)`, `statusDot(state: string | undefined)` (success→green, failure/error→red, pending→amber, else neutral using theme variables), `trendArrow(t: ReturnType<typeof trend>)`, `releaseBadge(tag: string | undefined)`.

- [ ] **Step 1: Tests:** `registerCards is idempotent`; `registerCards fills window.customCards with type, name, description`; `statusDot neutral for unknown and unavailable`; `trendArrow shows no percent when percent is null`; `setConfig throws without required key`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Pass. **Step 5:** Commit `feat: add base card, registry and UI parts`.

### Task 5: Editor helpers

**Files:** Create `src/core/editor.ts`, `src/core/editor.test.ts`.

**Interfaces:**
- Produces: `abstract class HocBaseEditor<C> extends LitElement` using `ha-form`; `deviceSelector(platform: string)` returning an `ha-selector` device schema filtered by integration; `layoutSelector(options: string[])`; dispatches `config-changed` with the new config.

- [ ] **Step 1: Tests:** `editor dispatches config-changed with merged config`; `deviceSelector filters by integration`.
- [ ] **Step 2–4:** fail → implement → pass. **Step 5:** Commit `feat: add shared card editor helpers`.

### Task 6: `hoc-github-repo-card`

**Files:** Create `src/cards/github-pulse/repo/{card.ts,editor.ts,card.test.ts}`; register in `registry.ts`.

**Interfaces:**
- Consumes: `resolveDeviceEntities`, `HocBaseCard`, parts, `trend`.
- Produces: config `{ type; device: string; layout?: "compact" | "standard" | "detailed" (default "standard"); show_name?: boolean }`; helper `repoFields(entities: ResolvedEntities, layout): Field[]` reused by Task 7.

- [ ] **Step 1: Tests (against fixtures from `sensor_repository.py`/`sensor_actions.py` keys):** `compact shows name, ci dot, stars, release only`; `standard adds forks, issues, PRs and commits with trend vs last month`; `detailed adds traffic, workflow and downloads when sensors exist`; `omits fields whose sensor is missing`; `neutral dot for ci_state outside the enum`; `device not found renders the error state`; `commits_vs_last_month with previous 0 shows arrow without percent`.
- [ ] **Step 2:** FAIL. **Step 3:** Implement the card, its editor (device picker, layout), and `repoFields`. **Step 4:** Pass. **Step 5:** Commit `feat: add GitHub repository card`.

### Task 7: `hoc-github-repos-card`

**Files:** Create `src/cards/github-pulse/repos/{card.ts,editor.ts,card.test.ts}`.

**Interfaces:**
- Consumes: `listDevices`, `resolveDeviceEntities`, `repoFields`.
- Produces: config `{ type; repositories: string[] | "all"; columns?: ColumnKey[]; sort_by?: ColumnKey | "name"; sort_order?: "asc" | "desc"; max_height?: number }` where `ColumnKey` is the stable key list from Global Constraints.

- [ ] **Step 1: Tests:** `all lists every github_pulse repository device`; `explicit list restricts rows`; `default columns applied`; `sorts by column asc and desc, name as default`; `non-numeric values sort last`; `zero repositories renders empty message`; `50 repositories render in a scroll container`.
- [ ] **Step 2–4:** fail → implement → pass. **Step 5:** Commit `feat: add GitHub repositories card`.

### Task 8: `hoc-github-profile-card`

**Files:** Create `src/cards/github-pulse/profile/{card.ts,editor.ts,card.test.ts}`.

**Interfaces:**
- Consumes: `findAccountDevice`, `resolveDeviceEntities`.
- Produces: config `{ type; device?: string; show_sparkline?: boolean }` (device defaults to `findAccountDevice`); fields `contributions_this_month`, `commits_vs_last_month` (trend), `current_streak`, `longest_streak`, `top_language`. Sparkline only if the sensor attributes already hold a series (builder verifies in `sensor_profile.py`; if not, drop the option and note it in docs).

- [ ] **Step 1: Tests:** `renders core fields from the account device`; `defaults to the account device when none configured`; `omits streak when sensor missing`; `no NaN when last-month value is 0`.
- [ ] **Step 2–4:** fail → implement → pass. **Step 5:** Commit `feat: add GitHub profile card`.

### Task 9: `hoc-github-attention-card`

**Files:** Create `src/cards/github-pulse/attention/{card.ts,editor.ts,card.test.ts}`.

**Interfaces:**
- Produces: config `{ type; device?: string; repositories?: string[] | "all"; show_when_clean?: boolean }`; pure function `collectAttention(hass, config): { failingRepos: string[]; reviewRequests: number; stalePullRequests: number }`.

- [ ] **Step 1: Tests:** `lists repos with ci_state failure or error`; `ignores pending and success`; `shows review_requests and stale_pull_requests counts`; `clean state shows "All clear" line`; `clean state renders nothing when show_when_clean is false`; `repositories filter restricts the failing list`; `non-numeric counts treated as 0`.
- [ ] **Step 2–4:** fail → implement → pass. **Step 5:** Commit `feat: add GitHub attention card`.

### Task 10: CI, release and docs

**Files:** Create `.github/workflows/ci.yaml`, `.github/workflows/release.yaml`, `docs/cards/*.md` (one per card with YAML examples and a ULM placement note), `docs/adding-a-card.md`; finalise `README.md` (house style: header, badges, install via HACS, card list, License, Contributing; Changelog section only once `CHANGELOG.md` exists).

**Interfaces:** CI runs lint, typecheck, test, build, then fails if `git diff --exit-code dist/` is non-empty. Release workflow on tag `v*` builds and attaches `dist/ha-house-of-cards.js` to a GitHub release.

- [ ] **Step 1:** Write the workflows; **Step 2:** locally run the same commands and confirm a clean `git diff --exit-code dist/`.
- [ ] **Step 3:** Write docs; verify every YAML example type exists in `registry.ts` (add a test `docs reference only registered card types` that greps `docs/cards/*.md` for `custom:hoc-` and compares with `cards`).
- [ ] **Step 4:** Commit `ci: add checks and release workflow` and `docs: document cards and extension`.

### Task 11 (phase 2): YouTrack cards

**Files:** Create `src/cards/youtrack/project/*`, `src/cards/youtrack/issues/*`, fixtures from `ha-youtrack` source.

**Interfaces:**
- Produces: `hoc-youtrack-project-card` config `{ type; device: string }` showing `issues_open`, `issues_overdue`, `issues_critical_open`, `issues_created_7d`, `issues_resolved_7d`; red accent when binary sensors `has_overdue` or `has_critical_open` are on. `hoc-youtrack-issues-card` config `{ type; entity: string; max_items?: number }` rendering issues from the query sensor's attributes (builder reads `sensor.py:176-277` for the attribute shape).

- [ ] **Step 1: Tests:** `accent only when a flag is on`; `missing binary sensors → no accent`; `issues card renders up to max_items`; `empty attributes → empty message`.
- [ ] **Step 2–4:** fail → implement → pass. **Step 5:** Commit `feat: add YouTrack project and issues cards`.

---

## Self-review

- **Spec coverage:** repo/bundle/HACS (T1, T10), resolver + contract (T2), i18n + trend rules (T3), base/registry/customCards (T4), editors (T5), four GitHub cards (T6–T9), YouTrack phase 2 (T11), extensibility doc (T10), quality/CI (T1, T10). ULM phase 2 templates are deliberately not planned (spec: decided later); ULM look comes from theme variables (Global Constraints) and each card doc notes placement.
- **Consistency:** `repoFields`, `ResolvedEntities`, `trend`, `ColumnKey` are defined before use.
- **Proportion:** signatures and test names only; bodies left to the implementer.
