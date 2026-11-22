import type { CharacterId } from './data/cards.ts'

export type MeterKey = 'health' | 'money' | 'people' | 'joy'

/** Every meter's value, from 0 to 100. */
export type Meters = Record<MeterKey, number>

/** How much a choice moves each meter. Meters that are left out don't change. */
export type Effects = Partial<Record<MeterKey, number>>

export interface MeterDef {
  key: MeterKey
  label: string
  icon: string
}

export interface Character {
  name: string
  role: string
  avatar: string
}

export interface Choice {
  label: string
  effects: Effects
  /** A line shown after picking this choice. */
  result?: string
}

export interface Card {
  id: string
  who: CharacterId
  text: string
  choices: Choice[]
}

export interface Ending {
  mark: string
  title: string
  text: string
}

export interface HistoryEntry {
  step: number
  who: string
  label: string
}

export interface RunResult {
  ending: Ending
  decisions: number
  history: HistoryEntry[]
}

/** The deltas from the last choice. A new id replays the meter arrows. */
export interface MeterChange {
  deltas: Effects
  id: string
}

/** Shown on the card after a choice that has a result line. */
export interface Outcome {
  text: string
  ending: Ending | null
  meters: Meters
  history: HistoryEntry[]
}
