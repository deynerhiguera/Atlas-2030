import { openDB, type IDBPDatabase } from 'idb'

/**
 * The whole document lives under one key in one object store (blueprint/03):
 * reads and writes are single atomic transactions over one JSON value.
 */
const DB_NAME = 'atlas-db'
const DB_VERSION = 1
const STORE_NAME = 'kv'
const DOC_KEY = 'atlas-doc'

let dbPromise: Promise<IDBPDatabase> | null = null

function getDb(): Promise<IDBPDatabase> {
  dbPromise ??= openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    },
  })
  return dbPromise
}

/** Returns the raw stored value (unknown shape — callers validate it). */
export async function readRawDoc(): Promise<unknown> {
  const db = await getDb()
  return db.get(STORE_NAME, DOC_KEY)
}

export async function writeRawDoc(value: unknown): Promise<void> {
  const db = await getDb()
  await db.put(STORE_NAME, value, DOC_KEY)
}

/** Test-only: forces a fresh connection on the next call. */
export function resetDbConnectionForTests(): void {
  dbPromise = null
}
