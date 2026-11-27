# GitHub repository card

One repository of the [GitHub Pulse](https://github.com/JtheGunner/ha-github-pulse) integration.

```yaml
type: custom:hoc-github-repo-card
device: <device id of the repository>
layout: standard
```

| Option | Default | Description |
|---|---|---|
| `device` | required | Device of the repository. Pick it in the visual editor. |
| `layout` | `standard` | `compact`, `standard` or `detailed` |

## Layouts

| Layout | Shows |
|---|---|
| `compact` | CI dot, name, stars, latest release |
| `standard` | adds forks, issues, pull requests, commits this month with the change versus last month |
| `detailed` | adds visitors, views, workflow result, runs today, downloads and days since the last commit and release |

Fields whose sensors are disabled in GitHub Pulse are left out. Enable the optional sensors on the device to see them.

## UI Lovelace Minimalist

Add the card to a view like any custom card. It uses the theme variables, so it matches the minimalist look. `compact` is the closest to a Minimalist row.
