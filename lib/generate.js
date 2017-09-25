const expandParam = (
  params,
  useKeys = false,
  delimiter = ',',
  encodeReserved = true
) => ({
  param,
  key,
  filters,
  explode = false,
  optional = false
}) => {
  let value = params[param]

  // Generate ISO string from Date
  if (value instanceof Date) {
    value = value.toISOString()
  }

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
        const args = filter.args || []
        return filter.function(value, ...args)
      }
      return value
    }, value)
  }

  // Encode value
  const encode = (encodeReserved) ? encodeURIComponent : encodeURI
  if (Array.isArray(value)) {
    value = value.map(encode).join((explode) ? delimiter : ',')
  } else {
    value = encode(value)
  }

  // Return value
  return (useKeys) ? `${encode(key || param)}=${value}` : value
}

const expandList = (params, list) => {
  const modifier = list[0] || ''
  let useKeys = false
  let delimiter = ','
  let encodeReserved = true

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
      break
    case '#':
    case '+':
      encodeReserved = false
  }

  const parts = list.slice(1)
    .map(expandParam(params, useKeys, delimiter, encodeReserved))
    .filter((part) => part !== null)

  return ((modifier === '+') ? '' : modifier) + parts.join(delimiter)
}

function generate (compiled, params) {
  params = params || {}

  const uri = compiled.map((segment) => {
    if (typeof segment === 'string') {
      return encodeURI(segment)
    }
    if (Array.isArray(segment)) {
      return expandList(params, segment)
    }
    return expandParam(params)(segment)
  }).join('')

  return uri
}

module.exports = generate
