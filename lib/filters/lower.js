/**
 * Returns the value in lower case.
 * @param {string} value - The value
 * @returns {string} Lower case value
 */
function lower (value) {
  if (value === null || value === undefined) {
    return value
  }
  return String.prototype.toLowerCase.call(value)
}

module.exports = lower
