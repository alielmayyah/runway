import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/motion.js'

/** Fades a screen in and staggers its direct children when it mounts. */
export function useScreenEnter() {
  const ref = useRef(null)
  useGSAP(
    () => {
      gsap.from(ref.current.children, {
        autoAlpha: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
      })
    },
    { scope: ref },
  )
  return ref
}
