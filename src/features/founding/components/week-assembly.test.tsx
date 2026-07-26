import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { MotionModeOverrideContext } from '@/design/hooks/motion-mode-context'

import { WeekAssembly } from './week-assembly'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('WeekAssembly', () => {
  it('shows the assembling line and calls onComplete after the full held beat', () => {
    const onComplete = vi.fn()
    render(<WeekAssembly onComplete={onComplete} />)

    expect(screen.getByText('Your Atlas is beginning.')).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()

    vi.advanceTimersByTime(999)
    expect(onComplete).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('collapses the held beat under reduced motion', () => {
    const onComplete = vi.fn()
    render(
      <MotionModeOverrideContext value="on">
        <WeekAssembly onComplete={onComplete} />
      </MotionModeOverrideContext>,
    )

    vi.advanceTimersByTime(150)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })
})
