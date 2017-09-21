/**
 * Return the `length` first characters of `value`. If `length` is higher
 * than the number of characters in value, value is returned as is.
 * @param {string} value - The value to shorten
 * @param {integer} length - The max number of characers to return
 * @returns {string} A string of maximum `length` characters
 */
function max (value, length) {
  if (value === null || value === undefined || isNaN(length)) {
    return value
  }

  return String.prototype.substring.call(value, 0, length)
}

module.exports = max
