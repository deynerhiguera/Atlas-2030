import type { AtlasDoc } from '@/domain/schema'

import { writeRawDoc } from './db'

const DEFAULT_AUTOSAVE_DEBOUNCE_MS = 500

/**
 * Debounced whole-document autosave (blueprint/03, FR-D1). Flushes
 * immediately on tab hide/unload so a debounce window is the most any
 * session can lose — never more.
 *
 * `debounceMs` is injectable so tests can use a short real delay instead of
 * the production 500ms; it should never be passed in application code.
 *
 * `onWriteSettled` reports the outcome of every write attempt (`null` on
 * success, a message on failure) — never left uncaught. Each write is
 * wrapped so a failure can never poison the `writing` promise chain: without
 * this, one rejected `writeRawDoc` call (a full quota, a revoked storage
 * permission, a momentary browser hiccup) would leave every *subsequent*
 * `.then()` built on that chain permanently short-circuited, silently
 * disabling autosave for the rest of the session — exactly the kind of
 * quiet, total data-loss a local-first app cannot allow.
 */
export function createAutosave(
  debounceMs: number = DEFAULT_AUTOSAVE_DEBOUNCE_MS,
  onWriteSettled?: (error: string | null) => void,
) {
  let timer: ReturnType<typeof setTimeout> | null = null
  let pending: AtlasDoc | null = null
  let writing: Promise<void> = Promise.resolve()

  function writeSafely(doc: AtlasDoc): Promise<void> {
    return writeRawDoc(doc).then(
      () => {
        onWriteSettled?.(null)
      },
      (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Atlas could not save just now.'
        onWriteSettled?.(message)
      },
    )
  }

  function flushNow(): Promise<void> {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    if (pending === null) return writing

    const doc = pending
    pending = null
    writing = writing.then(() => writeSafely(doc))
    return writing
  }

  function schedule(doc: AtlasDoc): void {
    pending = doc
    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(() => {
      void flushNow()
    }, debounceMs)
  }

  function onVisibilityOrHide(): void {
    if (document.visibilityState === 'hidden') void flushNow()
  }

  function attach(): () => void {
    window.addEventListener('visibilitychange', onVisibilityOrHide)
    window.addEventListener('pagehide', onVisibilityOrHide)
    return () => {
      window.removeEventListener('visibilitychange', onVisibilityOrHide)
      window.removeEventListener('pagehide', onVisibilityOrHide)
    }
  }

  return { schedule, flushNow, attach }
}

export type Autosave = ReturnType<typeof createAutosave>
