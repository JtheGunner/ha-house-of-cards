# House of Cards — design

Status: draft for approval · Date: 2026-11-27

## Intent

The owner runs several custom Home Assistant integrations (`ha-github-pulse`, `ha-youtrack`, more later) and wants dashboard cards for them. The cards must work in the classic HA dashboard and look native in **UI Lovelace Minimalist** (ULM). Instead of shipping frontend code inside each Python integration, one dedicated repository, **`ha-house-of-cards`**, holds all cards. The owner can add further cards over time, for any integration or generic ones.

Why a separate repo: shared design and code live in one place, integrations stay pure Python, and a new card is a new folder instead of a new build pipeline.

## Goals

- One HACS repository (category *Dashboard*) that ships **one JS bundle** containing many cards.
- Cards for `github_pulse` first, then `youtrack`.
- Adding a card = adding one folder plus one registry entry. No changes to the core or the build.
- Cards inherit HA theme variables, so they fit the classic dashboard and ULM without custom CSS per theme.
- Every card has a visual editor (HA's card editor UI), so no YAML is required.
- The user picks a repository/project/account; the card finds the matching entities itself.

## Non-goals

- No Python code and no HA integration in this repo.
- No new entities or services; cards only read existing state.
- No history charts of its own. Use HA's `statistics-graph` for trends; cards may embed small sparklines only if the data is already in attributes.
- No support for HA versions older than what the integrations require (2026.9+).

## Anti-goals

- Cards that need hand-written entity IDs for every field.
- A card that shows empty rows or errors when an optional (disabled) sensor is missing.
- Visual noise: cards must stay quiet when nothing needs attention.

## Constraints

- Frontend stack: TypeScript + Lit, bundled with Vite into a single `dist/ha-house-of-cards.js`. (Builder's call: exact tooling versions.)
- HACS `dashboard` category requires the bundle in `dist/` and a `hacs.json`.
- Language policy: code, docs, and card config keys in English; UI labels in English with German translations.
- MIT license; CHANGELOG from first release; README follows the house style.

## Approaches considered

1. **Separate cards repo, one bundle (chosen).** Shared core, one install, easy to extend.
2. Bundle per integration with a shared npm package. Rejected: duplicates build pipelines in Python repos and needs a published core package.
3. Bundle inside each integration (the first proposal). Rejected once a second integration was involved: duplicated frontend code and no home for generic cards.

## Design

### Repository layout

```text
src/
  core/            entity resolver, base card, shared UI parts, editor helpers, i18n
  cards/
    github-pulse/  repo, repos, profile, attention
    youtrack/      project, issues        (later)
    generic/       reserved for integration-independent cards
  registry.ts      list of cards: element name, class, editor, picker metadata
dist/              built bundle (committed for HACS)
docs/              per-card docs with YAML examples
```

### Core

- **Entity resolver.** Given a selected device (or a config entry for account-level cards), returns the device's entities keyed by `translation_key`, read from `hass.entities` and `hass.devices`. Disabled or missing sensors resolve to `undefined`; cards omit those fields silently.
- **Base card.** Handles `hass` updates, theme variables, size hints (`getCardSize`, `getGridOptions`), error/empty states, and the `layout` option.
- **UI parts.** Stat tile, status dot, trend arrow (up/down/flat with percent), relative time, release badge.
- **Editor helpers.** Device picker filtered by integration, layout select, field toggles.
- **Registry.** Each card registers its element name and appears in the HA card picker.

### Naming

Custom element prefix `hoc-`; YAML type `custom:hoc-<integration>-<name>-card`, e.g. `custom:hoc-github-repo-card`.

### Cards for `github_pulse`

| Card | Purpose | Key options |
|---|---|---|
| `hoc-github-repo-card` | One repository | `device`, `layout: compact \| standard \| detailed`, field toggles |
| `hoc-github-repos-card` | Many repositories as a list/table | `repositories` (list or all), `columns`, `sort_by`, `sort_order` |
| `hoc-github-profile-card` | Account activity | contributions, change vs last month, streak, top language; optional sparkline |
| `hoc-github-attention-card` | Only what needs attention | failing CI, review requests, stale pull requests; collapses to a single quiet line when clean |

Layouts of `hoc-github-repo-card`:

```text
compact:   ● ha-github-pulse   ★ 12   v1.4.0
standard:  ha-github-pulse  ● CI green
           ★ 12  ⑂ 3  Issues 2  PRs 1
           Commits (month) 41  ▲ 12 % vs last month
detailed:  standard + traffic (14 days), workflow runs, downloads,
           days since last commit / release
```

Entities are resolved by `translation_key` (`stars`, `forks`, `open_issues`, `open_pull_requests`, `commits_this_month`, `commits_vs_last_month`, `latest_release`, `ci_state`, …). Optional sensors, which `github_pulse` creates disabled, are shown only if enabled.

### Cards for `youtrack` (second phase)

- `hoc-youtrack-project-card`: open, overdue, critical open, created/resolved in 7 days; red accent when the overdue or critical flags are on.
- `hoc-youtrack-issues-card`: first issues of a query sensor (from its attributes).

### UI Lovelace Minimalist

- Phase 1: cards use HA theme variables only (card background, radius, primary/secondary text, state colours), so they match ULM's look when placed in a ULM view. The `compact` layout mirrors ULM's one-row, icon-left style.
- Phase 2 (optional, decided later): YAML `custom_card` templates so the compact layouts can also be added the ULM-native way.

### Extensibility

A new card = new folder under `src/cards/<integration>/` with the element, its editor, and a registry entry. Generic cards go under `src/cards/generic/`. A short `docs/adding-a-card.md` describes the steps.

### Quality

- Unit tests for the resolver and value formatting (Vitest).
- Each card renders against fixture `hass` objects, covering: all sensors present, optional sensors missing, entity unavailable.
- Lint and type checks in CI; CI also builds and fails if `dist/` is stale.

## Decided by the owner

- Separate repo, one bundle, many cards (approach 1).
- Repo name `ha-house-of-cards`.
- ULM is the minimalist target.
- GitHub Pulse cards first, YouTrack second.

## My calls (please check)

- Element prefix `hoc-` and the card names above.
- TypeScript + Lit + Vite + Vitest.
- `dist/` is committed (required by HACS dashboard category).
- Repo is public with MIT license, like the integrations.
- Four GitHub cards in phase 1; sparkline in the profile card is optional.

## Entity contract

The integrations' source is the contract; fixtures must be derived from it, not invented. Cards match entities by `platform` (`github_pulse` / `youtrack`) and `translation_key`.

- **github_pulse repository device** (`sensor_repository.py`, `sensor_actions.py`): `stars`, `forks`, `watchers`, `open_issues`, `open_pull_requests`, `commits_this_month`, `active_days_this_month`, `pull_requests_this_month`, `issues_this_month`, `commits_vs_last_month`, `commits_vs_last_year`, `latest_release`, `ci_state` (enum: `success`, `failure`, `pending`, `error`, `expected`), `latest_release_downloads`, `total_downloads`, `days_since_last_commit`, `days_since_last_release`, `last_push`, traffic (`peak_visitor_day`, `top_referrer`, `top_path`, `visitor_trend`, …) and workflow runs (`actions_last_result`, `actions_runs_today`, `actions_queued_runs`, `actions_failure_rate_7d`, `actions_failure_rate_30d`, `actions_average_duration`, `actions_running`).
- **github_pulse account device** (`sensor_profile.py`): `contributions_this_month`, `commits_this_month`, `pull_requests_this_month`, `commits_vs_last_month`, `commits_vs_last_year`, `current_streak`, `longest_streak`, `top_language`, `busiest_month`, `stale_pull_requests`, `review_requests`, `year_in_review`, `language_shift`, and more. Values, units and attributes: read the sensor descriptions and their `attributes_fn`.
- **youtrack project device**: sensors `issues_total`, `issues_open`, `issues_resolved`, `issues_unassigned`, `issues_overdue`, `issues_created_7d`, `issues_resolved_7d`, `issues_critical_open`; binary sensors `has_overdue`, `has_critical_open`; query sensors carry the first issues in attributes (`sensor.py`).
- If a needed value is not exposed by an integration, the card omits it; changing an integration is out of scope for this repo.

## Calls made after the builder check

- **Account-level cards** (profile, attention) take the account device of `github_pulse` via a device picker. The attention card aggregates over all repository devices of the same config entry and shows: repositories with `ci_state` = `failure`/`error`, the `review_requests` count, and the `stale_pull_requests` count (the integration already applies its own 14-day threshold; the card adds none). Options: `repositories` filter (default all) and `show_when_clean` (default: one quiet line "All clear").
- **Repos card**: `repositories` is a list of devices or `all` (every repository device of `github_pulse`). Column keys equal the field keys of the repo card (`stars`, `forks`, `open_issues`, `open_pull_requests`, `commits_this_month`, `commits_vs_last_month`, `ci_state`, `latest_release`, `days_since_last_commit`). Defaults: `ci_state`, `stars`, `commits_this_month`, `latest_release`. `sort_by` accepts any column key or `name`. These keys are a stable config API once released.
- **Language**: `hass.locale.language`, fallback English; German strings written by the builder.
- **Trend arrow**: flat when the change is within ±1 %; if the previous value is 0, show the arrow without a percentage.
- **Releases**: committed `dist/` plus a tagged GitHub release with the bundle attached (HACS). CI rebuilds and fails on a diff; toolchain versions are pinned for deterministic output.
- **Frontend APIs**: assume sections-view `getGridOptions`, `ha-form`/`ha-selector` editors and `window.customCards` registration are available at HA 2026.9+.

## Left to the builder

- Exact tooling versions and project config.
- Visual details (spacing, icons, colours within theme variables).
- Fixture data and test structure.
- How the repos list card paginates or scrolls for many repositories.
