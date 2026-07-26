import { describe, expect, it } from 'vitest'

import {
  addWeeks,
  compareWeeks,
  daysOfWeek,
  isoWeekKeyOf,
  mondayOf,
  stepWeek,
  weekBoundaries,
} from './iso-week'

// Hand-verified calendar facts used throughout this file:
// 2026-01-01 is a Thursday (2024-01-01 Mon -> 2025-01-01 Wed -> 2026-01-01 Thu).
// Because Jan 1 2026 falls on a Thursday, ISO year 2026 has 53 weeks.
// 2027-01-01 is a Friday, and therefore belongs to ISO week 2026-W53.

describe('isoWeekKeyOf', () => {
  it('places a Thursday January 1st in week 1 of its own year', () => {
    expect(isoWeekKeyOf('2026-01-01')).toBe('2026-W01')
  })

  it('places the days before it in the same week-1, under the new ISO year', () => {
    // Monday of 2026-W01 is 2025-12-29 (three days before Jan 1's Thursday).
    expect(isoWeekKeyOf('2025-12-29')).toBe('2026-W01')
    expect(isoWeekKeyOf('2025-12-31')).toBe('2026-W01')
  })

  it('assigns early January to the previous ISO year when that year has 53 weeks', () => {
    expect(isoWeekKeyOf('2027-01-01')).toBe('2026-W53')
    expect(isoWeekKeyOf('2027-01-03')).toBe('2026-W53')
    expect(isoWeekKeyOf('2027-01-04')).toBe('2027-W01')
  })
})

describe('mondayOf / weekBoundaries / daysOfWeek', () => {
  it('resolves the Monday of a known week', () => {
    expect(mondayOf('2026-W01')).toBe('2025-12-29')
    expect(mondayOf('2026-W53')).toBe('2026-12-28')
  })

  it('produces Monday..Sunday boundaries', () => {
    expect(weekBoundaries('2026-W01')).toEqual({ start: '2025-12-29', end: '2026-01-04' })
  })

  it('produces exactly seven consecutive days starting on the boundary start', () => {
    const days = daysOfWeek('2026-W27')
    expect(days).toHaveLength(7)
    expect(days[0]).toBe(weekBoundaries('2026-W27').start)
    expect(days[6]).toBe(weekBoundaries('2026-W27').end)
  })
})

describe('addWeeks', () => {
  it('steps forward within a year', () => {
    expect(addWeeks('2026-W01', 1)).toBe('2026-W02')
  })

  it('rolls forward across the 53-week year boundary', () => {
    expect(addWeeks('2026-W53', 1)).toBe('2027-W01')
  })

  it('steps backward', () => {
    expect(addWeeks('2027-W01', -1)).toBe('2026-W53')
  })
})

describe('compareWeeks', () => {
  it('orders weeks like their keys', () => {
    expect(compareWeeks('2026-W01', '2026-W02')).toBe(-1)
    expect(compareWeeks('2026-W02', '2026-W01')).toBe(1)
    expect(compareWeeks('2026-W27', '2026-W27')).toBe(0)
  })
})

describe('stepWeek', () => {
  it('always allows stepping backward, arbitrarily far, matching addWeeks(-1)', () => {
    expect(stepWeek('2026-W01', 'prev', '2026-W27')).toBe(addWeeks('2026-W01', -1))
  })

  it('steps forward while below the current week', () => {
    expect(stepWeek('2026-W25', 'next', '2026-W27')).toBe('2026-W26')
  })

  it('clamps forward stepping at the current week', () => {
    expect(stepWeek('2026-W27', 'next', '2026-W27')).toBe('2026-W27')
  })

  it('never overshoots the current week even by one step', () => {
    expect(stepWeek('2026-W26', 'next', '2026-W27')).toBe('2026-W27')
  })
})
