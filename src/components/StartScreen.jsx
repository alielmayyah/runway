import { useRef } from 'react'
import { CARDS } from '../data/cards.js'
import { gsap, reducedMotion, useGSAP } from '../lib/motion.js'
import { useScreenEnter } from './useScreenEnter.js'

export default function StartScreen({ best, onStart }) {
  const ref = useScreenEnter()
  const rocket = useRef(null)

  useGSAP(() => {
    if (reducedMotion) return
    gsap.to(rocket.current, { y: -8, rotate: -6, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  })

  return (
    <section ref={ref}>
      <div className="pt-6 pb-2 text-center">
        <div ref={rocket} className="inline-block text-[56px] leading-none">
          🚀
        </div>
        <h1 className="mt-3 mb-1 text-[2.4rem] font-bold tracking-tight">Runway</h1>
        <p className="text-lg text-muted">Make the calls that keep your startup alive.</p>
      </div>

      <ul className="panel my-6 list-disc space-y-1.5 py-5 pr-5 pl-10">
        <li>Each week someone brings you a problem. Pick how to handle it.</li>
        <li>
          Every choice moves your four meters: <b>Cash</b>, <b>Team</b>, <b>Users</b> and <b>Investors</b>.
        </li>
        <li>
          If any meter hits <b>empty</b> or <b>full</b>, the run is over. Too much of a good thing is a problem too.
        </li>
        <li>Hover over a choice to see which meters it will affect. A bigger dot means a bigger change.</li>
      </ul>

      <button className="btn-primary" onClick={onStart} autoFocus>
        Start the company
      </button>
      <p className="mt-3.5 min-h-6 text-center text-muted">
        {best > 0 && `Best run: ${best} of ${CARDS.length} weeks`}
      </p>
    </section>
  )
}
