import { useRef, useState, type ReactNode } from 'react'
import { CARDS } from '../data/cards.ts'
import { gsap, useGSAP } from '../lib/motion.ts'
import type { RunResult } from '../types.ts'
import { useScreenEnter } from './useScreenEnter.ts'

interface EndScreenProps {
  result: RunResult
  best: number
  onRestart: () => void
}

export default function EndScreen({ result, best, onRestart }: EndScreenProps) {
  const ref = useScreenEnter()
  const mark = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(0)
  const total = CARDS.length

  useGSAP(
    () => {
      gsap.from(mark.current, { scale: 0, rotate: -30, duration: 0.7, delay: 0.15, ease: 'back.out(2.5)' })
      // Count the decisions up from 0
      const counter = { v: 0 }
      gsap.to(counter, {
        v: result.decisions,
        duration: 0.8,
        delay: 0.3,
        ease: 'power2.out',
        onUpdate: () => setShown(Math.round(counter.v)),
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref}>
      <div className="pt-6 pb-2 text-center">
        <div ref={mark} className="inline-block text-[56px] leading-none">
          {result.ending.mark}
        </div>
        <h1 className="mt-3 mb-1 text-[2.4rem] font-bold tracking-tight">{result.ending.title}</h1>
        <p className="mx-auto mt-2 max-w-[44ch] text-[1.05rem] text-muted">{result.ending.text}</p>
      </div>

      <div className="my-6 grid grid-cols-2 gap-3">
        <Stat label="decisions made">
          {shown}/{total}
        </Stat>
        <Stat label="best run">
          {best}/{total}
        </Stat>
      </div>

      <div className="panel mb-6 px-5 py-4 shadow-none">
        <h2 className="mb-2 font-bold">Your calls</h2>
        <ol className="list-decimal space-y-1 pl-5">
          {result.history.slice(-5).map((h) => (
            <li key={h.step}>
              <span className="text-sm text-muted">
                Age {h.age}, {h.who}:
              </span>{' '}
              {h.label}
            </li>
          ))}
        </ol>
      </div>

      <button className="btn-primary" onClick={onRestart} autoFocus>
        Live it again
      </button>
    </section>
  )
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="panel flex flex-col p-4 text-center shadow-none">
      <span className="text-[2rem] font-bold tabular-nums">{children}</span>
      <span className="text-sm text-muted">{label}</span>
    </div>
  )
}
