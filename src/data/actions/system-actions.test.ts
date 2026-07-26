import { beforeEach, describe, expect, it } from 'vitest'
import { ZodError } from 'zod'

import { createFreshAtlasDoc } from '@/domain/schema'

import { setHydratedDoc, useAtlasStore } from '../store/atlas-store'

import { addSystem } from './system-actions'

beforeEach(() => {
  setHydratedDoc(createFreshAtlasDoc(new Date('2026-07-08T12:00:00-05:00'), '0.0.1'))
})

function systemsNow() {
  return useAtlasStore.getState().doc?.systems ?? []
}

describe('addSystem', () => {
  it('appends a valid, active system', () => {
    addSystem({ name: 'Deep Learning', pillar: 'engineering', rhythmPerWeek: 3 })
    const [system] = systemsNow()
    expect(system).toMatchObject({
      name: 'Deep Learning',
      pillar: 'engineering',
      rhythmPerWeek: 3,
      status: 'active',
    })
    expect(system?.id).toBeTruthy()
    expect(system?.createdAt).toBeTruthy()
  })

  it('trims the name', () => {
    addSystem({ name: '  Gym  ', pillar: 'health', rhythmPerWeek: 4 })
    expect(systemsNow()[0]?.name).toBe('Gym')
  })

  it('leaves earlier systems untouched when adding another', () => {
    addSystem({ name: 'Deep Learning', pillar: 'engineering', rhythmPerWeek: 3 })
    addSystem({ name: 'Gym', pillar: 'health', rhythmPerWeek: 4 })
    expect(systemsNow().map((s) => s.name)).toEqual(['Deep Learning', 'Gym'])
  })

  it('refuses a blank name even if a caller bypasses the form', () => {
    expect(() => addSystem({ name: '   ', pillar: 'engineering', rhythmPerWeek: 3 })).toThrow(
      ZodError,
    )
    expect(systemsNow()).toEqual([])
  })
})
