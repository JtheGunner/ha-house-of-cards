# YouTrack issues card

<!-- drift: src/cards/youtrack/issues/card.ts -->

The first issues of a YouTrack **query sensor**.

```yaml
type: custom:hoc-youtrack-issues-card
entity: sensor.my_open_bugs
max_items: 5
```

| Option | Default | Description |
|---|---|---|
| `entity` | required | A query sensor of the YouTrack integration |
| `max_items` | `5` | Number of issues to show |

Each row shows the issue ID, the summary and the state. The ID links to the issue in YouTrack when the link is an `http` or `https` URL. The integration limits how many issues a query sensor carries, so `max_items` cannot show more than that.

## UI Lovelace Minimalist

Place the card in a view like any custom card.
