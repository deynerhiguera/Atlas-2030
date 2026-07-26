import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createFreshAtlasDoc } from '@/domain/schema'

import { setHydratedDoc, useAtlasStore } from '../store/atlas-store'

import { setTodayEnergy, setTodayLine } from './signal-actions'

const TODAY = new Date('2026-07-08T12:00:00-05:00')

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(TODAY)
  setHydratedDoc(createFreshAtlasDoc(TODAY, '0.0.1'))
})

afterEach(() => {
  vi.useRealTimers()
})

function signalsNow() {
  return useAtlasStore.getState().doc?.signals ?? []
}

describe('setTodayEnergy', () => {
  it('creates a signal for today when none exists', () => {
    setTodayEnergy(4)
    expect(signalsNow()).toEqual([{ date: '2026-07-08', energy: 4 }])
  })

  it('overwrites a previous energy value for today', () => {
    setTodayEnergy(2)
    setTodayEnergy(5)
    expect(signalsNow()).toEqual([{ date: '2026-07-08', energy: 5 }])
  })

  it('never disturbs an existing one-liner for the same day', () => {
    setTodayLine('A quiet, good day.')
    setTodayEnergy(3)
    expect(signalsNow()).toEqual([{ date: '2026-07-08', energy: 3, line: 'A quiet, good day.' }])
  })
})

describe('setTodayLine', () => {
  it('creates a signal from just a line, with no energy value at all', () => {
    setTodayLine('Read for an hour.')
    expect(signalsNow()).toEqual([{ date: '2026-07-08', line: 'Read for an hour.' }])
  })

  it('trims surrounding whitespace', () => {
    setTodayLine('  spaced out  ')
    expect(signalsNow()).toEqual([{ date: '2026-07-08', line: 'spaced out' }])
  })

  it('clears the line entirely when committed empty, rather than storing blank text', () => {
    setTodayLine('something')
    setTodayLine('   ')
    expect(signalsNow()).toEqual([{ date: '2026-07-08' }])
  })

  it('never disturbs an existing energy value for the same day', () => {
    setTodayEnergy(5)
    setTodayLine('Great day.')
    expect(signalsNow()).toEqual([{ date: '2026-07-08', energy: 5, line: 'Great day.' }])
  })
})
