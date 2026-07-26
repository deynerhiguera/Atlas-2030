import { describe, expect, it } from 'vitest'

import type { WeekCell } from './week-view'
import { weeklyProgress } from './week-progress'

function cell(date: string, markId: string | null): WeekCell {
  return { date, markId }
}

describe('weeklyProgress', () => {
  it('counts marked cells against the rhythm target', () => {
    const cells: WeekCell[] = [
      cell('2026-07-06', 'm1'),
      cell('2026-07-07', null),
      cell('2026-07-08', 'm2'),
      cell('2026-07-09', null),
      cell('2026-07-10', null),
      cell('2026-07-11', null),
      cell('2026-07-12', null),
    ]
    expect(weeklyProgress(cells, 3)).toEqual({ marked: 2, target: 3 })
  })

  it('can exceed the target without being clamped — it is a count, not a ratio', () => {
    const cells: WeekCell[] = [
      cell('2026-07-06', 'm1'),
      cell('2026-07-07', 'm2'),
      cell('2026-07-08', 'm3'),
    ]
    expect(weeklyProgress(cells, 1)).toEqual({ marked: 3, target: 1 })
  })

  it('reports zero marked for an entirely empty week', () => {
    const dates = [
      '2026-07-06',
      '2026-07-07',
      '2026-07-08',
      '2026-07-09',
      '2026-07-10',
      '2026-07-11',
      '2026-07-12',
    ]
    const cells: WeekCell[] = dates.map((date) => cell(date, null))
    expect(weeklyProgress(cells, 4)).toEqual({ marked: 0, target: 4 })
  })
})
