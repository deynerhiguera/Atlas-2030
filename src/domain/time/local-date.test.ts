import { describe, expect, it } from 'vitest'

import { addDays, compareDays, daysBetween, parseLocalDay, todayLocal } from './local-date'

describe('todayLocal', () => {
  it('reads the local calendar date, not a UTC-derived one', () => {
    const date = new Date(2026, 0, 1, 2, 0, 0)
    expect(todayLocal(date)).toBe('2026-01-01')
  })

  it('pads single-digit months and days', () => {
    expect(todayLocal(new Date(2026, 2, 5))).toBe('2026-03-05')
  })
})

describe('parseLocalDay', () => {
  it('round-trips through todayLocal', () => {
    const day = '2026-07-05'
    expect(todayLocal(parseLocalDay(day))).toBe(day)
  })
})

describe('compareDays', () => {
  it('orders chronologically', () => {
    expect(compareDays('2026-01-01', '2026-01-02')).toBe(-1)
    expect(compareDays('2026-01-02', '2026-01-01')).toBe(1)
    expect(compareDays('2026-01-01', '2026-01-01')).toBe(0)
  })
})

describe('addDays', () => {
  it('crosses a month boundary', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01')
  })

  it('crosses a year boundary', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
  })

  it('subtracts days', () => {
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })

  it('handles a leap day correctly', () => {
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29')
    expect(addDays('2028-02-29', 1)).toBe('2028-03-01')
  })
})

describe('daysBetween', () => {
  it('counts whole calendar days', () => {
    expect(daysBetween('2026-01-01', '2026-01-10')).toBe(9)
    expect(daysBetween('2026-01-10', '2026-01-01')).toBe(-9)
    expect(daysBetween('2026-01-01', '2026-01-01')).toBe(0)
  })

  it('is unaffected by a DST transition in the local timezone', () => {
    const originalTz = process.env.TZ
    process.env.TZ = 'America/New_York'
    try {
      // 2026-03-08 is the US spring-forward date (02:00 -> 03:00).
      expect(daysBetween('2026-03-07', '2026-03-08')).toBe(1)
      expect(daysBetween('2026-03-07', '2026-03-09')).toBe(2)
      // 2026-11-01 is the US fall-back date.
      expect(daysBetween('2026-10-31', '2026-11-01')).toBe(1)
      expect(daysBetween('2026-10-31', '2026-11-02')).toBe(2)
    } finally {
      process.env.TZ = originalTz
    }
  })
})
