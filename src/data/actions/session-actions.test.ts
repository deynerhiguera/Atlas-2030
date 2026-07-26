import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InvariantViolationError } from '@/domain/rules'
import { createFreshAtlasDoc, type System } from '@/domain/schema'

import { setHydratedDoc, useAtlasStore } from '../store/atlas-store'

import { toggleSession } from './session-actions'

const TODAY = new Date('2026-07-08T12:00:00-05:00') // a Wednesday, ISO week 2026-W28

function system(overrides: Partial<System> = {}): System {
  return {
    id: 'sys-1',
    name: 'Deep Learning',
    pillar: 'engineering',
    rhythmPerWeek: 3,
    status: 'active',
    createdAt: '2026-07-01T09:00:00-05:00',
    ...overrides,
  }
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(TODAY)
  setHydratedDoc({ ...createFreshAtlasDoc(TODAY, '0.0.1'), systems: [system()] })
})

afterEach(() => {
  vi.useRealTimers()
})

function sessionsNow() {
  return useAtlasStore.getState().doc?.sessions ?? []
}

describe('toggleSession', () => {
  it('marks an unmarked, editable day', () => {
    toggleSession('sys-1', '2026-07-08')
    expect(sessionsNow()).toEqual([
      expect.objectContaining({ systemId: 'sys-1', date: '2026-07-08' }),
    ])
  })

  it('unmarks an already-marked day on a second toggle', () => {
    toggleSession('sys-1', '2026-07-08')
    toggleSession('sys-1', '2026-07-08')
    expect(sessionsNow()).toEqual([])
  })

  it('marks an earlier day within the current ISO week', () => {
    toggleSession('sys-1', '2026-07-06') // Monday of the same week
    expect(sessionsNow()).toHaveLength(1)
  })

  it('refuses a future day, even within the current week', () => {
    expect(() => toggleSession('sys-1', '2026-07-10')).toThrow(InvariantViolationError)
    expect(sessionsNow()).toEqual([])
  })

  it('refuses a day in a past week', () => {
    expect(() => toggleSession('sys-1', '2026-06-29')).toThrow(InvariantViolationError)
    expect(sessionsNow()).toEqual([])
  })

  it('keeps two systems independent on the same day', () => {
    setHydratedDoc({
      ...createFreshAtlasDoc(TODAY, '0.0.1'),
      systems: [system(), system({ id: 'sys-2', name: 'Gym', pillar: 'health' })],
    })
    toggleSession('sys-1', '2026-07-08')
    toggleSession('sys-2', '2026-07-08')
    expect(sessionsNow()).toHaveLength(2)
  })
})
