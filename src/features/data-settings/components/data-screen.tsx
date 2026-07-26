import { Text } from '@/design/primitives/text'

import { ExportPanel } from './export-panel'
import { ImportPanel } from './import-panel'
import { StorageStatus } from './storage-status'
import { ThemePicker } from './theme-picker'

export function DataScreen() {
  return (
    <div className="mx-auto max-w-prose-atlas px-6 py-16 md:px-0">
      <Text variant="label" as="h1" className="mb-8">
        Data &amp; Settings
      </Text>
      <ExportPanel />
      <ImportPanel />
      <ThemePicker />
      <StorageStatus />
    </div>
  )
}
