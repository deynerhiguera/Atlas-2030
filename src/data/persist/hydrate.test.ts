import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { atlasDocSchema, createFreshAtlasDoc } from '@/domain/schema'

import { readRawDoc, resetDbConnectionForTests, writeRawDoc } from './db'
import { hydrateAtlasDoc } from './hydrate'

async function resetDatabase(): Promise<void> {
  await resetDbConnectionForTests()
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase('atlas-db')
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error as Error)
    request.onblocked = () => resolve()
  })
}

beforeEach(resetDatabase)
afterEach(resetDatabase)

describe('hydrateAtlasDoc', () => {
  it('creates and persists a fresh document when none exists', async () => {
    const { doc, isFreshInstall } = await hydrateAtlasDoc('0.0.1')

    expect(isFreshInstall).toBe(true)
    expect(atlasDocSchema.safeParse(doc).success).toBe(true)

    const stored = await readRawDoc()
    expect(stored).toEqual(doc)
  })

  it('loads and validates an existing document without touching it', async () => {
    const existing = createFreshAtlasDoc(new Date('2026-07-05T09:00:00Z'), '0.0.1')
    await writeRawDoc(existing)

    const { doc, isFreshInstall } = await hydrateAtlasDoc('0.0.2')

    expect(isFreshInstall).toBe(false)
    expect(doc).toEqual(existing)
  })

  it('throws on a corrupted stored value and never overwrites it', async () => {
    await writeRawDoc({ this: 'is not an atlas document' })

    await expect(hydrateAtlasDoc('0.0.1')).rejects.toThrow()

    const stillThere = await readRawDoc()
    expect(stillThere).toEqual({ this: 'is not an atlas document' })
  })
})
