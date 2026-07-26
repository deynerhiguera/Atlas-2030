import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { setHydratedDoc, useAtlasStore } from '@/data/store/atlas-store'

import { QuestionSection } from './question-section'
import { makeDoc, makeQuestion } from './week-test-fixtures'

function questionsNow() {
  return useAtlasStore.getState().doc?.questions ?? []
}

describe('QuestionSection — empty state', () => {
  beforeEach(() => {
    setHydratedDoc(makeDoc())
  })

  it('invites asking a question when none exists', () => {
    render(<QuestionSection />)
    expect(screen.getByText('One question worth exploring')).toBeInTheDocument()
  })

  it('asking a question replaces the prompt with the live card', async () => {
    const user = userEvent.setup()
    render(<QuestionSection />)

    await user.type(screen.getByLabelText('Your question'), 'Why does RAM exist?')
    await user.click(screen.getByRole('button', { name: 'Ask' }))

    expect(await screen.findByText('Why does RAM exist?')).toBeInTheDocument()
    expect(questionsNow()).toHaveLength(1)
    expect(screen.queryByText('One question worth exploring')).not.toBeInTheDocument()
  })
})

describe('QuestionSection — live question', () => {
  beforeEach(() => {
    setHydratedDoc(
      makeDoc({ questions: [makeQuestion({ id: 'question-1', text: 'Why does RAM exist?' })] }),
    )
  })

  it('shows the question card with its state', () => {
    render(<QuestionSection />)
    expect(screen.getByText('Why does RAM exist?')).toBeInTheDocument()
    expect(screen.getByText('open')).toBeInTheDocument()
  })

  it('opens the sheet on click and appends a note, moving state to exploring', async () => {
    const user = userEvent.setup()
    render(<QuestionSection />)

    await user.click(screen.getByRole('button', { name: /Why does RAM exist\?/ }))
    const noteField = await screen.findByLabelText('Add a note')
    await user.type(noteField, 'It sits in the speed hierarchy.{Enter}')

    expect(questionsNow()[0]?.notes).toEqual([
      expect.objectContaining({ text: 'It sits in the speed hierarchy.' }),
    ])
    expect(questionsNow()[0]?.state).toBe('exploring')
  })

  it('closes on Escape and restores focus to the card that opened it', async () => {
    const user = userEvent.setup()
    render(<QuestionSection />)

    const trigger = screen.getByRole('button', { name: /Why does RAM exist\?/ })
    await user.click(trigger)
    await screen.findByLabelText('Add a note')

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByLabelText('Add a note')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('closing with an answer closes the sheet and guides into asking the next one', async () => {
    const user = userEvent.setup()
    render(<QuestionSection />)

    await user.click(screen.getByRole('button', { name: /Why does RAM exist\?/ }))
    await user.click(await screen.findByRole('button', { name: 'Close this question' }))
    await user.type(screen.getByLabelText('Answer'), 'A speed hierarchy from registers to disk.')
    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(questionsNow()[0]).toMatchObject({
      state: 'answered',
      answer: 'A speed hierarchy from registers to disk.',
    })

    // The sheet closes; the Week screen's own empty state is the single guide
    // into the next question (no duplicate "ask a question" form in the sheet).
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByText('One question worth exploring')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Your question'), 'How do operating systems work?')
    await user.click(screen.getByRole('button', { name: 'Ask' }))

    expect(questionsNow()).toHaveLength(2)
    expect(questionsNow()[1]).toMatchObject({
      text: 'How do operating systems work?',
      state: 'open',
    })
  })

  it('Cancel returns from the close-with-answer form without closing the question', async () => {
    const user = userEvent.setup()
    render(<QuestionSection />)

    await user.click(screen.getByRole('button', { name: /Why does RAM exist\?/ }))
    await user.click(await screen.findByRole('button', { name: 'Close this question' }))
    await user.type(screen.getByLabelText('Answer'), 'Half-written thought')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(questionsNow()[0]?.state).toBe('open')
    expect(await screen.findByRole('button', { name: 'Close this question' })).toBeInTheDocument()
  })
})

describe('QuestionSection — history', () => {
  it('offers a link to past questions once at least one is answered', () => {
    setHydratedDoc(
      makeDoc({
        questions: [
          makeQuestion({
            id: 'question-1',
            text: 'Why does RAM exist?',
            state: 'answered',
            answeredAt: '2026-06-20T10:00:00-05:00',
            answer: 'Because of the speed hierarchy.',
          }),
        ],
      }),
    )
    render(<QuestionSection />)
    expect(screen.getByRole('button', { name: '1 answered before' })).toBeInTheDocument()
  })

  it('shows past answers inside the sheet even with no live question', async () => {
    const user = userEvent.setup()
    setHydratedDoc(
      makeDoc({
        questions: [
          makeQuestion({
            id: 'question-1',
            text: 'Why does RAM exist?',
            state: 'answered',
            answeredAt: '2026-06-20T10:00:00-05:00',
            answer: 'Because of the speed hierarchy.',
          }),
        ],
      }),
    )
    render(<QuestionSection />)

    await user.click(screen.getByRole('button', { name: '1 answered before' }))
    expect(await screen.findByText('Because of the speed hierarchy.')).toBeInTheDocument()
  })
})
