import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { setHydratedDoc, useAtlasStore } from '@/data/store/atlas-store'

import { CaptureAction } from './capture-action'
import { makeBook, makeDoc, makeQuestion } from './week-test-fixtures'

function doc() {
  return useAtlasStore.getState().doc
}

describe('CaptureAction — the trigger', () => {
  it('is always visible, with an obvious label', () => {
    setHydratedDoc(makeDoc())
    render(<CaptureAction />)
    expect(screen.getByRole('button', { name: '+ Capture' })).toBeInTheDocument()
  })
})

describe('CaptureAction — milestone (no question or book yet)', () => {
  beforeEach(() => {
    setHydratedDoc(makeDoc())
  })

  it('opens straight to the milestone form with no destination selector', async () => {
    const user = userEvent.setup()
    render(<CaptureAction />)

    await user.click(screen.getByRole('button', { name: '+ Capture' }))

    expect(await screen.findByLabelText('Milestone')).toBeInTheDocument()
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
  })

  it('captures a milestone with text, pillar, and note, then disappears', async () => {
    const user = userEvent.setup()
    render(<CaptureAction />)

    const trigger = screen.getByRole('button', { name: '+ Capture' })
    await user.click(trigger)

    await user.type(await screen.findByLabelText('Milestone'), 'Passed the AWS exam')
    await user.selectOptions(screen.getByLabelText('Pillar (optional)'), 'engineering')
    await user.type(screen.getByLabelText('Note (optional)'), 'Studied for six weeks.')
    await user.click(screen.getByRole('button', { name: 'Capture' }))

    expect(doc()?.milestones).toEqual([
      expect.objectContaining({
        text: 'Passed the AWS exam',
        pillar: 'engineering',
        note: 'Studied for six weeks.',
      }),
    ])
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('refuses an empty capture', async () => {
    const user = userEvent.setup()
    render(<CaptureAction />)

    await user.click(screen.getByRole('button', { name: '+ Capture' }))
    await screen.findByLabelText('Milestone')

    expect(screen.getByRole('button', { name: 'Capture' })).toBeDisabled()
  })

  it('closes on Escape without capturing anything', async () => {
    const user = userEvent.setup()
    render(<CaptureAction />)

    await user.click(screen.getByRole('button', { name: '+ Capture' }))
    await user.type(await screen.findByLabelText('Milestone'), 'Half a thought')
    await user.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(doc()?.milestones).toEqual([])
  })
})

describe('CaptureAction — with a live question and a reading book', () => {
  beforeEach(() => {
    setHydratedDoc(
      makeDoc({
        questions: [makeQuestion({ id: 'question-1', text: 'Why does RAM exist?' })],
        books: [makeBook({ id: 'book-1', title: 'The Soul of a New Machine' })],
      }),
    )
  })

  it('offers all three destinations', async () => {
    const user = userEvent.setup()
    render(<CaptureAction />)

    await user.click(screen.getByRole('button', { name: '+ Capture' }))

    const group = await screen.findByRole('radiogroup', { name: 'What are you capturing?' })
    expect(group).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Milestone' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Question note' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Book idea' })).toBeInTheDocument()
  })

  it('captures a question note through the existing addQuestionNote action', async () => {
    const user = userEvent.setup()
    render(<CaptureAction />)

    await user.click(screen.getByRole('button', { name: '+ Capture' }))
    await user.click(await screen.findByRole('radio', { name: 'Question note' }))

    expect(screen.getByText('Why does RAM exist?')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Question note'), 'It sits in the speed hierarchy.')
    await user.click(screen.getByRole('button', { name: 'Capture' }))

    expect(doc()?.questions[0]?.notes).toEqual([
      expect.objectContaining({ text: 'It sits in the speed hierarchy.' }),
    ])
    expect(doc()?.questions[0]?.state).toBe('exploring')
  })

  it('captures a book idea through the existing addBookIdea action', async () => {
    const user = userEvent.setup()
    render(<CaptureAction />)

    await user.click(screen.getByRole('button', { name: '+ Capture' }))
    await user.click(await screen.findByRole('radio', { name: 'Book idea' }))

    expect(screen.getByText('The Soul of a New Machine')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Book idea'), 'Complexity lives somewhere.')
    await user.click(screen.getByRole('button', { name: 'Capture' }))

    expect(doc()?.books[0]?.ideas).toEqual([
      expect.objectContaining({ text: 'Complexity lives somewhere.' }),
    ])
  })

  it('always resets to the milestone destination on reopen', async () => {
    const user = userEvent.setup()
    render(<CaptureAction />)

    await user.click(screen.getByRole('button', { name: '+ Capture' }))
    await user.click(await screen.findByRole('radio', { name: 'Book idea' }))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: '+ Capture' }))
    expect(await screen.findByRole('radio', { name: 'Milestone' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })
})
