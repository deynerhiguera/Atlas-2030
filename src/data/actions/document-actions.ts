import type { AtlasDoc } from '@/domain/schema'

import { replaceDoc } from '../store/atlas-store'

/** The imported document has already been validated and migrated by the caller. */
export function importDoc(doc: AtlasDoc): void {
  replaceDoc(doc)
}
