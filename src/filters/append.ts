/**
 * Append the given arg string to the value, unless the value is empty.
 */
export default function append(value: unknown, arg?: string | null): unknown {
  if (typeof value === 'number') {
    value = String(value)
  }

  if (typeof value !== 'string' || value === '' || typeof arg !== 'string') {
    return value
  }
  return value + arg
}
