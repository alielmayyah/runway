# Crossroads

A small decision-making game about one person's life, played in the browser. People in your life bring you choices: your manager, your best friend, an old friend. Every choice moves four meters: **Health**, **Money**, **People** and **Happiness**. If any meter hits empty or full, the story ends.

**Play it:** https://alielmayyah.github.io/runway/

**See every path:** [TREE.md](TREE.md)

- Hover over a choice to see which meters it will change. A bigger dot means a bigger change.
- Press `1`, `2` or `3` to pick a choice, and `Enter` to continue.

## Stack

TypeScript, React, Vite, Tailwind CSS, Sass and GSAP.

| Path | What's there |
| --- | --- |
| `src/data/cards.ts` | All the game content: decisions, characters and endings |
| `src/game/engine.ts` | The game rules (no React) |
| `src/types.ts` | Shared types: `Card`, `Choice`, `Ending`, `Meters` and so on |
| `src/components/` | React components for the screens, meters and decision card |
| `src/styles/main.scss` | Theme colors (light and dark) and the meter gauge styles |
| `src/styles/tailwind.css` | Tailwind setup, mapping the theme colors to utilities |
| `src/lib/motion.ts` | GSAP setup, including the reduced-motion handling |
| `scripts/tree.ts` | Generates `TREE.md` from the decisions |

## Develop

```sh
npm install
npm run dev         # start the dev server
npm run lint        # run oxlint
npm run typecheck   # run the TypeScript compiler
npm run tree        # regenerate TREE.md
npm run build       # type-check and build to dist/
```

## Decision tree

[TREE.md](TREE.md) is a Mermaid diagram of every path through the game, with the meter values and result at the end of each one. GitHub renders it automatically. It's generated from `src/data/cards.ts`, so don't edit it by hand. After changing the decisions, run `npm run tree` and commit the result. CI fails if TREE.md doesn't match the decisions.

## Deploy

GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) runs lint, the TREE.md check, the type check and the build on every pull request. Every push to `main` is also deployed to GitHub Pages.

## Add a decision

To add a decision, add an entry to `CARDS` in [`src/data/cards.ts`](src/data/cards.ts), then run `npm run tree`:

```ts
{
  id: 'unique_id',
  who: 'maya',                  // a key in CHARACTERS
  text: 'The dilemma...',
  choices: [
    { label: 'Option A', effects: { money: -10, people: +10 }, result: 'What happened.' },
    { label: 'Option B', effects: { joy: +15 } },
  ],
}
```

Decisions are played in order, and the game ends after the last one.
