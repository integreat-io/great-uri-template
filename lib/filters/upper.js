/**
 * Returns the value in upper case.
 * @param {string} value - The value
 * @returns {string} Upper case value
 */
function upper (value) {
  if (value === null || value === undefined) {
    return value
  }
  return String.prototype.toUpperCase.call(value)
}

module.exports = upper
