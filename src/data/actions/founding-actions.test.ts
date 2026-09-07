import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createFreshAtlasDoc, PILLAR_IDS, type AtlasDoc, type PillarId } from '@/domain/schema'

import * as storageStatus from '../persist/storage-status'
import { setHydratedDoc, useAtlasStore } from '../store/atlas-store'
import { setTodayEnergy } from './signal-actions'

import {
  completeFounding,
  completeSystemsDeclaration,
  foundBook,
  foundQuestion,
  foundSeason,
  recordIdentityStatement,
  sealLetter,
} from './founding-actions'
import { addSystem } from './system-actions'

const NOW = new Date('2026-07-08T09:00:00-05:00')

function doc(): AtlasDoc {
  const current = useAtlasStore.getState().doc
  if (current === null) throw new Error('doc is null')
  return current
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(NOW)
  setHydratedDoc(createFreshAtlasDoc(NOW, '0.0.1'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('sealLetter', () => {
  it('stores a sentinel-prefixed sealed body and advances to identity', () => {
    sealLetter('Dear future me, ...')
    expect(doc().letter?.sealedBody.startsWith('ATLAS-SEALED-V1:')).toBe(true)
    expect(doc().letter?.opensAt).toBe('2030-12-01')
    expect(doc().meta.foundingStep).toBe('identity')
  })

  it('never stores the plain text anywhere in the document', () => {
    sealLetter('a secret only future me should read')
    expect(JSON.stringify(doc())).not.toContain('a secret only future me should read')
  })

  it('refuses an empty letter', () => {
    sealLetter('   ')
    expect(doc().letter).toBeUndefined()
    expect(doc().meta.foundingStep).toBe('letter')
  })
})

describe('recordIdentityStatement', () => {
  it('appends a statement for the given pillar without advancing before all six', () => {
    recordIdentityStatement('engineering', 'I build systems people trust.')
    expect(doc().identity).toEqual([
      expect.objectContaining({ pillar: 'engineering', text: 'I build systems people trust.' }),
    ])
    expect(doc().meta.foundingStep).toBe('identity')
  })

  it('advances to systems once all six pillars have a statement', () => {
    for (const pillar of PILLAR_IDS) {
      recordIdentityStatement(pillar, `A statement for ${pillar}.`)
    }
    expect(doc().identity).toHaveLength(6)
    expect(doc().meta.foundingStep).toBe('systems')
  })

  it('refuses a blank statement', () => {
    recordIdentityStatement('engineering', '   ')
    expect(doc().identity).toEqual([])
  })
})

describe('completeSystemsDeclaration', () => {
  it('refuses to advance with nothing declared', () => {
    completeSystemsDeclaration()
    expect(doc().meta.foundingStep).toBe('letter')
  })

  it('advances to season once at least one system exists', () => {
    addSystem({ name: 'Deep Learning', pillar: 'engineering', rhythmPerWeek: 3 })
    completeSystemsDeclaration()
    expect(doc().meta.foundingStep).toBe('season')
  })
})

describe('foundSeason', () => {
  it('creates the first season with a computed ~12-week end date and advances to question', () => {
    foundSeason({
      name: 'Foundations',
      focusPillars: ['engineering', 'health'],
      intentions: ['Ship something real', 'Show up daily'],
    })
    const [season] = doc().seasons
    expect(season).toMatchObject({
      name: 'Foundations',
      startDate: '2026-07-08',
      plannedEndDate: '2026-09-30',
      focusPillars: ['engineering', 'health'],
    })
    expect(season?.intentions.map((intention) => intention.text)).toEqual([
      'Ship something real',
      'Show up daily',
    ])
    expect(doc().meta.foundingStep).toBe('question')
  })

  it('drops blank intention lines rather than storing them', () => {
    foundSeason({
      name: 'Foundations',
      focusPillars: ['engineering', 'health'],
      intentions: ['Ship something real', '   '],
    })
    expect(doc().seasons[0]?.intentions).toHaveLength(1)
  })
})

describe('foundQuestion', () => {
  it('asks the question through the real action and advances to book', () => {
    foundQuestion({ text: 'Why does RAM exist?', pillar: 'engineering' })
    expect(doc().questions).toEqual([
      expect.objectContaining({ text: 'Why does RAM exist?', state: 'open' }),
    ])
    expect(doc().meta.foundingStep).toBe('book')
  })
})

describe('foundBook', () => {
  it('starts the book through the real action and advances to pulse', () => {
    foundBook({
      title: 'The Soul of a New Machine',
      pillar: 'engineering',
      why: 'To understand how machines get built.',
    })
    expect(doc().books).toEqual([
      expect.objectContaining({ title: 'The Soul of a New Machine', status: 'reading' }),
    ])
    expect(doc().meta.foundingStep).toBe('pulse')
  })
})

describe('completeFounding', () => {
  it('refuses to finish without a recorded energy for today', () => {
    completeFounding()
    expect(doc().meta.foundingStep).toBe('letter')
  })

  it('deletes foundingStep once today has an energy value, leaving foundedAt untouched', () => {
    const foundedAtBefore = doc().meta.foundedAt
    setTodayEnergy(4)
    completeFounding()
    expect(doc().meta.foundingStep).toBeUndefined()
    expect(doc().meta.foundedAt).toBe(foundedAtBefore)
  })

  it('requests persistent storage once founding actually completes (FR-D6)', () => {
    const spy = vi.spyOn(storageStatus, 'requestPersistentStorage').mockResolvedValue(true)
    setTodayEnergy(4)
    completeFounding()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('does not request persistent storage when completion is refused', () => {
    const spy = vi.spyOn(storageStatus, 'requestPersistentStorage').mockResolvedValue(true)
    completeFounding()
    expect(spy).not.toHaveBeenCalled()
  })
})

describe('the full sequence end to end', () => {
  it('walks every step in order and finishes founded', () => {
    sealLetter('A letter to 2030.')
    for (const pillar of PILLAR_IDS as readonly PillarId[]) {
      recordIdentityStatement(pillar, `A statement for ${pillar}.`)
    }
    addSystem({ name: 'Deep Learning', pillar: 'engineering', rhythmPerWeek: 3 })
    completeSystemsDeclaration()
    foundSeason({
      name: 'Foundations',
      focusPillars: ['engineering', 'health'],
      intentions: ['Ship something real'],
    })
    foundQuestion({ text: 'Why does RAM exist?', pillar: 'engineering' })
    foundBook({
      title: 'The Soul of a New Machine',
      pillar: 'engineering',
      why: 'To understand how machines get built.',
    })
    setTodayEnergy(4)
    completeFounding()

    expect(doc().meta.foundingStep).toBeUndefined()
    expect(doc().letter).toBeDefined()
    expect(doc().identity).toHaveLength(6)
    expect(doc().systems).toHaveLength(1)
    expect(doc().seasons).toHaveLength(1)
    expect(doc().questions).toHaveLength(1)
    expect(doc().books).toHaveLength(1)
    expect(doc().signals).toEqual([expect.objectContaining({ energy: 4 })])
  })
})
