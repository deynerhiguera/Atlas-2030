import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'

import { WeekScreen } from '@/features/week'

import { RoomShell } from './shell/room-shell'

const rootRoute = createRootRoute({
  component: () => (
    <RoomShell>
      <Outlet />
    </RoomShell>
  ),
})

const weekRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: WeekScreen,
})

const routeTree = rootRoute.addChildren([weekRoute])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
