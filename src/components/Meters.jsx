import { useRef } from 'react'
import { BIG_EFFECT, DANGER_HIGH, DANGER_LOW, METERS } from '../game/engine.js'
import { gsap, useGSAP } from '../lib/motion.js'

/**
 * @param meters   current values, 0-100
 * @param preview  effects of the hovered choice, or null
 * @param change   { deltas, id } from the last choice; a new id replays the arrows
 */
export default function Meters({ meters, preview, change }) {
  return (
    <div className="mb-5 grid grid-cols-4 gap-2">
      {METERS.map((m) => (
        <Meter
          key={m.key}
          meter={m}
          value={meters[m.key]}
          previewDelta={preview?.[m.key] ?? 0}
          delta={change?.deltas[m.key] ?? 0}
          changeId={change?.id}
        />
      ))}
    </div>
  )
}

function Meter({ meter, value, previewDelta, delta, changeId }) {
  const root = useRef(null)
  const fill = useRef(null)
  const dot = useRef(null)
  const arrow = useRef(null)
  const danger = value <= DANGER_LOW || value >= DANGER_HIGH

  // Fill level
  useGSAP(
    () => {
      gsap.to(fill.current, { height: `${value}%`, duration: 0.7, ease: 'power3.out', overwrite: 'auto' })
    },
    { dependencies: [value], scope: root },
  )

  // Start with the preview dot hidden
  useGSAP(() => gsap.set(dot.current, { scale: 0 }), { scope: root })

  // Preview dot: hidden, small or big depending on how much the hovered choice moves this meter
  useGSAP(
    () => {
      const size = Math.abs(previewDelta)
      const scale = size === 0 ? 0 : size < BIG_EFFECT ? 0.5 : 1
      gsap.to(dot.current, { scale, duration: 0.2, ease: 'back.out(3)', overwrite: 'auto' })
    },
    { dependencies: [previewDelta], scope: root },
  )

  // Up/down arrow after a choice, plus a little shake when the meter drops
  useGSAP(
    () => {
      if (!delta) return
      gsap
        .timeline()
        .fromTo(arrow.current, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.2 })
        .to(arrow.current, { autoAlpha: 0, y: -10, duration: 0.4, delay: 0.7 })
      if (delta < 0) {
        gsap.fromTo(root.current, { x: 0 }, { x: 3, duration: 0.06, repeat: 5, yoyo: true, clearProps: 'x' })
      }
    },
    { dependencies: [changeId], scope: root },
  )

  return (
    <div ref={root} className={`relative flex flex-col items-center gap-1.5 ${danger ? 'is-danger' : ''}`}>
      <div className="grid h-3.5 w-3.5 place-items-center">
        <div ref={dot} className="meter-dot" />
      </div>
      <div className="text-[22px] leading-none" aria-hidden="true">
        {meter.icon}
      </div>
      <div className="meter-bar" role="meter" aria-label={meter.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
        <div ref={fill} className="meter-fill" />
      </div>
      <div className="text-sm text-muted">{meter.label}</div>
      <div
        ref={arrow}
        className={`invisible absolute top-12.5 right-[calc(50%-38px)] text-sm font-bold ${delta > 0 ? 'text-up' : 'text-down'}`}
      >
        {delta > 0 ? '▲' : '▼'}
      </div>
    </div>
  )
}
