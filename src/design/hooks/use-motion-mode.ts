import { use, useSyncExternalStore } from 'react'

import { MotionModeOverrideContext } from './motion-mode-context'

export type MotionMode = 'full' | 'reduced'

const query = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(query)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

function prefersReducedMotion(): boolean {
  return window.matchMedia(query).matches
}

/**
 * Every animated component takes its variants from this hook — reduced
 * motion is structurally incapable of being forgotten (blueprint/03).
 *
 * Two inputs, either one enough to reduce motion: the OS-level media query,
 * and the `/data` override (`doc.settings.reducedMotion`, supplied via
 * `MotionModeOverrideContext` — see that file for why it lives in
 * `design/` rather than reading the store directly).
 */
export function useMotionMode(): MotionMode {
  const override = use(MotionModeOverrideContext)
  const systemPrefersReduced = useSyncExternalStore(subscribe, prefersReducedMotion, () => false)
  return override === 'on' || systemPrefersReduced ? 'reduced' : 'full'
}
