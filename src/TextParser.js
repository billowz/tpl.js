import _ from './util'

const TextParser = _.dynamicClass({
  constructor(text) {
    this.text = text
  },
  token() {
    throw new Error('abstract method')
  }
})

TextParser.NormalTextParser = _.dynamicClass({
  extend: TextParser,
  constructor() {
    this.super(arguments)
    this.index = 0
    this.reg = /{([^{]+)}/g
  },
  token() {
    let tk, reg = this.reg

    if (tk = reg.exec(this.text)) {
      let index = reg.lastIndex

      this.index = index
      return {
        token: tk[1],
        start: index - tk[0].length,
        end: index
      }
    }
    this.index = 0
  }
})
export default TextParser
