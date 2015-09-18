const PRIMITIVE = 0
const KEYPATH = 1
const TEXT = 0
const BINDING = 1

export function parseType(string) {
  let type = PRIMITIVE
  let value = string

  if (/^'.*'$|^".*"$/.test(string)) {
    value = string.slice(1, -1)
  } else if (string === 'true') {
    value = true
  } else if (string === 'false') {
    value = false
  } else if (string === 'null') {
    value = null
  } else if (string === 'undefined') {
    value = undefined
  } else if (isNaN(Number(string)) === false) {
    value = Number(string)
  } else {
    type = KEYPATH
  }

  return {
    type: type,
    value: value
  }
}

export function parseTemplate(template, delimiters) {
  let tokens = []
  let length = template.length
  let index = 0
  let lastIndex = 0

  while (lastIndex < length) {
    index = template.indexOf(delimiters[0], lastIndex)

    if (index < 0) {
      tokens.push({
        type: TEXT,
        value: template.slice(lastIndex)
      })
      break
    } else {
      if (index > 0 && lastIndex < index) {
        tokens.push({
          type: TEXT,
          value: template.slice(lastIndex, index)
        })
      }

      lastIndex = index + delimiters[0].length
      index = template.indexOf(delimiters[1], lastIndex)

      if (index < 0) {
        let substring = template.slice(lastIndex - delimiters[1].length)
        lastToken = tokens[tokens.length - 1]

        if (lastToken && lastToken.type === TEXT) {
          lastToken.value += substring
        } else {
          tokens.push({
            type: TEXT,
            value: substring
          })
        }
        break
      }

      let value = template.slice(lastIndex, index).trim()

      tokens.push({
        type: BINDING,
        value: value
      })

      lastIndex = index + delimiters[1].length
    }
  }

  return tokens
}
