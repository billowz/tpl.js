import TextParser from './TextParser'
import DirectiveParser from './DirectiveParser'
import Template from './Template'
import {
  Directive,
  DirectiveGroup,
  Text
} from '../binding'
import _ from '../util'
import dom from '../dom'
import log from '../log'
import config from '../config'

config.register('directiveParser', new DirectiveParser(), [DirectiveParser])
config.register('TextParser', TextParser, [{
  cls: TextParser,
  type: config.TYPE
}])

const TEXT = 1,
  DIRECTIVE = 2,
  DIRECTIVE_GROUP = 3

const DomParser = _.dynamicClass({
  constructor(el, clone) {
    this.el = this.parseEl(el, clone)
    this.directiveParser = config.get('directiveParser')
    this.TextParser = config.get('TextParser')
    this.parse()
  },
  complie(scope) {
    let el = dom.cloneNode(this.el),
      els = this.parseEls(el),
      bindings = this.parseBindings(this.bindings, scope, els)
    return new Template(el, bindings)
  },
  parseBindings(descs, scope, els) {
    return _.map(descs, (desc) => {
      let type = desc.type,
        cfg = {
          el: els[desc.index],
          scope: scope
        }

      if (type === TEXT) {
        cfg.expression = desc.expression
        return new Text(cfg)
      }

      let Const
      if (type === DIRECTIVE) {
        Const = desc.directive
        cfg.expression = desc.expression
        cfg.attr = desc.attr
        cfg.domParser = desc.domParser
        cfg.independent = desc.independent
      } else {
        Const = DirectiveGroup
        cfg.directives = _.map(desc.directives, desc => {
          return new desc.directive({
            el: cfg.el,
            scope: scope,
            expression: desc.expression,
            attr: desc.attr
          })
        })
      }
      cfg.block = desc.block
      cfg.children = desc.children ? this.parseBindings(desc.children || [], scope, els) : undefined
      return new Const(cfg)
    })
  },
  parseEls(el) {
    let index = 0,
      tempEls = this.els
    return this.eachDom(el, [], function(el, els) {
      els.push(el)
      return tempEls[index++].marked && els
    }, function(el, els) {
      els.push(el)
      index++
    })
  },
  parseEl(el, clone) {
    if (_.isString(el)) {
      el = _.trim(el)
      if (el.charAt(0) == '<') {
        let templ = document.createElement('div')
        dom.html(templ, el)
        el = templ.childNodes
      }
      el = dom.query(el)
    } else if (clone) {
      el = dom.cloneNode(el)
    }
    return el
  },
  eachDom(el, data, elemHandler, textHandler) {
    if (_.isArrayLike(el)) {
      _.each(this.el, (el) => {
        this._eachDom(el, data, elemHandler, textHandler)
      })
    } else {
      this._eachDom(el, data, elemHandler, textHandler)
    }
    return data
  },
  _eachDom(el, data, elemHandler, textHandler) {
    switch (el.nodeType) {
      case 1:
        if (data = elemHandler(el, data))
          _.each(_.map(el.childNodes, (n) => n), (el) => {
            this._eachDom(el, data, elemHandler, textHandler)
          })
        break
      case 3:
        textHandler(el, data)
        break
    }
  },
  parse() {
    let els = [],
      index = 0,
      TextParser = this.TextParser,
      directiveParser = this.directiveParser

    function markEl(el, marked) {
      if (el) {
        el.marked = marked
        els.push(el)
        index++
      }
      return el
    }
    this.els = els
    this.bindings = this.eachDom(this.el, [], (el, bindings) => {
      let directives = [],
        block = false,
        independent = false,
        desc

      _.each(el.attributes, (attr) => {
        let name = attr.name,
          directive

        if (!directiveParser.isDirective(name))
          return

        if (!(directive = directiveParser.getDirective(name))) {
          log.warn(`Directive[${name}] is undefined`)
          return
        }
        let desc = {
          type: DIRECTIVE,
          index: index,
          expression: attr.value,
          directive: directive,
          attr: name,
          block: Directive.isBlock(directive),
          independent: Directive.isIndependent(directive)
        }
        if (desc.independent) {
          desc.block = block = independent = true
          directives = [desc]
          return false
        } else if (desc.block) {
          block = true
        }
        directives.push(desc)
      })

      if (!directives.length) {
        markEl(el, true)
        return bindings
      }

      if (directives.length == 1) {
        desc = directives[0]
      } else {
        desc = {
          type: DIRECTIVE_GROUP,
          index: index,
          directives: directives.sort((a, b) => {
            return (Directive.getPriority(b.directive) - Directive.getPriority(a.directive)) || 0
          }),
          block: block,
          independent: independent
        }
      }
      desc.children = !block && []

      bindings.push(desc)
      if (independent) {
        let childEl = dom.cloneNode(el, false)
        dom.removeAttr(childEl, directives[0].attr)
        dom.append(childEl, _.map(el.childNodes, (n) => n))
        desc.domParser = new DomParser(childEl, false)
      }
      markEl(el, !block)
      return desc.children
    }, (el, bindings) => {
      let expr = dom.text(el),
        parser = new TextParser(expr),
        token,
        i = 0

      while (token = parser.nextToken()) {
        if (i < token.start)
          markEl(this.insertNotBlankText(expr.substring(i, token.start), el), false)
        bindings.push({
          type: TEXT,
          index: index,
          expression: token.token
        })
        markEl(this.insertText('binding', el), false)
        i = token.end
      }
      if (i) {
        markEl(this.insertNotBlankText(expr.substr(i), el), false)
        dom.remove(el)
      } else {
        markEl(el, false)
      }
    })

  },
  insertNotBlankText(content, before) {
    if ((content = _.trim(content)))
      return this.insertText(content, before)
    return null;
  },
  insertText(content, before) {
    let el = document.createTextNode(content)
    dom.before(el, before)
    return el
  }
})
export default DomParser
