# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- `hoc-devices-card`: `name` adds a title above the table, and `device_title` replaces the title of the name column.
- `show_title: false` hides the title of the device card and the issues card. A `badge` stays; the visual editor then hides the title name and link options.

### Changed

- Text sizes follow the Mushroom and tile cards: titles and values are 14px, labels, units, badges and details 12px (`--ha-font-size-m` and `--ha-font-size-s` when the theme sets them). Values are no longer bold and larger.

## [0.3.0] - 2026-11-27

### Added

- YouTrack issues card: a title (project and query name, `name` replaces it), an optional `badge` for the number of matches or an attribute, coloured state badges and priority edges (`colors` overrides them), a `+N more` line that expands to every issue (`expandable`), a link to the same search in YouTrack for issues the sensor does not list, and a detail view per issue with its full summary, priority and assignee.
- `hoc-devices-card`: a sortable table of several devices, for any integration. Use `platform` to list every device of an integration or `devices` to pick them. GitHub Pulse and YouTrack bring default columns and status.
- Columns take `name`, `icon`, `color`, `title_color` and `align` (numbers right, text left by default); `column_titles` shows titles as text, icon or both.
- `show_status` and `status` rules show a dot before each name; `link` links the names to the device page or to a URL in an attribute; `hide_owner` shortens `owner/repo` to `repo`.
- The visual editor of the device card lists the default fields of the chosen layout in `fields` so you can edit them in place. Changing nothing keeps the defaults, and they follow the layout.
- Status of the device card: `status` is a list of rules (sensor or `sensor:attribute`, condition, value, resulting status). The first match wins and replaces the integration's default status. Rules are edited in the visual editor and only shown while `show_status` is on.
- Presets: the device card knows GitHub Pulse and YouTrack devices and starts with their fields and status, including the GitHub profile for the account device.
- `badge` on the device card: shows any sensor or attribute as a badge on the far side of the title. It is grey by default and takes a `color`.
- `link` on the device card accepts `device` (the device's page) or `sensor:attribute` (a URL held in an attribute); `link_url` sets any https URL while `link` gives no target; the visual editor hides it once a link source is chosen. `link: true` keeps meaning the device page.

### Changed

- The YouTrack issues card tells you when the chosen sensor lists no issues, and its editor offers only sensors that do.
- **Breaking:** `hoc-github-repo-card` and `hoc-youtrack-project-card` are now `hoc-device-card`, which also shows your GitHub profile for the account device. `hoc-github-repos-card` is now `hoc-devices-card` with `platform: github_pulse` instead of `repositories: all`, `devices` instead of a repository list and `show_status` instead of `show_activity`. Update `type:` and these options in existing dashboards.
- Every card offers a live preview in the card picker.

### Fixed

- Selecting a device twice in the table no longer ties two entries together; duplicates are dropped.

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

[Unreleased]: https://github.com/JtheGunner/ha-house-of-cards/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/JtheGunner/ha-house-of-cards/compare/v0.2.2...v0.3.0
[0.2.2]: https://github.com/JtheGunner/ha-house-of-cards/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/JtheGunner/ha-house-of-cards/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/JtheGunner/ha-house-of-cards/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/JtheGunner/ha-house-of-cards/releases/tag/v0.1.0
