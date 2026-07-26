import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/newsreader/index.css'
import '@/styles/index.css'

import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { ThemeProvider } from './providers/theme-provider'
import { router } from './router'

const rootElement = document.getElementById('root')
if (rootElement === null) throw new Error('Root element #root is missing from index.html')

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
