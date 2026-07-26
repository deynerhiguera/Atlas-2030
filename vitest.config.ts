import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    // Domain/data tests are pure and stay on the fast node environment;
    // component tests (.test.tsx) need a DOM, so they alone get jsdom.
    environmentMatchGlobs: [['**/*.test.tsx', 'jsdom']],
    setupFiles: ['./vitest.setup.ts'],
    // jsdom disables localStorage for the default "about:blank" origin (its
    // storage model requires a real origin) — ThemeProvider's pre-paint
    // cache needs it, so component tests get an explicit http origin.
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/',
      },
    },
  },
})
