// Game content. Add new decisions to CARDS. They are played in order, from youngest age to oldest.
//
// Meter keys: health, smarts, people, joy (each runs from 0 to 100 and starts at 50).
// The Card, Choice and Ending types are in ../types.ts.
// After changing anything here, run `npm run tree` to update TREE.md.

import type { Card, Character, Ending, MeterKey } from '../types.ts'

export const CHARACTERS = {
  crib: { name: '3:00 AM', role: 'In your crib', avatar: '🍼' },
  rivera: { name: 'Ms. Rivera', role: 'Your kindergarten teacher', avatar: '🍎' },
  coach: { name: 'Coach Dee', role: 'Soccer coach', avatar: '⚽' },
} satisfies Record<string, Character>

export type CharacterId = keyof typeof CHARACTERS

export const CARDS: Card[] = [
  {
    id: 'night',
    age: 0,
    who: 'crib',
    text: "You're wide awake. The house is dark and quiet, and Mom and Dad are asleep down the hall.",
    choices: [
      {
        label: 'Cry until someone comes.',
        effects: { people: +20, health: -10, joy: +5 },
        result: 'Dad stumbles in, scoops you up and hums the same song four times. Nobody sleeps much, but you feel very loved.',
      },
      {
        label: 'Babble at the ceiling fan.',
        effects: { smarts: +15, people: -15, joy: +5 },
        result: 'You spend an hour working out how the fan goes round. Nobody notices you were awake.',
      },
    ],
  },
  {
    id: 'buddy',
    age: 5,
    who: 'rivera',
    text: "Time to pick a buddy for the year! Do you want Leo, the loud kid everyone likes, or Ada, the quiet girl reading in the corner?",
    choices: [
      {
        label: 'Leo, the loud kid.',
        effects: { people: +25, joy: +10, smarts: -15 },
        result: "Leo introduces you to the whole class by lunchtime. Neither of you hears a word of the alphabet song.",
      },
      {
        label: 'Ada, the quiet reader.',
        effects: { smarts: +20, people: -15, joy: -5 },
        result: 'Ada teaches you to read chapter books. The other kids decide you two are "the weird ones".',
      },
    ],
  },
  {
    id: 'soccer',
    age: 9,
    who: 'coach',
    text: 'Tryouts are on Saturday. If you make the team, it means practice at 7am every weekend. Or you could just stay home and play video games.',
    choices: [
      {
        label: 'Go to tryouts.',
        effects: { health: +20, people: +5, smarts: -10, joy: -10 },
        result: "You make the team. You're the fastest kid on the field, and too tired to do your homework.",
      },
      {
        label: 'Stay home and play video games.',
        effects: { joy: +20, health: -25, smarts: +15, people: -5 },
        result: 'You beat every puzzle game in the house and learn to type really fast. You also forget what outside looks like.',
      },
    ],
  },
]

/** Shown when a meter hits 0 (low) or 100 (high). */
export const ENDINGS: Record<MeterKey, { low: Ending; high: Ending }> = {
  health: {
    low: { mark: '🤒', title: 'Always sick', text: 'Too many late nights and too much junk food. You spend more days in bed than at school.' },
    high: { mark: '🏃', title: 'Sports-obsessed', text: 'Practice every morning, games every weekend. You forget what a lazy Sunday feels like.' },
  },
  smarts: {
    low: { mark: '😶', title: 'Checked out', text: 'School stops making sense, so you stop trying. Teachers sigh when they read your name.' },
    high: { mark: '🤓', title: 'Too clever for your own good', text: 'You skip two grades and correct every teacher. Nobody your age wants to sit with you at lunch.' },
  },
  people: {
    low: { mark: '🚪', title: 'The loner', text: 'You eat lunch alone every day. After a while, you stop looking up when people walk past.' },
    high: { mark: '🎭', title: 'Class clown', text: "You'll do anything for a laugh. You're sent to the principal's office so often that you have your own chair." },
  },
  joy: {
    low: { mark: '🌧️', title: 'The gray days', text: 'The days blur together and nothing sounds fun anymore.' },
    high: { mark: '🍭', title: 'Spoiled', text: 'Every day is a party and every wish comes true. The word "no" makes you cry for an hour.' },
  },
}

/** Shown when you make it through every decision. Picked by your highest meter. */
export const ARCHETYPES: Record<MeterKey, Ending> = {
  health: { mark: '🌿', title: 'The Sporty Kid', text: 'Scraped knees, grass stains, and more energy than anyone can keep up with.' },
  smarts: { mark: '📚', title: 'The Little Genius', text: 'You ask "why?" about everything, and you usually find out.' },
  people: { mark: '🫂', title: "Everyone's Friend", text: "There's a birthday party every weekend, and you're invited to all of them." },
  joy: { mark: '🌈', title: 'The Happy Kid', text: 'You laugh easily and often. Grown-ups say you light up the room.' },
}
