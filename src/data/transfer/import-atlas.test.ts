import { describe, expect, it } from 'vitest'

import { createFreshAtlasDoc } from '@/domain/schema'

import { parseImportedDoc } from './import-atlas'
import { serializeAtlasDoc } from './serialize'

describe('parseImportedDoc', () => {
  it('round-trips a real export back into an equal document', () => {
    const doc = createFreshAtlasDoc(new Date('2026-07-05T09:00:00Z'), '0.0.1')
    const result = parseImportedDoc(serializeAtlasDoc(doc))
    expect(result).toEqual({ ok: true, doc })
  })

  it('rejects text that is not JSON at all, leaving a clear message', () => {
    const result = parseImportedDoc('this is not json {{{')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toMatch(/not valid JSON/i)
  })

  it('rejects valid JSON that is not an Atlas document', () => {
    const result = parseImportedDoc(JSON.stringify({ hello: 'world' }))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toMatch(/schemaVersion/i)
  })

  it('rejects an Atlas-shaped document that fails a field constraint', () => {
    const doc = createFreshAtlasDoc(new Date(), '0.0.1')
    const broken = {
      ...doc,
      seasons: [
        {
          id: 'season-01',
          name: '', // violates the 1-character minimum
          startDate: '2026-07-01',
          plannedEndDate: '2026-09-23',
          focusPillars: ['engineering', 'health'],
          intentions: [{ id: 'intent-01', text: 'Ship' }],
        },
      ],
    }
    const result = parseImportedDoc(JSON.stringify(broken))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toMatch(/seasons\.0\.name/)
  })
})
