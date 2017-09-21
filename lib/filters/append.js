/**
 * Append the given string to the value, unless the value is empty.
 * @param {string} value - The value to append to
 * @returns {string} The appended result
 */
function append (value, string) {
  if (
    value === null || value === undefined || value === '' ||
    string === null || string === undefined
  ) {
    return value
  }
  return value + string
}

module.exports = append
