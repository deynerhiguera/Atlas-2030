import { weeklyProgress, type WeekCell } from '@/domain/derive'
import { isSessionCellEditable } from '@/domain/rules'
import type { DayString, System } from '@/domain/schema'
import { parseLocalDay } from '@/domain/time'
import { Chip, Text } from '@/design/primitives'
import { pillarDotClass } from '@/design/tokens'

import { DayCell } from './day-cell'

const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' })
const monthDayFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' })

function cellLabel(
  systemName: string,
  date: DayString,
  filled: boolean,
  interactive: boolean,
): string {
  const parsed = parseLocalDay(date)
  const when = `${weekdayFormatter.format(parsed)} ${monthDayFormatter.format(parsed)}`
  const state = filled ? 'session marked' : interactive ? 'not marked' : 'not available'
  return `${systemName}, ${when}, ${state}`
}

interface SystemRowProps {
  system: System
  cells: readonly WeekCell[]
  today: DayString
  focusedCol: number | null
  onActivateCell: (date: DayString) => void
  registerCellRef: (col: number, element: HTMLDivElement | null) => void
}

export function SystemRow({
  system,
  cells,
  today,
  focusedCol,
  onActivateCell,
  registerCellRef,
}: SystemRowProps) {
  const progress = weeklyProgress(cells, system.rhythmPerWeek)

  return (
    <div
      role="row"
      className="grid grid-cols-[minmax(10rem,1fr)_repeat(7,2.25rem)] items-center gap-2"
    >
      <div role="rowheader" className="flex items-center gap-2 pr-4">
        <span
          aria-hidden="true"
          className={`size-1.5 shrink-0 rounded-full ${pillarDotClass[system.pillar]}`}
        />
        <Text variant="body" as="span" className="truncate">
          {system.name}
        </Text>
        <Chip className="ml-auto shrink-0">
          {progress.marked} of {progress.target}
        </Chip>
      </div>
      {cells.map((cell, index) => {
        const interactive = isSessionCellEditable(cell.date, today)
        return (
          <DayCell
            key={cell.date}
            filled={cell.markId !== null}
            interactive={interactive}
            focused={focusedCol === index}
            label={cellLabel(system.name, cell.date, cell.markId !== null, interactive)}
            pillarClass={pillarDotClass[system.pillar]}
            onActivate={() => onActivateCell(cell.date)}
            cellRef={(element) => registerCellRef(index, element)}
          />
        )
      })}
    </div>
  )
}
