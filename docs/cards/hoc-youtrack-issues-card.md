# YouTrack issues card

<!-- drift: src/cards/youtrack/issues/card.ts, src/cards/youtrack/issues/colors.ts -->

The issues of a YouTrack **query sensor**, with coloured states and priorities. Click an issue to see its details, and the card to see all of its issues.

```yaml
type: custom:hoc-youtrack-issues-card
entity: sensor.my_open_bugs
max_items: 5
badge: count
colors:
  In Review: purple
```

| Option       | Default                | Description                                                                                                                                                                              |
| ------------ | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `entity`     | required               | A query sensor of the YouTrack integration. The visual editor offers only sensors that list issues.                                                                                      |
| `show_title` | `true`                 | Set `false` to hide the title. A `badge` stays and `name` has no effect                                                                                                                  |
| `name`       | project and query name | Title shown in the header                                                                                                                                                                |
| `badge`      | none                   | A value shown as a badge on the far side of the title: `count` (number of matches) or the name of an attribute of the sensor, such as `query`. An object `{ key, color }` sets a colour. |
| `max_items`  | `5`                    | Number of issues shown before the rest is folded away                                                                                                                                    |
| `expandable` | `true`                 | Click `+N more` to show every issue the sensor lists                                                                                                                                     |
| `colors`     | none                   | Colours by state or priority name, for example `In Review: purple`. A palette name, a Home Assistant colour name or any CSS colour.                                                      |

## What you see

- **Title.** The project and the name of the query, such as `HHOC · Open bugs`. `name` replaces it.
- **State badge.** Each issue shows its state as a badge: green when resolved (`Done`, `Fixed`, `Verified`, `Erledigt`), amber while in progress or review, blue while open, red when blocked or rejected. Other states get a stable colour of their own.
- **Priority edge.** The left edge of each issue is red for `Show-stopper` and `Critical`, amber for `Major`, grey for `Minor` and quiet for `Normal`.
- **Details.** Click an issue to unfold its full summary, priority, assignee and a link to YouTrack. Click again to fold it. Several issues can be open at once.
- **More issues.** When the query matches more issues than are shown, the last line says `+N more`. With `expandable` a click shows every issue the sensor lists and `Show less` folds them again. The integration limits how many issues a query sensor carries (its option _Issues in the attributes_). For the rest the card links to the same search in YouTrack.

The issue ID links to the issue in YouTrack when the link is an `http` or `https` URL.

## UI Lovelace Minimalist

Place the card in a view like any custom card.
