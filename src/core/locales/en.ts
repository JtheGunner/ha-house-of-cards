export const en = {
  all_clear: "All clear",
  device_not_found: "Device not found",
  no_repositories: "No repositories",
  unavailable: "Unavailable",
  stars: "Stars",
  forks: "Forks",
  issues: "Issues",
  pull_requests: "Pull requests",
  commits_this_month: "Commits this month",
  release: "Release",
  ci: "CI",
  failing_ci: "Failing CI",
  review_requests: "Review requests",
  stale_pull_requests: "Stale pull requests",
} as const;

export type LocaleKey = keyof typeof en;
