import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/newsreader/index.css'
import '@/styles/index.css'

import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { initializeAtlasData, useAtlasStore } from '@/data'
import { GateScreen } from '@/design/primitives/gate-screen'

import { MotionModeProvider } from './providers/motion-mode-provider'
import { ThemeProvider } from './providers/theme-provider'
import { router } from './router'

/**
 * Hydration is awaited here, before anything renders (blueprint/03) — there
 * is no loading screen anywhere in Atlas because there is nothing to wait
 * for once this resolves. On failure the stored bytes are left untouched
 * (blueprint/10): this renders an honest message, never a silent crash and
 * never a repaired-looking document.
 */
async function bootstrap() {
  const rootElement = document.getElementById('root')
  if (rootElement === null) throw new Error('Root element #root is missing from index.html')

  await initializeAtlasData(__APP_VERSION__)
  const { hydrationError } = useAtlasStore.getState()

  const tree =
    hydrationError === null ? (
      <RouterProvider router={router} />
    ) : (
      <GateScreen
        title="Atlas couldn't load"
        message={`${hydrationError} Nothing has been changed or deleted — your data is still on this device.`}
      />
    )

  createRoot(rootElement).render(
    <StrictMode>
      <MotionModeProvider>
        <ThemeProvider>{tree}</ThemeProvider>
      </MotionModeProvider>
    </StrictMode>,
  )
}

void bootstrap()
