import type { AtlasDoc } from '@/domain/schema'

import { writeRawDoc } from './db'

const AUTOSAVE_DEBOUNCE_MS = 500

/**
 * Debounced whole-document autosave (blueprint/03, FR-D1). Flushes
 * immediately on tab hide/unload so a debounce window is the most any
 * session can lose — never more.
 */
export function createAutosave() {
  let timer: ReturnType<typeof setTimeout> | null = null
  let pending: AtlasDoc | null = null
  let writing: Promise<void> = Promise.resolve()

  function flushNow(): Promise<void> {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    if (pending === null) return writing

    const doc = pending
    pending = null
    writing = writing.then(() => writeRawDoc(doc))
    return writing
  }

  function schedule(doc: AtlasDoc): void {
    pending = doc
    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(() => {
      void flushNow()
    }, AUTOSAVE_DEBOUNCE_MS)
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
