import { describe, expect, it } from 'vitest'

import type { AtlasDoc } from '../schema/atlas-doc'
import { createFreshAtlasDoc } from '../schema/atlas-doc'
import type { Book, Question, Season, SessionMark, Signal } from '../schema/entities'

import {
  findSignal,
  hasAtMostOneLiveQuestion,
  hasAtMostOneReadingBook,
  hasAtMostOneSeason,
  isSessionInCurrentWeek,
  isSessionSlotFree,
  isSignalEditableToday,
  noRecordsBeforeFounding,
} from './invariants'

function season(overrides: Partial<Season> = {}): Season {
  return {
    id: 's1',
    name: 'Foundations',
    startDate: '2026-07-01',
    plannedEndDate: '2026-09-23',
    focusPillars: ['engineering', 'health'],
    intentions: [{ id: 'i1', text: 'Ship the first weekend' }],
    ...overrides,
  }
}

function question(overrides: Partial<Question> = {}): Question {
  return {
    id: 'q1',
    text: 'Why does RAM exist?',
    pillar: 'engineering',
    state: 'open',
    askedOn: '2026-07-01',
    notes: [],
    ...overrides,
  }
}

function book(overrides: Partial<Book> = {}): Book {
  return {
    id: 'b1',
    title: 'The Soul of a New Machine',
    pillar: 'engineering',
    why: 'To understand how machines get built.',
    status: 'reading',
    startedAt: '2026-07-01T09:00:00-05:00',
    ideas: [],
    ...overrides,
  }
}

function mark(overrides: Partial<SessionMark> = {}): SessionMark {
  return { id: 'm1', systemId: 'sys-a', date: '2026-07-01', ...overrides }
}

describe('hasAtMostOneSeason', () => {
  it('allows zero or one season', () => {
    expect(hasAtMostOneSeason([])).toBe(true)
    expect(hasAtMostOneSeason([season()])).toBe(true)
  })

  it('rejects two seasons', () => {
    expect(hasAtMostOneSeason([season({ id: 's1' }), season({ id: 's2' })])).toBe(false)
  })
})

describe('isSessionSlotFree', () => {
  it('is free when no mark exists for that system and day', () => {
    expect(isSessionSlotFree([mark()], 'sys-a', '2026-07-02')).toBe(true)
    expect(isSessionSlotFree([mark()], 'sys-b', '2026-07-01')).toBe(true)
  })

  it('is taken when a mark already exists for that exact pair', () => {
    expect(isSessionSlotFree([mark()], 'sys-a', '2026-07-01')).toBe(false)
  })
})

describe('isSessionInCurrentWeek', () => {
  it('is true for a mark dated within the same ISO week as today', () => {
    expect(isSessionInCurrentWeek(mark({ date: '2026-06-30' }), '2026-07-02')).toBe(true)
  })

  it('is false for a mark dated in a previous ISO week', () => {
    expect(isSessionInCurrentWeek(mark({ date: '2026-06-20' }), '2026-07-02')).toBe(false)
  })
})

describe('hasAtMostOneLiveQuestion', () => {
  it('allows any number of answered questions alongside zero live ones', () => {
    expect(hasAtMostOneLiveQuestion([question({ id: 'q1', state: 'answered' })])).toBe(true)
  })

  it('allows exactly one open or exploring question', () => {
    expect(hasAtMostOneLiveQuestion([question({ state: 'exploring' })])).toBe(true)
  })

  it('rejects two live questions', () => {
    expect(
      hasAtMostOneLiveQuestion([
        question({ id: 'q1', state: 'open' }),
        question({ id: 'q2', state: 'exploring' }),
      ]),
    ).toBe(false)
  })
})

describe('hasAtMostOneReadingBook', () => {
  it('allows one reading book alongside any number of finished/set-down ones', () => {
    expect(
      hasAtMostOneReadingBook([
        book({ id: 'b1', status: 'reading' }),
        book({ id: 'b2', status: 'finished' }),
      ]),
    ).toBe(true)
  })

  it('rejects two books simultaneously reading', () => {
    expect(
      hasAtMostOneReadingBook([
        book({ id: 'b1', status: 'reading' }),
        book({ id: 'b2', status: 'reading' }),
      ]),
    ).toBe(false)
  })
})

describe('isSignalEditableToday / findSignal', () => {
  const signals: Signal[] = [{ date: '2026-07-01', energy: 3 }]

  it('is editable only on its own local date', () => {
    expect(isSignalEditableToday('2026-07-01', '2026-07-01')).toBe(true)
    expect(isSignalEditableToday('2026-07-01', '2026-07-02')).toBe(false)
  })

  it('finds a signal by date', () => {
    expect(findSignal(signals, '2026-07-01')).toEqual(signals[0])
    expect(findSignal(signals, '2026-07-02')).toBeUndefined()
  })
})

describe('noRecordsBeforeFounding', () => {
  const founded = new Date(2026, 6, 5, 9, 0, 0).toISOString()

  function docWith(overrides: Partial<AtlasDoc>): AtlasDoc {
    const base = createFreshAtlasDoc(new Date(founded), '0.0.1')
    return { ...base, ...overrides }
  }

  it('accepts a document with no records before founding', () => {
    const doc = docWith({ sessions: [mark({ date: '2026-07-05' })] })
    expect(noRecordsBeforeFounding(doc)).toBe(true)
  })

  it('rejects a session dated before founding', () => {
    const doc = docWith({ sessions: [mark({ date: '2026-07-04' })] })
    expect(noRecordsBeforeFounding(doc)).toBe(false)
  })

  it('rejects a milestone timestamped before founding', () => {
    const doc = docWith({
      milestones: [{ id: 'ms1', text: 'Too early', capturedAt: '2026-07-04T10:00:00-05:00' }],
    })
    expect(noRecordsBeforeFounding(doc)).toBe(false)
  })
})
