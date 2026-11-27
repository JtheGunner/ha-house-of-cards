# GitHub card

<!-- drift: src/cards/github-pulse/github/card.ts, src/core/fields-card.ts, src/core/fields.ts -->

One repository or your GitHub profile from the [GitHub Pulse](https://github.com/JtheGunner/ha-github-pulse) integration. Pick the device in the editor: a repository device shows repository fields, the account device shows your activity.

```yaml
type: custom:hoc-github-card
device: <device id of a repository or the account>
layout: standard
```

| Option | Default | Description |
|---|---|---|
| `device` | required | A repository device or the account device. Pick it in the visual editor. |
| `layout` | `standard` | `compact`, `standard` or `list` |
| `name` | device name | Title shown in the header |
| `link` | `false` | Make the title a link to the repository on GitHub (opens in a new tab) |
| `show_release` | `false` | Show the latest release version as a badge on the right side of the header |
| `show_status` | `true` | Show the CI dot and the status accent on the top edge |
| `fields` | by device and layout | Sensors and attributes to show, see the [device card](hoc-device-card.md#fields). Replaces the layout's default fields. |

## Layouts

| Layout | Shows |
|---|---|
| `compact` | CI dot, name, stars and latest release in one row |
| `standard` | tiles for stars, forks, issues, pull requests, commits this month (with the change versus last month) and the latest release |
| `list` | the standard fields as rows |

For the account device the defaults are contributions this month (with the change versus last month), current and longest streak and top language; `compact` shows contributions and the current streak. The card has no CI dot there.

Every field has a coloured icon. A failing CI run turns the card's top edge and the CI dot red. Fields whose sensors are disabled in GitHub Pulse are left out; enable the optional sensors on the device to see them, or pick any sensor or attribute with `fields`, for example visitors, views, workflow result, downloads or days since the last commit. In the visual editor each field has its own entry with sensor, name, icon and colour. Removing all fields restores the layout's defaults.

## UI Lovelace Minimalist

Add the card to a view like any custom card. It uses the theme variables, so it matches the minimalist look. `compact` is the closest to a Minimalist row.
