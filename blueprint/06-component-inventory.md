# 06 — Complete Component Inventory

Four levels. Dependencies flow strictly downward. Props are specified as informal signatures (types abbreviated; all components also accept `className` unless noted). "Phase" = when it first ships.

```
L0 tokens  →  L1 primitives  →  L2 system components  →  L3 feature compositions  →  routes
```

## L1 — Primitives (`design/primitives/`) — generic, Atlas-agnostic

| Component | Props (essence) | Responsibility | Phase |
|---|---|---|---|
| `Text` | `variant: label…monument · as? · serif?(derived from variant)` | the only way type styles are applied | v0.1 |
| `Button` | `variant: quiet\|solid\|ghost · size: sm\|md` | quiet by default; no primary-colored CTAs exist | v0.1 |
| `IconButton` | `icon · label(required, a11y)` | 16/20 Lucide only | v0.1 |
| `Chip` | `hue?: PillarId · children` | mode chips, state chips (`exploring`, `Focus`) | v0.1 |
| `Dialog` | Radix wrap; `onConfirm?` | seal warnings, import confirm; restyled fully | v0.1 |
| `Popover` | Radix wrap | session-note entry, letter marker | v0.1 |
| `Sheet` | `side: right · open · onClose` | Question/Book/Milestone sheets; focus-trapped | v0.1 |
| `TextField` / `TextArea` | controlled; `serif? · maxSoft?` | all text input; serif mode for user-voice fields | v0.1 |
| `Kbd` | `keys` | shortcut hints, `?` overlay | v0.1 |
| `Divider`, `VisuallyHidden` | — | — | v0.1 |

No Table, no Tabs, no Toast, no Spinner, no Badge, no Avatar — they have no role in Atlas and their absence is intentional.

## L2 — System components (`design/components/`) — Atlas's visual language, feature-agnostic

### Identity & narrative
| Component | Props | Responsibility | Phase |
|---|---|---|---|
| `IdentityStatement` | `text · pillar · size: room\|monument · versions?` | serif hero rendering; optional history affordance | v0.1 |
| `SealedNote` | `state: sealed\|unsealing\|open · label · opensAt? · onUnseal?` | seal visual, shimmer (letter only), **held-beat** choreography | v0.1 (letter) / v0.3 (seasons) |
| `Echo` | `text · sourceDate · onVisit?` | 1 s arrival fade; quoted, dated | v0.2 |

### Curiosity
| `QuestionCard` | `question: {text,state,askedOn} · onOpen` | week-screen presence; serif; state chip; multi-week span line | v0.1 |
| `BookCard` | `book: {title,progress,why} · onOpen` | week-screen presence; progress rendered as marginal note, not bar | v0.1 |
| `IdeaTrail` | `items: {text, createdAt}[] · onAdd?` | dated serif fragments, newest last; shared by Question notes & Book ideas | v0.1 |
| `QuestionTrail` | `questions[] · range · onSelect` | years of weekly dots; connected runs for carried questions | v1.0 |
| `Shelf` | `books[] · groupBy: year · onSelect` | pillar-hued spines; **set-down books lean** | v1.0 |

### Time & evidence
| `DensityDots` | `cells: {date, filled, hue}[] · variant: weekRow\|strip30\|yearGrid · interactive?` | THE core primitive; `role=grid` when interactive; opacity ramp + a11y labels | v0.1 (weekRow, strip30) / v1.0 (yearGrid) |
| `TimelineBand` | `span · marks: Mark[] · altitude` | pillar/year bands in Atlas | v1.0 |
| `MilestoneMark` / `MilestoneCard` | `milestone · onOpen` / `milestone · editable?` | point-of-light; expanded story | v0.2 |
| `SeasonSegment` | `season · grades?` | named span on bands | v1.0 |
| `EnergyLine` | `signals[] · range` | faint topographic underlay; never a foreground chart | v0.2 (week playback) / v1.0 |

### Input
| `SystemRow` | `system · week: WeekCells · editable · onToggle(date) · onNote(date,text)` | grid row + `n of m` chip; keyboard cell nav | v0.1 |
| `EnergyDial` | `value?: 1..5 · onChange · disabled?` | labeled slider semantics; 5 stops; drag/click/arrows | v0.1 |
| `OneLiner` | `value? · onCommit · promptRotation: string[]` | single line, Enter commits, settles in place | v0.1 |
| `CommandBar` | `open · onClose · onCommit(ParsedCommand)` | cmdk shell; grammar lives in `domain/grammar`, NOT here | v0.1 |

### Structure
| `PillarCard` | `pillar · mode · strip: cells · latestMilestone?` | pillars grid unit | v0.2 |
| `RitualFlow` | `steps: Step[] · initialStep? · onComplete · onExit(saveDraft)` | THE ceremony shell: full-screen, dim-the-world, page-turn transitions, focus trap, resume, progress-quiet (no step counter UI — pacing over progress) | v0.1 |
| `RoomShell` | `room · children` | top rail, room crossfade, keyboard room keys | v0.1 |
| `GateScreen` | `message · action?` | second-tab, small-viewport, rescue framing | v0.1 |

## L3 — Feature compositions (`features/*/components/`) — compose L2, add data

Week: `WeekHeader` `WeekGrid`(SystemRows) `TodayBand`(EnergyDial+OneLiner) `WeekFooter`(day-count ∥ Echo ∥ invitation) `PastWeekNav`.
Founding: `FoundingThreshold` `LetterStep` `SealStep` `IdentityStep` `SystemsStep` `SeasonStep` `QuestionStep` `BookStep` `FirstPulseStep` `WeekAssembly`(the exit transition).
Question: `QuestionSheet` `AnswerEditor` `AskNextPrompt` `QuestionHistory`.
Book: `BookSheet` `ProgressEditor` `FinishFlow` `SetDownFlow` `NextBookPrompt`.
Capture: `CaptureResult`(inline hue-settle confirmation).
Data: `ExportPanel` `ImportPanel` `ThemePicker` `StorageStatus`.
v0.2+: `WeekPlayback` `PromptSequence` `VisionSteps` (weekly ceremony) · `PillarDetail` `TrajectoryBand` · `EntryList` `EntryViewer` (reflect) · v0.3: `SeasonPlayback` `GradingStep` `IdentityCheckStep` `CompositionStep` `PullBack` · v1.0: `AtlasCanvas` `AltitudeControl` `CuriosityLayer` `LetterMarker`.

## Cross-cutting component rules

1. L2 components receive **plain data props** — never store hooks, never ids-to-look-up. Features do the selecting; system components stay portable and story-testable.
2. Anything rendering user words takes text, not markdown — Atlas has no rich text (a decade-stable decision; formatting ambition is scope creep wearing a nice font).
3. Every interactive component documents its keyboard contract in its file header comment.
4. Motion variants come from the shared `useMotionMode()`; components own *what* moves, tokens own *how fast*.
5. A component exceeding ~200 lines or acquiring a boolean prop that forks its render into two shapes is two components.
