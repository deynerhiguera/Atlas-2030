// Provides a real (in-memory) IndexedDB implementation for tests that
// exercise data/persist against `idb` — no mocking of the persistence layer.
import 'fake-indexeddb/auto'

// Adds `.toBeInTheDocument()` etc. to `expect` for component tests. A no-op
// import under the node environment (no DOM there), so it is safe to load
// unconditionally for every test file.
import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Both of the below touch `window`/`document`, which exist only under the
// jsdom environment (domain/data tests run under 'node' and never reach
// this branch) — see vitest.config.ts's environmentMatchGlobs. Without
// explicit cleanup here, each component test's render() would accumulate
// in the same document, since these test files use Vitest's named
// `afterEach` import rather than the `globals: true` mode that Testing
// Library's own auto-cleanup depends on.
if (typeof window !== 'undefined') {
  afterEach(() => cleanup())

  // jsdom does not implement matchMedia; useMotionMode and the theme
  // provider both call it, so component tests need at least a stub.
  if (typeof window.matchMedia !== 'function') {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList
  }
}
