import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { OneLiner } from './one-liner'

describe('OneLiner', () => {
  it('shows the persisted value', () => {
    render(<OneLiner value="Read for an hour." onCommit={() => {}} promptRotation={[]} />)
    expect(screen.getByRole('textbox')).toHaveValue('Read for an hour.')
  })

  it('commits the trimmed text on Enter', async () => {
    const user = userEvent.setup()
    const onCommit = vi.fn()
    render(<OneLiner onCommit={onCommit} promptRotation={[]} />)
    const input = screen.getByRole('textbox')
    await user.type(input, '  Shipped the first weekend.  {Enter}')
    expect(onCommit).toHaveBeenCalledWith('Shipped the first weekend.')
  })

  it('does not commit when Enter is pressed with no change from the persisted value', async () => {
    const user = userEvent.setup()
    const onCommit = vi.fn()
    render(<OneLiner value="Same" onCommit={onCommit} promptRotation={[]} />)
    const input = screen.getByRole('textbox')
    await user.click(input)
    await user.keyboard('{Enter}')
    expect(onCommit).not.toHaveBeenCalled()
  })

  it('a disabled field cannot be typed into at all', () => {
    const onCommit = vi.fn()
    render(<OneLiner onCommit={onCommit} promptRotation={[]} disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})
