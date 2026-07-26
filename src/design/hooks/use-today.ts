import { useSyncExternalStore } from 'react'

import type { DayString } from '@/domain/schema'
import { todayLocal } from '@/domain/time'

/**
 * Schedules a wakeup at the next local midnight and re-subscribes after
 * each fire, so the return value keeps rolling over for as long as the
 * component stays mounted.
 */
function subscribe(onChange: () => void): () => void {
  const now = new Date()
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 2)
  const timeout = setTimeout(onChange, nextMidnight.getTime() - now.getTime())
  return () => clearTimeout(timeout)
}

/**
 * Today, reactively. A one-shot `todayLocal()` call baked into a render is
 * only ever as fresh as that render — if the app is left open past
 * midnight with nothing else changing the store, nothing re-renders, and a
 * cell that *looked* like today's can still be sitting in the DOM from
 * yesterday. Clicking it would call an action that recomputes `today`
 * fresh and correctly refuses the now-stale date — refusing loudly, as an
 * uncaught `InvariantViolationError`, since nothing prompted that render to
 * reconsider what "today" means first. This hook is what keeps that render
 * honest, the same way `useMotionMode` keeps reduced-motion honest.
 */
export function useToday(): DayString {
  return useSyncExternalStore(subscribe, todayLocal, todayLocal)
}
