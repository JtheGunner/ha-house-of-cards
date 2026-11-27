# GitHub profile card

<!-- drift: src/cards/github-pulse/profile/card.ts, src/core/fields-card.ts, src/core/fields.ts -->

Your GitHub activity: contributions this month, the change versus last month, streaks and top language.

```yaml
type: custom:hoc-github-profile-card
```

| Option | Default | Description |
|---|---|---|
| `device` | account device | Only needed if you want to pick the device yourself |
| `layout` | `standard` | `compact`, `standard` or `list` |
| `fields` | contributions with trend, streaks, top language | Sensors and attributes to show, see the [device card](hoc-device-card.md#fields) |
| `name` | device name | Title shown in the header |
| `link` | `false` | Make the title a link to the device's page (https only, opens in a new tab) |
| `show_status` | `true` | Show the status dot and accent where the card has one |

Sensors that are disabled in GitHub Pulse are left out. A contribution sparkline is not offered because the integration exposes no series; use the built-in `statistics-graph` card with the imported history instead.

## UI Lovelace Minimalist

Place the card in a view like any custom card.
