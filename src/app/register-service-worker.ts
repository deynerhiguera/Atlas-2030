/**
 * design/06 §Offline: "100% functional offline, forever." Registered with
 * the app version as a query param so `sw.js` can name its cache after it
 * (`?v=` read via `self.location.href`) — a new release's activate step
 * then drops the previous version's cache instead of accumulating them.
 *
 * Skipped outside a real browser (SSR/tests) and when the API is absent
 * (older browsers) — offline support degrades to "no offline," never a
 * thrown error at startup.
 */
export function registerServiceWorker(appVersion: string): void {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(`/sw.js?v=${encodeURIComponent(appVersion)}`)
  })
}
