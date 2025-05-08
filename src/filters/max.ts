/**
 * Return the `length` first characters of `value`. If `length` is higher
 * than the number of characters in value, value is returned as is.
 * @param {string} value - The value to shorten
 * @param {integer} length - The max number of characers to return
 * @returns {string} A string of maximum `length` characters
 */
export default function max(value: unknown, length: number | string): unknown {
  if (typeof length === 'string') {
    length = Number.parseInt(length)
  }
  if (
    value === null ||
    value === undefined ||
    typeof length !== 'number' ||
    Number.isNaN(length)
  ) {
    return value
  }

  return String.prototype.substring.call(value, 0, length)
}
