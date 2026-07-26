import { describe, expect, it } from 'vitest'

import type { Season } from '../schema/entities'

import { seasonWeekIndex } from './season-progress'

function season(overrides: Partial<Season> = {}): Season {
  return {
    id: 's1',
    name: 'Foundations',
    startDate: '2026-07-06', // a Monday
    plannedEndDate: '2026-09-27', // 12 weeks later
    focusPillars: ['engineering', 'health'],
    intentions: [{ id: 'i1', text: 'Ship the first weekend' }],
    ...overrides,
  }
}

describe('seasonWeekIndex', () => {
  it("is week 1 of the total during the season's own start week", () => {
    expect(seasonWeekIndex(season(), '2026-W28')).toEqual({ index: 1, total: 12 })
  })

  it('advances by one for each ISO week that follows', () => {
    expect(seasonWeekIndex(season(), '2026-W29')).toEqual({ index: 2, total: 12 })
    expect(seasonWeekIndex(season(), '2026-W31')).toEqual({ index: 4, total: 12 })
  })

  it('rounds the total length up to a whole week', () => {
    const info = seasonWeekIndex(season({ plannedEndDate: '2026-07-15' }), '2026-W28')
    // 2026-07-06 -> 2026-07-15 is 9 days, i.e. more than one week but less than two.
    expect(info.total).toBe(2)
  })
})
