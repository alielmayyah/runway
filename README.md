# Runway

A small decision-making game you play in the browser. You run a startup, and each week someone brings you a problem. Every choice moves four meters: **Cash**, **Team**, **Users** and **Investors**. If any meter hits empty or full, the run is over.

## Play

Open `index.html` in a browser. There's nothing to install.

- Hover over a choice to see which meters it will change. A bigger dot means a bigger change.
- Press `1`, `2` or `3` to pick a choice, and `Enter` to continue.

## Add a decision

All the content lives in [`cards.js`](cards.js). To add a decision, add an entry to `CARDS`:

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
