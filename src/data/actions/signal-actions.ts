import type { AtlasDoc, DayString, Signal } from '@/domain/schema'
import { todayLocal } from '@/domain/time'

import { getCurrentDoc, replaceDoc } from '../store/atlas-store'

function replaceTodaySignal(doc: AtlasDoc, today: DayString, next: Signal): AtlasDoc {
  const exists = doc.signals.some((signal) => signal.date === today)
  return {
    ...doc,
    signals: exists
      ? doc.signals.map((signal) => (signal.date === today ? next : signal))
      : [...doc.signals, next],
  }
}

/**
 * I-5: writable only for today. Energy and the one-liner are independent —
 * setting one never disturbs the other (blueprint/04's M2 widening of Signal).
 */
export function setTodayEnergy(energy: number): void {
  const doc = getCurrentDoc()
  if (doc === null) return
  const today = todayLocal()
  const current = doc.signals.find((signal) => signal.date === today)
  const next: Signal = {
    date: today,
    energy,
    ...(current?.line !== undefined ? { line: current.line } : {}),
  }
  replaceDoc(replaceTodaySignal(doc, today, next))
}

/** Trims the input; an empty line clears the field entirely rather than storing blank text. */
export function setTodayLine(rawLine: string): void {
  const doc = getCurrentDoc()
  if (doc === null) return
  const today = todayLocal()
  const trimmed = rawLine.trim()
  const current = doc.signals.find((signal) => signal.date === today)
  const next: Signal = {
    date: today,
    ...(current?.energy !== undefined ? { energy: current.energy } : {}),
    ...(trimmed.length > 0 ? { line: trimmed } : {}),
  }
  replaceDoc(replaceTodaySignal(doc, today, next))
}
