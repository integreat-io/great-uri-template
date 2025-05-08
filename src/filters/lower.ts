/**
 * Returns the value in lower case.
 */
export default function lower(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value
  }
  return String.prototype.toLowerCase.call(value)
}
