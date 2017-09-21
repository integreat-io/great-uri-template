const expandParam = (params, useKeys = false, delimiter = ',') => ({
  param,
  key,
  filters,
  explode = false,
  optional = false
}) => {
  let value = params[param]

  // Required parameters
  if (value === undefined || value === null) {
    if (!optional) {
      throw new TypeError(`Missing required parameter '${param}'`)
    } else {
      return null
    }
  }

  // Filters
  if (filters) {
    value = filters.reduce((value, filter) => {
      if (typeof filter.function === 'function') {
        return filter.function(value, ...filter.args)
      }
      return value
    }, value)
  }

  // Array value
  if (Array.isArray(value)) {
    value = value.join((explode) ? delimiter : ',')
  }

  // Return value
  return (useKeys) ? `${key || param}=${value}` : value
}

const expandList = (list, params) => {
  const modifier = list[0] || ''
  let useKeys = false
  let delimiter = ','

  switch (modifier) {
    case '?':
    case '&':
      delimiter = '&'
      useKeys = true
      break
    case '/':
    case '.':
      delimiter = modifier
      break
    case ';':
      delimiter = modifier
      useKeys = true
  }

  const parts = list.slice(1)
    .map(expandParam(params, useKeys, delimiter))
    .filter((part) => part !== null)

  return modifier + parts.join(delimiter)
}

function generate (compiled, params) {
  return compiled.map((segment) => {
    if (typeof segment === 'string') {
      return segment
    } else if (Array.isArray(segment)) {
      return expandList(segment, params)
    }

    return expandParam(params)(segment)
  }).join('')
}

module.exports = generate
