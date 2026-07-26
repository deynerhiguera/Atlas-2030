import { z } from 'zod'

/** Closed enums (blueprint/04). Extension requires a schemaVersion bump. */

export const systemStatusSchema = z.enum(['active', 'paused', 'retired'])
export type SystemStatus = z.infer<typeof systemStatusSchema>

export const questionStateSchema = z.enum(['open', 'exploring', 'answered'])
export type QuestionState = z.infer<typeof questionStateSchema>

export const bookStatusSchema = z.enum(['reading', 'finished', 'setDown'])
export type BookStatus = z.infer<typeof bookStatusSchema>

export const intentionGradeSchema = z.enum(['became', 'moved', 'didntMove'])
export type IntentionGrade = z.infer<typeof intentionGradeSchema>

export const promptIdSchema = z.enum(['whatMoved', 'whatDrained', 'whatLearned'])
export type PromptId = z.infer<typeof promptIdSchema>

export const themeSettingSchema = z.enum(['system', 'light', 'dark'])
export type ThemeSetting = z.infer<typeof themeSettingSchema>

export const reducedMotionSettingSchema = z.enum(['system', 'on'])
export type ReducedMotionSetting = z.infer<typeof reducedMotionSettingSchema>
