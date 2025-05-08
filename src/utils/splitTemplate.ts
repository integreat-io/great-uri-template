const returnSegment = (segment: string, rest: string[] = []) => {
  let parts = [segment]

  if (segment[0] !== '{') {
    // eslint-disable-next-line security/detect-unsafe-regex
    const match = segment.match(/^([^?#]+)?(\?[^#]+)?(#.+)?$/)
    if (match) {
      parts = match.slice(1)
    }
  }

  return [...parts, ...rest]
}

const split = (template: string, open = true): string[] => {
  let index = -1
  do {
    index = template.indexOf(open ? '{' : '}', index + 1)
  } while (index !== -1 && template[index - 1] === '\\')

  if (index === -1) {
    return returnSegment(template)
  }

  const splitAt = open ? index : index + 1
  const segment = template.slice(0, splitAt)
  const rest = split(template.slice(splitAt), !open)

  return returnSegment(segment, rest)
}

/**
 * Split the given template into segments.
 * @param {string} template - The template to split
 * @returns {string[]} An array of string segments
 */
export default function splitTemplate(template: string | null): string[] {
  if (!template) {
    return []
  }
  return split(template).filter((seg) => seg !== '' && seg !== undefined)
}
