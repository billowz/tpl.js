import _ from './util'
import dom from './dom'
import log from './log'
import {
  Directive,
  DirectiveGroup,
  Text
} from './binding'

const TemplateParser = _.dynamicClass({
  statics: {
    TEXT: 1,
    DIRECTIVE: 2,
    DIRECTIVE_GROUP: 3
  },
  constructor(el, directiveReg, TextParser) {
    this.el = el
    this.directiveReg = directiveReg
    this.TextParser = TextParser
    this.parse()
  },
  createDirective(binding, cfg) {
    cfg = _.assign(cfg, binding)
    switch (binding.type) {
      case TemplateParser.TEXT:
        return new Text(cfg)
        break
      case TemplateParser.DIRECTIVE:
        return new binding.directive(cfg)
      case TemplateParser.DIRECTIVE_GROUP:
        return new DirectiveGroup(cfg)
      default:
        throw new Error('invalid binding')
    }
  },
  clone() {
    let el = dom.cloneNode(this.el)

    return {
      el: el,
      els: this.parseEls(el),
      bindings: this.bindings
    }
  },
  parseEls(el) {
    let els = []

    if (_.isArrayLike(el)) {
      _.each(el, (el) => {
        this.parseElsNode(el, els)
      })
    } else {
      this.parseElsNode(el, els)
    }
    return els
  },
  parseElsNode(el, els) {
    els.push(el)
    if (el.nodeType === 1 && this.els[els.length - 1].parsed)
      _.each(el.childNodes, (el) => {
        this.parseElsNode(el, els)
      })
  },
  parse() {
    this.els = []
    this.bindings = []
    if (_.isArrayLike(this.el)) {
      _.each(this.el, (el) => {
        this.parseNode(el, this.bindings)
      })
    } else {
      this.parseNode(this.el, this.bindings)
    }
  },
  parseNode(el, coll) {
    switch (el.nodeType) {
      case 1:
        this.parseElement(el, coll)
        break
      case 3:
        this.parseText(el, coll)
        break
    }
  },
  parseText(el, coll) {
    let text = dom.text(el),
      parser = new this.TextParser(text),
      token, index = 0,
      els = this.els

    while (token = parser.token()) {
      this.insertText2(text.substring(index, token.start), el)
      this.insertText('binding', el)
      coll.push({
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
      this.pushEl(el, false)
    }
  },
  parseElement(el, coll) {
    let directives = [],
      index = this.els.length,
      directiveReg = this.directiveReg,
      directive = undefined,
      block

    _.each(el.attributes, (attr) => {
      let name = attr.name
      if (directiveReg.test(name)) {
        let directive = Directive.getDirective(name.replace(directiveReg, ''))
        if (directive) {
          let cfg = {
            expression: attr.value,
            index: index,
            directive: directive,
            attr: name,
            type: TemplateParser.DIRECTIVE
          }
          if (Directive.isAbstract(directive)) {
            directives = [cfg]
            block = Directive.isBlock(directive)
            return false
          }
          if (Directive.isBlock(directive))
            block = true
          directives.push(cfg)
        } else {
          log.warn(`Directive[${name}] is undefined`)
        }
      }
    })

    if (directives.length == 1) {
      directive = directives[0]
    } else if (directives.length) {
      directive = {
        directives: directives.sort((a, b) => {
          return Directive.getPriority(b.directive) - Directive.getPriority(a.directive)
        }),
        index: index,
        type: TemplateParser.DIRECTIVE_GROUP
      }
    }
    if (directive) {
      coll.push(directive)
      coll = directive.children = []
    }

    this.pushEl(el, !block)
    if (!block)
      _.each(_.map(el.childNodes, (n) => n), (el) => {
        this.parseNode(el, coll)
      })
  },
  pushEl(el, parsed) {
    el.parsed = parsed
    this.els.push(el)
  },
  insertText(content, before) {
    let el = document.createTextNode(content)
    dom.before(el, before)
    this.pushEl(el, false)
    return el
  },
  insertText2(content, before) {
    if ((content = _.trim(content)))
      return this.insertText(content, before)
  }
})

export default TemplateParser
