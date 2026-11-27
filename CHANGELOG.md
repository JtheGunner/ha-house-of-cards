# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

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

[Unreleased]: https://github.com/JtheGunner/ha-house-of-cards/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/JtheGunner/ha-house-of-cards/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/JtheGunner/ha-house-of-cards/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/JtheGunner/ha-house-of-cards/releases/tag/v0.1.0
