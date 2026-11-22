import { useEffect, useRef, useState } from 'react'
import { CARDS, CHARACTERS } from '../data/cards.js'
import { applyEffects, findEnding, initialMeters, winEnding } from '../game/engine.js'
import { gsap, useGSAP } from '../lib/motion.js'
import DecisionCard from './DecisionCard.jsx'
import Meters from './Meters.jsx'

export default function GameScreen({ onFinish }) {
  const [index, setIndex] = useState(0)
  const [meters, setMeters] = useState(initialMeters)
  const [history, setHistory] = useState([])
  const [outcome, setOutcome] = useState(null)
  const [preview, setPreview] = useState(null)
  const [change, setChange] = useState(null)
  const busy = useRef(false)
  const progress = useRef(null)

  const card = CARDS[index]

  useGSAP(() => {
    gsap.to(progress.current, { width: `${(index / CARDS.length) * 100}%`, duration: 0.5, ease: 'power2.out' })
  }, [index])

  function advance(ending, finalMeters, finalHistory) {
    if (ending) return onFinish({ ending, decisions: index + 1, history: finalHistory })
    if (index + 1 >= CARDS.length) {
      return onFinish({ ending: winEnding(finalMeters), decisions: CARDS.length, history: finalHistory })
    }
    busy.current = false
    setOutcome(null)
    setIndex(index + 1)
  }

  function choose(i) {
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

  const continueOn = () => advance(outcome.ending, outcome.meters, outcome.history)

  // Number keys pick a choice. Enter is handled by the focused Continue button.
  const chooseRef = useRef(choose)
  useEffect(() => {
    chooseRef.current = choose
  })
  useEffect(() => {
    const onKey = (e) => {
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
