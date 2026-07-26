import { beforeEach, describe, expect, it } from 'vitest'

import { createFreshAtlasDoc, type Book } from '@/domain/schema'

import { setHydratedDoc, useAtlasStore } from '../store/atlas-store'

import { addBookIdea, finishBook, setDownBook, startBook, updateBookProgress } from './book-actions'

beforeEach(() => {
  setHydratedDoc(createFreshAtlasDoc(new Date('2026-07-08T09:00:00-05:00'), '0.0.1'))
})

function booksNow(): Book[] {
  return useAtlasStore.getState().doc?.books ?? []
}

function milestonesNow() {
  return useAtlasStore.getState().doc?.milestones ?? []
}

describe('startBook', () => {
  it('adds a new reading book', () => {
    startBook({
      title: 'The Soul of a New Machine',
      pillar: 'engineering',
      why: 'To understand how machines get built.',
    })
    expect(booksNow()).toEqual([
      expect.objectContaining({ title: 'The Soul of a New Machine', status: 'reading', ideas: [] }),
    ])
  })

  it('omits a blank author rather than storing an empty string', () => {
    startBook({ title: 'Title', author: '   ', pillar: 'engineering', why: 'Why.' })
    expect(booksNow()[0]).not.toHaveProperty('author')
  })

  it('refuses a second reading book while one is already in progress', () => {
    startBook({ title: 'First', pillar: 'engineering', why: 'Why.' })
    startBook({ title: 'Second', pillar: 'health', why: 'Why.' })
    expect(booksNow()).toHaveLength(1)
    expect(booksNow()[0]?.title).toBe('First')
  })
})

describe('updateBookProgress', () => {
  it('persists a page-based progress update', () => {
    startBook({ title: 'Title', pillar: 'engineering', why: 'Why.' })
    const id = booksNow()[0]!.id
    updateBookProgress(id, { kind: 'page', page: 142 })
    expect(booksNow()[0]?.progress).toEqual({ kind: 'page', page: 142 })
  })

  it('is ignored for a book that is not currently being read', () => {
    startBook({ title: 'Title', pillar: 'engineering', why: 'Why.' })
    const id = booksNow()[0]!.id
    finishBook(id)
    updateBookProgress(id, { kind: 'page', page: 999 })
    expect(booksNow()[0]?.progress).toBeUndefined()
  })
})

describe('addBookIdea', () => {
  it('appends a dated idea', () => {
    startBook({ title: 'Title', pillar: 'engineering', why: 'Why.' })
    const id = booksNow()[0]!.id
    addBookIdea(id, 'Complexity lives somewhere; you can move it but not remove it.')
    expect(booksNow()[0]?.ideas).toEqual([
      expect.objectContaining({
        text: 'Complexity lives somewhere; you can move it but not remove it.',
      }),
    ])
  })

  it('accumulates ideas without removing earlier ones', () => {
    startBook({ title: 'Title', pillar: 'engineering', why: 'Why.' })
    const id = booksNow()[0]!.id
    addBookIdea(id, 'First idea.')
    addBookIdea(id, 'Second idea.')
    expect(booksNow()[0]?.ideas.map((idea) => idea.text)).toEqual(['First idea.', 'Second idea.'])
  })

  it('ignores a blank idea', () => {
    startBook({ title: 'Title', pillar: 'engineering', why: 'Why.' })
    addBookIdea(booksNow()[0]!.id, '   ')
    expect(booksNow()[0]?.ideas).toEqual([])
  })
})

describe('finishBook', () => {
  it('marks the book finished and mints exactly one milestone in its pillar', () => {
    startBook({ title: 'The Soul of a New Machine', pillar: 'engineering', why: 'Why.' })
    const id = booksNow()[0]!.id
    finishBook(id, 'Understood how teams actually ship hardware.')
    expect(booksNow()[0]).toMatchObject({
      status: 'finished',
      endNote: 'Understood how teams actually ship hardware.',
    })
    expect(milestonesNow()).toEqual([
      expect.objectContaining({
        text: 'Finished "The Soul of a New Machine"',
        pillar: 'engineering',
        source: { kind: 'book', id },
      }),
    ])
  })

  it('mints the milestone even without an end note', () => {
    startBook({ title: 'Title', pillar: 'health', why: 'Why.' })
    finishBook(booksNow()[0]!.id)
    expect(milestonesNow()).toHaveLength(1)
    expect(booksNow()[0]).not.toHaveProperty('endNote')
  })

  it('frees the slot for the next book', () => {
    startBook({ title: 'First', pillar: 'engineering', why: 'Why.' })
    finishBook(booksNow()[0]!.id)
    startBook({ title: 'Second', pillar: 'engineering', why: 'Why.' })
    expect(booksNow().filter((book) => book.status === 'reading')).toHaveLength(1)
  })
})

describe('setDownBook', () => {
  it('marks the book set down without minting a milestone', () => {
    startBook({ title: 'Title', pillar: 'engineering', why: 'Why.' })
    const id = booksNow()[0]!.id
    setDownBook(id, 'Not the right time for it.')
    expect(booksNow()[0]).toMatchObject({
      status: 'setDown',
      endNote: 'Not the right time for it.',
    })
    expect(milestonesNow()).toEqual([])
  })

  it('frees the slot for the next book', () => {
    startBook({ title: 'First', pillar: 'engineering', why: 'Why.' })
    setDownBook(booksNow()[0]!.id)
    startBook({ title: 'Second', pillar: 'engineering', why: 'Why.' })
    expect(booksNow().filter((book) => book.status === 'reading')).toHaveLength(1)
  })
})
