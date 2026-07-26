/**
 * The migration chain (blueprint/03, /04, /10). Keyed by the version a
 * migration reads FROM; each function returns a document one version newer.
 *
 * Empty today: schemaVersion 1 is the only version this build has ever
 * produced, so there is genuinely nothing to migrate from yet. The registry
 * exists so that v2 (blueprint/04's lineage: reflections, gaps, milestone
 * enrichment, rhythmHistory) can be appended here as a single new entry
 * without touching the runner, per blueprint/11's migration-law checklist.
 */
export const migrations: Record<number, (doc: unknown) => unknown> = {}
