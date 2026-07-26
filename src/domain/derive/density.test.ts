import { describe, expect, it } from 'vitest'

import type { SessionMark } from '../schema/entities'

import { densityFor } from './density'

function mark(systemId: string, date: string): SessionMark {
  return { id: `${systemId}-${date}`, systemId, date }
}

describe('densityFor', () => {
  it('counts only the given system, within the window, up to the reference day', () => {
    const sessions: SessionMark[] = [
      mark('sys-a', '2026-07-01'),
      mark('sys-a', '2026-07-03'),
      mark('sys-b', '2026-07-03'), // different system, ignored
      mark('sys-a', '2026-07-10'), // outside the 7-day window ending 07-05
    ]

    const result = densityFor(sessions, 'sys-a', 7, 3, '2026-07-05')
    expect(result.marked).toBe(2)
    expect(result.expected).toBe(3)
    expect(result.ratio).toBeCloseTo(2 / 3)
  })

  it('prorates a 30-day window against a weekly rhythm', () => {
    const result = densityFor([], 'sys-a', 30, 7, '2026-07-05')
    expect(result.expected).toBeCloseTo(30)
  })

  it('caps the ratio at 1 even when marks exceed the expected count', () => {
    const sessions: SessionMark[] = [
      mark('sys-a', '2026-07-01'),
      mark('sys-a', '2026-07-02'),
      mark('sys-a', '2026-07-03'),
    ]
    const result = densityFor(sessions, 'sys-a', 7, 1, '2026-07-05')
    expect(result.marked).toBe(3)
    expect(result.ratio).toBe(1)
  })

  it('returns zero ratio when nothing is expected', () => {
    const result = densityFor([], 'sys-a', 7, 0, '2026-07-05')
    expect(result.ratio).toBe(0)
  })
})
