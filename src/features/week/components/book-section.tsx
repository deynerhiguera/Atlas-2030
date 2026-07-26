import { memo, useState } from 'react'

import { startBook } from '@/data/actions'
import { useAtlasStore } from '@/data/store'
import { BookCard } from '@/design/components/book-card'
import { NextBookPrompt } from '@/design/components/next-book-prompt'
import { START_BOOK_BODY, START_BOOK_TITLE } from '@/design/copy'
import type { Book } from '@/domain/schema'

import { BookSheet } from './book-sheet'
import { SectionLabel } from './section-label'

const EMPTY_BOOKS: Book[] = []

/**
 * Curiosity's second half, above the systems grid. Selects only
 * `doc.books` — see QuestionSection for why this isolation matters.
 */
export const BookSection = memo(function BookSection() {
  const books = useAtlasStore((state) => state.doc?.books ?? EMPTY_BOOKS)
  const [sheetOpen, setSheetOpen] = useState(false)

  const reading = books.find((book) => book.status === 'reading')

  return (
    <section className="flex flex-col gap-3">
      <SectionLabel>Reading</SectionLabel>
      {reading !== undefined ? (
        <BookCard book={reading} onOpen={() => setSheetOpen(true)} />
      ) : (
        <NextBookPrompt title={START_BOOK_TITLE} body={START_BOOK_BODY} onStart={startBook} />
      )}
      <BookSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        {...(reading !== undefined ? { book: reading } : {})}
      />
    </section>
  )
})
