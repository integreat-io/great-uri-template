import type {
  CompiledTemplate,
  CompiledSegment,
  CompiledTemplateList,
} from './types.js'

function encode(value: string | number, doEncodeReserved: boolean) {
  if (doEncodeReserved) {
    return encodeURIComponent(value)
  } else {
    return encodeURI(String(value))
  }
}

const expandParam =
  (
    params: Record<string, unknown>,
    useKeys = false,
    delimiter = ',',
    encodeReserved = true,
  ) =>
  ({
    param,
    key,
    filters,
    explode = false,
    optional = false,
  }: CompiledSegment): string | null | undefined => {
    // eslint-disable-next-line security/detect-object-injection
    let value = param ? params[param] : undefined

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
      value = filters.reduce<unknown>((value, filter) => {
        if (typeof filter.function === 'function') {
          const args = filter.args || []
          return filter.function(value, ...args)
        }
        return value
      }, value)
    }

    // Encode value
    if (Array.isArray(value)) {
      value = value
        .map((value) => encode(value, encodeReserved))
        .join(explode ? delimiter : ',')
    } else if (typeof value === 'string') {
      value = encode(value, encodeReserved)
    }

    // Return value
    const theKey = key || param
    if (useKeys && theKey) {
      return `${encode(theKey, encodeReserved)}=${value}`
    } else if (typeof value === 'string') {
      return value
    } else if (typeof value === 'number') {
      return String(value)
    } else {
      return null
    }
  }

const expandList = (
  params: Record<string, unknown>,
  list: CompiledTemplateList,
) => {
  const modifier = list[0] ?? ''
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

  const paramsFromList = list.slice(1)
  const parts = paramsFromList
    .filter((part) => typeof part !== 'string' && part !== null)
    .map(expandParam(params, useKeys, delimiter, encodeReserved))
    .filter((part) => part !== null)

  return (modifier === '+' ? '' : modifier) + parts.join(delimiter)
}

export default function generate(
  compiledTemplate: CompiledTemplate | null,
  params: Record<string, unknown> = {},
): string {
  if (!compiledTemplate) {
    return ''
  }

  const uri = compiledTemplate
    .map((segment) => {
      if (typeof segment === 'string') {
        return encodeURI(segment)
      }
      if (Array.isArray(segment)) {
        return expandList(params, segment)
      } else if (segment) {
        return expandParam(params)(segment)
      } else {
        return ''
      }
    })
    .join('')

  return uri
}
