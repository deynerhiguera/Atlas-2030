import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DayCell } from './day-cell'

function renderCell(overrides: Partial<Parameters<typeof DayCell>[0]> = {}) {
  return render(
    <DayCell
      filled={false}
      interactive
      focused
      label="Monday, session"
      pillarClass="bg-pillar-engineering"
      onActivate={vi.fn()}
      cellRef={() => {}}
      {...overrides}
    />,
  )
}

describe('DayCell', () => {
  it('does not suppress the global visible focus ring (blueprint/05, blueprint/06 a11y)', () => {
    renderCell()
    const cell = screen.getByRole('gridcell')
    expect(cell.className).not.toMatch(/\boutline-none\b/)
  })

  it('is keyboard-reachable only when it is the roving-focus cell', () => {
    renderCell({ focused: false })
    expect(screen.getByRole('gridcell')).toHaveAttribute('tabIndex', '-1')
  })
})
