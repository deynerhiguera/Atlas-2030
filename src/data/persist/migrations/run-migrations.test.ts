import { describe, expect, it } from 'vitest'

import { createFreshAtlasDoc } from '@/domain/schema'

import { runMigrations } from './run-migrations'

describe('runMigrations', () => {
  it('validates and returns an already-current document unchanged', () => {
    const doc = createFreshAtlasDoc(new Date(), '0.0.1')
    const raw: unknown = JSON.parse(JSON.stringify(doc))
    expect(runMigrations(raw)).toEqual(doc)
  })

  it('throws when the input has no schemaVersion field at all', () => {
    expect(() => runMigrations({ hello: 'world' })).toThrow(/schemaVersion/i)
  })

  it('throws when the input is not an object', () => {
    expect(() => runMigrations('just a string')).toThrow()
    expect(() => runMigrations(null)).toThrow()
  })

  it('throws on a document from a newer, not-yet-understood schema version', () => {
    const doc = { ...createFreshAtlasDoc(new Date(), '0.0.1'), schemaVersion: 99 }
    expect(() => runMigrations(doc)).toThrow(/newer version/i)
  })

  it('throws with a clear message when a migration step is missing from the registry', () => {
    const doc = { ...createFreshAtlasDoc(new Date(), '0.0.1'), schemaVersion: 0 }
    expect(() => runMigrations(doc)).toThrow(/no migration is registered/i)
  })

  it('reports a path-level message when the final shape fails validation', () => {
    const doc = createFreshAtlasDoc(new Date(), '0.0.1')
    const broken = { ...doc, settings: { theme: 'not-a-real-theme', reducedMotion: 'system' } }
    expect(() => runMigrations(broken)).toThrow(/settings\.theme/)
  })
})
