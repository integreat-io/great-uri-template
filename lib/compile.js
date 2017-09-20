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

  return obj
}

const component = (segment) => {
  const modifier = (/^[?&/#.;]/.test(segment)) ? segment.substr(0, 1) : null
  const list = segment.substr(modifier ? 1 : 0).split(',')
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
