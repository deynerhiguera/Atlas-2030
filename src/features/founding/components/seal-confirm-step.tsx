import { Button } from '@/design/primitives/button'
import { Text } from '@/design/primitives/text'
import { FOUNDING_SEAL_BODY, FOUNDING_SEAL_CANCEL, FOUNDING_SEAL_CONFIRM, FOUNDING_SEAL_TITLE } from '@/design/copy'

interface SealConfirmStepProps {
  onConfirm: () => void
  onCancel: () => void
}

/** Step 3, part one (FR-F3): one warning before an in-app-irreversible action. */
export function SealConfirmStep({ onConfirm, onCancel }: SealConfirmStepProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <Text variant="title" as="h1">
        {FOUNDING_SEAL_TITLE}
      </Text>
      <Text variant="body" as="p" muted>
        {FOUNDING_SEAL_BODY}
      </Text>
      <div className="flex items-center gap-3">
        <Button variant="solid" onClick={onConfirm} autoFocus>
          {FOUNDING_SEAL_CONFIRM}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          {FOUNDING_SEAL_CANCEL}
        </Button>
      </div>
    </div>
  )
}
