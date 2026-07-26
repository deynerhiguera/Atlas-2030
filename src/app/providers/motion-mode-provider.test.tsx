import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { setHydratedDoc } from '@/data/store/atlas-store'
import { useMotionMode } from '@/design/hooks/use-motion-mode'
import { createFreshAtlasDoc } from '@/domain/schema'

import { MotionModeProvider } from './motion-mode-provider'

function Probe() {
  return <span>{useMotionMode()}</span>
}

beforeEach(() => {
  setHydratedDoc(createFreshAtlasDoc(new Date('2026-07-08T09:00:00-05:00'), '0.0.1'))
})

describe('MotionModeProvider', () => {
  it("feeds doc.settings.reducedMotion into useMotionMode's override", () => {
    act(() => {
      setHydratedDoc({
        ...createFreshAtlasDoc(new Date('2026-07-08T09:00:00-05:00'), '0.0.1'),
        settings: { theme: 'system', reducedMotion: 'on' },
      })
    })

    render(
      <MotionModeProvider>
        <Probe />
      </MotionModeProvider>,
    )
    expect(screen.getByText('reduced')).toBeInTheDocument()
  })

  it('defaults to the system preference when Settings.reducedMotion is "system"', () => {
    render(
      <MotionModeProvider>
        <Probe />
      </MotionModeProvider>,
    )
    expect(screen.getByText('full')).toBeInTheDocument()
  })
})
