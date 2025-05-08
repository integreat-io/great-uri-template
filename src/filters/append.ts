import type { FilterValue } from '../types.js'

/**
 * Append the given arg string to the value, unless the value is empty.
 */
export default function append(
  value: FilterValue,
  arg?: string | null,
): FilterValue {
  if (typeof value === 'number') {
    value = String(value)
  }

  if (typeof value !== 'string' || value === '' || typeof arg !== 'string') {
    return value
  }
  return value + arg
}
