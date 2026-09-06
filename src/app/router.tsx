import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router'

import { useAtlasStore } from '@/data/store'
import { DataScreen } from '@/features/data-settings'
import { FoundationsScreen } from '@/features/foundations'
import { FoundingScreen } from '@/features/founding'
import { WeekScreen } from '@/features/week'

import { RootComponent } from './shell/root-component'

const rootRoute = createRootRoute({
  component: RootComponent,
})

/**
 * FR-F1 (blueprint/06): fresh/unfounded installs route to `/founding`;
 * founded installs never see it again. Read synchronously off the Zustand
 * store rather than a loader — hydration is awaited before the router ever
 * mounts (blueprint/03), so `doc` is never null here.
 */
function redirectIfUnfounded() {
  const doc = useAtlasStore.getState().doc
  if (doc?.meta.foundingStep !== undefined) {
    throw redirect({ to: '/founding' })
  }
}

const weekRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: redirectIfUnfounded,
  component: WeekScreen,
})

const dataRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/data',
  beforeLoad: redirectIfUnfounded,
  component: DataScreen,
})

const foundationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/foundations',
  beforeLoad: redirectIfUnfounded,
  component: FoundationsScreen,
})

const foundingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/founding',
  beforeLoad: () => {
    const doc = useAtlasStore.getState().doc
    if (doc?.meta.foundingStep === undefined) {
      throw redirect({ to: '/' })
    }
  },
  component: FoundingScreen,
})

const routeTree = rootRoute.addChildren([weekRoute, dataRoute, foundationsRoute, foundingRoute])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
