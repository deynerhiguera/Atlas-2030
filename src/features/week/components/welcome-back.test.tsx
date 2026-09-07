import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { WelcomeBack, WELCOME_BACK_THRESHOLD_DAYS } from './welcome-back'

describe('WelcomeBack', () => {
  it('renders nothing when there is no prior activity', () => {
    const { container } = render(<WelcomeBack daysSinceActivity={null} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the gap is under the threshold', () => {
    const { container } = render(
      <WelcomeBack daysSinceActivity={WELCOME_BACK_THRESHOLD_DAYS - 1} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the welcome-back line at exactly the threshold, with no day count', () => {
    render(<WelcomeBack daysSinceActivity={WELCOME_BACK_THRESHOLD_DAYS} />)
    expect(screen.getByText('Welcome back.')).toBeInTheDocument()
    expect(screen.queryByText(/\d+ days?/)).not.toBeInTheDocument()
  })

  it('dismisses on click and stays dismissed for this mount', async () => {
    const user = userEvent.setup()
    render(<WelcomeBack daysSinceActivity={30} />)

    await user.click(screen.getByRole('button', { name: 'Dismiss' }))

    expect(screen.queryByText('Welcome back.')).not.toBeInTheDocument()
  })
})
