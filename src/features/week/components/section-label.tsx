import type { ReactNode } from 'react'

import { Text } from '@/design/primitives/text'

/** The small eyebrow heading above each of the Week screen's three sections. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Text variant="label" as="h2" muted>
      {children}
    </Text>
  )
}
