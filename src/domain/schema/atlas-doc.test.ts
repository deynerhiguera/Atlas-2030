import { describe, expect, it } from 'vitest'

import { atlasDocSchema, createFreshAtlasDoc, CURRENT_SCHEMA_VERSION } from './atlas-doc'

describe('createFreshAtlasDoc', () => {
  it('produces a document that satisfies its own schema', () => {
    const doc = createFreshAtlasDoc(new Date('2026-07-05T09:00:00.000Z'), '0.0.1')
    expect(atlasDocSchema.safeParse(doc).success).toBe(true)
  })

  it('starts with every collection empty and default settings', () => {
    const doc = createFreshAtlasDoc(new Date(), '0.0.1')
    expect(doc.schemaVersion).toBe(CURRENT_SCHEMA_VERSION)
    expect(doc.identity).toEqual([])
    expect(doc.seasons).toEqual([])
    expect(doc.systems).toEqual([])
    expect(doc.letter).toBeUndefined()
    expect(doc.settings).toEqual({ theme: 'system', reducedMotion: 'system' })
  })

  it('round-trips through JSON without loss', () => {
    const doc = createFreshAtlasDoc(new Date(), '0.0.1')
    const roundTripped: unknown = JSON.parse(JSON.stringify(doc))
    expect(atlasDocSchema.parse(roundTripped)).toEqual(doc)
  })
})

describe('atlasDocSchema validation', () => {
  function validDoc() {
    return createFreshAtlasDoc(new Date('2026-07-05T09:00:00.000Z'), '0.0.1')
  }

  it('rejects a season with only one focus pillar', () => {
    const doc = {
      ...validDoc(),
      seasons: [
        {
          id: 'season-01',
          name: 'Foundations',
          startDate: '2026-07-01',
          plannedEndDate: '2026-09-23',
          focusPillars: ['engineering'],
          intentions: [{ id: 'intent-01', text: 'Ship' }],
        },
      ],
    }
    expect(atlasDocSchema.safeParse(doc).success).toBe(false)
  })

  it('rejects an identity statement over 600 characters', () => {
    const doc = {
      ...validDoc(),
      identity: [
        {
          id: 'identity-01',
          pillar: 'engineering',
          text: 'x'.repeat(601),
          createdAt: '2026-07-05T09:00:00Z',
        },
      ],
    }
    expect(atlasDocSchema.safeParse(doc).success).toBe(false)
  })

  it('rejects a signal with energy out of range', () => {
    const doc = { ...validDoc(), signals: [{ date: '2026-07-05', energy: 6 }] }
    expect(atlasDocSchema.safeParse(doc).success).toBe(false)
  })

  it('rejects an unknown pillar value', () => {
    const doc = {
      ...validDoc(),
      systems: [
        {
          id: 'system-01',
          name: 'Deep Learning',
          pillar: 'not-a-real-pillar',
          rhythmPerWeek: 3,
          status: 'active',
          createdAt: '2026-07-05T09:00:00Z',
        },
      ],
    }
    expect(atlasDocSchema.safeParse(doc).success).toBe(false)
  })

  it('rejects a schemaVersion other than the current one', () => {
    const doc = { ...validDoc(), schemaVersion: 2 }
    expect(atlasDocSchema.safeParse(doc).success).toBe(false)
  })

  it('rejects an id shorter than the minimum opaque-id length', () => {
    const doc = {
      ...validDoc(),
      milestones: [{ id: 'short', text: 'Too short an id', capturedAt: '2026-07-05T09:00:00Z' }],
    }
    expect(atlasDocSchema.safeParse(doc).success).toBe(false)
  })

  it('accepts a fully populated, valid document', () => {
    const doc = {
      ...validDoc(),
      systems: [
        {
          id: 'system-01',
          name: 'Deep Learning',
          pillar: 'engineering',
          rhythmPerWeek: 3,
          status: 'active',
          createdAt: '2026-07-05T09:00:00Z',
        },
      ],
      sessions: [
        { id: 'session-01', systemId: 'system-01', date: '2026-07-05', note: 'built the ALU' },
      ],
      questions: [
        {
          id: 'question-01',
          text: 'Why does RAM exist?',
          pillar: 'engineering',
          state: 'open',
          askedOn: '2026-07-05',
          notes: [],
        },
      ],
      books: [
        {
          id: 'book-01',
          title: 'The Soul of a New Machine',
          pillar: 'engineering',
          why: 'To understand how machines get built.',
          status: 'reading',
          startedAt: '2026-07-05T09:00:00Z',
          ideas: [],
        },
      ],
    }
    expect(atlasDocSchema.safeParse(doc).success).toBe(true)
  })
})
