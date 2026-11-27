# GitHub repository card

<!-- drift: src/cards/github-pulse/repo/card.ts, src/core/fields-card.ts, src/core/fields.ts -->

One repository of the [GitHub Pulse](https://github.com/JtheGunner/ha-github-pulse) integration.

```yaml
type: custom:hoc-github-repo-card
device: <device id of the repository>
layout: standard
```

| Option | Default | Description |
|---|---|---|
| `device` | required | Device of the repository. Pick it in the visual editor. |
| `layout` | `standard` | `compact`, `standard`, `detailed` or `list` |
| `fields` | by layout | Sensors and attributes to show, see the [device card](hoc-device-card.md#fields). Replaces the layout's default fields. |

## Layouts

| Layout | Shows |
|---|---|
| `compact` | CI dot, name, stars and latest release in one row |
| `standard` | tiles for stars, forks, issues, pull requests, commits this month (with the change versus last month) and the latest release |
| `detailed` | adds visitors, views, workflow result, runs today, downloads and days since the last commit and release |
| `list` | the standard fields as rows |

Every field has a coloured icon. A failing CI run turns the card's top edge and the CI dot red. Fields whose sensors are disabled in GitHub Pulse are left out; enable the optional sensors on the device to see them, or pick any sensor or attribute with `fields`.

## UI Lovelace Minimalist

Add the card to a view like any custom card. It uses the theme variables, so it matches the minimalist look. `compact` is the closest to a Minimalist row.
