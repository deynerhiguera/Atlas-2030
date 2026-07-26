# 11 — Engineering Standards

The rules the maintainer of 2035 will thank the maintainer of 2026 for. Everything here is enforceable — by lint, by CI, or by checklist — because standards that live only in memory don't survive a decade.

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Files (all) | kebab-case | `system-row.tsx`, `close-question.ts` |
| Components | PascalCase export, file named after it | `SystemRow` in `system-row.tsx` |
| Hooks | `use-` file, `useX` export | `use-motion-mode.ts` |
| Actions | verb-first, domain vocabulary | `markSession`, `closeQuestion`, `setDownBook` (never `updateBook`) |
| Selectors | `select` prefix | `selectWeekView` |
| Domain functions | plain verbs/nouns, no `get` | `densityFor`, `weekKeyOf`, `dayOfBecoming` |
| Types | PascalCase, no `I`/`T` prefixes | `SessionMark`, `AtlasDoc` |
| Enums/unions | camelCase values (they appear in exports — human-readable wins) | `setDown`, `didntMove` |
| Tokens | dot-path names | `duration.settle`, `accent.engineering/50` |
| Test files | co-located `*.test.ts`; E2E in `e2e/*.spec.ts` | `density.test.ts` |
| Booleans | `is/has/can` prefixes; no negated names (`isSealed`, never `isNotOpen`) | |

**Vocabulary law:** code speaks the product language (`04 §enums`, `design/04 §voice`). A variable named `taskList` or `habitStreak` is a bug even if the code works — names are how the philosophy survives contributor-you-in-2031.

## Folder conventions

Layer layout is normative in `03`. Within a feature: `components/` · `hooks/` · `motion.ts` (if animated) · `index.ts` exporting the feature's public surface — **imports from a feature go through its index or not at all** (lint-enforced). No `utils.ts` dumping grounds: a helper either belongs to `domain`, `lib`, or beside its single caller. No `types.ts` per feature — types live with schemas (`domain`) or with their component.

## Code review checklist (self-review, PR template)

Every PR answers, in the description:

1. **Layering** — does anything import upward or across features? (CI catches; reviewer confirms intent.)
2. **Schema** — touched? If yes: migration + fixture + changelog entry present? (Auto-blocked otherwise.)
3. **Honesty surface** — does any change let the record be silently rewritten? (Append-mostly check.)
4. **Calm audit** — does any new UI count, judge, alarm, or speak first? Banned-vocab lint green?
5. **Keyboard + reduced-motion** — exercised by hand, stated in the PR ("keyboard: yes, RM: yes" is the minimum).
6. **Size** — component > 200 lines or function > 40? Split or justify in a comment.
7. **Deps** — any new package? Requires a Decision Record (below).
8. **Deletion** — did this PR leave scaffolding behind? (M2 seed-form rule generalized.)

## Accessibility checklist (per surface, from `05`)

Focus order sensible · visible focus everywhere · all interactives named · grid/slider semantics where specified · info never color-alone · `aria-live` for async settles · Esc-retreat safe (never destroys text) · axe zero-violations · 200% zoom clean.

## Performance checklist (per surface)

Renders from memory (no awaited reads in render path) · narrow store subscriptions (no whole-doc selectors in components) · lists over decade-fixture within budget · no layout thrash in animations (transform/opacity only) · assets self-hosted, fonts subsetted · bundle delta stated in PR if > 5 KB.

## Git & branch strategy

- **Trunk-based, single long-lived branch `main`, always shippable.** Milestone work on short-lived branches `m{N}-{slug}` (e.g. `m3-curiosity`), merged by PR (self-reviewed against the checklist — the PR ritual is the review, even solo), squash-merged, branch deleted.
- Tags per phase: `v0.1.0`, `v0.2.0`… Data-affecting merges (schema) get an annotated tag `schema-v{N}` on the commit that froze the fixture.
- Never rebase published history; never commit directly to `main` except docs typos.
- The repo contains no user data: real exports/backups live outside the tree (`.gitignore`: `*.atlas.json`, `backups/`).

## Commit conventions

Conventional Commits with the layer/feature as scope: `feat(question): close-with-answer flow` · `fix(time): W53 rollover in week nav` · `chore(deps): …` · `schema(v2): reflections + gaps` (custom type — schema commits must be findable in one grep). Body explains *why* when the diff can't. Reference blueprint sections when implementing them (`per blueprint/07 F13`).

## Dependency policy & Decision Records

Current runtime allowlist (11 packages) lives in `03 §dependency-graph`. Adding one requires a **Decision Record**: `blueprint/decisions/DR-{n}-{slug}.md` — context, options, decision, removal cost, and which Non-goal or principle it was tested against. DRs are append-only (superseded, never edited). Standing DRs already implied by this blueprint: DR-1 single-document store · DR-2 no TanStack Query · DR-3 no RHF · DR-4 shadcn-mechanism-not-kit · DR-5 local dates for day keys · DR-6 append-only-as-sync-strategy · DR-7 rhythm history proration · DR-8 no rich text · DR-9 single-language. Write these nine files during M0/M1 while the reasoning is fresh.

## Documentation standards

- **Blueprint is law until amended by PR** — code that diverges from `blueprint/` either fixes itself or amends the blueprint in the same PR; silent divergence is the failure mode that kills decade projects.
- Each layer directory carries a 10-line `README.md`: what belongs here, what never does.
- Comments state constraints code can't show (invariant references: `// I-3: only one live question`), never narration.
- Keyboard contracts in interactive components' file headers (`06 §rules`).
- A `CHANGELOG.md` per phase tag, written for 2035-you: what shipped, what data changed, what was deliberately not done.
- Every ceremony/journey implementation links its section of the experience designs in the PR — experience docs are acceptance criteria, not inspiration.

## Tooling gates (all CI-enforced)

TypeScript strict, no `any`/`ts-ignore` without an inline justification comment · ESLint: layering rule, feature-index rule, banned-vocab-in-strings rule, no-arbitrary-Tailwind-values rule, no-raw-color/duration rule · Prettier, zero config debates · Vitest + Playwright + axe + size-limit + Lighthouse CI as per `10` · pre-commit: lint+typecheck+unit (the < 2 min set); everything else on PR.
