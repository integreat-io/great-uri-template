import filters from './filters/index.js'
import splitTemplate from './utils/splitTemplate.js'
import splitComponent from './utils/splitComponent.js'
import type {
  CompiledTemplate,
  CompiledSegment,
  CompiledFilter,
  CompiledTemplateList,
} from './types.js'

const fixEscapedCommas = (
  args: string[],
  arg: string,
  index: number,
  array: string[],
) => {
  if (arg.slice(arg.length - 1) === '\\' && array.length > index) {
    const next = array.splice(index + 1, 1)
    return args.concat(arg.slice(0, arg.length - 1) + ',' + next[0])
  }
  return args.concat(arg)
}

const setOptional = (obj: CompiledSegment) => {
  const param = obj.param
  if (typeof param === 'string') {
    const length = param.length
    if (param.slice(length - 1) === '?') {
      obj.param = param.slice(0, length - 1)
      obj.optional = true
    }
  }
}

const setFilterFunctions = (obj: CompiledSegment) => {
  const param = obj.param
  if (param) {
    const filterParts = param.split('|')
    if (filterParts.length > 1) {
      obj.param = filterParts[0]
      obj.filters = filterParts.slice(1).map((filter) => {
        const match = /^(\w+)\(([^)]*)\)$/.exec(filter)
        const filterId = match && match.length > 1 ? match[1] : filter
        const filterObj: CompiledFilter = {
          function: filters[filterId], // eslint-disable-line security/detect-object-injection
        }
        if (match && match[2]) {
          filterObj.args = match[2]
            .split(',')
            .reduce(fixEscapedCommas, [])
            .map((arg) => arg.trim())
        }
        return filterObj
      })
    }
  }
}

const setPrefixFunction = (obj: CompiledSegment) => {
  const param = obj.param
  if (param) {
    const index = param?.indexOf(':')
    if (index > -1) {
      const key = param.slice(index + 1)
      obj.filters = [
        { function: filters.max, args: [key] },
        ...(obj.filters ?? []),
      ]
      obj.param = param.slice(0, index)
    }
  }
}

const setKey = (obj: CompiledSegment) => {
  const keyParts = obj.param?.split('=')
  if (keyParts && keyParts.length > 1) {
    obj.key = keyParts[0]
    obj.param = keyParts[1]
  }
}

const compileParam =
  (explode = false) =>
  (param: string | null, index?: number): CompiledSegment | string | null => {
    if (index === 0) {
      // Skip modifier
      return param
    }

    const obj: CompiledSegment = { param }

    setOptional(obj)
    setFilterFunctions(obj)
    setPrefixFunction(obj)
    setKey(obj)

    if (explode) {
      obj.explode = true
    }

    return obj
  }

const compileComponent = (component: string) => {
  const parts = splitComponent(component)
  if (parts.length < 2) {
    throw new TypeError(`Can't compile template with parameter '${component}'`)
  }
  const modifier = parts[0]

  if (modifier === null && parts.length === 2) {
    return compileParam()(parts[1])
  }

  const explode = modifier === '/' || modifier === '.'
  return parts.map(compileParam(explode))
}

const compileSegment = (
  segment: string,
): string | CompiledSegment | CompiledTemplateList | null => {
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
export default function compile(
  template: string | null,
): CompiledTemplate | null {
  const segments = splitTemplate(template)
  return segments.map(compileSegment)
}
