// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'

import { setHydratedDoc } from '@/data/store/atlas-store'
import { createFreshAtlasDoc, type AtlasDoc } from '@/domain/schema'

import { router } from './router'

const NOW = new Date('2026-07-08T09:00:00-05:00')

function unfoundedDoc(): AtlasDoc {
  return createFreshAtlasDoc(NOW, '0.0.1')
}

function foundedDoc(): AtlasDoc {
  const fresh = createFreshAtlasDoc(NOW, '0.0.1')
  return {
    ...fresh,
    meta: { foundedAt: fresh.meta.foundedAt, appVersionAtFounding: fresh.meta.appVersionAtFounding },
  }
}

beforeEach(async () => {
  await router.navigate({ to: '/' })
})

/**
 * FR-F1 (blueprint/06): fresh/unfounded installs route to `/founding`;
 * founded installs never see it again. Drives the real singleton router
 * (no React rendering) so these assertions exercise the exact `beforeLoad`
 * guards the app boots with, not a re-implementation of them.
 */
describe('founding gate', () => {
  it('redirects an unfounded document away from / to /founding', async () => {
    setHydratedDoc(unfoundedDoc())
    await router.navigate({ to: '/' })
    expect(router.state.location.pathname).toBe('/founding')
  })

  it('redirects an unfounded document away from /data to /founding', async () => {
    setHydratedDoc(unfoundedDoc())
    await router.navigate({ to: '/data' })
    expect(router.state.location.pathname).toBe('/founding')
  })

  it('redirects an unfounded document away from /foundations to /founding', async () => {
    setHydratedDoc(unfoundedDoc())
    await router.navigate({ to: '/foundations' })
    expect(router.state.location.pathname).toBe('/founding')
  })

  it('redirects a founded document away from /founding to /', async () => {
    setHydratedDoc(foundedDoc())
    await router.navigate({ to: '/founding' })
    expect(router.state.location.pathname).toBe('/')
  })

  it('lets a founded document reach / and /data normally', async () => {
    setHydratedDoc(foundedDoc())
    await router.navigate({ to: '/data' })
    expect(router.state.location.pathname).toBe('/data')
  })

  it('lets a founded document reach /foundations normally', async () => {
    setHydratedDoc(foundedDoc())
    await router.navigate({ to: '/foundations' })
    expect(router.state.location.pathname).toBe('/foundations')
  })
})
