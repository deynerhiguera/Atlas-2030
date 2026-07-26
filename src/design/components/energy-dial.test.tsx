import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { EnergyDial } from './energy-dial'

describe('EnergyDial', () => {
  it('exposes slider semantics with the current value', () => {
    render(<EnergyDial value={3} onChange={() => {}} />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-valuenow', '3')
    expect(slider).toHaveAttribute('aria-valuetext', '3 of 5')
  })

  it('reports "not recorded yet" when unset, while staying a valid ARIA value', () => {
    render(<EnergyDial onChange={() => {}} />)
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-valuenow', '0')
    expect(slider).toHaveAttribute('aria-valuetext', 'Not recorded yet')
  })

  it('ArrowRight increments from unset to 1, then upward', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<EnergyDial onChange={onChange} />)
    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('ArrowLeft decrements but floors at 1', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<EnergyDial value={1} onChange={onChange} />)
    await user.tab()
    await user.keyboard('{ArrowLeft}')
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('Home and End jump to the ends', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<EnergyDial value={3} onChange={onChange} />)
    await user.tab()
    await user.keyboard('{End}')
    expect(onChange).toHaveBeenLastCalledWith(5)
    await user.keyboard('{Home}')
    expect(onChange).toHaveBeenLastCalledWith(1)
  })

  it('a disabled dial ignores keyboard input', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<EnergyDial value={2} onChange={onChange} disabled />)
    const slider = screen.getByRole('slider')
    slider.focus()
    await user.keyboard('{ArrowRight}')
    expect(onChange).not.toHaveBeenCalled()
  })
})
