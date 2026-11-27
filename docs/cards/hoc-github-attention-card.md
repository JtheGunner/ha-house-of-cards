# GitHub attention card

Shows only what needs attention: repositories with failing CI, open review requests and stale pull requests. When nothing needs attention it collapses to one quiet line.

```yaml
type: custom:hoc-github-attention-card
repositories: all
show_when_clean: true
```

| Option | Default | Description |
|---|---|---|
| `repositories` | all | List of repository devices to check for failing CI |
| `show_when_clean` | `true` | `false` hides the card completely while nothing needs attention |
| `device` | account device | Account device for review requests and stale pull requests |

"Stale" uses the threshold of the GitHub Pulse sensor; the card adds none. The review-request and stale-pull-request sensors are optional in GitHub Pulse; enable them to see their counts.

## UI Lovelace Minimalist

Place the card in a view. With `show_when_clean: false` it takes no space while everything is fine.
