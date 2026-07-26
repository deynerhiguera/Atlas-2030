import { useSyncExternalStore } from 'react'

export type MotionMode = 'full' | 'reduced'

const query = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(query)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

function getSnapshot(): MotionMode {
  return window.matchMedia(query).matches ? 'reduced' : 'full'
}

/**
 * Every animated component takes its variants from this hook —
 * reduced motion is structurally incapable of being forgotten (blueprint/03).
 */
export function useMotionMode(): MotionMode {
  return useSyncExternalStore(subscribe, getSnapshot, () => 'full')
}
