/**
 * Prepend the given string to the value, unless the value is empty.
 * @param {string} value - The value to prepend to
 * @returns {string} The prepended result
 */
function prepend (value, string) {
  if (
    value === null || value === undefined || value === '' ||
    string === null || string === undefined
  ) {
    return value
  }
  return string + value
}

module.exports = prepend
