import type { DayString } from '../schema/primitives'
import type { SessionMark } from '../schema/entities'
import { addDays, compareDays } from '../time/local-date'

export interface DensityResult {
  marked: number
  expected: number
  ratio: number
}

/**
 * Sessions against rhythm over a rolling window (blueprint/04). `expected`
 * is the rhythm prorated to the window length — a 7-day window against a
 * 3/week rhythm expects 3; a 30-day window expects ~12.86.
 *
 * At schemaVersion 1 a system's rhythm is fixed for its lifetime (no
 * rhythmHistory yet — DR-7's proration-by-period applies once rhythm can
 * change, at schemaVersion 2), so a single rhythm value is correct here.
 */
export function densityFor(
  sessions: readonly SessionMark[],
  systemId: string,
  windowDays: 7 | 30,
  rhythmPerWeek: number,
  referenceDay: DayString,
): DensityResult {
  const windowStart = addDays(referenceDay, -(windowDays - 1))
  const marked = sessions.filter(
    (session) =>
      session.systemId === systemId &&
      compareDays(session.date, windowStart) >= 0 &&
      compareDays(session.date, referenceDay) <= 0,
  ).length

  const expected = (rhythmPerWeek * windowDays) / 7
  const ratio = expected > 0 ? Math.min(1, marked / expected) : 0

  return { marked, expected, ratio }
}
