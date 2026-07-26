import { describe, expect, it } from 'vitest'

import { todayLocal } from '../time/local-date'

import { dayOfBecoming } from './day-count'

describe('dayOfBecoming', () => {
  it('is 1 on the founding day itself, regardless of time of day', () => {
    const foundedAt = new Date(2026, 6, 5, 9, 0, 0).toISOString()
    const today = todayLocal(new Date(2026, 6, 5, 22, 0, 0))
    expect(dayOfBecoming(foundedAt, today)).toBe(1)
  })

  it('increments by exactly one per elapsed local day', () => {
    const foundedAt = new Date(2026, 6, 1, 8, 0, 0).toISOString()
    const today = todayLocal(new Date(2026, 6, 5, 8, 0, 0))
    expect(dayOfBecoming(foundedAt, today)).toBe(5)
  })

  it('defaults `today` to the current local date when omitted', () => {
    const foundedNowIso = new Date().toISOString()
    expect(dayOfBecoming(foundedNowIso)).toBe(1)
  })
})
