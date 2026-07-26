import type { DayString } from '../schema/primitives'
import { daysBetween, todayLocal } from '../time/local-date'

/**
 * "Day N of becoming" (blueprint/02, /03) — derived, never stored. Day 1 is
 * the founding day itself.
 */
export function dayOfBecoming(foundedAt: string, today: DayString = todayLocal()): number {
  const foundedDay = todayLocal(new Date(foundedAt))
  return daysBetween(foundedDay, today) + 1
}
