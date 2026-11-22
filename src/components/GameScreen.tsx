import { useEffect, useRef, useState } from 'react'
import { CARDS, CHARACTERS } from '../data/cards.ts'
import { applyEffects, findEnding, initialMeters, winEnding } from '../game/engine.ts'
import { gsap, useGSAP } from '../lib/motion.ts'
import type { Effects, Ending, HistoryEntry, MeterChange, Meters as MeterValues, Outcome, RunResult } from '../types.ts'
import DecisionCard from './DecisionCard.tsx'
import Meters from './Meters.tsx'

interface GameScreenProps {
  onFinish: (result: RunResult) => void
}

export default function GameScreen({ onFinish }: GameScreenProps) {
  const [index, setIndex] = useState(0)
  const [meters, setMeters] = useState<MeterValues>(initialMeters)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [preview, setPreview] = useState<Effects | null>(null)
  const [change, setChange] = useState<MeterChange | null>(null)
  const busy = useRef(false)
  const progress = useRef<HTMLDivElement>(null)

  const card = CARDS[index]

  useGSAP(() => {
    gsap.to(progress.current, { width: `${(index / CARDS.length) * 100}%`, duration: 0.5, ease: 'power2.out' })
  }, [index])

  function advance(ending: Ending | null, finalMeters: MeterValues, finalHistory: HistoryEntry[]) {
    if (ending) return onFinish({ ending, decisions: index + 1, history: finalHistory })
    if (index + 1 >= CARDS.length) {
      return onFinish({ ending: winEnding(finalMeters), decisions: CARDS.length, history: finalHistory })
    }
    busy.current = false
    setOutcome(null)
    setIndex(index + 1)
  }

  function choose(i: number) {
    if (busy.current) return
    busy.current = true

    const choice = card.choices[i]
    const { meters: next, deltas } = applyEffects(meters, choice.effects)
    const nextHistory = [...history, { step: index + 1, who: CHARACTERS[card.who].name, label: choice.label }]
    const ending = findEnding(next)

    setPreview(null)
    setMeters(next)
    setHistory(nextHistory)
    setChange({ deltas, id: `${index}-${i}` })

    if (choice.result) {
      setOutcome({ text: choice.result, ending, meters: next, history: nextHistory })
    } else {
      setTimeout(() => advance(ending, next, nextHistory), 500)
    }
  }

  const continueOn = () => {
    if (outcome) advance(outcome.ending, outcome.meters, outcome.history)
  }

  // Number keys pick a choice. Enter is handled by the focused Continue button.
  const chooseRef = useRef(choose)
  useEffect(() => {
    chooseRef.current = choose
  })
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (outcome || !/^[1-9]$/.test(e.key)) return
      const i = Number(e.key) - 1
      if (i < card.choices.length) chooseRef.current(i)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [outcome, card])

  return (
    <section>
      <header className="flex items-baseline justify-between">
        <span className="font-bold tracking-tight">Crossroads</span>
        <span className="text-muted tabular-nums">
          Decision {index + 1} of {CARDS.length}
        </span>
      </header>
      <div className="mt-2 mb-5 h-1 overflow-hidden rounded-full bg-track">
        <div ref={progress} className="h-full w-0 bg-accent" />
      </div>

      <Meters meters={meters} preview={preview} change={change} />

      <DecisionCard
        key={card.id}
        card={card}
        outcome={outcome}
        onChoose={choose}
        onContinue={continueOn}
        onPreview={setPreview}
      />

      <p className="mt-4 text-center text-sm text-muted [@media(hover:none)]:hidden">
        Tip: press 1, 2 or 3 to choose, and Enter to continue.
      </p>
    </section>
  )
}
