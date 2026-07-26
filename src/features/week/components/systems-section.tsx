import { memo } from 'react'

import { useAtlasStore } from '@/data/store'
import { Text } from '@/design/primitives/text'
import { WEEK_NO_SYSTEMS_BODY, WEEK_NO_SYSTEMS_TITLE } from '@/design/copy'
import type { DayString, SessionMark, System } from '@/domain/schema'
import type { WeekKey } from '@/domain/time'

import { AddSystemForm } from './add-system-form'
import { SectionLabel } from './section-label'
import { SystemGrid } from './system-grid'

const EMPTY_SYSTEMS: System[] = []
const EMPTY_SESSIONS: SessionMark[] = []

interface SystemsSectionProps {
  weekKey: WeekKey
  today: DayString
}

/**
 * Discipline, below Question and Book. Selects only `doc.systems` and
 * `doc.sessions` — closing a question or turning a book's page never
 * re-renders the grid (blueprint/07's performance note). `weekKey`/`today`
 * are view state owned by WeekScreen, not document data, so passing them as
 * props doesn't reintroduce the coupling this split exists to avoid.
 */
export const SystemsSection = memo(function SystemsSection({
  weekKey,
  today,
}: SystemsSectionProps) {
  const systems = useAtlasStore((state) => state.doc?.systems ?? EMPTY_SYSTEMS)
  const sessions = useAtlasStore((state) => state.doc?.sessions ?? EMPTY_SESSIONS)
  const activeSystems = systems.filter((system) => system.status === 'active')

  return (
    <section className="flex flex-col gap-3">
      <SectionLabel>Systems</SectionLabel>
      {activeSystems.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-card border border-line px-6 py-12 text-center">
          <Text variant="body" as="p">
            {WEEK_NO_SYSTEMS_TITLE}
          </Text>
          <Text variant="ui" as="p" muted>
            {WEEK_NO_SYSTEMS_BODY}
          </Text>
          <AddSystemForm />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <SystemGrid
            key={weekKey}
            systems={activeSystems}
            sessions={sessions}
            weekKey={weekKey}
            today={today}
          />
          <AddSystemForm />
        </div>
      )}
    </section>
  )
})
