import type { DayString } from '../schema/primitives'
import { compareDays, daysBetween, todayLocal } from '../time/local-date'

/**
 * "Days since a trace was last left" (blueprint/02 Week states: "welcome
 * back"). Derived from the most recent session mark or signal date — no
 * separate "last opened" field is stored; a day the app was merely viewed
 * without marking anything doesn't count as activity, which is exactly the
 * gap the welcome-back state is meant to notice.
 *
 * `null` when there is no activity yet at all (day one of founding) — a
 * gap is only meaningful once something has been left to return to.
 */
export function daysSinceLastActivity(
  activityDates: readonly DayString[],
  today: DayString = todayLocal(),
): number | null {
  if (activityDates.length === 0) return null

  const mostRecent = activityDates.reduce((latest, date) => (compareDays(date, latest) > 0 ? date : latest))
  return daysBetween(mostRecent, today)
}
