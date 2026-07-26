import { exportAtlas } from '@/data/transfer'
import { useAtlasStore } from '@/data/store'
import { Button } from '@/design/primitives/button'
import { Text } from '@/design/primitives/text'

export function ExportPanel() {
  const doc = useAtlasStore((state) => state.doc)

  return (
    <section className="flex items-center justify-between gap-6 border-b border-line py-8">
      <div className="flex flex-col gap-1">
        <Text variant="body" as="h2">
          Export Atlas
        </Text>
        <Text variant="ui" as="p" muted>
          A complete, human-readable copy of everything in this Atlas.
        </Text>
      </div>
      <Button
        variant="solid"
        disabled={doc === null}
        onClick={() => {
          if (doc !== null) exportAtlas(doc)
        }}
      >
        Export
      </Button>
    </section>
  )
}
