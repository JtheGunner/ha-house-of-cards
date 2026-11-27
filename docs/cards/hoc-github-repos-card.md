# GitHub repositories card

<!-- drift: src/cards/github-pulse/repos/card.ts, src/core/fields-card.ts, src/core/fields.ts -->

Several repositories as a sortable table.

```yaml
type: custom:hoc-github-repos-card
repositories: all
columns:
  - ci_state
  - stars
  - commits_this_month
  - latest_release
sort_by: commits_this_month
sort_order: desc
```

| Option | Default | Description |
|---|---|---|
| `repositories` | all | List of repository devices, or `all`. An empty list also means all. |
| `columns` | `ci_state`, `stars`, `commits_this_month`, `latest_release` | Sensors and attributes to show |
| `sort_by` | `name` | `name` or any column, such as `stars` or `latest_release:downloads` |
| `sort_order` | `asc` | `asc` or `desc`. Missing values always sort last. |
| `hide_owner` | `false` | Show `repo` instead of `owner/repo` |
| `column_titles` | `text` | What the column titles show: `text`, `icon` or `icon_text`. Icons come from the sensor, or from `icon` in the column. |
| `link` | `false` | Make each repository name a link to its GitHub page (https only, opens in a new tab) |
| `show_activity` | `false` | A dot before each repository name: green when it had commits this month, grey otherwise |
| `max_height` | `400` | Height in pixels before the table scrolls |

A column is a sensor key or `sensor:attribute`, exactly like `fields` of the [device card](hoc-device-card.md#fields); objects work too: `name` replaces the column title, `icon` sets the icon used in the column title (see `column_titles`), `color` tints the values, `title_color` colours the column title, `align` sets `left`, `center` or `right` for the column, and `trend` adds a change arrow from another sensor. `sort_by` takes `name` or a column. In the visual editor you choose from every sensor and attribute of your repositories.

Without `align`, columns that hold only numbers are right-aligned and everything else is left-aligned, titles included.

## UI Lovelace Minimalist

Place the card in a view or a grid. It inherits the theme's colours and radius.
