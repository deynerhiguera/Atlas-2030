import type { KeyboardEvent } from 'react'

import { cn } from '@/lib/cn'

/**
 * One day's session mark, as an ARIA `gridcell` (blueprint/06). Named
 * `DayCell` rather than the blueprint's `DensityDots` to avoid colliding
 * with `domain/derive`'s `WeekCell` data type, and kept feature-local for
 * now rather than promoted to `design/components` — the 30-day and
 * year-scale variants blueprint/06 describes belong to Pillars (v0.2) and
 * Atlas (v1.0); generalizing this session-specific cell isn't worth it
 * until a second consumer exists (YAGNI).
 *
 * Keyboard contract: reachable via the grid's roving tabindex (only the
 * cell at the current focus coordinate has `tabIndex=0`); Enter/Space
 * activates it when `interactive` is true. Arrow-key movement is handled by
 * the parent grid, since it must move focus across cells this one has no
 * reference to.
 */
interface DayCellProps {
  filled: boolean
  interactive: boolean
  focused: boolean
  label: string
  pillarClass: string
  onActivate: () => void
  cellRef: (element: HTMLDivElement | null) => void
}

export function DayCell({
  filled,
  interactive,
  focused,
  label,
  pillarClass,
  onActivate,
  cellRef,
}: DayCellProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!interactive) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onActivate()
    }
  }

  return (
    <div
      ref={cellRef}
      role="gridcell"
      tabIndex={focused ? 0 : -1}
      aria-label={label}
      aria-disabled={!interactive || undefined}
      onClick={() => {
        if (interactive) onActivate()
      }}
      onKeyDown={handleKeyDown}
      className={cn(
        'grid h-9 w-9 place-items-center rounded-control outline-none',
        interactive ? 'cursor-pointer' : 'cursor-default',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-2.5 rounded-full transition-colors duration-settle ease-settle',
          filled ? pillarClass : 'bg-line',
        )}
      />
    </div>
  )
}
