# 04 — Complete Data Model

The single most important document in this blueprint. Everything here is designed to be correct for a decade; changes to this document carry the repo's highest review bar.

## Global conventions

| Convention | Rule | Why |
|---|---|---|
| IDs | `nanoid(12)`, opaque, never meaningful | mergeable across devices later (see `09`); no sequence coordination |
| Timestamps | ISO 8601 **with offset** (`2026-07-05T21:40:00-05:00`) for events | preserves the lived moment across future timezones |
| Day keys | **local calendar date** `YYYY-MM-DD` for anything day-keyed (`sessions.date`, `signals.date`) | the "which day was that?" answer must match the human's answer forever; UTC day-keys are a spec violation |
| Week keys | ISO-8601 week `2026-W27`, Monday start, derived — never stored | derivable = single source of truth |
| Text | Unicode, trimmed; soft limits validated (below) | limits protect renders, not expression |
| Enums | closed string unions; extension requires a schema version bump | greppable, human-readable in exports |
| Deletion | almost nowhere (see per-entity rules) | the record is the product |

## The document

```
AtlasDoc {
  schemaVersion: number            // 1 at v0.1
  meta:       Meta
  letter:     Letter
  identity:   IdentityVersion[]    // append-only
  seasons:    Season[]
  systems:    System[]
  sessions:   SessionMark[]        // append-only + same-week delete
  questions:  Question[]
  books:      Book[]
  signals:    Signal[]             // one per date; same-day editable
  milestones: MilestoneCapture[]   // append-only
  reflections: Reflection[]        // v0.2+ · append-only
  gaps:       GapAnnotation[]      // v0.2+ · append-only
  settings:   Settings
}
```

## Entities

### Meta
`foundedAt: timestamp` · `foundingStep?: enum(letter|identity|systems|season|question|book|pulse)` (present only mid-founding; deleted at completion) · `appVersionAtFounding: string`.

### Letter
`sealedBody: string` (base64 + sentinel prefix `ATLAS-SEALED-V1:`) · `sealedAt: timestamp` · `opensAt: '2030-12-01'`. **The seal is a promise, not cryptography** — local software cannot keep secrets from its owner; the sentinel + encoding prevent *accidental* self-spoiling in exports, and no v≤2030 code path decodes it. Documented honestly here so no one "upgrades" it to fake security.

### IdentityVersion — append-only
`id` · `pillar: PillarId` · `text: string(1..600)` · `createdAt`. Current statement = latest per pillar. Revisions only happen inside ceremonies (identity check) or founding — enforced by action layer, not schema.

### Season
`id` · `name: string(1..80)` · `startDate: day` · `plannedEndDate: day` (~12 weeks, advisory — seasons end when closed, not when the calendar says) · `focusPillars: PillarId[2..3]` · `intentions: {id, text: string(1..200)}[1..3]` · **v0.3 fields:** `sealedNote?: {sealedBody, sealedAt}` · `closedAt?: timestamp` · `grades?: {intentionId, grade: IntentionGrade, note?: string(0..300)}[]` · `closingNote?: string` · `endedEarly?: boolean` (a fact, never rendered with stigma). Exactly one season lacks `closedAt` at any time (invariant I-1).

### System
`id` · `name: string(1..60)` · `pillar: PillarId` · `rhythmPerWeek: int 1..7` · `status: SystemStatus` · `createdAt` · `pausedAt?` · `retiredAt?`. Rhythm changes (v0.2, ceremonies only) append to `rhythmHistory?: {rhythmPerWeek, from: day}[]` so historical density is always computed against the rhythm *of that period* — never retroactively re-judged (decision DR-7).

### SessionMark — append-only + same-week delete
`id` · `systemId` · `date: day` · `note?: string(0..200)`. Unique `(systemId, date)` (I-2). Delete permitted only while `date` is in the current ISO week (honest-mistake window); the action layer refuses otherwise.

### Question
`id` · `text: string(1..300)` · `pillar: PillarId` · `state: QuestionState` · `askedOn: day` · `notes: {id, text: string(1..2000), createdAt}[]` (append-only) · `answeredAt?` · `answer?: string(1..20000)`. At most one question not in `answered` (I-3). "Carrying" is the absence of a transition — deliberately unmodeled; the Trail derives multi-week runs from `askedOn → answeredAt` span.

### Book
`id` · `title: string(1..200)` · `author?: string(0..120)` · `pillar: PillarId` · `why: string(1..500)` · `status: BookStatus` · `progress?: {kind:'page', page: int>0} | {kind:'percent', percent: int 0..100}` · `startedAt: timestamp` · `endedAt?` · `endNote?: string(0..1000)` ("what it changed" / set-down reason) · `ideas: {id, text: string(1..2000), createdAt}[]` (append-only). At most one book in `reading` (I-4, v0.1 UI constraint; the schema permits more so relaxing it later is a UI change, not a migration).

### Signal
`date: day` (primary key) · `energy: int 1..5` · `line?: string(0..280)`. Writable/editable only when `date` = today (I-5). No backfill — blank days are honest.

### MilestoneCapture — append-only
`id` · `text: string(1..300)` · `pillar?: PillarId` · `capturedAt` · `source?: {kind:'book'|'question', id}` (auto-mints) · **v0.2:** `note?: string(0..2000)` · `enrichedAt?`. Photos are v2+: stored as a separate idb blob store keyed by milestone id, referenced as `photoRef?: string` — binary never enters the JSON document (keeps exports readable and small).

### Reflection (v0.2) — append-only
`id` · `kind: 'weekly'` · `weekKey: string` (unique per week, I-6) · `answers: {prompt: PromptId, text}[]` · `intentionLine?: string(0..200)` · `createdAt`. Season reviews are **not** Reflections — their writing lives on `Season` (grades, closingNote), because it belongs to the season's lifecycle, not the journal stream.

### GapAnnotation (v0.2) — append-only
`id` · `startDate: day` · `endDate: day` · `label: string(1..80)` ("final exams", "rest") · `createdAt`.

### Settings
`theme: 'system'|'light'|'dark'` · `reducedMotion: 'system'|'on'` · future display prefs. Settings are the only freely-mutable entity.

## Enums

`PillarId = engineering|university|english|health|spirit|relationships` — **fixed for the decade**; display names/hues live in `domain/schema/pillars.ts` config, not in data.
`SystemStatus = active|paused|retired` · `QuestionState = open|exploring|answered` · `BookStatus = reading|finished|setDown` · `IntentionGrade = became|moved|didntMove` · `PromptId = whatMoved|whatDrained|whatLearned`.

## Invariants (enforced in `domain/rules`, tested exhaustively)

I-1 exactly one open season · I-2 one session per system per day · I-3 ≤ 1 live question · I-4 ≤ 1 reading book (action-layer) · I-5 signals same-day only · I-6 ≤ 1 weekly reflection per week · I-7 append-only types expose no update path · I-8 every `pillar` field ∈ PillarId · I-9 `identity` has ≥ 1 version per pillar post-founding · I-10 no record dated before `foundedAt` except founding-created ones.

## Validation

Zod schemas in `domain/schema/` are the **single source of truth**: TypeScript types are `z.infer`'d; imports parse against them; migrations end by parsing. Validation philosophy: **strict on structure, generous on content** — reject malformed shapes absolutely; never reject a user's words for style. Import failures report path-level messages ("`books[2].why` is empty") and touch nothing.

## Versioning & migrations

- `schemaVersion` is an integer, bumped for any change a v-1 parser would reject or misread. Additive-optional fields still bump (cheap for us, unambiguous forever).
- Planned lineage: **v1** (v0.1 core) → **v2** (reflections, gaps, milestone enrichment, rhythmHistory — app v0.2) → **v3** (season sealing/grading — app v0.3) → **v4** (final-opening artifacts — 2030).
- Each bump ships: `migrations/vN.ts` pure function · fixture `fixtures/exports/vN.json` frozen forever · chain test `v1→current` for every fixture · a changelog entry in this file's appendix.
- Migration laws: forward-only (no downgrades) · total (must handle every doc the previous schema admits) · lossless for user text (renames carry data; nothing written by the user is ever dropped by a migration) · run identically on stored docs and imports.

## Future-proofing decisions (recorded so they're deliberate)

1. **Arrays, not maps** — JSON-diff-friendly exports; order is never semantic (sort at render).
2. **Append-only collections merge by union** — the property that makes future device sync nearly free (`09`); protecting append-only *is* protecting sync.
3. **No stored derivations** (density, week keys, day counts, question-run lengths) — consistency debt is refused at the schema door.
4. **No `x`/extension escape hatch** — unknown fields are a parse error; flexibility comes only through versioned migration, or the export format rots into dialect soup by 2030.
5. **Blobs out of the document** — the JSON export must remain something a human opens in a text editor and understands.
6. **The schema permits what the UI forbids** (multiple reading books) where the restriction is a product-phase choice, so product evolution ≠ data migration.
