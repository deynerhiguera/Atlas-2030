import type { DayString } from '../schema/primitives'
import type { SessionMark } from '../schema/entities'
import { daysOfWeek, type WeekKey } from '../time/iso-week'

export interface WeekCell {
  date: DayString
  markId: string | null
}

/**
 * One cell per day of the week for a given system — the shape SystemRow
 * (roadmap M2) renders directly. Pure and selector-friendly: callers narrow
 * `sessions` to one system's marks before calling, or pass the full list.
 */
export function weekCellsFor(
  sessions: readonly SessionMark[],
  systemId: string,
  weekKey: WeekKey,
): WeekCell[] {
  const marksByDate = new Map(
    sessions.filter((session) => session.systemId === systemId).map((session) => [session.date, session.id]),
  )

  return daysOfWeek(weekKey).map((date) => ({
    date,
    markId: marksByDate.get(date) ?? null,
  }))
}
