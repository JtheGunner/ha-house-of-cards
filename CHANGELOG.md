# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Status of the device card: `status` is a list of rules (sensor or `sensor:attribute`, condition, value, resulting status). The first match wins and replaces the integration's default status. Rules are edited in the visual editor and only shown while `show_status` is on.
- Presets: the device card knows GitHub Pulse and YouTrack devices and starts with their fields and status, including the GitHub profile for the account device.
- `badge` on the device card: shows any sensor or attribute as a badge on the far side of the title. It is grey by default and takes a `color`.
- `link` on the device card accepts `device` (the device's page) or `sensor:attribute` (a URL held in an attribute); `link_url` sets any https URL. `link: true` keeps meaning the device page.
- Per-column `title_color` in the repositories table colours the column title; `color` tints the values.
- Per-column `align` in the repositories table. By default number columns align right, text columns left; the column title follows.
- `link` on the repositories table: repository names link to GitHub. Off by default.
- `column_titles` on the repositories table: titles as text, icon or icon and text.
- `show_activity` on the repositories table: a green or grey dot before each name, by commits this month.
- `hide_owner` on the repositories table: show `repo` instead of `owner/repo`.
- Columns of the repositories table take `icon` and `color` besides `name`.

### Changed

- **Breaking:** `hoc-github-repo-card` and `hoc-youtrack-project-card` are now `hoc-device-card`, which also shows your GitHub profile for the account device. Update `type:` in existing dashboards; `device`, `layout`, `fields`, `name`, `link` and `show_status` keep working.
- Every card offers a live preview in the card picker.

### Fixed

- Selecting a repository twice in the repositories table no longer ties two entries together; duplicates are dropped.

- The activity dot keeps its distance from the name and no longer wraps onto its own line.

### Removed

- **Breaking:** `hoc-github-profile-card` (use `hoc-device-card` with the account device) and `hoc-github-attention-card`.

## [0.2.2] - 2026-11-27

### Fixed

- Labels in the visual editors follow the Home Assistant language (English, German) and start with a capital letter, including the layout and sort order choices.

## [0.2.1] - 2026-11-27

### Added

- `name`, `link` (title as link, off by default) and `show_status` (on by default) on the repository, profile, project and device cards.
- The visual editor edits each field as its own entry with sensor, name, icon and colour; the same for the repositories table columns.

### Changed

- The `detailed` layout is removed; choose extra sensors with `fields`. Configurations that still use it render as `standard`.

### Fixed

- Removing every field restores the layout's default fields instead of showing an empty card.

## [0.2.0] - 2026-11-27

### Added

- `hoc-device-card` for any device of any integration.
- Selectable fields: every card takes `fields` (or `columns`), listing sensors and `sensor:attribute` entries, with name, icon, colour and trend overrides. The visual editor offers every sensor and attribute of the chosen device.
- Coloured icon chips per field and a status accent on the cards: success, failure and trend states use the theme colours.
- `list` layout.

### Changed

- Labels, units and values come from Home Assistant for sensors without a built-in label.
- The release tag of a repository is now a regular tile instead of a badge.

## [0.1.0] - 2026-11-27

### Added

- GitHub Pulse cards: `hoc-github-repo-card`, `hoc-github-repos-card`, `hoc-github-profile-card` and `hoc-github-attention-card`.
- YouTrack cards: `hoc-youtrack-project-card` and `hoc-youtrack-issues-card`.
- Visual editors for all cards, English and German labels, and theme-variable styling for the classic dashboard and UI Lovelace Minimalist.
- Warn-only documentation drift check for pull requests.

[Unreleased]: https://github.com/JtheGunner/ha-house-of-cards/compare/v0.2.2...HEAD
[0.2.2]: https://github.com/JtheGunner/ha-house-of-cards/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/JtheGunner/ha-house-of-cards/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/JtheGunner/ha-house-of-cards/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/JtheGunner/ha-house-of-cards/releases/tag/v0.1.0
