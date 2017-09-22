const filters = require('./filters')

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
        if (!paran && template[delimiters.lastIndex - 2] !== '\\') {
          array.push(template.substring(from, delimiters.lastIndex - 1).trim())
          from = delimiters.lastIndex
        }
    }
  }

  array.push(template.substring(from).trim())
  return array
}

const compileParam = (explode) => (segment) => {
  const {length} = segment

  // Optional or not
  const obj = (segment.substr(length - 1) === '?')
    ? {
      param: segment.substr(0, length - 1),
      optional: true
    }
    : {param: segment}

  // Filter functions
  const filterParts = obj.param.split('|')
  if (filterParts.length > 1) {
    obj.param = filterParts[0]
    obj.filters = filterParts.slice(1)
      .map((filter) => {
        const match = /^(\w+)\(([^)]*)\)$/.exec(filter)
        const obj = {function: filters[(match && match.length > 1) ? match[1] : filter]}
        if (match && match[2]) {
          obj.args = split(match[2]).map((filter) => filter.replace('\\,', ','))
        }
        return obj
      })
  }

  // Prefix modifier
  const prefixParts = obj.param.split(':')
  if (prefixParts.length > 1) {
    obj.param = prefixParts[0]
    obj.filters = [{function: filters.max, args: [prefixParts[1]]}].concat(obj.filters || [])
  }

  // Specified key
  const keyParts = obj.param.split('=')
  if (keyParts.length > 1) {
    obj.key = keyParts[0]
    obj.param = keyParts[1]
  }

  // Explode
  if (explode) {
    obj.explode = true
  }

  return obj
}

const compileComponent = (segment) => {
  const modifier = (/^[?&/#.;]/.test(segment)) ? segment.substr(0, 1) : null
  const list = split(segment.substr(modifier ? 1 : 0))
  const explode = (modifier === '/' || modifier === '.')
  if (modifier || list.length > 1) {
    return [modifier].concat(list.map(compileParam(explode)))
  }
  return compileParam(explode)(segment)
}

const compileSegment = (template, open = true) => {
  let index = -1
  do {
    index = template.indexOf((open) ? '{' : '}', index + 1)
  } while (template[index - 1] === '\\')

  if (index === -1) {
    return (template) ? [template] : []
  }

  let element = template.substr(0, index).replace(/\\([{}])/g, '$1')
  if (!open) {
    element = compileComponent(element)
  }

  const rest = compileSegment(template.substr(index + 1), !open)
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
