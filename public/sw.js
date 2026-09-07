// Hand-rolled, dependency-free (blueprint/11: a runtime dependency needs a
// Decision Record; this needs none). "100% functional offline, forever —
// there is no online" (design/06 §Offline): precache the app shell on
// install, then cache-as-you-go for everything else same-origin, so a
// second visit — online or not — never needs the network again.
//
// The cache name is versioned by the app version baked in at build time
// (see index.html's registration call) so a new release gets a clean
// cache instead of serving stale hashed assets forever.
const CACHE_PREFIX = 'atlas-shell-'

const SHELL_URLS = ['/', '/index.html', '/manifest.webmanifest', '/icon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(cacheNameFromUrl())
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  const currentCache = cacheNameFromUrl()
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== currentCache)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

function cacheNameFromUrl() {
  const version = new URL(self.location.href).searchParams.get('v') ?? 'dev'
  return CACHE_PREFIX + version
}

// Cache-first for the shell and any content-hashed build asset (safe
// forever — the filename changes when the content does); network-first
// with a cache fallback for everything else same-origin, so a doc reload
// while offline still resolves to the last cached copy of the shell.
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  const isHashedAsset = url.pathname.startsWith('/assets/')

  if (isHashedAsset) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            const copy = response.clone()
            void caches.open(cacheNameFromUrl()).then((cache) => cache.put(request, copy))
            return response
          }),
      ),
    )
    return
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone()
        void caches.open(cacheNameFromUrl()).then((cache) => cache.put(request, copy))
        return response
      })
      .catch(() => caches.match(request).then((cached) => cached ?? caches.match('/index.html'))),
  )
})
