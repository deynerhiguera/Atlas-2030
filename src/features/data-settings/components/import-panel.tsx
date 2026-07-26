import { useRef, useState, type ChangeEvent } from 'react'

import { importDoc } from '@/data/actions'
import { readImportedFile } from '@/data/transfer'
import { Button } from '@/design/primitives/button'
import { Text } from '@/design/primitives/text'

type ImportStatus = { kind: 'idle' } | { kind: 'success' } | { kind: 'error'; message: string }

/**
 * FR-D3: on failure the current document is left completely untouched — the
 * status message is quiet, typographic text, never a color-alarmed toast
 * (blueprint/05: no alarm colors exist in this system).
 */
export function ImportPanel() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<ImportStatus>({ kind: 'idle' })

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file === undefined) return

    const result = await readImportedFile(file)
    if (result.ok) {
      importDoc(result.doc)
      setStatus({ kind: 'success' })
    } else {
      setStatus({ kind: 'error', message: result.message })
    }
  }

  return (
    <section className="flex flex-col gap-4 border-b border-line py-8">
      <div className="flex items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <Text variant="body" as="h2">
            Import Atlas
          </Text>
          <Text variant="ui" as="p" muted>
            Replace this Atlas with a previously exported file.
          </Text>
        </div>
        <Button variant="quiet" onClick={() => inputRef.current?.click()}>
          Choose file
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(event) => void handleFileChange(event)}
        />
      </div>
      {status.kind === 'success' && (
        <Text variant="ui" as="p">
          Imported.
        </Text>
      )}
      {status.kind === 'error' && (
        <Text variant="ui" as="p">
          That file couldn&rsquo;t be read: {status.message}
        </Text>
      )}
    </section>
  )
}
