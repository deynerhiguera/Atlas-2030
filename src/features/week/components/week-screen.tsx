import { useEffect, useMemo, useState } from 'react'

import { dayOfBecoming, daysSinceLastActivity } from '@/domain/derive'
import { currentWeekKey, parseLocalDay, stepWeek, weekBoundaries, type WeekKey } from '@/domain/time'
import { useAtlasStore } from '@/data/store'
import { useToday } from '@/design/hooks/use-today'

import { BookSection } from './book-section'
import { CaptureAction } from './capture-action'
import { QuestionSection } from './question-section'
import { SystemsSection } from './systems-section'
import { TodayBand } from './today-band'
import { WeekFooter } from './week-footer'
import { WeekHeader } from './week-header'
import { WelcomeBack } from './welcome-back'

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
 * The Week room (blueprint/02 R1) — the screen opened every morning.
 *
 * Deliberately reads only the small, stable slices it needs directly
 * (founding date, the season) rather than the whole document: Question,
 * Book, Systems, the today band, and the capture action each own a narrow,
 * independent `useAtlasStore` selector and are memoized, so editing a
 * book's progress never re-renders the systems grid and marking a session
 * never re-renders the question card (blueprint/07's performance note).
 * Every write still goes through the imported data/actions functions
 * directly (blueprint/03).
 *
 * Room-entrance and room-to-room motion live one level up, in the router's
 * root component — every room gets the same crossfade there, rather than
 * each room screen reimplementing its own one-off entrance animation.
 */
export function WeekScreen() {
  const hydrated = useAtlasStore((state) => state.doc !== null)
  const season = useAtlasStore((state) => state.doc?.seasons[0])
  const foundedAt = useAtlasStore((state) => state.doc?.meta.foundedAt)
  const signals = useAtlasStore((state) => state.doc?.signals)
  const sessions = useAtlasStore((state) => state.doc?.sessions)
  const [viewedWeekKey, setViewedWeekKey] = useState<WeekKey>(() => currentWeekKey())
  const today = useToday()

  const daysSinceActivity = useMemo(() => {
    const activityDates = [
      ...(signals ?? []).map((signal) => signal.date),
      ...(sessions ?? []).map((session) => session.date),
    ]
    return daysSinceLastActivity(activityDates, today)
  }, [signals, sessions, today])

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

  if (!hydrated || foundedAt === undefined) return null

  const isCurrentWeek = viewedWeekKey === currentWeekKey()
  const dateLabel = isCurrentWeek
    ? fullDateFormatter.format(parseLocalDay(today))
    : formatWeekRange(viewedWeekKey)

  return (
    <div className="mx-auto flex max-w-prose-atlas flex-col gap-10 px-6 py-12 md:px-0">
      <h1 className="sr-only">This week</h1>
      {isCurrentWeek && <WelcomeBack daysSinceActivity={daysSinceActivity} />}
      <WeekHeader
        {...(season !== undefined ? { season } : {})}
        weekKey={viewedWeekKey}
        isCurrentWeek={isCurrentWeek}
        dateLabel={dateLabel}
        onPrevWeek={() => setViewedWeekKey((week) => stepWeek(week, 'prev'))}
        onNextWeek={() => setViewedWeekKey((week) => stepWeek(week, 'next'))}
      />

      <QuestionSection />
      <BookSection />
      <SystemsSection weekKey={viewedWeekKey} today={today} />

      {isCurrentWeek && <TodayBand />}

      <WeekFooter dayOfBecoming={dayOfBecoming(foundedAt, today)} />

      <CaptureAction />
    </div>
  )
}
