import { beforeEach, describe, expect, it } from 'vitest'

import { createFreshAtlasDoc, type MilestoneCapture } from '@/domain/schema'

import { setHydratedDoc, useAtlasStore } from '../store/atlas-store'

import { captureMilestone } from './milestone-actions'

beforeEach(() => {
  setHydratedDoc(createFreshAtlasDoc(new Date('2026-07-08T09:00:00-05:00'), '0.0.1'))
})

function milestonesNow(): MilestoneCapture[] {
  return useAtlasStore.getState().doc?.milestones ?? []
}

describe('captureMilestone', () => {
  it('appends a milestone with just text', () => {
    captureMilestone({ text: 'Passed the AWS exam' })
    expect(milestonesNow()).toEqual([expect.objectContaining({ text: 'Passed the AWS exam' })])
    expect(milestonesNow()[0]).not.toHaveProperty('pillar')
    expect(milestonesNow()[0]).not.toHaveProperty('note')
  })

  it('captures an optional pillar and note', () => {
    captureMilestone({
      text: 'Shipped the first weekend',
      pillar: 'engineering',
      note: 'Felt real.',
    })
    expect(milestonesNow()[0]).toMatchObject({
      text: 'Shipped the first weekend',
      pillar: 'engineering',
      note: 'Felt real.',
    })
  })

  it('trims text and note, and omits a blank note rather than storing it', () => {
    captureMilestone({ text: '  Ran the 10K  ', note: '   ' })
    expect(milestonesNow()[0]?.text).toBe('Ran the 10K')
    expect(milestonesNow()[0]).not.toHaveProperty('note')
  })

  it('refuses a blank milestone', () => {
    captureMilestone({ text: '   ' })
    expect(milestonesNow()).toEqual([])
  })

  it('never removes an earlier milestone', () => {
    captureMilestone({ text: 'First' })
    captureMilestone({ text: 'Second' })
    expect(milestonesNow().map((m) => m.text)).toEqual(['First', 'Second'])
  })
})
