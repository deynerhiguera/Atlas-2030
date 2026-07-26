import { useRef, useState, type KeyboardEvent } from 'react'

import { weekCellsFor } from '@/domain/derive'
import type { DayString, SessionMark, System } from '@/domain/schema'
import { daysOfWeek, parseLocalDay, type WeekKey } from '@/domain/time'
import { toggleSession } from '@/data/actions'

import { SystemRow } from './system-row'

const shortWeekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})

interface FocusCoord {
  row: number
  col: number
}

interface SystemGridProps {
  systems: readonly System[]
  sessions: readonly SessionMark[]
  weekKey: WeekKey
  today: DayString
}

/**
 * The week's system grid, one `role="grid"` spanning every system row
 * (blueprint/06 SystemRow, /05 accessibility). Owns roving-tabindex focus
 * coordination across rows and days; each row only renders its cells.
 *
 * Callers should mount this with `key={weekKey}` (see WeekScreen) so React
 * remounts it — and resets focus to a sensible default — whenever the
 * viewed week changes, rather than this component reconciling that itself.
 */
export function SystemGrid({ systems, sessions, weekKey, today }: SystemGridProps) {
  const days = daysOfWeek(weekKey)
  const todayIndex = days.indexOf(today)
  const [focused, setFocused] = useState<FocusCoord>({ row: 0, col: Math.max(0, todayIndex) })
  const cellRefs = useRef(new Map<string, HTMLDivElement>())

  function registerCellRef(row: number, col: number, element: HTMLDivElement | null) {
    const key = `${row}-${col}`
    if (element === null) cellRefs.current.delete(key)
    else cellRefs.current.set(key, element)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const { row, col } = focused
    let nextRow = row
    let nextCol = col

    switch (event.key) {
      case 'ArrowRight':
        nextCol = Math.min(6, col + 1)
        break
      case 'ArrowLeft':
        nextCol = Math.max(0, col - 1)
        break
      case 'ArrowDown':
        nextRow = Math.min(systems.length - 1, row + 1)
        break
      case 'ArrowUp':
        nextRow = Math.max(0, row - 1)
        break
      case 'Home':
        nextCol = 0
        break
      case 'End':
        nextCol = 6
        break
      default:
        return
    }

    event.preventDefault()
    setFocused({ row: nextRow, col: nextCol })
    cellRefs.current.get(`${nextRow}-${nextCol}`)?.focus()
  }

  return (
    <div
      role="grid"
      aria-label="This week's systems"
      aria-rowcount={systems.length + 1}
      aria-colcount={7}
      onKeyDown={handleKeyDown}
      className="flex flex-col gap-3"
    >
      <div
        role="row"
        className="grid grid-cols-[minmax(10rem,1fr)_repeat(7,2.25rem)] items-center gap-2"
      >
        <span aria-hidden="true" />
        {days.map((day) => {
          const parsed = parseLocalDay(day)
          return (
            <span
              key={day}
              role="columnheader"
              aria-label={fullDateFormatter.format(parsed)}
              className={`text-center font-sans text-label uppercase tracking-[0.08em] ${
                day === today ? 'text-ink' : 'text-ink-muted'
              }`}
            >
              <span aria-hidden="true">{shortWeekdayFormatter.format(parsed).slice(0, 2)}</span>
            </span>
          )
        })}
      </div>

      {systems.map((system, row) => (
        <SystemRow
          key={system.id}
          system={system}
          cells={weekCellsFor(sessions, system.id, weekKey)}
          today={today}
          focusedCol={focused.row === row ? focused.col : null}
          onActivateCell={(date) => toggleSession(system.id, date)}
          registerCellRef={(col, element) => registerCellRef(row, col, element)}
        />
      ))}
    </div>
  )
}
