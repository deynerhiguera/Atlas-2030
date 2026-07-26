import { beforeEach, describe, expect, it } from 'vitest'

import { createFreshAtlasDoc, type Question } from '@/domain/schema'

import { setHydratedDoc, useAtlasStore } from '../store/atlas-store'

import { addQuestionNote, askQuestion, closeQuestion } from './question-actions'

beforeEach(() => {
  setHydratedDoc(createFreshAtlasDoc(new Date('2026-07-08T09:00:00-05:00'), '0.0.1'))
})

function questionsNow(): Question[] {
  return useAtlasStore.getState().doc?.questions ?? []
}

describe('askQuestion', () => {
  it('adds a new open question', () => {
    askQuestion({ text: 'Why does RAM exist?', pillar: 'engineering' })
    expect(questionsNow()).toEqual([
      expect.objectContaining({
        text: 'Why does RAM exist?',
        pillar: 'engineering',
        state: 'open',
        notes: [],
      }),
    ])
  })

  it('trims the question text', () => {
    askQuestion({ text: '  How do computers execute instructions?  ', pillar: 'engineering' })
    expect(questionsNow()[0]?.text).toBe('How do computers execute instructions?')
  })

  it('refuses a second question while one is still live', () => {
    askQuestion({ text: 'First question', pillar: 'engineering' })
    askQuestion({ text: 'Second question', pillar: 'engineering' })
    expect(questionsNow()).toHaveLength(1)
    expect(questionsNow()[0]?.text).toBe('First question')
  })

  it('allows a new question once the previous one is answered', () => {
    askQuestion({ text: 'First question', pillar: 'engineering' })
    closeQuestion(questionsNow()[0]!.id, 'Because.')
    askQuestion({ text: 'Second question', pillar: 'engineering' })
    expect(questionsNow()).toHaveLength(2)
    expect(questionsNow()[1]?.state).toBe('open')
  })
})

describe('addQuestionNote', () => {
  beforeEach(() => {
    askQuestion({ text: 'Why does RAM exist?', pillar: 'engineering' })
  })

  it('appends a dated note and moves the question to exploring', () => {
    const id = questionsNow()[0]!.id
    addQuestionNote(id, 'It sits between registers and disk in the hierarchy.')
    const question = questionsNow()[0]!
    expect(question.state).toBe('exploring')
    expect(question.notes).toEqual([
      expect.objectContaining({ text: 'It sits between registers and disk in the hierarchy.' }),
    ])
  })

  it('accumulates notes without ever removing an earlier one', () => {
    const id = questionsNow()[0]!.id
    addQuestionNote(id, 'First thought.')
    addQuestionNote(id, 'Second thought.')
    expect(questionsNow()[0]?.notes.map((note) => note.text)).toEqual([
      'First thought.',
      'Second thought.',
    ])
  })

  it('ignores a blank note', () => {
    const id = questionsNow()[0]!.id
    addQuestionNote(id, '   ')
    expect(questionsNow()[0]?.notes).toEqual([])
    expect(questionsNow()[0]?.state).toBe('open')
  })

  it('refuses a note on an already-answered question', () => {
    const id = questionsNow()[0]!.id
    closeQuestion(id, 'Because.')
    addQuestionNote(id, 'Too late.')
    expect(questionsNow()[0]?.notes).toEqual([])
  })
})

describe('closeQuestion', () => {
  beforeEach(() => {
    askQuestion({ text: 'Why does RAM exist?', pillar: 'engineering' })
  })

  it('sets the answer, marks it answered, and stamps the time', () => {
    const id = questionsNow()[0]!.id
    closeQuestion(id, 'Speed hierarchy: registers, cache, RAM, disk.')
    const question = questionsNow()[0]!
    expect(question.state).toBe('answered')
    expect(question.answer).toBe('Speed hierarchy: registers, cache, RAM, disk.')
    expect(question.answeredAt).toBeTruthy()
  })

  it('refuses an empty answer', () => {
    const id = questionsNow()[0]!.id
    closeQuestion(id, '   ')
    expect(questionsNow()[0]?.state).toBe('open')
  })

  it('frees the slot so a new question may be asked', () => {
    const id = questionsNow()[0]!.id
    closeQuestion(id, 'Because.')
    askQuestion({ text: 'How do operating systems work?', pillar: 'engineering' })
    expect(questionsNow()).toHaveLength(2)
  })
})
