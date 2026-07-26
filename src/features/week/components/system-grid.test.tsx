import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { setHydratedDoc, useAtlasStore } from '@/data/store/atlas-store'
import type { WeekKey } from '@/domain/time'

import { SystemGrid } from './system-grid'
import { makeDoc, makeSystem } from './week-test-fixtures'

// 2026-07-08 is a Wednesday in ISO week 2026-W28 (Mon 07-06 .. Sun 07-12).
const CURRENT_WEEK: WeekKey = '2026-W28'
const TODAY = '2026-07-08'

// toggleSession (called by clicking/activating a cell) reads the real clock
// via todayLocal(), independent of this file's `today` prop — the prop only
// drives rendering. The system clock must be pinned to match, or every
// activation in these tests would be judged against the wrong "today".
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-07-08T12:00:00-05:00'))
})

afterEach(() => {
  vi.useRealTimers()
})

function sessionsNow() {
  return useAtlasStore.getState().doc?.sessions ?? []
}

describe('SystemGrid — rendering', () => {
  it('renders one row per system, with its weekly progress chip', () => {
    const deepLearning = makeSystem({ name: 'Deep Learning', rhythmPerWeek: 3 })
    setHydratedDoc(
      makeDoc({
        systems: [deepLearning],
        sessions: [{ id: 'm1', systemId: deepLearning.id, date: '2026-07-06' }],
      }),
    )

    render(
      <SystemGrid
        systems={[deepLearning]}
        sessions={sessionsNow()}
        weekKey={CURRENT_WEEK}
        today={TODAY}
      />,
    )

    expect(screen.getByText('Deep Learning')).toBeInTheDocument()
    expect(screen.getByText('1 of 3')).toBeInTheDocument()
  })

  it('exposes correct grid roles', () => {
    const system = makeSystem()
    setHydratedDoc(makeDoc({ systems: [system] }))
    render(<SystemGrid systems={[system]} sessions={[]} weekKey={CURRENT_WEEK} today={TODAY} />)

    expect(screen.getByRole('grid', { name: /this week/i })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(2) // header + one system
    expect(screen.getAllByRole('gridcell')).toHaveLength(7)
  })
})

describe('SystemGrid — marking sessions', () => {
  beforeEach(() => {
    const system = makeSystem({ id: 'sys-1' })
    setHydratedDoc(makeDoc({ systems: [system] }))
  })

  it('marks today when its cell is clicked', async () => {
    const user = userEvent.setup({ delay: null })
    const system = makeSystem({ id: 'sys-1' })
    render(<SystemGrid systems={[system]} sessions={[]} weekKey={CURRENT_WEEK} today={TODAY} />)

    await user.click(screen.getByRole('gridcell', { name: /wednesday july 8, not marked/i }))
    expect(sessionsNow()).toEqual([expect.objectContaining({ systemId: 'sys-1', date: TODAY })])
  })

  it('does nothing when a future-day cell is clicked', async () => {
    const user = userEvent.setup({ delay: null })
    const system = makeSystem({ id: 'sys-1' })
    render(<SystemGrid systems={[system]} sessions={[]} weekKey={CURRENT_WEEK} today={TODAY} />)

    await user.click(screen.getByRole('gridcell', { name: /friday july 10, not available/i }))
    expect(sessionsNow()).toEqual([])
  })

  it('a past week renders every cell as not available and unclickable', async () => {
    const user = userEvent.setup({ delay: null })
    const system = makeSystem({ id: 'sys-1' })
    const pastWeek: WeekKey = '2026-W27'
    render(<SystemGrid systems={[system]} sessions={[]} weekKey={pastWeek} today={TODAY} />)

    const cells = screen.getAllByRole('gridcell')
    for (const cell of cells) {
      expect(cell).toHaveAttribute('aria-disabled', 'true')
    }
    await user.click(cells[0] as HTMLElement)
    expect(sessionsNow()).toEqual([])
  })
})

describe('SystemGrid — keyboard navigation', () => {
  it('moves the roving focus across days with the arrow keys, and activates with Enter', async () => {
    const user = userEvent.setup({ delay: null })
    const system = makeSystem({ id: 'sys-1' })
    setHydratedDoc(makeDoc({ systems: [system] }))
    render(<SystemGrid systems={[system]} sessions={[]} weekKey={CURRENT_WEEK} today={TODAY} />)

    // Initial roving focus lands on today's column (Wednesday).
    await user.tab()
    expect(screen.getByRole('gridcell', { name: /wednesday july 8/i })).toHaveFocus()

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('gridcell', { name: /tuesday july 7/i })).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(sessionsNow()).toEqual([
      expect.objectContaining({ systemId: 'sys-1', date: '2026-07-07' }),
    ])
  })

  it('moves focus between systems with the vertical arrow keys', async () => {
    const user = userEvent.setup({ delay: null })
    const first = makeSystem({ id: 'sys-1', name: 'Deep Learning' })
    const second = makeSystem({ id: 'sys-2', name: 'Gym', pillar: 'health' })
    setHydratedDoc(makeDoc({ systems: [first, second] }))
    render(
      <SystemGrid systems={[first, second]} sessions={[]} weekKey={CURRENT_WEEK} today={TODAY} />,
    )

    await user.tab()
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')
    expect(sessionsNow()).toEqual([expect.objectContaining({ systemId: 'sys-2', date: TODAY })])
  })
})
