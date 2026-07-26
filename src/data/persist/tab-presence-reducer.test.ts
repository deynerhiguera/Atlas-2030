import { describe, expect, it } from 'vitest'

import { initialPresenceState, reduceTabPresence } from './tab-presence-reducer'

const SELF = 'tab-self'
const OTHER = 'tab-other'

describe('reduceTabPresence', () => {
  it('init: starts announcing and broadcasts an announce', () => {
    const { next, effects } = reduceTabPresence(initialPresenceState, { type: 'init' }, SELF)
    expect(next.status).toBe('announcing')
    expect(effects).toEqual([{ kind: 'announce', from: SELF }])
  })

  it('an active tab answers another tab\'s announce with "here"', () => {
    const { next, effects } = reduceTabPresence(
      { status: 'active' },
      { type: 'message', message: { kind: 'announce', from: OTHER } },
      SELF,
    )
    expect(next.status).toBe('active')
    expect(effects).toEqual([{ kind: 'here', from: SELF }])
  })

  it('an announcing tab that hears "here" becomes guarded', () => {
    const { next, effects } = reduceTabPresence(
      { status: 'announcing' },
      { type: 'message', message: { kind: 'here', from: OTHER } },
      SELF,
    )
    expect(next.status).toBe('guarded')
    expect(effects).toEqual([])
  })

  it('an announcing tab that times out with no reply becomes active', () => {
    const { next } = reduceTabPresence({ status: 'announcing' }, { type: 'announceTimeout' }, SELF)
    expect(next.status).toBe('active')
  })

  it('a timeout after already resolving has no effect', () => {
    const { next } = reduceTabPresence({ status: 'active' }, { type: 'announceTimeout' }, SELF)
    expect(next.status).toBe('active')
  })

  it('an active tab yields to a takeover request from another tab', () => {
    const { next, effects } = reduceTabPresence(
      { status: 'active' },
      { type: 'message', message: { kind: 'takeover', from: OTHER } },
      SELF,
    )
    expect(next.status).toBe('guarded')
    expect(effects).toEqual([])
  })

  it('a guarded tab can request takeover, becoming active and broadcasting it', () => {
    const { next, effects } = reduceTabPresence({ status: 'guarded' }, { type: 'requestTakeover' }, SELF)
    expect(next.status).toBe('active')
    expect(effects).toEqual([{ kind: 'takeover', from: SELF }])
  })

  it('requesting takeover while already active is a no-op', () => {
    const { next, effects } = reduceTabPresence({ status: 'active' }, { type: 'requestTakeover' }, SELF)
    expect(next.status).toBe('active')
    expect(effects).toEqual([])
  })

  it('ignores messages that originated from itself', () => {
    const { next, effects } = reduceTabPresence(
      { status: 'active' },
      { type: 'message', message: { kind: 'announce', from: SELF } },
      SELF,
    )
    expect(next.status).toBe('active')
    expect(effects).toEqual([])
  })
})
