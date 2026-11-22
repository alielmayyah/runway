// Game content. Add new decisions to CARDS. They are played in order.
//
// Meter keys: cash, team, users, investors (each runs from 0 to 100 and starts at 50).
//
// Card shape:
//   id       unique string
//   who      key into CHARACTERS
//   text     the dilemma
//   choices  2-3 options: { label, effects: { meter: delta }, result?: "what happened" }

const CHARACTERS = {
  priya: { name: "Priya", role: "CTO", avatar: "👩🏽‍💻" },
  dana: { name: "Dana Voss", role: "Lead Investor", avatar: "🦈" },
};

const CARDS = [
  {
    id: "priya_rewrite",
    who: "priya",
    text: "Our codebase is held together with duct tape. Let me rewrite it from scratch. Three months, tops.",
    choices: [
      {
        label: "Do it right. Start the rewrite.",
        effects: { team: +15, users: -15, cash: -10 },
        result: "Priya's eyes light up. The product roadmap goes quiet, and so do your users.",
      },
      {
        label: "No. Keep shipping features.",
        effects: { team: -15, users: +15 },
        result: "Users love the new features. The engineers start polishing their résumés.",
      },
    ],
  },
  {
    id: "dana_growth",
    who: "dana",
    text: "Growth is flat. I want to see a hockey stick at the next board meeting. Are you spending on ads or not?",
    choices: [
      {
        label: "Put money into ads.",
        effects: { cash: -20, users: +15, investors: +10 },
        result: "The signup graph finally points up. So does your credit card bill.",
      },
      {
        label: "We'll grow organically.",
        effects: { investors: -20, cash: +10 },
        result: "Dana goes silent on the call for an uncomfortably long time.",
      },
    ],
  },
];

// Shown when a meter hits 0 (low) or 100 (high).
const ENDINGS = {
  cash: {
    low: { mark: "💸", title: "Out of runway", text: "The bank account hits zero and payroll bounces. The company is over." },
    high: { mark: "🏦", title: "Sitting on the pile", text: "The board decides you're hoarding cash instead of growing, and hires a new CEO to spend it." },
  },
  team: {
    low: { mark: "🚪", title: "Everyone quit", text: "The last engineer leaves without a word. It's just you and the coffee machine now." },
    high: { mark: "🗳️", title: "Voted out", text: "The team is so empowered that they vote you out of your own company." },
  },
  users: {
    low: { mark: "🦗", title: "Ghost town", text: "Your last user cancels. The servers keep running for no one." },
    high: { mark: "🔥", title: "Crushed by growth", text: "Signups explode, the servers melt, and the outage makes the evening news." },
  },
  investors: {
    low: { mark: "📉", title: "Investors walk", text: "Your backers pull out and tell everyone they know. No one returns your calls." },
    high: { mark: "🤝", title: "Sold out from under you", text: "Your investors love the company so much that they take over the board and sell it." },
  },
};

// Shown when you survive every decision. Picked by your highest meter.
const ARCHETYPES = {
  cash: { mark: "💰", title: "The Penny-Pincher", text: "You made it with money in the bank. Nobody had fun, but nobody got fired either." },
  team: { mark: "👥", title: "The People's Founder", text: "You made it with a team that would follow you anywhere. Your users are still waiting on that roadmap." },
  users: { mark: "📈", title: "The Product Visionary", text: "You made it with users who love what you built. Your spreadsheet is a little scary." },
  investors: { mark: "🤝", title: "The Dealmaker", text: "You made it with a board that can't stop smiling. Now you have to deliver on everything you promised." },
};
