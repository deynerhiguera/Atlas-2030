import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { setHydratedDoc } from '@/data/store/atlas-store'
import { createFreshAtlasDoc } from '@/domain/schema'
import { ONE_LINER_PROMPTS } from '@/design/copy'

import { TodayBand } from './today-band'

beforeEach(() => {
  setHydratedDoc(createFreshAtlasDoc(new Date('2026-07-08T09:00:00-05:00'), '0.0.1'))
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('TodayBand — one-liner placeholder stability', () => {
  it('keeps the same placeholder when the band re-renders because the signal changed', async () => {
    // Math.random is mocked to pick a different prompt on the first two
    // calls, so this test fails deterministically (not by chance ~2/3 of
    // the time) if OneLiner's placeholder is ever recomputed instead of
    // staying memoized.
    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.99).mockReturnValue(0.5)

    const user = userEvent.setup()
    render(<TodayBand />)

    const input = screen.getByRole('textbox', { name: "Today's one line" }) as HTMLInputElement
    const firstPlaceholder = input.placeholder
    expect(firstPlaceholder).toBe(ONE_LINER_PROMPTS[0])

    // Setting energy updates the Signal TodayBand reads, forcing a
    // re-render of the whole band — including the OneLiner underneath it.
    // Before the fix, TodayBand re-created its `promptRotation` array on
    // every render, which reset OneLiner's memoized placeholder and made it
    // silently re-randomize while visible on screen.
    screen.getByRole('slider').focus()
    await user.keyboard('{ArrowRight}{ArrowRight}')

    expect(input.placeholder).toBe(firstPlaceholder)
  })
})
