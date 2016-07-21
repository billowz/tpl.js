const _ = require('./util'),
  dom = require('./dom'),
  log = require('./log'),
  {
    Directive
  } = require('./binding')

class TemplateParser {
  constructor(el, directiveReg, TextParser) {
    this.el = el
    this.directiveReg = directiveReg
    this.TextParser = TextParser
    this.parse()
  }
  clone(){
    let el = dom.cloneNode(this.el)
    return {
      el: el,
      els: dom2Array(el),
      bindings: this.bindings
    }
  }
  parse() {
    this.els = []
    this.bindings = []
    if (_.isArrayLike(this.el)) {
      _.each(el, (el) => {
        this.parseNode(el)
      })
    } else {
      this.parseNode(this.el)
    }
  }
  parseNode(el) {
    switch (el.nodeType) {
      case 1:
        this.parseElement(el)
        break
      case 3:
        this.parseText(el)
        break
    }
  }
  parseText(el) {
    let text = dom.text(el),
      parser = new this.TextParser(text),
      token, index = 0,
      els = this.els,
      bindings = this.bindings

    while (token = parser.token()) {
      this.insertText2(text.substring(index, token.start), el)
      this.insertText('binding', el)
      bindings.push({
        expression: token.token,
        index: els.length - 1,
        type: TemplateParser.TEXT
      })
      index = token.end
    }
    if (index) {
      this.insertText2(text.substr(index), el)
      dom.remove(el)
    } else {
      this.els.push(el)
    }
  }
  parseElement(el) {
    let directives = [],
      index = this.els.length - 1,
      bindings = this.bindings,
      directiveReg = this.directiveReg

    this.els.push(el)
    _.each(el.attributes, (attr) => {
      let name = attr.name
      if (directiveReg.test(name)) {
        let directive = Directive.getDirective(name.replace(directiveReg, ''))
        if (directive) {
          directives.push({
            expression: attr.value,
            index: index,
            directive: directive,
            attr: name,
            type: TemplateParser.DIRECTIVE
          })
        } else {
          log.warn(`Directive[${name}] is undefined`)
        }
      }
    })
    switch (directives.length) {
      case 0:
        break
      case 1:
        bindings.push(directives[0])
        break
      default:
        bindings.push({
          directives: directives,
          index: index,
          type: TemplateParser.DIRECTIVE_GROUP
        })
    }
    _.each(_.map(el.childNodes, (n) => n), (el) => {
      this.parseNode(el)
    })
  }
  insertText(content, before) {
    let el = document.createTextNode(content)
    dom.before(el, before)
    this.els.push(el)
    return el
  }
  insertText2(content, before) {
    if ((content = _.trim(content)))
      return this.insertText(content, before)
  }
}

module.exports = TemplateParser

_.assign(TemplateParser, {
  TEXT: 1,
  DIRECTIVE: 2,
  DIRECTIVE_GROUP: 3
})

function dom2Array(el) {
  let arr = []

  if (_.isArrayLike(el)) {
    _.each(el, (el) => {
      el2Array(el, arr)
    })
  }
  el2Array(el, arr)
  return arr
}

function el2Array(el, arr) {
  arr.push(el)
  if (el.nodeType === 1) {
    _.each(el.childNodes, (el) => {
      el2Array(el, arr)
    })
  }
}
