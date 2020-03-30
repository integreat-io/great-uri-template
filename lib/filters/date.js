const dateTime = require('date-and-time')

function date (value, format) {
  if (typeof value === 'string') {
    value = new Date(value)
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    if (typeof format === 'string' && format !== '') {
      return dateTime.format(value, format)
    } else {
      return value.toISOString()
    }
  } else {
    return ''
  }
}

module.exports = date
