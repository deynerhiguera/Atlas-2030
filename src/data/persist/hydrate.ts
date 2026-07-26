import { createFreshAtlasDoc, type AtlasDoc } from '@/domain/schema'

import { readRawDoc, writeRawDoc } from './db'
import { runMigrations } from './migrations/run-migrations'

export interface HydrationResult {
  doc: AtlasDoc
  isFreshInstall: boolean
}

/**
 * The startup sequence (blueprint/03): read → migrate if needed → validate
 * → return. No loading state exists anywhere above this function — it is
 * awaited once, before the app renders, and is expected to resolve in
 * single-digit milliseconds against a local document this size.
 *
 * On failure, this throws rather than returning a partial or repaired
 * document — the stored bytes are never touched by a failed hydration, so a
 * later rescue attempt always has the original data to work with.
 */
export async function hydrateAtlasDoc(appVersion: string): Promise<HydrationResult> {
  const raw = await readRawDoc()

  if (raw === undefined) {
    const doc = createFreshAtlasDoc(new Date(), appVersion)
    await writeRawDoc(doc)
    return { doc, isFreshInstall: true }
  }

  const doc = runMigrations(raw)
  return { doc, isFreshInstall: false }
}
