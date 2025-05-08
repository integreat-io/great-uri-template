/**
 * Returns the value in upper case.
 * @param {string} value - The value
 * @returns {string} Upper case value
 */
export default function upper(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value
  }
  return String.prototype.toUpperCase.call(value)
}
