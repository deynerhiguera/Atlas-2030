import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setHydratedDoc, useAtlasStore } from '@/data/store/atlas-store'
import { MotionModeOverrideContext } from '@/design/hooks/motion-mode-context'
import {
  FOUNDING_SEASON_TITLE,
  FOUNDING_SYSTEMS_TITLE,
  FOUNDING_THRESHOLD_TITLE,
} from '@/design/copy'
import { createFreshAtlasDoc, pillarLabels, PILLAR_IDS, type AtlasDoc } from '@/domain/schema'

import { FoundingScreen } from './founding-screen'

const navigateMock = vi.fn()
vi.mock('@tanstack/react-router', () => ({ useNavigate: () => navigateMock }))

const NOW = new Date('2026-07-08T09:00:00-05:00')

function doc(): AtlasDoc {
  const current = useAtlasStore.getState().doc
  if (current === null) throw new Error('doc is null')
  return current
}

/** Reduced motion collapses every held beat to ~150ms — fast enough for real (unfaked) waits in tests. */
function renderFounding() {
  return render(
    <MotionModeOverrideContext value="on">
      <FoundingScreen />
    </MotionModeOverrideContext>,
  )
}

beforeEach(() => {
  navigateMock.mockClear()
  setHydratedDoc(createFreshAtlasDoc(NOW, '0.0.1'))
})

describe('FoundingScreen — the complete ceremony', () => {
  it('walks every step end to end and lands on a founded, populated document', async () => {
    const user = userEvent.setup()
    renderFounding()

    await user.click(screen.getByRole('button', { name: 'Begin' }))

    await user.type(await screen.findByLabelText('Your letter to 2030'), 'Dear future me, I made it.')
    await user.click(screen.getByRole('button', { name: 'Seal it' }))
    await user.click(await screen.findByRole('button', { name: 'Seal the letter' }))

    await waitFor(() => expect(doc().meta.foundingStep).toBe('identity'))
    expect(doc().letter?.sealedBody.startsWith('ATLAS-SEALED-V1:')).toBe(true)

    for (const pillar of PILLAR_IDS) {
      const textarea = await screen.findByRole('textbox', {
        name: new RegExp(`identity statement for ${pillarLabels[pillar]}`, 'i'),
      })
      await user.type(textarea, `A statement for ${pillar}.`)
      await user.click(screen.getByRole('button', { name: 'Continue' }))
    }
    expect(doc().identity).toHaveLength(6)
    expect(doc().meta.foundingStep).toBe('systems')

    await user.type(await screen.findByLabelText('Name'), 'Deep Learning')
    await user.click(screen.getByRole('button', { name: '+ Add' }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(doc().systems).toHaveLength(1)
    expect(doc().meta.foundingStep).toBe('season')

    await user.type(await screen.findByLabelText('Season name'), 'Foundations')
    await user.click(screen.getByRole('button', { name: 'Engineering' }))
    await user.click(screen.getByRole('button', { name: 'Health' }))
    await user.type(screen.getByLabelText('Intention 1'), 'Ship something real')
    await user.click(screen.getByRole('button', { name: 'Begin this season' }))
    expect(doc().seasons).toHaveLength(1)
    expect(doc().meta.foundingStep).toBe('question')

    await user.type(await screen.findByLabelText('Your question'), 'Why does RAM exist?')
    await user.click(screen.getByRole('button', { name: 'Ask it' }))
    expect(doc().questions).toHaveLength(1)
    expect(doc().meta.foundingStep).toBe('book')

    await user.type(await screen.findByLabelText('Book title'), 'The Soul of a New Machine')
    await user.type(
      screen.getByLabelText("Why you're reading it"),
      'To understand how machines get built.',
    )
    await user.click(screen.getByRole('button', { name: 'Start reading' }))
    expect(doc().books).toHaveLength(1)
    expect(doc().meta.foundingStep).toBe('pulse')

    ;(await screen.findByRole('slider')).focus()
    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}')
    await user.click(screen.getByRole('button', { name: 'Enter the week' }))

    await waitFor(() => expect(doc().meta.foundingStep).toBeUndefined())
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith({ to: '/' }))
    expect(doc().signals).toEqual([expect.objectContaining({ energy: 3 })])
  })
})

describe('FoundingScreen — the letter draft survives "Keep writing"', () => {
  it('restores exactly what was typed instead of remounting an empty draft', async () => {
    const user = userEvent.setup()
    renderFounding()

    await user.click(screen.getByRole('button', { name: 'Begin' }))
    const letterField = await screen.findByLabelText('Your letter to 2030')
    await user.type(letterField, 'Dear future me, do not forget this part.')
    await user.click(screen.getByRole('button', { name: 'Seal it' }))

    await user.click(await screen.findByRole('button', { name: 'Keep writing' }))

    expect(await screen.findByLabelText('Your letter to 2030')).toHaveValue(
      'Dear future me, do not forget this part.',
    )
  })
})

describe('FoundingScreen — interruption and resume', () => {
  it('resumes at the systems step once identity is already complete', () => {
    const fresh = createFreshAtlasDoc(NOW, '0.0.1')
    setHydratedDoc({
      ...fresh,
      identity: PILLAR_IDS.map((pillar) => ({
        id: pillar,
        pillar,
        text: `A statement for ${pillar}.`,
        createdAt: NOW.toISOString(),
      })),
      meta: { ...fresh.meta, foundingStep: 'systems' },
    })
    renderFounding()
    expect(screen.getByText(FOUNDING_SYSTEMS_TITLE)).toBeInTheDocument()
  })

  it('resumes at the correct next pillar when identity is partially complete', () => {
    const fresh = createFreshAtlasDoc(NOW, '0.0.1')
    setHydratedDoc({
      ...fresh,
      identity: [
        { id: 'a', pillar: 'engineering', text: 'x', createdAt: NOW.toISOString() },
        { id: 'b', pillar: 'university', text: 'x', createdAt: NOW.toISOString() },
        { id: 'c', pillar: 'english', text: 'x', createdAt: NOW.toISOString() },
      ],
      meta: { ...fresh.meta, foundingStep: 'identity' },
    })
    renderFounding()
    expect(screen.getByText('Pillar 4 of 6')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Health' })).toBeInTheDocument()
  })

  it('always resumes the letter step at the threshold, never mid-draft', () => {
    setHydratedDoc(createFreshAtlasDoc(NOW, '0.0.1'))
    renderFounding()
    expect(screen.getByText(FOUNDING_THRESHOLD_TITLE)).toBeInTheDocument()
  })

  it('resumes at the season step with previously declared systems visible', () => {
    const fresh = createFreshAtlasDoc(NOW, '0.0.1')
    setHydratedDoc({
      ...fresh,
      systems: [
        {
          id: 's1',
          name: 'Deep Learning',
          pillar: 'engineering',
          rhythmPerWeek: 3,
          status: 'active',
          createdAt: NOW.toISOString(),
        },
      ],
      meta: { ...fresh.meta, foundingStep: 'season' },
    })
    renderFounding()
    expect(screen.getByText(FOUNDING_SEASON_TITLE)).toBeInTheDocument()
  })
})

describe('FoundingScreen — validation guides rather than blocks', () => {
  it('disables sealing an empty letter', async () => {
    const user = userEvent.setup()
    renderFounding()
    await user.click(screen.getByRole('button', { name: 'Begin' }))
    expect(await screen.findByRole('button', { name: 'Seal it' })).toBeDisabled()
  })

  it('disables continuing the systems step with nothing declared', () => {
    const fresh = createFreshAtlasDoc(NOW, '0.0.1')
    setHydratedDoc({ ...fresh, meta: { ...fresh.meta, foundingStep: 'systems' } })
    renderFounding()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })

  it('disables beginning a season with fewer than two focus pillars', async () => {
    const user = userEvent.setup()
    const fresh = createFreshAtlasDoc(NOW, '0.0.1')
    setHydratedDoc({ ...fresh, meta: { ...fresh.meta, foundingStep: 'season' } })
    renderFounding()

    await user.type(screen.getByLabelText('Season name'), 'Foundations')
    await user.type(screen.getByLabelText('Intention 1'), 'Ship something real')
    expect(screen.getByRole('button', { name: 'Begin this season' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Engineering' }))
    expect(screen.getByRole('button', { name: 'Begin this season' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Health' }))
    expect(screen.getByRole('button', { name: 'Begin this season' })).toBeEnabled()
  })

  it('disables entering the week before an energy value is recorded', () => {
    const fresh = createFreshAtlasDoc(NOW, '0.0.1')
    setHydratedDoc({ ...fresh, meta: { ...fresh.meta, foundingStep: 'pulse' } })
    renderFounding()
    expect(screen.getByRole('button', { name: 'Enter the week' })).toBeDisabled()
  })
})

describe('FoundingScreen — "Not tonight"', () => {
  it('exits the threshold cleanly and offers a way back in, without writing anything', async () => {
    const user = userEvent.setup()
    renderFounding()

    await user.click(screen.getByRole('button', { name: 'Not tonight' }))
    expect(screen.getByText("Whenever you're ready.")).toBeInTheDocument()
    expect(doc().meta.foundingStep).toBe('letter')

    await user.click(screen.getByRole('button', { name: "Actually, let's begin" }))
    expect(screen.getByText(FOUNDING_THRESHOLD_TITLE)).toBeInTheDocument()
  })
})

describe('FoundingScreen — focus management', () => {
  it('moves focus onto the new step when nothing claims it itself', () => {
    renderFounding()
    expect(document.activeElement).toHaveAttribute('tabindex', '-1')
    expect(document.activeElement?.textContent).toContain(FOUNDING_THRESHOLD_TITLE)
  })

  it("defers to a step's own autoFocus input instead of stealing focus", async () => {
    const user = userEvent.setup()
    renderFounding()
    await user.click(screen.getByRole('button', { name: 'Begin' }))
    const letterField = await screen.findByLabelText('Your letter to 2030')
    await waitFor(() => expect(document.activeElement).toBe(letterField))
  })
})

describe('FoundingScreen — full motion mode', () => {
  it('still renders and advances a step without an override forcing reduced motion', async () => {
    const user = userEvent.setup()
    render(<FoundingScreen />)

    await user.click(screen.getByRole('button', { name: 'Begin' }))
    expect(await screen.findByLabelText('Your letter to 2030')).toBeInTheDocument()
  })
})
