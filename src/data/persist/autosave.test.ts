import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createFreshAtlasDoc } from '@/domain/schema'

import { createAutosave } from './autosave'
import * as dbModule from './db'
import { readRawDoc, resetDbConnectionForTests } from './db'

// Vitest's fake timers and fake-indexeddb's own internal task scheduling do
// not coexist: fake-indexeddb needs real timer ticks to resolve its
// promises. These tests use a short *real* debounce instead of mocking time.
const TEST_DEBOUNCE_MS = 20

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

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

describe('createAutosave', () => {
  it('writes nothing before the debounce window elapses', async () => {
    const autosave = createAutosave(TEST_DEBOUNCE_MS)
    autosave.schedule(createFreshAtlasDoc(new Date(), '0.0.1'))

    await wait(TEST_DEBOUNCE_MS / 2)
    expect(await readRawDoc()).toBeUndefined()
  })

  it('writes once the debounce window elapses', async () => {
    const doc = createFreshAtlasDoc(new Date(), '0.0.1')
    const autosave = createAutosave(TEST_DEBOUNCE_MS)
    autosave.schedule(doc)

    await wait(TEST_DEBOUNCE_MS * 3)
    expect(await readRawDoc()).toEqual(doc)
  })

  it('collapses rapid successive schedules into a single write of the latest value', async () => {
    const autosave = createAutosave(TEST_DEBOUNCE_MS)
    const first = createFreshAtlasDoc(new Date('2026-07-01T00:00:00Z'), '0.0.1')
    const second = createFreshAtlasDoc(new Date('2026-07-02T00:00:00Z'), '0.0.1')

    autosave.schedule(first)
    await wait(TEST_DEBOUNCE_MS / 2)
    autosave.schedule(second)
    await wait(TEST_DEBOUNCE_MS * 3)

    expect(await readRawDoc()).toEqual(second)
  })

  it('flushNow writes immediately without waiting for the debounce', async () => {
    const doc = createFreshAtlasDoc(new Date(), '0.0.1')
    const autosave = createAutosave(TEST_DEBOUNCE_MS)
    autosave.schedule(doc)

    await autosave.flushNow()
    expect(await readRawDoc()).toEqual(doc)
  })

  it('recovers after a failed write instead of poisoning every write after it', async () => {
    const writeSpy = vi.spyOn(dbModule, 'writeRawDoc').mockRejectedValueOnce(new Error('quota exceeded'))

    const autosave = createAutosave(TEST_DEBOUNCE_MS)
    const first = createFreshAtlasDoc(new Date('2026-07-01T00:00:00Z'), '0.0.1')
    autosave.schedule(first)
    await wait(TEST_DEBOUNCE_MS * 3)
    expect(await readRawDoc()).toBeUndefined()

    writeSpy.mockRestore()
    const second = createFreshAtlasDoc(new Date('2026-07-02T00:00:00Z'), '0.0.1')
    autosave.schedule(second)
    await wait(TEST_DEBOUNCE_MS * 3)
    expect(await readRawDoc()).toEqual(second)
  })

  it('reports null on success and a message on failure via onWriteSettled', async () => {
    const writeSpy = vi.spyOn(dbModule, 'writeRawDoc').mockRejectedValueOnce(new Error('quota exceeded'))
    const settled: Array<string | null> = []

    const autosave = createAutosave(TEST_DEBOUNCE_MS, (error) => settled.push(error))
    autosave.schedule(createFreshAtlasDoc(new Date('2026-07-01T00:00:00Z'), '0.0.1'))
    await wait(TEST_DEBOUNCE_MS * 3)
    expect(settled).toEqual(['quota exceeded'])

    writeSpy.mockRestore()
    autosave.schedule(createFreshAtlasDoc(new Date('2026-07-02T00:00:00Z'), '0.0.1'))
    await wait(TEST_DEBOUNCE_MS * 3)
    expect(settled).toEqual(['quota exceeded', null])
  })
})
