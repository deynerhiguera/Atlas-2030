export interface StorageStatus {
  supported: boolean
  persisted: boolean
  usageBytes: number | null
  quotaBytes: number | null
}

/** Read-only snapshot of the origin's storage state, for the `/data` page. */
export async function readStorageStatus(): Promise<StorageStatus> {
  if (typeof navigator === 'undefined' || navigator.storage === undefined) {
    return { supported: false, persisted: false, usageBytes: null, quotaBytes: null }
  }

  const [persisted, estimate] = await Promise.all([
    navigator.storage.persisted?.() ?? Promise.resolve(false),
    navigator.storage.estimate?.() ?? Promise.resolve(undefined),
  ])

  return {
    supported: true,
    persisted,
    usageBytes: estimate?.usage ?? null,
    quotaBytes: estimate?.quota ?? null,
  }
}

/** FR-D6: requested once, after the document first comes into being. */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === 'undefined' || navigator.storage?.persist === undefined) return false
  return navigator.storage.persist()
}
