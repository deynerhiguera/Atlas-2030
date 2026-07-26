import { create } from 'zustand'

import type { AtlasDoc } from '@/domain/schema'

/**
 * One store, holding the one document (blueprint/03). Components read via
 * `useAtlasStore` with narrow selectors; every write goes through
 * data/actions, never through `useAtlasStore.setState` directly from a
 * component — the setters below are the only sanctioned callers, and they
 * live beside the store precisely so the boundary is one file wide.
 */
export interface AtlasStoreState {
  doc: AtlasDoc | null
  hydrated: boolean
  hydrationError: string | null
}

export const useAtlasStore = create<AtlasStoreState>(() => ({
  doc: null,
  hydrated: false,
  hydrationError: null,
}))

export function setHydratedDoc(doc: AtlasDoc): void {
  useAtlasStore.setState({ doc, hydrated: true, hydrationError: null })
}

export function setHydrationError(message: string): void {
  useAtlasStore.setState({ doc: null, hydrated: false, hydrationError: message })
}

/** The one seam every data/actions mutation passes through. */
export function replaceDoc(doc: AtlasDoc): void {
  useAtlasStore.setState({ doc })
}

export function getCurrentDoc(): AtlasDoc | null {
  return useAtlasStore.getState().doc
}
