import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// With reduced motion, every tween finishes almost instantly instead of animating.
if (reducedMotion) gsap.globalTimeline.timeScale(1000)

export { gsap, useGSAP }
