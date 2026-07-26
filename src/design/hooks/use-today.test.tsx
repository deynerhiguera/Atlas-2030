import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useToday } from './use-today'

function Probe() {
  const today = useToday()
  return <span>{today}</span>
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useToday', () => {
  it("returns today's local date", () => {
    // Local constructor, not an ISO string with a hardcoded offset: getDate()
    // etc. read the *running machine's* timezone, so a fixed offset string
    // near a day boundary would make this test's outcome depend on where it
    // happens to run.
    vi.setSystemTime(new Date(2026, 6, 8, 12, 0, 0))
    render(<Probe />)
    expect(screen.getByText('2026-07-08')).toBeInTheDocument()
  })

  it('rolls over to the next day at local midnight without any other trigger', () => {
    vi.setSystemTime(new Date(2026, 6, 8, 23, 59, 58))
    render(<Probe />)
    expect(screen.getByText('2026-07-08')).toBeInTheDocument()

    // Advance purely through the fake timer engine so the internally
    // scheduled timeout actually fires, and the mocked clock advances
    // consistently with it. Wrapped in act(): the resulting state update
    // happens outside any React event handler, so React won't flush it to
    // the DOM before this returns unless told to.
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.getByText('2026-07-09')).toBeInTheDocument()
  })
})
