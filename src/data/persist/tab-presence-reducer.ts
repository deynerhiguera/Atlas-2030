/**
 * The multi-tab handoff protocol (blueprint/03, FR-D5), as a pure state
 * machine — side effects (BroadcastChannel, timers) live in tab-guard.ts and
 * are thin wrappers around this function, which is what gets tested.
 *
 * Protocol: a new tab announces itself and waits briefly. Any tab already
 * active answers "here". If no answer arrives before the deadline, the new
 * tab becomes active. A guarded tab can request takeover; the active tab
 * yields (after flushing, in the wrapper) and the requester becomes active.
 */
export type PresenceStatus = 'announcing' | 'active' | 'guarded'

export interface PresenceState {
  status: PresenceStatus
}

export type PresenceMessage =
  | { kind: 'announce'; from: string }
  | { kind: 'here'; from: string }
  | { kind: 'takeover'; from: string }

export type PresenceEvent =
  | { type: 'init' }
  | { type: 'message'; message: PresenceMessage }
  | { type: 'announceTimeout' }
  | { type: 'requestTakeover' }

export interface PresenceTransition {
  next: PresenceState
  effects: PresenceMessage[]
}

export const initialPresenceState: PresenceState = { status: 'announcing' }

export function reduceTabPresence(
  state: PresenceState,
  event: PresenceEvent,
  selfId: string,
): PresenceTransition {
  switch (event.type) {
    case 'init':
      return { next: { status: 'announcing' }, effects: [{ kind: 'announce', from: selfId }] }

    case 'message': {
      const { message } = event
      if (message.from === selfId) return { next: state, effects: [] }

      if (message.kind === 'announce' && state.status === 'active') {
        return { next: state, effects: [{ kind: 'here', from: selfId }] }
      }
      if (message.kind === 'here' && state.status === 'announcing') {
        return { next: { status: 'guarded' }, effects: [] }
      }
      if (message.kind === 'takeover' && state.status === 'active') {
        return { next: { status: 'guarded' }, effects: [] }
      }
      return { next: state, effects: [] }
    }

    case 'announceTimeout':
      if (state.status === 'announcing') {
        return { next: { status: 'active' }, effects: [] }
      }
      return { next: state, effects: [] }

    case 'requestTakeover':
      if (state.status === 'guarded') {
        return { next: { status: 'active' }, effects: [{ kind: 'takeover', from: selfId }] }
      }
      return { next: state, effects: [] }

    default:
      return { next: state, effects: [] }
  }
}
