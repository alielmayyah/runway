// Game content. Add new decisions to CARDS. They are played in order.
//
// Meter keys: health, money, people, joy (each runs from 0 to 100 and starts at 50).
//
// Card shape:
//   id       unique string
//   who      key into CHARACTERS
//   text     the dilemma
//   choices  2-3 options: { label, effects: { meter: delta }, result?: "what happened" }

export const CHARACTERS = {
  leila: { name: 'Leila', role: 'Your manager', avatar: '💼' },
  maya: { name: 'Maya', role: 'Your best friend', avatar: '🙋🏽‍♀️' },
  sam: { name: 'Sam', role: 'An old friend', avatar: '✈️' },
}

export const CARDS = [
  {
    id: 'promotion',
    who: 'leila',
    text: "There's a promotion opening up and it's yours if you want it. Fair warning: it means 60-hour weeks for the next year.",
    choices: [
      {
        label: 'Take the promotion.',
        effects: { money: +25, health: -15, people: -10 },
        result: 'The raise hits your account. Dinner is usually something from a vending machine.',
      },
      {
        label: 'Turn it down. Keep your evenings.',
        effects: { money: -10, health: +10, joy: +10 },
        result: "Leila nods, a little disappointed. That evening you go for a long walk and actually cook dinner.",
      },
    ],
  },
  {
    id: 'couch',
    who: 'maya',
    text: "I'm going through a breakup and I can't stay at the apartment. Can I crash on your couch for a month?",
    choices: [
      {
        label: 'Of course. Come over.',
        effects: { people: +25, money: -10, health: -10 },
        result: 'Late-night talks, takeout every night, and very little sleep. Maya says you saved her life.',
      },
      {
        label: "I'm sorry, I can't right now.",
        effects: { people: -30, joy: +5 },
        result: 'Your place stays quiet. Maya stops texting first.',
      },
    ],
  },
  {
    id: 'trip',
    who: 'sam',
    text: 'The old crew is doing a last-minute trip to Lisbon. Flights leave Friday. You in?',
    choices: [
      {
        label: 'Book it!',
        effects: { joy: +25, money: -30, health: -5 },
        result: 'Sunsets, custard tarts and laughing until 3am. Your credit card statement is less fun.',
      },
      {
        label: 'Stay home and rest.',
        effects: { health: +10, joy: -15, people: -10 },
        result: "You sleep ten hours. The group chat fills up with photos you're not in.",
      },
    ],
  },
]

// Shown when a meter hits 0 (low) or 100 (high).
export const ENDINGS = {
  health: {
    low: { mark: '🛏️', title: 'Burned out', text: 'Your body makes the decision for you. Two weeks in bed, staring at the ceiling.' },
    high: { mark: '🏋️', title: 'Fitness obsessed', text: "You track every meal and run at 5am. Nobody has seen you at a dinner in months." },
  },
  money: {
    low: { mark: '💸', title: 'Broke', text: 'Your card gets declined at the grocery store. You move back into your childhood bedroom.' },
    high: { mark: '🏦', title: 'Rich and empty', text: 'Your savings account looks beautiful. Your calendar is completely empty.' },
  },
  people: {
    low: { mark: '📵', title: 'Alone', text: 'The phone stops ringing. Your birthday passes without a single message.' },
    high: { mark: '🙇', title: 'People-pleaser', text: 'You said yes to everyone, for everything. There is no time left that belongs to you.' },
  },
  joy: {
    low: { mark: '🌧️', title: 'Running on empty', text: 'Nothing feels like anything anymore. You stop making plans altogether.' },
    high: { mark: '🎈', title: 'Head in the clouds', text: 'You chased every good feeling and ignored every warning. Reality catches up all at once.' },
  },
}

// Shown when you make it through every decision. Picked by your highest meter.
export const ARCHETYPES = {
  health: { mark: '🌿', title: 'The Steady One', text: 'You took care of yourself first. Calm, rested and ready for whatever comes next.' },
  money: { mark: '📊', title: 'The Planner', text: 'Your future self will thank you. Your present self could use a little more fun.' },
  people: { mark: '🫂', title: 'The Glue', text: 'Everyone you love knows they can count on you. Remember to lean on them too.' },
  joy: { mark: '🌅', title: 'The Free Spirit', text: "You followed what made you happy. Life feels light, even if your bank account doesn't." },
}
