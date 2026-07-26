import { createAutosave, type Autosave } from './persist/autosave'
import { hydrateAtlasDoc } from './persist/hydrate'
import { requestPersistentStorage } from './persist/storage-status'
import { setAutosaveError, setHydratedDoc, setHydrationError, useAtlasStore } from './store/atlas-store'

let autosaveInstance: Autosave | null = null

/**
 * Runs once, awaited before the app renders (blueprint/03): hydrate, wire
 * autosave to every subsequent document change, and — on a brand-new
 * install — request persistent storage. No loading UI exists above this;
 * the await is the entire "loading state" this architecture needs.
 */
export async function initializeAtlasData(appVersion: string): Promise<void> {
  try {
    const { doc, isFreshInstall } = await hydrateAtlasDoc(appVersion)
    setHydratedDoc(doc)

    const autosave = createAutosave(undefined, setAutosaveError)
    autosave.attach()
    autosaveInstance = autosave
    useAtlasStore.subscribe((state, prevState) => {
      if (state.doc !== null && state.doc !== prevState.doc) {
        autosave.schedule(state.doc)
      }
    })

    if (isFreshInstall) {
      void requestPersistentStorage()
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Atlas could not load its data.'
    setHydrationError(message)
  }
}

/** Called when this tab yields to another (blueprint/03 FR-D5) — flush before freezing. */
export function flushAutosave(): Promise<void> {
  return autosaveInstance?.flushNow() ?? Promise.resolve()
}
