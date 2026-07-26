import { useEffect, useState } from 'react'

import { readStorageStatus, type StorageStatus as StorageStatusData } from '@/data/persist'
import { useAtlasStore } from '@/data/store'
import { Text } from '@/design/primitives/text'

function formatBytes(bytes: number | null): string {
  if (bytes === null) return '—'
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`
}

function formatFoundedAt(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
  }).format(new Date(iso))
}

interface Row {
  label: string
  value: string
}

function StatusRow({ label, value }: Row) {
  return (
    <div className="flex items-center justify-between gap-6 py-2">
      <Text variant="ui" as="span" muted>
        {label}
      </Text>
      <Text variant="ui" as="span" className="tabular">
        {value}
      </Text>
    </div>
  )
}

/** Storage, schema, app version, and founding date — the installation's vital signs. */
export function StorageStatus() {
  const doc = useAtlasStore((state) => state.doc)
  const autosaveError = useAtlasStore((state) => state.autosaveError)
  const [storage, setStorage] = useState<StorageStatusData | null>(null)

  useEffect(() => {
    let cancelled = false
    void readStorageStatus().then((status) => {
      if (!cancelled) setStorage(status)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="flex flex-col gap-1 py-8">
      <Text variant="body" as="h2" className="mb-3">
        Status
      </Text>
      <StatusRow
        label="Storage"
        value={
          storage === null
            ? '—'
            : storage.supported
              ? `${formatBytes(storage.usageBytes)} of ${formatBytes(storage.quotaBytes)}`
              : 'Not available in this browser'
        }
      />
      <StatusRow
        label="Persisted"
        value={storage === null ? '—' : storage.persisted ? 'Yes' : 'Not requested'}
      />
      <StatusRow label="Autosave" value={autosaveError ?? 'Working'} />
      <StatusRow label="Founded" value={doc === null ? '—' : formatFoundedAt(doc.meta.foundedAt)} />
      <StatusRow label="Schema version" value={doc === null ? '—' : String(doc.schemaVersion)} />
      <StatusRow label="App version" value={__APP_VERSION__} />
    </section>
  )
}
