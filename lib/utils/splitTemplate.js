const returnSegment = (segment, rest = []) => {
  let parts = [segment]

  if (segment[0] !== '{') {
    const match = segment.match(/^([^?#]+)?(\?[^#]+)?(#.+)?$/)
    parts = match.slice(1)
  }

  return [...parts, ...rest]
}

const split = (template, open = true) => {
  let index = -1
  do {
    index = template.indexOf((open) ? '{' : '}', index + 1)
  } while (index !== -1 && template[index - 1] === '\\')

  if (index === -1) {
    return returnSegment(template)
  }

  const splitAt = (open) ? index : index + 1
  const segment = template.substr(0, splitAt)
  const rest = split(template.substr(splitAt), !open)

  return returnSegment(segment, rest)
}

/**
 * Split the given template into segments.
 * @param {string} template - The template to split
 * @returns {string[]} An array of string segments
 */
function splitTemplate (template) {
  if (!template) {
    return []
  }
  return split(template).filter((seg) => seg !== '' && seg !== undefined)
}

module.exports = splitTemplate
