import { describe, expect, it } from 'vitest'

import { boundedText, dayStringSchema, idSchema, isoTimestampSchema } from './primitives'

describe('dayStringSchema', () => {
  it('accepts real calendar dates', () => {
    expect(dayStringSchema.safeParse('2026-07-05').success).toBe(true)
    expect(dayStringSchema.safeParse('2028-02-29').success).toBe(true) // leap day
  })

  it('rejects malformed shapes', () => {
    expect(dayStringSchema.safeParse('2026-7-5').success).toBe(false)
    expect(dayStringSchema.safeParse('07-05-2026').success).toBe(false)
    expect(dayStringSchema.safeParse('not-a-date').success).toBe(false)
  })

  it('rejects calendar-impossible dates', () => {
    expect(dayStringSchema.safeParse('2026-02-30').success).toBe(false)
    expect(dayStringSchema.safeParse('2026-13-01').success).toBe(false)
    expect(dayStringSchema.safeParse('2027-02-29').success).toBe(false) // not a leap year
  })
})

describe('isoTimestampSchema', () => {
  it('accepts timestamps with an explicit offset or Z', () => {
    expect(isoTimestampSchema.safeParse('2026-07-05T09:00:00-05:00').success).toBe(true)
    expect(isoTimestampSchema.safeParse('2026-07-05T09:00:00.123Z').success).toBe(true)
  })

  it('rejects a bare date-only string', () => {
    expect(isoTimestampSchema.safeParse('2026-07-05').success).toBe(false)
  })

  it('rejects a timestamp with no offset', () => {
    expect(isoTimestampSchema.safeParse('2026-07-05T09:00:00').success).toBe(false)
  })
})

describe('idSchema', () => {
  it('accepts opaque id-shaped strings', () => {
    expect(idSchema.safeParse('V1StGXR8_Z5j').success).toBe(true)
  })

  it('rejects strings that are too short', () => {
    expect(idSchema.safeParse('abc').success).toBe(false)
  })
})

describe('boundedText', () => {
  it('trims and enforces min/max length', () => {
    const schema = boundedText(1, 5)
    expect(schema.safeParse('  hi  ').success).toBe(true)
    expect(schema.parse('  hi  ')).toBe('hi')
    expect(schema.safeParse('').success).toBe(false)
    expect(schema.safeParse('too long').success).toBe(false)
  })

  it('allows an empty string when min is 0', () => {
    expect(boundedText(0, 5).safeParse('').success).toBe(true)
  })
})
