# Runway

A small decision-making game you play in the browser. You run a startup, and each week someone brings you a problem. Every choice moves four meters: **Cash**, **Team**, **Users** and **Investors**. If any meter hits empty or full, the run is over.

**Play it:** https://alielmayyah.github.io/runway/

- Hover over a choice to see which meters it will change. A bigger dot means a bigger change.
- Press `1`, `2` or `3` to pick a choice, and `Enter` to continue.

## Stack

React, Vite, Tailwind CSS, Sass and GSAP.

| Path | What's there |
| --- | --- |
| `src/data/cards.js` | All the game content: decisions, characters and endings |
| `src/game/engine.js` | The game rules (no React) |
| `src/components/` | React components for the screens, meters and decision card |
| `src/styles/main.scss` | Theme colors (light and dark) and the meter gauge styles |
| `src/styles/tailwind.css` | Tailwind setup, mapping the theme colors to utilities |
| `src/lib/motion.js` | GSAP setup, including the reduced-motion handling |

## Develop

```sh
npm install
npm run dev      # start the dev server
npm run lint     # run oxlint
npm run build    # build to dist/
```

## Deploy

GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) lints and builds every pull request. Every push to `main` is also deployed to GitHub Pages.

## Add a decision

To add a decision, add an entry to `CARDS` in [`src/data/cards.js`](src/data/cards.js):

```js
{
  id: "unique_id",
  who: "priya",                 // a key in CHARACTERS
  text: "The dilemma...",
  choices: [
    { label: "Option A", effects: { cash: -10, team: +10 }, result: "What happened." },
    { label: "Option B", effects: { users: +15 } },
  ],
}
```

Decisions are played in order, and the game ends after the last one.
