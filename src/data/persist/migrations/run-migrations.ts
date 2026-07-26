import { z } from 'zod'

import { atlasDocSchema, CURRENT_SCHEMA_VERSION, type AtlasDoc } from '@/domain/schema'

import { migrations } from './registry'

export class MigrationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MigrationError'
  }
}

const versionProbeSchema = z.object({ schemaVersion: z.number().int() }).passthrough()

/**
 * Migration laws (blueprint/04, /11): forward-only, total for every document
 * the previous schema admits, lossless for user text, and run identically
 * on stored documents and on imports — this function is that single path.
 */
export function runMigrations(raw: unknown): AtlasDoc {
  const probe = versionProbeSchema.safeParse(raw)
  if (!probe.success) {
    throw new MigrationError('This does not look like an Atlas document: no schemaVersion field.')
  }

  let version = probe.data.schemaVersion
  let doc: unknown = raw

  if (version > CURRENT_SCHEMA_VERSION) {
    throw new MigrationError(
      `This document is from a newer version of Atlas (schema ${version}) than this build understands (schema ${CURRENT_SCHEMA_VERSION}). Migrations are forward-only.`,
    )
  }

  while (version < CURRENT_SCHEMA_VERSION) {
    const migrate = migrations[version]
    if (migrate === undefined) {
      throw new MigrationError(
        `No migration is registered from schema ${version} to schema ${version + 1}.`,
      )
    }
    doc = migrate(doc)
    version += 1
  }

  const result = atlasDocSchema.safeParse(doc)
  if (!result.success) {
    const [firstIssue] = result.error.issues
    const path = firstIssue !== undefined ? firstIssue.path.join('.') : '(document)'
    const message = firstIssue?.message ?? 'failed validation'
    throw new MigrationError(`Atlas document is invalid at "${path}": ${message}`)
  }

  return result.data
}
