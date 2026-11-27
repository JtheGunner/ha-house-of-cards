<div align="center">

# 🃏 House of Cards

**Dashboard cards for your Home Assistant integrations.**

<code>integration sensors</code> &nbsp;→&nbsp; <code>theme-aware cards</code> &nbsp;→&nbsp; <code>your dashboard</code>

[![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/typescript-lit-3776ab?style=flat-square&logo=typescript&logoColor=white)](https://lit.dev/)
[![Home Assistant](https://img.shields.io/badge/home%20assistant-2026.9%2B-0ea5e9?style=flat-square&logo=homeassistant&logoColor=white)](https://www.home-assistant.io/)
[![HACS](https://img.shields.io/badge/HACS-dashboard-8b5cf6?style=flat-square)](https://hacs.xyz/)

</div>

---

## 🎯 What it is

One bundle with cards for [GitHub Pulse](https://github.com/JtheGunner/ha-github-pulse) and [YouTrack](https://github.com/JtheGunner/ha-youtrack). You pick a repository or project in the visual editor; the cards find their sensors themselves. They use only Home Assistant theme variables, so they fit the classic dashboard and [UI Lovelace Minimalist](https://ui-lovelace-minimalist.github.io/UI/).

---

## 📥 Installation

1. In HACS, open **Custom repositories** and add `https://github.com/JtheGunner/ha-house-of-cards` with the category **Dashboard**.
2. Download **House of Cards** and reload the browser.
3. Add a card from the card picker, or use the YAML types below.

---

## 🃏 Cards

|    | Card | Integration | Purpose |
|----|------|-------------|---------|
| 📦 | [`hoc-github-repo-card`](docs/cards/hoc-github-repo-card.md) | GitHub Pulse | One repository, layouts `compact`, `standard`, `detailed` |
| 📋 | [`hoc-github-repos-card`](docs/cards/hoc-github-repos-card.md) | GitHub Pulse | Several repositories as a sortable table |
| 👤 | [`hoc-github-profile-card`](docs/cards/hoc-github-profile-card.md) | GitHub Pulse | Account activity, streaks, top language |
| 🔔 | [`hoc-github-attention-card`](docs/cards/hoc-github-attention-card.md) | GitHub Pulse | Failing CI, review requests, stale pull requests |
| 🗂️ | [`hoc-youtrack-project-card`](docs/cards/hoc-youtrack-project-card.md) | YouTrack | Issue counts of one project |
| 📝 | [`hoc-youtrack-issues-card`](docs/cards/hoc-youtrack-issues-card.md) | YouTrack | Issues of a query sensor |

> [!NOTE]
> Optional sensors are disabled by default in the integrations. A card shows a field only if its sensor is enabled.

---

## 🤝 Contributing

Issues and pull requests are welcome. To run the project locally:

```bash
npm install
npm test
npm run build   # writes dist/ha-house-of-cards.js
```

Commit the rebuilt `dist/`; CI fails if it is stale. See [adding a card](docs/adding-a-card.md) for how to extend the bundle.

---

## 📜 License

MIT, see [LICENSE](LICENSE).

---

<div align="center"><sub>Cards for the integrations you build yourself.</sub></div>
