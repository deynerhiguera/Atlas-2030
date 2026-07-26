import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { setHydratedDoc, useAtlasStore } from '@/data/store/atlas-store'

import { BookSection } from './book-section'
import { makeBook, makeDoc } from './week-test-fixtures'

function booksNow() {
  return useAtlasStore.getState().doc?.books ?? []
}

function milestonesNow() {
  return useAtlasStore.getState().doc?.milestones ?? []
}

describe('BookSection — empty state', () => {
  beforeEach(() => {
    setHydratedDoc(makeDoc())
  })

  it('invites starting a book when none is being read', () => {
    render(<BookSection />)
    expect(screen.getByText('One book worth reading')).toBeInTheDocument()
  })

  it('starting a book replaces the prompt with the live card', async () => {
    const user = userEvent.setup()
    render(<BookSection />)

    await user.type(screen.getByLabelText('Book title'), 'The Soul of a New Machine')
    await user.type(
      screen.getByLabelText("Why you're reading it"),
      'To understand how machines get built.',
    )
    await user.click(screen.getByRole('button', { name: 'Start' }))

    expect(await screen.findByText('The Soul of a New Machine')).toBeInTheDocument()
    expect(booksNow()).toHaveLength(1)
    expect(screen.queryByText('One book worth reading')).not.toBeInTheDocument()
  })
})

describe('BookSection — reading a book', () => {
  beforeEach(() => {
    setHydratedDoc(
      makeDoc({ books: [makeBook({ id: 'book-1', title: 'The Soul of a New Machine' })] }),
    )
  })

  it('shows the card with its why', () => {
    render(<BookSection />)
    expect(screen.getByText('The Soul of a New Machine')).toBeInTheDocument()
    expect(screen.getByText('To understand how machines get built.')).toBeInTheDocument()
  })

  it('opens the sheet, updates progress, and appends an idea', async () => {
    const user = userEvent.setup()
    render(<BookSection />)

    await user.click(screen.getByRole('button', { name: /The Soul of a New Machine/ }))
    await user.type(await screen.findByLabelText('Current page'), '142')
    await user.tab()

    await user.type(screen.getByLabelText('Add an idea'), 'Complexity lives somewhere.{Enter}')

    expect(booksNow()[0]?.progress).toEqual({ kind: 'page', page: 142 })
    expect(booksNow()[0]?.ideas).toEqual([
      expect.objectContaining({ text: 'Complexity lives somewhere.' }),
    ])
  })

  it('closes on Escape and restores focus to the card that opened it', async () => {
    const user = userEvent.setup()
    render(<BookSection />)

    const trigger = screen.getByRole('button', { name: /The Soul of a New Machine/ })
    await user.click(trigger)
    await screen.findByLabelText('Add an idea')

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByLabelText('Add an idea')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('finishing mints a milestone, closes the sheet, and guides into starting the next book', async () => {
    const user = userEvent.setup()
    render(<BookSection />)

    await user.click(screen.getByRole('button', { name: /The Soul of a New Machine/ }))
    await user.click(await screen.findByRole('button', { name: 'Finish' }))
    await user.type(screen.getByLabelText('What did it change?'), 'How I think about shipping.')
    await user.click(screen.getByRole('button', { name: 'Finish' }))

    expect(booksNow()[0]).toMatchObject({
      status: 'finished',
      endNote: 'How I think about shipping.',
    })
    expect(milestonesNow()).toEqual([
      expect.objectContaining({ text: 'Finished "The Soul of a New Machine"' }),
    ])

    // The sheet closes; the Week screen's own empty state is the single guide
    // into the next book (no duplicate "start a book" form in the sheet).
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByText('One book worth reading')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Book title'), 'Next Book')
    await user.type(screen.getByLabelText("Why you're reading it"), 'Why.')
    await user.click(screen.getByRole('button', { name: 'Start' }))

    expect(booksNow().filter((book) => book.status === 'reading')).toHaveLength(1)
    await waitFor(() => expect(screen.queryByLabelText('Book title')).not.toBeInTheDocument())
  })

  it('setting a book down never mints a milestone', async () => {
    const user = userEvent.setup()
    render(<BookSection />)

    await user.click(screen.getByRole('button', { name: /The Soul of a New Machine/ }))
    await user.click(await screen.findByRole('button', { name: 'Set down' }))
    await user.click(screen.getByRole('button', { name: 'Set down' }))

    expect(booksNow()[0]?.status).toBe('setDown')
    expect(milestonesNow()).toEqual([])
    expect(await screen.findByText('One book worth reading')).toBeInTheDocument()
  })
})
