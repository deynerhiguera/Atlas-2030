/** Joins class names, skipping falsy values. Atlas's only class utility. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
