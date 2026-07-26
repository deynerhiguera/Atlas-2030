import type { AtlasDoc } from '@/domain/schema'
import { todayLocal } from '@/domain/time'

import { serializeAtlasDoc } from './serialize'

export function exportFileName(today: string = todayLocal()): string {
  return `atlas-${today}.atlas.json`
}

/** Triggers a browser download of the whole document as human-readable JSON. */
export function exportAtlas(doc: AtlasDoc): void {
  const json = serializeAtlasDoc(doc)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = exportFileName()
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
