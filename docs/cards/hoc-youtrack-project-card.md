# YouTrack project card

<!-- drift: src/cards/youtrack/project/card.ts, src/core/fields-card.ts, src/core/fields.ts -->

Issue counts of one project of the [YouTrack](https://github.com/JtheGunner/ha-youtrack) integration.

```yaml
type: custom:hoc-youtrack-project-card
device: <device id of the project>
```

| Option | Default | Description |
|---|---|---|
| `device` | required | Device of the project. Pick it in the visual editor. |
| `layout` | `standard` | `compact`, `standard` or `list` |
| `fields` | the five issue counts | Sensors and attributes to show, see the [device card](hoc-device-card.md#fields) |
| `name` | device name | Title shown in the header |
| `link` | `false` | Make the title a link to the device's page (https only, opens in a new tab) |
| `show_status` | `true` | Show the status dot and accent where the card has one |

Shows open, overdue and critical open issues, and those created and resolved in the last 7 days. The card gets a red accent while the project's **has overdue** or **has critical open** binary sensor is on. Counts whose sensors are missing are left out.

## UI Lovelace Minimalist

Place the card in a view like any custom card.
