import { nanoid } from 'nanoid'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  initialPresenceState,
  reduceTabPresence,
  type PresenceEvent,
  type PresenceMessage,
  type PresenceState,
  type PresenceStatus,
} from './tab-presence-reducer'

const CHANNEL_NAME = 'atlas-presence'
const ANNOUNCE_WINDOW_MS = 200

export interface TabGuardHandle {
  status: PresenceStatus
  takeOver: () => void
}

/**
 * The thin, effectful wrapper around the pure protocol in
 * tab-presence-reducer.ts. Side effects (posting to the channel, calling
 * `onBecameGuarded` so the caller can flush autosave) happen in plain
 * function bodies, never inside a setState updater, so React StrictMode's
 * double-invocation of updater functions cannot double-broadcast.
 */
export function useTabGuard(onBecameGuarded?: () => void): TabGuardHandle {
  const tabIdRef = useRef(nanoid(10))
  const stateRef = useRef<PresenceState>(initialPresenceState)
  const channelRef = useRef<BroadcastChannel | null>(null)
  const onBecameGuardedRef = useRef(onBecameGuarded)
  onBecameGuardedRef.current = onBecameGuarded

  const [status, setStatus] = useState<PresenceStatus>(initialPresenceState.status)

  const dispatch = useCallback((event: PresenceEvent) => {
    const { next, effects } = reduceTabPresence(stateRef.current, event, tabIdRef.current)
    const channel = channelRef.current
    if (channel !== null) {
      for (const effect of effects) channel.postMessage(effect)
    }
    const wasActive = stateRef.current.status === 'active'
    stateRef.current = next
    setStatus(next.status)
    if (wasActive && next.status === 'guarded') onBecameGuardedRef.current?.()
  }, [])

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') {
      stateRef.current = { status: 'active' }
      setStatus('active')
      return
    }

    const channel = new BroadcastChannel(CHANNEL_NAME)
    channelRef.current = channel
    channel.onmessage = (event: MessageEvent<PresenceMessage>) =>
      dispatch({ type: 'message', message: event.data })

    dispatch({ type: 'init' })
    const timeoutId = window.setTimeout(() => dispatch({ type: 'announceTimeout' }), ANNOUNCE_WINDOW_MS)

    return () => {
      window.clearTimeout(timeoutId)
      channel.close()
      channelRef.current = null
    }
  }, [dispatch])

  const takeOver = useCallback(() => dispatch({ type: 'requestTakeover' }), [dispatch])

  return { status, takeOver }
}
