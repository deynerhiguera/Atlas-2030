import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { MotionModeOverrideContext } from '@/design/hooks/motion-mode-context'

import { SealMoment } from './seal-moment'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('SealMoment', () => {
  it('shows the sealed line and calls onComplete after the full held beat', () => {
    const onComplete = vi.fn()
    render(<SealMoment onComplete={onComplete} />)

    expect(screen.getByText('Sealed until December 2030.')).toBeInTheDocument()
    expect(onComplete).not.toHaveBeenCalled()

    vi.advanceTimersByTime(899)
    expect(onComplete).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('collapses the held beat under reduced motion', () => {
    const onComplete = vi.fn()
    render(
      <MotionModeOverrideContext value="on">
        <SealMoment onComplete={onComplete} />
      </MotionModeOverrideContext>,
    )

    vi.advanceTimersByTime(150)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('always calls the latest onComplete even if the prop identity changes mid-hold', () => {
    const first = vi.fn()
    const { rerender } = render(<SealMoment onComplete={first} />)

    const second = vi.fn()
    rerender(<SealMoment onComplete={second} />)

    vi.advanceTimersByTime(900)
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })
})
