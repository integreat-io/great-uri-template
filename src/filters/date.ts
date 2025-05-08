import dateTime from 'date-and-time'
import type { FilterValue } from '../types.js'

const isDatish = (value: FilterValue | Date): value is Date =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  typeof (value as Date).getTime === 'function' &&
  typeof (value as Date).toISOString === 'function'

export default function date(
  value: FilterValue | Date,
  format?: string,
): FilterValue {
  let date
  if (typeof value === 'string' || typeof value === 'number') {
    date = new Date(value)
  } else if (isDatish(value)) {
    date = new Date(value.getTime()) // Don't know if this will every happen ...
  }

  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    if (typeof format === 'string' && format !== '') {
      if (format.endsWith('s-epoc')) {
        const ms = date.getTime()
        return format === 'ms-epoc' ? String(ms) : String(Math.round(ms / 1000))
      } else {
        return dateTime.format(date, format)
      }
    } else {
      return date.toISOString()
    }
  } else {
    return ''
  }
}
