import prepend from './prepend.js'
import append from './append.js'
import date from './date.js'
import upper from './upper.js'
import lower from './lower.js'
import wrap from './wrap.js'
import max from './max.js'
import map from './map.js'
import type { FilterFunction } from '../types.js'

const filters: Record<string, FilterFunction> = {
  prepend,
  append,
  date,
  upper,
  lower,
  wrap,
  max,
  map,
}

export default filters
