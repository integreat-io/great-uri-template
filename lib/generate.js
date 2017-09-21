const delimiterFromModifier = (modifier) => {
  switch (modifier) {
    case '?':
    case '&':
      return '&'
    case '/':
      return '/'
    case '.':
      return '.'
    case ';':
      return ';'
    default:
      return ','
  }
}

const expandParam = (params, useKeys = false, explode = false, delimiter = ',') => (param) => {
  const {filters} = param
  let value = params[param.param]

  if (value === undefined || value === null) {
    if (!param.optional) {
      throw new TypeError(`Missing required parameter '${param.param}'`)
    } else {
      return null
    }
  }

  if (filters) {
    value = filters.reduce((value, filter) => {
      if (typeof filter.function === 'function') {
        return filter.function(value, ...filter.args)
      }
      return value
    }, value)
  }

  if (Array.isArray(value)) {
    value = value.join((explode) ? delimiter : ',')
  }

  return (useKeys) ? `${param.key || param.param}=${value}` : value
}

const expandList = (list, params) => {
  const modifier = list[0]
  const useKeys = /[?&;]/.test(modifier)
  const explode = /[/.]/.test(modifier)
  const delimiter = delimiterFromModifier(modifier)
  const parts = list.slice(1)
    .map(expandParam(params, useKeys, explode, delimiter))
    .filter((part) => part !== null)

  return (modifier || '') + parts.join(delimiter)
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
