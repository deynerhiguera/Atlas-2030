import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { setHydratedDoc, useAtlasStore } from '@/data/store/atlas-store'
import { createFreshAtlasDoc } from '@/domain/schema'

import { ThemeProvider } from './theme-provider'
import { useTheme } from './use-theme'

function Probe() {
  const { setting, resolved, setSetting } = useTheme()
  return (
    <div>
      <span data-testid="setting">{setting}</span>
      <span data-testid="resolved">{resolved}</span>
      <button onClick={() => setSetting('dark')}>Dark</button>
    </div>
  )
}

beforeEach(() => {
  setHydratedDoc(createFreshAtlasDoc(new Date('2026-07-08T09:00:00-05:00'), '0.0.1'))
})

describe('ThemeProvider', () => {
  it('setSetting persists to doc.settings, not just local state (both ThemeToggle and ThemePicker call this one path)', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Dark' }))

    expect(screen.getByTestId('setting')).toHaveTextContent('dark')
    expect(useAtlasStore.getState().doc?.settings.theme).toBe('dark')
  })

  it("reacts to the document's own setting changing from elsewhere (e.g. an import)", () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('setting')).toHaveTextContent('system')

    act(() => {
      setHydratedDoc({
        ...createFreshAtlasDoc(new Date('2026-07-08T09:00:00-05:00'), '0.0.1'),
        settings: { theme: 'dark', reducedMotion: 'system' },
      })
    })

    expect(screen.getByTestId('setting')).toHaveTextContent('dark')
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark')
  })
})
