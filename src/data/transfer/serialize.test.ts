import { describe, expect, it } from 'vitest'

import type { AtlasDoc } from '@/domain/schema'
import { createFreshAtlasDoc } from '@/domain/schema'

import { serializeAtlasDoc } from './serialize'

describe('serializeAtlasDoc', () => {
  it('always puts schemaVersion first', () => {
    const doc = createFreshAtlasDoc(new Date(), '0.0.1')
    const parsed: unknown = JSON.parse(serializeAtlasDoc(doc))
    expect(Object.keys(parsed as object)[0]).toBe('schemaVersion')
  })

  it('produces the same key order across two documents that were built differently', () => {
    const a = createFreshAtlasDoc(new Date('2026-07-05T09:00:00Z'), '0.0.1')
    const b: AtlasDoc = {
      // Built with fields assigned in a deliberately different order.
      settings: { theme: 'system', reducedMotion: 'system' },
      milestones: [],
      signals: [],
      books: [],
      questions: [],
      sessions: [],
      systems: [],
      seasons: [],
      identity: [],
      meta: { foundedAt: '2026-07-05T09:00:00.000Z', appVersionAtFounding: '0.0.1' },
      schemaVersion: 1,
    }

    const keysA = Object.keys(JSON.parse(serializeAtlasDoc(a)) as object)
    const keysB = Object.keys(JSON.parse(serializeAtlasDoc(b)) as object)
    expect(keysB).toEqual(keysA)
  })

  it('is pretty-printed and human-readable', () => {
    const doc = createFreshAtlasDoc(new Date(), '0.0.1')
    const json = serializeAtlasDoc(doc)
    expect(json).toContain('\n')
    expect(json).toContain('  "schemaVersion"')
  })

  it('orders a session mark\'s keys as id, systemId, date, note', () => {
    const doc: AtlasDoc = {
      ...createFreshAtlasDoc(new Date(), '0.0.1'),
      sessions: [{ note: 'built the ALU', date: '2026-07-05', systemId: 'sys1', id: 'm1' }],
    }
    const parsed = JSON.parse(serializeAtlasDoc(doc)) as { sessions: object[] }
    expect(Object.keys(parsed.sessions[0] as object)).toEqual(['id', 'systemId', 'date', 'note'])
  })
})
