const filters = require('./filters')
const splitTemplate = require('./utils/splitTemplate')
const splitComponent = require('./utils/splitComponent')

const fixEscapedCommas = (args, arg, index, array) => {
  if (arg.substr(arg.length - 1) === '\\' && array.length > index) {
    const next = array.splice(index + 1, 1)
    return args.concat(arg.substr(0, arg.length - 1) + ',' + next[0])
  }
  return args.concat(arg)
}

const setOptional = (obj) => {
  const {length} = obj.param
  if (obj.param.substr(length - 1) === '?') {
    obj.param = obj.param.substr(0, length - 1)
    obj.optional = true
  }
}

const setFilterFunctions = (obj) => {
  const filterParts = obj.param.split('|')
  if (filterParts.length > 1) {
    obj.param = filterParts[0]
    obj.filters = filterParts.slice(1)
      .map((filter) => {
        const match = /^(\w+)\(([^)]*)\)$/.exec(filter)
        const obj = {function: filters[(match && match.length > 1) ? match[1] : filter]}
        if (match && match[2]) {
          obj.args = match[2].split(',')
            .reduce(fixEscapedCommas, [])
            .map((arg) => arg.trim())
        }
        return obj
      })
  }
}

const setPrefixFunction = (obj) => {
  const index = obj.param.indexOf(':')
  if (index > -1) {
    const key = obj.param.substr(index + 1)
    obj.filters = [{function: filters.max, args: [key]}]
      .concat(obj.filters || [])
    obj.param = obj.param.substr(0, index)
  }
}

const setKey = (obj) => {
  const keyParts = obj.param.split('=')
  if (keyParts.length > 1) {
    obj.key = keyParts[0]
    obj.param = keyParts[1]
  }
}

const compileParam = (explode = false) => (param, index) => {
  if (index === 0) {
    // Skip modifier
    return param
  }

  const obj = {param}

  setOptional(obj)
  setFilterFunctions(obj)
  setPrefixFunction(obj)
  setKey(obj)

  if (explode) {
    obj.explode = true
  }

  return obj
}

const compileComponent = (component) => {
  const parts = splitComponent(component)
  if (parts.length < 2) {
    throw new TypeError(`Can't compile template with parameter '${component}'`)
  }
  const modifier = parts[0]

  if (modifier === null && parts.length === 2) {
    return compileParam()(parts[1])
  }

  const explode = (modifier === '/' || modifier === '.')
  return parts.map(compileParam(explode))
}

const compileSegment = (segment) => {
  const isComponent = segment[0] === '{'
  segment = segment.replace(/\\([{}])/g, '$1')

  if (isComponent) {
    return compileComponent(segment)
  } else {
    return segment
  }
}

/**
 * Compile the given template to a format more easily used at runtime.
 * @param {string} template - The template to compile
 * @returns {array} An array of template segments/components
 */
function compile (template) {
  const segments = splitTemplate(template)
  return segments.map(compileSegment)
}

module.exports = compile
