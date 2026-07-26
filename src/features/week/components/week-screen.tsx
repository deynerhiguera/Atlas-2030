import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

import { dayOfBecoming } from '@/domain/derive'
import {
  currentWeekKey,
  parseLocalDay,
  stepWeek,
  todayLocal,
  weekBoundaries,
  type WeekKey,
} from '@/domain/time'
import { useAtlasStore } from '@/data/store'
import { useMotionMode } from '@/design/hooks/use-motion-mode'
import { Text } from '@/design/primitives/text'
import { duration, easeSettle, reducedFade } from '@/design/tokens'
import { WEEK_NO_SYSTEMS_BODY, WEEK_NO_SYSTEMS_TITLE } from '@/design/copy'

import { AddSystemForm } from './add-system-form'
import { SystemGrid } from './system-grid'
import { TodayBand } from './today-band'
import { WeekFooter } from './week-footer'
import { WeekHeader } from './week-header'

const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})
const shortDateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

function formatWeekRange(weekKey: WeekKey): string {
  const { start, end } = weekBoundaries(weekKey)
  return `${shortDateFormatter.format(parseLocalDay(start))} – ${shortDateFormatter.format(parseLocalDay(end))}`
}

/**
 * The Week room (blueprint/02 R1) — the screen opened every morning. Reads
 * the document once at the top and passes plain data down; every write goes
 * through the imported data/actions functions directly (blueprint/03), the
 * same pattern already used by the Data & Settings feature.
 */
export function WeekScreen() {
  const doc = useAtlasStore((state) => state.doc)
  const [viewedWeekKey, setViewedWeekKey] = useState<WeekKey>(() => currentWeekKey())
  const motionMode = useMotionMode()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      ) {
        return
      }
      if (event.key === '[') {
        setViewedWeekKey((week) => stepWeek(week, 'prev'))
      } else if (event.key === ']') {
        setViewedWeekKey((week) => stepWeek(week, 'next'))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (doc === null) return null

  const today = todayLocal()
  const isCurrentWeek = viewedWeekKey === currentWeekKey()
  const activeSystems = doc.systems.filter((system) => system.status === 'active')
  const todaySignal = doc.signals.find((signal) => signal.date === today)
  const dateLabel = isCurrentWeek
    ? fullDateFormatter.format(parseLocalDay(today))
    : formatWeekRange(viewedWeekKey)

  const enter =
    motionMode === 'full'
      ? { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 } }
      : { initial: { opacity: 0 }, animate: { opacity: 1 } }
  const transition =
    motionMode === 'full'
      ? { duration: duration.room, ease: easeSettle }
      : { duration: reducedFade }

  return (
    <motion.div
      {...enter}
      transition={transition}
      className="mx-auto flex max-w-prose-atlas flex-col gap-10 px-6 py-12 md:px-0"
    >
      <h1 className="sr-only">This week</h1>
      <WeekHeader
        {...(doc.seasons[0] !== undefined ? { season: doc.seasons[0] } : {})}
        weekKey={viewedWeekKey}
        isCurrentWeek={isCurrentWeek}
        dateLabel={dateLabel}
        onPrevWeek={() => setViewedWeekKey((week) => stepWeek(week, 'prev'))}
        onNextWeek={() => setViewedWeekKey((week) => stepWeek(week, 'next'))}
      />

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
            key={viewedWeekKey}
            systems={activeSystems}
            sessions={doc.sessions}
            weekKey={viewedWeekKey}
            today={today}
          />
          <AddSystemForm />
        </div>
      )}

      {isCurrentWeek && (
        <TodayBand {...(todaySignal !== undefined ? { signal: todaySignal } : {})} />
      )}

      <WeekFooter dayOfBecoming={dayOfBecoming(doc.meta.foundedAt, today)} />
    </motion.div>
  )
}
