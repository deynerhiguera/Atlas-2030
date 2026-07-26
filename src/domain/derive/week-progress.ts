import type { WeekCell } from './week-view'

export interface WeekProgress {
  marked: number
  target: number
}

/**
 * Sessions marked this calendar week against the system's rhythm — the
 * "n of m" chip (blueprint/06 FR-W3). Deliberately not a percentage or a
 * ratio: a bare count against a target is the least gamified way to say
 * the same thing.
 */
export function weeklyProgress(cells: readonly WeekCell[], rhythmPerWeek: number): WeekProgress {
  const marked = cells.filter((cell) => cell.markId !== null).length
  return { marked, target: rhythmPerWeek }
}
