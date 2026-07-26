import type { AtlasDoc } from '@/domain/schema'

import { MigrationError, runMigrations } from '../persist/migrations/run-migrations'

export type ImportResult = { ok: true; doc: AtlasDoc } | { ok: false; message: string }

/**
 * FR-D3: validates before touching anything. On failure this returns a
 * human-readable, path-level message and the caller's current document is
 * left completely untouched — import either replaces cleanly or does nothing.
 */
export function parseImportedDoc(rawText: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(rawText)
  } catch {
    return { ok: false, message: 'That file is not valid JSON.' }
  }

  try {
    const doc = runMigrations(parsed)
    return { ok: true, doc }
  } catch (error) {
    if (error instanceof MigrationError) return { ok: false, message: error.message }
    return { ok: false, message: 'That file could not be read as an Atlas document.' }
  }
}

export async function readImportedFile(file: File): Promise<ImportResult> {
  const text = await file.text()
  return parseImportedDoc(text)
}
