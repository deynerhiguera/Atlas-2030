import { describe, expect, it } from 'vitest'

import { daysSinceLastActivity } from './days-since-activity'

describe('daysSinceLastActivity', () => {
  it('returns null when there is no activity at all', () => {
    expect(daysSinceLastActivity([], '2026-07-20')).toBeNull()
  })

  it('returns 0 when the most recent activity is today', () => {
    expect(daysSinceLastActivity(['2026-07-18', '2026-07-20'], '2026-07-20')).toBe(0)
  })

  it('counts from the most recent date regardless of input order', () => {
    expect(daysSinceLastActivity(['2026-07-20', '2026-06-01', '2026-07-01'], '2026-07-25')).toBe(5)
  })

  it('defaults `today` to the current local date when omitted', () => {
    expect(daysSinceLastActivity(['2026-01-01'])).toBeGreaterThan(0)
  })
})
