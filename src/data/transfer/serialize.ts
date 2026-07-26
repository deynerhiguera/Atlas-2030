import type {
  AtlasDoc,
  Book,
  IdentityVersion,
  MilestoneCapture,
  Question,
  Season,
  SessionMark,
  Settings,
  Signal,
  System,
} from '@/domain/schema'

/**
 * Rebuilds every record with a canonical, declared key order before
 * stringifying (FR-D2: "stable key order, schemaVersion first"). Built
 * explicitly rather than relied on incidentally — object-spread happens to
 * preserve insertion order today, but that is an implementation detail of
 * the action layer, not a guarantee an export format should depend on.
 */

function reorderIdentity(v: IdentityVersion): IdentityVersion {
  return { id: v.id, pillar: v.pillar, text: v.text, createdAt: v.createdAt }
}

function reorderSeason(s: Season): Season {
  return {
    id: s.id,
    name: s.name,
    startDate: s.startDate,
    plannedEndDate: s.plannedEndDate,
    focusPillars: [...s.focusPillars],
    intentions: s.intentions.map((i) => ({ id: i.id, text: i.text })),
  }
}

function reorderSystem(s: System): System {
  return {
    id: s.id,
    name: s.name,
    pillar: s.pillar,
    rhythmPerWeek: s.rhythmPerWeek,
    status: s.status,
    createdAt: s.createdAt,
    ...(s.pausedAt !== undefined ? { pausedAt: s.pausedAt } : {}),
    ...(s.retiredAt !== undefined ? { retiredAt: s.retiredAt } : {}),
  }
}

function reorderSession(s: SessionMark): SessionMark {
  return {
    id: s.id,
    systemId: s.systemId,
    date: s.date,
    ...(s.note !== undefined ? { note: s.note } : {}),
  }
}

function reorderQuestion(q: Question): Question {
  return {
    id: q.id,
    text: q.text,
    pillar: q.pillar,
    state: q.state,
    askedOn: q.askedOn,
    notes: q.notes.map((n) => ({ id: n.id, text: n.text, createdAt: n.createdAt })),
    ...(q.answeredAt !== undefined ? { answeredAt: q.answeredAt } : {}),
    ...(q.answer !== undefined ? { answer: q.answer } : {}),
  }
}

function reorderBook(b: Book): Book {
  return {
    id: b.id,
    title: b.title,
    ...(b.author !== undefined ? { author: b.author } : {}),
    pillar: b.pillar,
    why: b.why,
    status: b.status,
    ...(b.progress !== undefined ? { progress: b.progress } : {}),
    startedAt: b.startedAt,
    ...(b.endedAt !== undefined ? { endedAt: b.endedAt } : {}),
    ...(b.endNote !== undefined ? { endNote: b.endNote } : {}),
    ideas: b.ideas.map((i) => ({ id: i.id, text: i.text, createdAt: i.createdAt })),
  }
}

function reorderSignal(s: Signal): Signal {
  return {
    date: s.date,
    ...(s.energy !== undefined ? { energy: s.energy } : {}),
    ...(s.line !== undefined ? { line: s.line } : {}),
  }
}

function reorderMilestone(m: MilestoneCapture): MilestoneCapture {
  return {
    id: m.id,
    text: m.text,
    ...(m.pillar !== undefined ? { pillar: m.pillar } : {}),
    ...(m.note !== undefined ? { note: m.note } : {}),
    capturedAt: m.capturedAt,
    ...(m.source !== undefined ? { source: m.source } : {}),
  }
}

function reorderSettings(s: Settings): Settings {
  return { theme: s.theme, reducedMotion: s.reducedMotion }
}

function canonicalize(doc: AtlasDoc): AtlasDoc {
  return {
    schemaVersion: doc.schemaVersion,
    meta: {
      foundedAt: doc.meta.foundedAt,
      appVersionAtFounding: doc.meta.appVersionAtFounding,
      ...(doc.meta.foundingStep !== undefined ? { foundingStep: doc.meta.foundingStep } : {}),
    },
    ...(doc.letter !== undefined
      ? {
          letter: {
            sealedBody: doc.letter.sealedBody,
            sealedAt: doc.letter.sealedAt,
            opensAt: doc.letter.opensAt,
          },
        }
      : {}),
    identity: doc.identity.map(reorderIdentity),
    seasons: doc.seasons.map(reorderSeason),
    systems: doc.systems.map(reorderSystem),
    sessions: doc.sessions.map(reorderSession),
    questions: doc.questions.map(reorderQuestion),
    books: doc.books.map(reorderBook),
    signals: doc.signals.map(reorderSignal),
    milestones: doc.milestones.map(reorderMilestone),
    settings: reorderSettings(doc.settings),
  }
}

/** Pretty-printed, key-order-stable JSON — a human should be able to open this in a text editor. */
export function serializeAtlasDoc(doc: AtlasDoc): string {
  return JSON.stringify(canonicalize(doc), null, 2)
}
