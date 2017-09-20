const split = (template) => {
  const array = []
  const delimiters = /[,()]/g
  let paran = false
  let from = 0
  let match

  while ((match = delimiters.exec(template)) !== null) {
    switch (match[0]) {
      case '(':
        paran = true
        break
      case ')':
        paran = false
        break
      case ',':
        if (!paran) {
          array.push(template.substring(from, delimiters.lastIndex - 1))
          from = delimiters.lastIndex
        }
    }
  }

  array.push(template.substring(from))
  return array
}

const param = (segment) => {
  const {length} = segment

  // Optional or not
  const obj = (segment.substr(length - 1) === '?')
    ? {
      param: segment.substr(0, length - 1),
      optional: true
    }
    : {param: segment}

  // Specified key
  const keyParts = obj.param.split('=')
  if (keyParts.length > 1) {
    obj.key = keyParts[0]
    obj.param = keyParts[1]
  }

  // Filter functions
  const filterParts = obj.param.split('|')
  if (filterParts.length > 1) {
    obj.param = filterParts[0]
    obj.filters = filterParts.slice(1)
      .map((filter) => {
        const match = /^(\w+)\(([^)]*)\)$/.exec(filter)
        if (match && match.length > 1) {
          return [match[1], match[2] || null]
        } else {
          return [filter, null]
        }
      })
      .reduce((array, filter) => array.concat(filter), [])
  }

  // Prefix modifier
  const prefixParts = obj.param.split(':')
  if (prefixParts.length > 1) {
    obj.param = prefixParts[0]
    obj.filters = ['max', prefixParts[1]].concat(obj.filters || [])
  }

  return obj
}

const component = (segment) => {
  const modifier = (/^[?&/#.;]/.test(segment)) ? segment.substr(0, 1) : null
  const list = split(segment.substr(modifier ? 1 : 0))
  if (modifier || list.length > 1) {
    return [modifier].concat(list.map(param))
  }
  return param(segment)
}

const compileSegment = (template, open = true) => {
  const index = template.indexOf((open) ? '{' : '}')
  if (index === -1) {
    return []
  }

  const rest = compileSegment(template.substr(index + 1), !open)
  const segment = template.substr(0, index)
  const element = (open) ? segment : component(segment)

  if (element !== '') {
    return [element, ...rest]
  }
  return rest
}

/**
 * Compile the given template to a format more easily used at runtime.
 * @param {string} template - The template to compile
 * @returns {array} An array of template segments/components
 */
function compile (template) {
  return compileSegment(template)
}

module.exports = compile
