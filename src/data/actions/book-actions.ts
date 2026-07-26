import { nanoid } from 'nanoid'

import { hasAtMostOneReadingBook } from '@/domain/rules'
import {
  bookSchema,
  milestoneCaptureSchema,
  type Book,
  type BookProgress,
  type MilestoneCapture,
  type PillarId,
} from '@/domain/schema'

import { getCurrentDoc, replaceDoc } from '../store/atlas-store'

export interface StartBookInput {
  title: string
  author?: string
  pillar: PillarId
  why: string
}

/** I-4: at most one book with status `reading`, validated the same way askQuestion validates I-3. */
export function startBook(input: StartBookInput): void {
  const doc = getCurrentDoc()
  if (doc === null) return

  const candidate: Book = bookSchema.parse({
    id: nanoid(12),
    title: input.title.trim(),
    ...(input.author !== undefined && input.author.trim().length > 0
      ? { author: input.author.trim() }
      : {}),
    pillar: input.pillar,
    why: input.why.trim(),
    status: 'reading',
    startedAt: new Date().toISOString(),
    ideas: [],
  })

  if (!hasAtMostOneReadingBook([...doc.books, candidate])) return

  replaceDoc({ ...doc, books: [...doc.books, candidate] })
}

function findReadingBook(books: readonly Book[], bookId: string): Book | undefined {
  const target = books.find((book) => book.id === bookId)
  return target?.status === 'reading' ? target : undefined
}

/** FR-B2: progress is freely editable while the book is being read. */
export function updateBookProgress(bookId: string, progress: BookProgress): void {
  const doc = getCurrentDoc()
  if (doc === null) return

  const target = findReadingBook(doc.books, bookId)
  if (target === undefined) return

  const updated: Book = bookSchema.parse({ ...target, progress })
  replaceDoc({ ...doc, books: doc.books.map((book) => (book.id === bookId ? updated : book)) })
}

/** FR-B3: append-only ideas, captured while the book is being read. */
export function addBookIdea(bookId: string, text: string): void {
  const doc = getCurrentDoc()
  if (doc === null) return

  const trimmed = text.trim()
  if (trimmed.length === 0) return

  const target = findReadingBook(doc.books, bookId)
  if (target === undefined) return

  const updated: Book = bookSchema.parse({
    ...target,
    ideas: [
      ...target.ideas,
      { id: nanoid(12), text: trimmed, createdAt: new Date().toISOString() },
    ],
  })

  replaceDoc({ ...doc, books: doc.books.map((book) => (book.id === bookId ? updated : book)) })
}

/**
 * FR-B4: finishing sets `finished` and auto-mints a milestone in the book's
 * pillar. The milestone creation lives here, in the domain-adjacent action
 * layer, so no UI component ever has to know how a finished book becomes
 * evidence — it happens once, in the one place that mutates the document.
 */
export function finishBook(bookId: string, endNote?: string): void {
  const doc = getCurrentDoc()
  if (doc === null) return

  const target = findReadingBook(doc.books, bookId)
  if (target === undefined) return

  const trimmedNote = endNote?.trim()
  const now = new Date().toISOString()

  const updated: Book = bookSchema.parse({
    ...target,
    status: 'finished',
    endedAt: now,
    ...(trimmedNote !== undefined && trimmedNote.length > 0 ? { endNote: trimmedNote } : {}),
  })

  const milestone: MilestoneCapture = milestoneCaptureSchema.parse({
    id: nanoid(12),
    text: `Finished "${target.title}"`,
    pillar: target.pillar,
    capturedAt: now,
    source: { kind: 'book', id: target.id },
  })

  replaceDoc({
    ...doc,
    books: doc.books.map((book) => (book.id === bookId ? updated : book)),
    milestones: [...doc.milestones, milestone],
  })
}

/** FR-B5: set down with equal dignity to finishing — recorded, never mints a milestone. */
export function setDownBook(bookId: string, endNote?: string): void {
  const doc = getCurrentDoc()
  if (doc === null) return

  const target = findReadingBook(doc.books, bookId)
  if (target === undefined) return

  const trimmedNote = endNote?.trim()

  const updated: Book = bookSchema.parse({
    ...target,
    status: 'setDown',
    endedAt: new Date().toISOString(),
    ...(trimmedNote !== undefined && trimmedNote.length > 0 ? { endNote: trimmedNote } : {}),
  })

  replaceDoc({ ...doc, books: doc.books.map((book) => (book.id === bookId ? updated : book)) })
}
