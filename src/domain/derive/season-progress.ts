import type { Season } from '../schema/entities'
import { daysBetween } from '../time/local-date'
import { mondayOf, type WeekKey } from '../time/iso-week'

export interface SeasonWeekInfo {
  index: number
  total: number
}

/**
 * "Foundations · week 4 of 12" (blueprint/02 FR-W1). `index` counts from 1 at
 * the season's own start week; `total` is the season's planned length in
 * weeks, rounded up. Not clamped to the season's span — a week outside it
 * (viewed via past-week navigation) still produces an honest, if unusual, index.
 */
export function seasonWeekIndex(season: Season, weekKey: WeekKey): SeasonWeekInfo {
  const viewedMonday = mondayOf(weekKey)
  const index = Math.floor(daysBetween(season.startDate, viewedMonday) / 7) + 1
  const total = Math.max(1, Math.ceil(daysBetween(season.startDate, season.plannedEndDate) / 7))
  return { index, total }
}
