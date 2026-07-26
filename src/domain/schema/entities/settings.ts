import { z } from 'zod'

import { reducedMotionSettingSchema, themeSettingSchema } from '../enums'

/** The only freely-mutable entity in the document (blueprint/04). */
export const settingsSchema = z.object({
  theme: themeSettingSchema,
  reducedMotion: reducedMotionSettingSchema,
})

export type Settings = z.infer<typeof settingsSchema>

export const defaultSettings: Settings = {
  theme: 'system',
  reducedMotion: 'system',
}
