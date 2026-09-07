import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { vi } from 'vitest'

import { setHydratedDoc, useAtlasStore } from '@/data/store/atlas-store'

import { WeekScreen } from './week-screen'
import { makeDoc, makeSystem } from './week-test-fixtures'

// A Wednesday in ISO week 2026-W28 (Mon 2026-07-06 .. Sun 2026-07-12).
const NOW = new Date('2026-07-08T12:00:00-05:00')

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('WeekScreen — rendering', () => {
  it('shows the day-of-becoming count derived from the founding date', () => {
    setHydratedDoc(makeDoc({}, new Date('2026-07-01T09:00:00-05:00')))
    render(<WeekScreen />)
    // 2026-07-01 -> 2026-07-08 is 7 elapsed days, so today is day 8.
    expect(screen.getByText('Day 8 of becoming')).toBeInTheDocument()
  })

  it('shows the season line only when a season exists', () => {
    setHydratedDoc(
      makeDoc({
        seasons: [
          {
            id: 's1',
            name: 'Foundations',
            startDate: '2026-07-06',
            plannedEndDate: '2026-09-27',
            focusPillars: ['engineering', 'health'],
            intentions: [{ id: 'i1', text: 'Ship the first weekend' }],
          },
        ],
      }),
    )
    render(<WeekScreen />)
    expect(screen.getByText(/Foundations · Week 1 of 12/)).toBeInTheDocument()
  })
})

describe('WeekScreen — past-week navigation', () => {
  beforeEach(() => {
    setHydratedDoc(makeDoc({ systems: [makeSystem({ id: 'sys-1' })] }))
  })

  it('hides the today band and makes the grid read-only when browsing a past week', async () => {
    const user = userEvent.setup({ delay: null })
    render(<WeekScreen />)

    expect(screen.getByRole('slider')).toBeInTheDocument() // the energy dial, present on the current week

    await user.click(screen.getByRole('button', { name: 'Previous week' }))

    expect(screen.queryByRole('slider')).not.toBeInTheDocument()
    for (const cell of screen.getAllByRole('gridcell')) {
      expect(cell).toHaveAttribute('aria-disabled', 'true')
    }
  })

  it('disables "Next week" while already viewing the current week', () => {
    render(<WeekScreen />)
    expect(screen.getByRole('button', { name: 'Next week' })).toBeDisabled()
  })

  it('returns to the current week and re-enables the today band', async () => {
    const user = userEvent.setup({ delay: null })
    render(<WeekScreen />)

    await user.click(screen.getByRole('button', { name: 'Previous week' }))
    expect(screen.queryByRole('slider')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next week' }))
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })
})

describe('WeekScreen — welcome back', () => {
  it('does not show the welcome-back line for a document with recent activity', () => {
    setHydratedDoc(makeDoc({ signals: [{ date: '2026-07-08', energy: 3 }] }))
    render(<WeekScreen />)
    expect(screen.queryByText('Welcome back.')).not.toBeInTheDocument()
  })

  it('shows the welcome-back line after a 14+ day gap since the last signal or session', () => {
    setHydratedDoc(makeDoc({ signals: [{ date: '2026-06-01', energy: 3 }] }))
    render(<WeekScreen />)
    expect(screen.getByText('Welcome back.')).toBeInTheDocument()
  })

  it('does not show the welcome-back line on day one, with no prior activity at all', () => {
    setHydratedDoc(makeDoc({}, new Date('2026-07-08T09:00:00-05:00')))
    render(<WeekScreen />)
    expect(screen.queryByText('Welcome back.')).not.toBeInTheDocument()
  })

  it('hides the welcome-back line while browsing a past week', async () => {
    const user = userEvent.setup({ delay: null })
    setHydratedDoc(makeDoc({ signals: [{ date: '2026-06-01', energy: 3 }] }))
    render(<WeekScreen />)

    expect(screen.getByText('Welcome back.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Previous week' }))
    expect(screen.queryByText('Welcome back.')).not.toBeInTheDocument()
  })
})

describe('WeekScreen — today band wiring', () => {
  beforeEach(() => {
    setHydratedDoc(makeDoc({ systems: [makeSystem({ id: 'sys-1' })] }))
  })

  it('persists an energy value set through the dial', async () => {
    const user = userEvent.setup({ delay: null })
    render(<WeekScreen />)

    screen.getByRole('slider').focus()
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}')

    expect(useAtlasStore.getState().doc?.signals).toEqual([{ date: '2026-07-08', energy: 3 }])
  })

  it('persists a one-liner committed with Enter', async () => {
    const user = userEvent.setup({ delay: null })
    render(<WeekScreen />)

    const input = screen.getByRole('textbox', { name: "Today's one line" })
    await user.type(input, 'A quiet, good day.{Enter}')

    expect(useAtlasStore.getState().doc?.signals).toEqual([
      { date: '2026-07-08', line: 'A quiet, good day.' },
    ])
  })
})
