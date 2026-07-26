import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MotionModeOverrideContext } from './motion-mode-context'
import { useMotionMode } from './use-motion-mode'

function Probe() {
  return <span>{useMotionMode()}</span>
}

describe('useMotionMode', () => {
  it('defaults to full motion with no provider in the tree (every isolated component test)', () => {
    render(<Probe />)
    expect(screen.getByText('full')).toBeInTheDocument()
  })

  it('reduces motion when the /data override is "on", regardless of the OS setting', () => {
    render(
      <MotionModeOverrideContext value="on">
        <Probe />
      </MotionModeOverrideContext>,
    )
    expect(screen.getByText('reduced')).toBeInTheDocument()
  })

  it('stays full when the override is explicitly "system" and the OS has no preference', () => {
    render(
      <MotionModeOverrideContext value="system">
        <Probe />
      </MotionModeOverrideContext>,
    )
    expect(screen.getByText('full')).toBeInTheDocument()
  })
})
