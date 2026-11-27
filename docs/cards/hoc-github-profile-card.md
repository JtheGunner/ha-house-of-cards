# GitHub profile card

Your GitHub activity: contributions this month, the change versus last month, streaks and top language.

```yaml
type: custom:hoc-github-profile-card
```

| Option | Default | Description |
|---|---|---|
| `device` | account device | Only needed if you want to pick the device yourself |

Sensors that are disabled in GitHub Pulse are left out. A contribution sparkline is not offered because the integration exposes no series; use the built-in `statistics-graph` card with the imported history instead.

## UI Lovelace Minimalist

Place the card in a view like any custom card.
