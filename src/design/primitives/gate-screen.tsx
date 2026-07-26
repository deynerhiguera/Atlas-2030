import { Button } from './button'
import { Text } from './text'

/**
 * The calm block for states where the room itself cannot render (blueprint/02,
 * /06): a second open tab, or a document that failed to load. Self-contained
 * — it does not assume RoomShell is mounted around it, since the hydration
 * failure case happens before the router exists at all.
 */
interface GateScreenAction {
  label: string
  onClick: () => void
}

interface GateScreenProps {
  title: string
  message: string
  action?: GateScreenAction
  secondaryAction?: GateScreenAction
}

export function GateScreen({ title, message, action, secondaryAction }: GateScreenProps) {
  return (
    <div className="grid min-h-screen place-items-center bg-bg px-6">
      <div className="flex max-w-prose-atlas flex-col items-center gap-6 text-center">
        <Text variant="title" as="h1">
          {title}
        </Text>
        <Text variant="body" as="p" muted>
          {message}
        </Text>
        {(action ?? secondaryAction) !== undefined && (
          <div className="flex items-center gap-3">
            {action !== undefined && (
              <Button variant="solid" onClick={action.onClick}>
                {action.label}
              </Button>
            )}
            {secondaryAction !== undefined && (
              <Button variant="ghost" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
