import type { FilterValue } from '../types.js'

/**
 * Returns the value in lower case.
 */
export default function lower(value: FilterValue): FilterValue {
  if (value === null || value === undefined) {
    return value
  }
  return String.prototype.toLowerCase.call(value)
}
