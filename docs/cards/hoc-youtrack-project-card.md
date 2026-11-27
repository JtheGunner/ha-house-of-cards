# YouTrack project card

<!-- drift: src/cards/youtrack/project/card.ts -->

Issue counts of one project of the [YouTrack](https://github.com/JtheGunner/ha-youtrack) integration.

```yaml
type: custom:hoc-youtrack-project-card
device: <device id of the project>
```

| Option | Default | Description |
|---|---|---|
| `device` | required | Device of the project. Pick it in the visual editor. |

Shows open, overdue and critical open issues, and those created and resolved in the last 7 days. The card gets a red accent while the project's **has overdue** or **has critical open** binary sensor is on. Counts whose sensors are missing are left out.

## UI Lovelace Minimalist

Place the card in a view like any custom card.
