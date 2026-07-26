import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'

import { DataScreen } from '@/features/data-settings'
import { WeekScreen } from '@/features/week'

import { RootComponent } from './shell/root-component'

const rootRoute = createRootRoute({
  component: RootComponent,
})

const weekRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: WeekScreen,
})

const dataRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/data',
  component: DataScreen,
})

const routeTree = rootRoute.addChildren([weekRoute, dataRoute])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
