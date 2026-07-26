import { nanoid } from 'nanoid'

import { hasAtMostOneLiveQuestion } from '@/domain/rules'
import { questionSchema, type PillarId, type Question } from '@/domain/schema'
import { todayLocal } from '@/domain/time'

import { getCurrentDoc, replaceDoc } from '../store/atlas-store'

export interface AskQuestionInput {
  text: string
  pillar: PillarId
}

/**
 * I-3: at most one question not yet answered. Validated by checking the
 * invariant against the array-with-candidate, reusing the exact predicate
 * blueprint/04 defines rather than restating it as a new "no live question"
 * rule.
 */
export function askQuestion(input: AskQuestionInput): void {
  const doc = getCurrentDoc()
  if (doc === null) return

  const candidate: Question = questionSchema.parse({
    id: nanoid(12),
    text: input.text.trim(),
    pillar: input.pillar,
    state: 'open',
    askedOn: todayLocal(),
    notes: [],
  })

  if (!hasAtMostOneLiveQuestion([...doc.questions, candidate])) return

  replaceDoc({ ...doc, questions: [...doc.questions, candidate] })
}

/**
 * FR-Q2: append-only notes; the first note moves `open` to `exploring`.
 * Refused for a question that does not exist or is already answered.
 */
export function addQuestionNote(questionId: string, text: string): void {
  const doc = getCurrentDoc()
  if (doc === null) return

  const trimmed = text.trim()
  if (trimmed.length === 0) return

  const target = doc.questions.find((question) => question.id === questionId)
  if (target === undefined || target.state === 'answered') return

  const updated: Question = questionSchema.parse({
    ...target,
    state: 'exploring',
    notes: [
      ...target.notes,
      { id: nanoid(12), text: trimmed, createdAt: new Date().toISOString() },
    ],
  })

  replaceDoc({
    ...doc,
    questions: doc.questions.map((question) => (question.id === questionId ? updated : question)),
  })
}

/** FR-Q3: closing requires a non-empty answer and sets `answered` + a timestamp. */
export function closeQuestion(questionId: string, answer: string): void {
  const doc = getCurrentDoc()
  if (doc === null) return

  const trimmed = answer.trim()
  if (trimmed.length === 0) return

  const target = doc.questions.find((question) => question.id === questionId)
  if (target === undefined || target.state === 'answered') return

  const updated: Question = questionSchema.parse({
    ...target,
    state: 'answered',
    answeredAt: new Date().toISOString(),
    answer: trimmed,
  })

  replaceDoc({
    ...doc,
    questions: doc.questions.map((question) => (question.id === questionId ? updated : question)),
  })
}
