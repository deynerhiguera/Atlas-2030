import { useAtlasStore } from '@/data/store'
import { PILLAR_IDS, pillarLabels } from '@/domain/schema/pillars'
import { Text } from '@/design/primitives/text'

function formatFoundedAt(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(iso))
}

/**
 * `/foundations` (blueprint/02): read-only. The six statements shown are
 * each pillar's *latest* version — identity is append-only (I-9), so the
 * founding words may already have been revised in a later ceremony.
 */
export function FoundationsScreen() {
  const doc = useAtlasStore((state) => state.doc)

  if (doc === null) return null

  return (
    <div className="mx-auto max-w-prose-atlas px-6 py-16 md:px-0">
      <Text variant="label" as="h1" className="mb-8">
        Foundations
      </Text>

      <section className="flex flex-col gap-8 border-b border-line pb-8">
        {PILLAR_IDS.map((pillarId) => {
          const latest = doc.identity
            .filter((version) => version.pillar === pillarId)
            .at(-1)

          return (
            <div key={pillarId} className="flex flex-col gap-2">
              <Text variant="label" as="h2" muted>
                {pillarLabels[pillarId]}
              </Text>
              <Text variant="read" as="p">
                {latest?.text ?? '—'}
              </Text>
            </div>
          )
        })}
      </section>

      <section className="flex items-center justify-between gap-6 border-b border-line py-8">
        <Text variant="body" as="h2">
          The letter to 2030
        </Text>
        <Text variant="ui" as="span" muted>
          {doc.letter ? `Sealed until ${doc.letter.opensAt}` : 'Not sealed'}
        </Text>
      </section>

      <section className="flex items-center justify-between gap-6 py-8">
        <Text variant="body" as="h2">
          Founded
        </Text>
        <Text variant="ui" as="span" muted>
          {formatFoundedAt(doc.meta.foundedAt)}
        </Text>
      </section>
    </div>
  )
}
