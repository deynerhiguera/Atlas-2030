import { describe, expect, it } from 'vitest'

import type { SessionMark } from '../schema/entities'

import { weekCellsFor } from './week-view'

describe('weekCellsFor', () => {
  it('produces one cell per day of the week, marked where a session exists', () => {
    const sessions: SessionMark[] = [
      { id: 'a', systemId: 'sys-a', date: '2026-06-30' },
      { id: 'b', systemId: 'sys-a', date: '2026-07-02' },
      { id: 'c', systemId: 'sys-b', date: '2026-07-01' }, // different system
    ]

    const cells = weekCellsFor(sessions, 'sys-a', '2026-W27')

    expect(cells).toHaveLength(7)
    expect(cells[0]).toEqual({ date: '2026-06-29', markId: null })
    expect(cells[1]).toEqual({ date: '2026-06-30', markId: 'a' })
    expect(cells[3]).toEqual({ date: '2026-07-02', markId: 'b' })
  })
})
