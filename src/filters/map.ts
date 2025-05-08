export default function map(value: unknown, ...mappings: string[]): unknown {
  if (typeof value !== 'string') {
    return value
  }

  const searchFor = `${value}=`
  const mapping = mappings.find((mapping) => mapping.startsWith(searchFor))

  if (mapping) {
    return mapping.slice(searchFor.length)
  }

  return value
}
