# GitHub repositories card

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
| `repositories` | required | List of repository devices, or `all`. An empty list also means all. |
| `columns` | `ci_state`, `stars`, `commits_this_month`, `latest_release` | Columns to show |
| `sort_by` | `name` | `name` or any column key |
| `sort_order` | `asc` | `asc` or `desc`. Missing values always sort last. |
| `max_height` | `400` | Height in pixels before the table scrolls |

Column keys: `stars`, `forks`, `open_issues`, `open_pull_requests`, `commits_this_month`, `commits_vs_last_month`, `ci_state`, `latest_release`, `days_since_last_commit`. These keys are a stable part of the card's configuration.

## UI Lovelace Minimalist

Place the card in a view or a grid. It inherits the theme's colours and radius.
