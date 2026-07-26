import { seasonWeekIndex } from '@/domain/derive'
import type { Season } from '@/domain/schema'
import type { WeekKey } from '@/domain/time'
import { IconButton } from '@/design/primitives/icon-button'
import { Text } from '@/design/primitives/text'

function ChevronLeft() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M10 3.5 5.5 8l4.5 4.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 3.5 10.5 8 6 12.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface WeekHeaderProps {
  season?: Season
  weekKey: WeekKey
  isCurrentWeek: boolean
  dateLabel: string
  onPrevWeek: () => void
  onNextWeek: () => void
}

/**
 * FR-W1: season name + week index (when a season exists — none can yet be
 * created before the Founding ceremony, roadmap M5, so this line is simply
 * absent today, never a placeholder standing in for it) alongside the date
 * and past-week navigation.
 */
export function WeekHeader({
  season,
  weekKey,
  isCurrentWeek,
  dateLabel,
  onPrevWeek,
  onNextWeek,
}: WeekHeaderProps) {
  const seasonInfo = season !== undefined ? seasonWeekIndex(season, weekKey) : null

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-1">
        <IconButton label="Previous week" onClick={onPrevWeek}>
          <ChevronLeft />
        </IconButton>
        <IconButton label="Next week" onClick={onNextWeek} disabled={isCurrentWeek}>
          <ChevronRight />
        </IconButton>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        {seasonInfo !== null && season !== undefined && (
          <Text variant="label" as="span" muted>
            {season.name} · Week {seasonInfo.index} of {seasonInfo.total}
          </Text>
        )}
        <Text variant="label" as="span" muted className="tabular">
          {dateLabel}
        </Text>
      </div>
    </div>
  )
}
