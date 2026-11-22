// Pure game rules, with no React or DOM code.
import { ARCHETYPES, ENDINGS } from '../data/cards.js'

export const METERS = [
  { key: 'health', label: 'Health', icon: '❤️' },
  { key: 'money', label: 'Money', icon: '💰' },
  { key: 'people', label: 'People', icon: '🫂' },
  { key: 'joy', label: 'Happiness', icon: '😊' },
]

export const START_VALUE = 50
export const DANGER_LOW = 20
export const DANGER_HIGH = 80
export const BIG_EFFECT = 10

export const initialMeters = () => Object.fromEntries(METERS.map((m) => [m.key, START_VALUE]))

const clamp = (v) => Math.max(0, Math.min(100, v))

/** Applies a choice's effects. Returns the new meter values and the non-zero deltas. */
export function applyEffects(meters, effects = {}) {
  const next = { ...meters }
  const deltas = {}
  for (const { key } of METERS) {
    const d = effects[key] ?? 0
    if (!d) continue
    next[key] = clamp(next[key] + d)
    deltas[key] = d
  }
  return { meters: next, deltas }
}

/** Returns the game-over ending if any meter is empty or full, otherwise null. */
export function findEnding(meters) {
  for (const { key } of METERS) {
    if (meters[key] <= 0) return ENDINGS[key].low
    if (meters[key] >= 100) return ENDINGS[key].high
  }
  return null
}

/** The ending for surviving every decision, picked by the highest meter. */
export function winEnding(meters) {
  const top = METERS.reduce((a, b) => (meters[b.key] > meters[a.key] ? b : a))
  return ARCHETYPES[top.key]
}
