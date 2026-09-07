import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { setHydratedDoc, useAtlasStore } from '@/data/store/atlas-store'
import { createFreshAtlasDoc, type IdentityVersion, type Letter } from '@/domain/schema'
import { PILLAR_IDS } from '@/domain/schema/pillars'

import { FoundationsScreen } from './foundations-screen'

function foundedDocFixture() {
  const doc = createFreshAtlasDoc(new Date('2026-07-08T09:00:00-05:00'), '0.0.1')

  const identity: IdentityVersion[] = PILLAR_IDS.map((pillar, index) => ({
    id: `id-${index}`,
    pillar,
    text: `My ${pillar} statement`,
    createdAt: '2026-07-08T09:00:00.000Z',
  }))

  const letter: Letter = {
    sealedBody: 'ATLAS-SEALED-V1:aGVsbG8=',
    sealedAt: '2026-07-08T09:00:00.000Z',
    opensAt: '2030-12-01',
  }

  return {
    ...doc,
    identity,
    letter,
    meta: { foundedAt: doc.meta.foundedAt, appVersionAtFounding: doc.meta.appVersionAtFounding },
  }
}

describe('FoundationsScreen', () => {
  beforeEach(() => {
    setHydratedDoc(foundedDocFixture())
  })

  it('shows the latest statement for every pillar', () => {
    render(<FoundationsScreen />)
    expect(screen.getByText('My engineering statement')).toBeInTheDocument()
    expect(screen.getByText('My spirit statement')).toBeInTheDocument()
  })

  it('shows the sealed letter marker with its open date', () => {
    render(<FoundationsScreen />)
    expect(screen.getByText('Sealed until 2030-12-01')).toBeInTheDocument()
  })

  it('renders the current, latest version when a pillar has been revised', () => {
    const doc = foundedDocFixture()
    const revised: IdentityVersion = {
      id: 'id-revised',
      pillar: 'engineering',
      text: 'A revised engineering statement',
      createdAt: '2026-08-01T09:00:00.000Z',
    }
    setHydratedDoc({ ...doc, identity: [...doc.identity, revised] })

    render(<FoundationsScreen />)
    expect(screen.getByText('A revised engineering statement')).toBeInTheDocument()
    expect(screen.queryByText('My engineering statement')).not.toBeInTheDocument()
  })

  it('shows "Not sealed" when the letter is absent', () => {
    const doc = foundedDocFixture()
    setHydratedDoc({ ...doc, letter: undefined })

    render(<FoundationsScreen />)
    expect(screen.getByText('Not sealed')).toBeInTheDocument()
  })

  it('renders nothing before the document hydrates', () => {
    useAtlasStore.setState({ doc: null, hydrated: false, hydrationError: null, autosaveError: null })
    const { container } = render(<FoundationsScreen />)
    expect(container).toBeEmptyDOMElement()
  })
})
