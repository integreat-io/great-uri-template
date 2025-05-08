/**
 * Prepend the given string to the value, unless the value is empty.
 * @param {string} value - The value to prepend to
 * @returns {string} The prepended result
 */
export default function prepend(value: unknown, arg: string | null): unknown {
  if (typeof value === 'number') {
    value = String(value)
  }
  if (typeof value !== 'string' || value === '' || typeof arg !== 'string') {
    return value
  }
  return arg + value
}
