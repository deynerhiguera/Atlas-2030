import { Text } from '@/design/primitives/text'

interface WeekFooterProps {
  dayOfBecoming: number
}

/**
 * "Day N of becoming" — always today's count, regardless of which week is
 * being viewed (blueprint/02). The extra vertical space below it is
 * reserved, not decorative: Echo (blueprint/07 F13, v0.2) will occupy this
 * same footer, and is deliberately not implemented here.
 */
export function WeekFooter({ dayOfBecoming }: WeekFooterProps) {
  return (
    <footer className="flex min-h-16 flex-col items-center justify-center gap-2 pb-6 pt-10">
      <Text variant="label" as="p" muted className="tabular">
        Day {dayOfBecoming} of becoming
      </Text>
    </footer>
  )
}
