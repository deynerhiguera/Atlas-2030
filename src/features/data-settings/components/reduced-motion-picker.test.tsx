import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { setHydratedDoc, useAtlasStore } from '@/data/store/atlas-store'
import { createFreshAtlasDoc } from '@/domain/schema'

import { ReducedMotionPicker } from './reduced-motion-picker'

beforeEach(() => {
  setHydratedDoc(createFreshAtlasDoc(new Date('2026-07-08T09:00:00-05:00'), '0.0.1'))
})

describe('ReducedMotionPicker', () => {
  it('marks "System" as pressed by default', () => {
    render(<ReducedMotionPicker />)
    expect(screen.getByRole('button', { name: 'System' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('persists the choice to doc.settings.reducedMotion', async () => {
    const user = userEvent.setup()
    render(<ReducedMotionPicker />)

    await user.click(screen.getByRole('button', { name: 'Always reduced' }))

    expect(useAtlasStore.getState().doc?.settings.reducedMotion).toBe('on')
  })
})
