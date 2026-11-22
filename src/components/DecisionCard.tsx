import { useRef } from 'react'
import { CHARACTERS } from '../data/cards.ts'
import { gsap, useGSAP } from '../lib/motion.ts'
import type { Card, Effects, Outcome } from '../types.ts'

interface DecisionCardProps {
  card: Card
  /** Set once a choice with a result line has been made */
  outcome: Outcome | null
  onChoose: (index: number) => void
  onContinue: () => void
  onPreview: (effects: Effects | null) => void
}

/** One decision. Remount it (with a new key) for each card so the entrance animation replays. */
export default function DecisionCard({ card, outcome, onChoose, onContinue, onPreview }: DecisionCardProps) {
  const root = useRef<HTMLElement>(null)
  const who = CHARACTERS[card.who]

  // Card entrance
  useGSAP(
    () => {
      gsap
        .timeline()
        .from(root.current, { autoAlpha: 0, y: 24, scale: 0.97, duration: 0.45, ease: 'power3.out' })
        .from('.choice', { autoAlpha: 0, y: 10, duration: 0.3, stagger: 0.08, ease: 'power2.out' }, '-=0.2')
    },
    { scope: root },
  )

  // Outcome reveal
  useGSAP(
    () => {
      if (outcome) gsap.from('.outcome', { autoAlpha: 0, y: 8, duration: 0.35, ease: 'power2.out' })
    },
    { dependencies: [outcome], scope: root },
  )

  return (
    <article ref={root} className="panel rounded-[22px] p-[22px]">
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-track text-[30px]">{who.avatar}</div>
        <div>
          <div className="font-bold">{who.name}</div>
          <div className="text-sm text-muted">{who.role}</div>
        </div>
      </div>

      <p className="mt-[18px] mb-5 text-[1.15rem]">{card.text}</p>

      {outcome ? (
        <div className="outcome">
          <p className="mb-4 border-l-[3px] border-accent pl-3 text-muted italic">{outcome.text}</p>
          <button className="btn-primary" onClick={onContinue} autoFocus>
            {outcome.ending ? 'See what happened' : 'Continue'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {card.choices.map((choice, i) => (
            <button
              key={choice.label}
              className="choice flex w-full cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] border-line px-3.5 py-3 text-left transition-colors hover:border-accent hover:bg-accent/8 focus-visible:border-accent focus-visible:bg-accent/8 active:scale-[0.99]"
              onClick={() => onChoose(i)}
              onMouseEnter={() => onPreview(choice.effects)}
              onMouseLeave={() => onPreview(null)}
              onFocus={() => onPreview(choice.effects)}
              onBlur={() => onPreview(null)}
            >
              <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-lg bg-track text-sm font-bold text-muted">
                {i + 1}
              </span>
              <span>{choice.label}</span>
            </button>
          ))}
        </div>
      )}
    </article>
  )
}
