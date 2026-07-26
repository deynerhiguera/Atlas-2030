// Shared builders for Week component tests. Not itself a test file (no
// `.test.` in the name), so Vitest never collects it as its own suite.
import { nanoid } from 'nanoid'

import {
  createFreshAtlasDoc,
  type AtlasDoc,
  type Book,
  type Question,
  type System,
} from '@/domain/schema'

export function makeSystem(overrides: Partial<System> = {}): System {
  return {
    id: nanoid(12),
    name: 'Deep Learning',
    pillar: 'engineering',
    rhythmPerWeek: 3,
    status: 'active',
    createdAt: '2026-07-01T09:00:00-05:00',
    ...overrides,
  }
}

export function makeQuestion(overrides: Partial<Question> = {}): Question {
  return {
    id: nanoid(12),
    text: 'Why does RAM exist?',
    pillar: 'engineering',
    state: 'open',
    askedOn: '2026-07-01',
    notes: [],
    ...overrides,
  }
}

export function makeBook(overrides: Partial<Book> = {}): Book {
  return {
    id: nanoid(12),
    title: 'The Soul of a New Machine',
    pillar: 'engineering',
    why: 'To understand how machines get built.',
    status: 'reading',
    startedAt: '2026-07-01T09:00:00-05:00',
    ideas: [],
    ...overrides,
  }
}

export function makeDoc(
  overrides: Partial<AtlasDoc> = {},
  founded = new Date('2026-07-01T09:00:00-05:00'),
): AtlasDoc {
  return {
    ...createFreshAtlasDoc(founded, '0.0.1'),
    ...overrides,
  }
}
