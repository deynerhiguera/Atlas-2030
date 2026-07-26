import { memo } from 'react'

import { useAtlasStore } from '@/data/store'
import type { DayString, SessionMark, System } from '@/domain/schema'
import type { WeekKey } from '@/domain/time'

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
 *
 * No empty state and no add-a-system control here: the Founding ceremony
 * declares 1–10 systems before Week is ever reachable (FR-F5), so this
 * section can assume a real roster. Declaring a new system after founding
 * is not a v0.1 interaction (blueprint/02 R1 lists none).
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
      <SystemGrid
        key={weekKey}
        systems={activeSystems}
        sessions={sessions}
        weekKey={weekKey}
        today={today}
      />
    </section>
  )
})
