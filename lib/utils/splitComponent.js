const split = (component) => {
  const array = []
  const regex = /[,()]/g
  let paran = false
  let from = 0
  let match

  while ((match = regex.exec(component)) !== null) {
    switch (match[0]) {
      case '(':
        paran = true
        break
      case ')':
        paran = false
        break
      case ',':
        if (!paran) {
          array.push(component.substring(from, regex.lastIndex - 1).trim())
          from = regex.lastIndex
        }
    }
  }

  array.push(component.substring(from).trim())

  return array
}

function splitComponent (component) {
  const match = /^\{([?&/#.;+]?).+\}$/.exec(component)
  if (!match) {
    return []
  }
  const modifier = match[1] || null
  component = component.substring((modifier) ? 2 : 1, component.length - 1)

  return [modifier, ...split(component)]
}

module.exports = splitComponent
