function map (value, ...mappings) {
  if (value === null || value === undefined) {
    return value
  }

  const searchFor = `${value}=`
  const mapping = mappings.find((mapping) => mapping.startsWith(searchFor))

  if (mapping) {
    return mapping.substr(searchFor.length)
  }

  return value
}

module.exports = map
