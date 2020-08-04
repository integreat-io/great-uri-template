const dateTime = require('date-and-time')

const isDatish = (value) =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  typeof value.getTime === 'function' &&
  typeof value.toISOString === 'function'

function date (value, format) {
  if (typeof value === 'string' || typeof value === 'number') {
    value = new Date(value)
  }
  if (isDatish(value) && !Number.isNaN(value.getTime())) {
    if (typeof format === 'string' && format !== '') {
      if (format.endsWith('s-epoc')) {
        const ms = value.getTime()
        return format === 'ms-epoc' ? String(ms) : String(Math.round(ms / 1000))
      } else {
        return dateTime.format(value, format)
      }
    } else {
      return value.toISOString()
    }
  } else {
    return ''
  }
}

module.exports = date
