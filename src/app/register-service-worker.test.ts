// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'

import { registerServiceWorker } from './register-service-worker'

describe('registerServiceWorker', () => {
  const originalServiceWorker = navigator.serviceWorker

  afterEach(() => {
    Object.defineProperty(navigator, 'serviceWorker', {
      value: originalServiceWorker,
      configurable: true,
    })
  })

  it('registers sw.js with the app version once the page loads', async () => {
    const register = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { register },
      configurable: true,
    })

    registerServiceWorker('1.2.3')
    window.dispatchEvent(new Event('load'))
    await Promise.resolve()

    expect(register).toHaveBeenCalledWith('/sw.js?v=1.2.3')
  })

  it('does nothing when the browser has no serviceWorker API', () => {
    Object.defineProperty(navigator, 'serviceWorker', { value: undefined, configurable: true })

    expect(() => registerServiceWorker('1.2.3')).not.toThrow()
  })
})
