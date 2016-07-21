const observer = require('observer'),
  _ = require('./util'),
  dom = require('./dom'),
  {
    Text,
    Directive,
    DirectiveGroup
  } = require('./binding')

function childNodes(el) {
  return _.map(el.childNodes, (n) => n)
}

class TemplateInstance {
  constructor(el, scope, TextParser, directiveReg) {
    this.TextParser = TextParser
    this.directiveReg = directiveReg
    this._scopeProxyListen = this._scopeProxyListen.bind(this)
    this.scope = observer.proxy.proxy(scope) || scope
    observer.proxy.on(this.scope, this._scopeProxyListen)
    this.bindings = this.parse(el, this)
    this.binded = false
    this.els = childNodes(el)
    this.bind()
  }

  parentEl() {
    return this.els[0].parentNode
  }

  before(target) {
    dom.before(this.els, dom.query(target))
    return this
  }

  after(target) {
    dom.after(this.els, dom.query(target))
    return this
  }

  prependTo(target) {
    dom.prepend(dom.query(target), this.els)
    return this
  }

  appendTo(target) {
    dom.append(dom.query(target), this.els)
    return this
  }

  bind() {
    if (!this.binded) {
      _.each(this.bindings, (bind) => {
        bind.bind()
      })
      this.binded = true
    }
    return this
  }

  unbind() {
    if (this.binded) {
      _.each(this.bindings, (bind) => {
        bind.unbind()
      })
      this.binded = false
    }
    return this
  }

  destroy() {
    observer.proxy.un(this.scope, this._scopeProxyListen)
    _.each(this.bindings, (bind) => {
      if (this.binded)
        bind.unbind()
      bind.destroy()
    })
    dom.remove(this.els)
    this.bindings = undefined
    this.scope = undefined
  }

  _scopeProxyListen(obj, proxy) {
    this.scope = proxy || obj
  }

  parse(els) {
    if (_.isArrayLike(els)) {
      let bindings = []
      _.each(els, (el) => {
        bindings.push.apply(bindings, this.parseEl(el))
      })
      return bindings
    }
    return this.parseEl(els)
  }

  parseEl(el) {
    switch (el.nodeType) {
      case 1:
        return this.parseElement(el)
      case 3:
        return this.parseText(el)
      default:
        return []
    }
  }

  parseText(el) {
    let text = el.data,
      parser = new this.TextParser(text),
      token, index = 0, bindings = []

    while(token = parser.token()){
      this.createTextNode2(text.substring(index, token.start), el)
      bindings.push(new Text(this.createTextNode('binding', el), this, token.token))
      index = token.end
    }
    if(index){
      this.createTextNode2(text.substr(index), el)
      dom.remove(el)
    }
    return bindings
  }

  parseElement(el) {
    let block = false,
      directives = [],
      attributes = el.attributes,
      attribute,
      name,
      directiveName,
      directiveConst,
      directiveConsts = []

    for (let i = 0, l = attributes.length; i < l; i++) {
      attribute = attributes[i]
      name = attribute.name
      directiveName = this.parseDirectiveName(name)
      if (directiveName) {
        directiveConst = Directive.getDirective(directiveName)
        if (directiveConst) {
          if (directiveConst.prototype.abstract) {
            block = true
            directiveConsts = [{
              const: directiveConst,
              expression: attribute.value,
              attr: name
            }]
            break
          } else {
            directiveConsts.push({
              const: directiveConst,
              expression: attribute.value,
              attr: name
            })
            if (directiveConst.prototype.block)
              block = true
          }
        } else {
          console.warn('Directive is undefined ' + name)
        }
      }
    }
    if (directiveConsts.length == 1) {
      let cfg = directiveConsts[0]
      directives.push(new cfg.const(el, this, cfg.expression, cfg.attr))
    } else if (directiveConsts.length) {
      directives.push(new DirectiveGroup(el, this, directiveConsts))
    }
    if (!block)
      directives.push.apply(directives, this.parseChildNodes(el))
    return directives
  }

  parseChildNodes(el) {
    return this.parse(childNodes(el))
  }

  parseDirectiveName(name) {
    let directiveName = name.replace(this.directiveReg, '')
    return directiveName == name ? undefined : directiveName
  }

  createTextNode(content, before) {
    let el = document.createTextNode(content)
    dom.before(el, before)
    return el
  }

  createTextNode2(content, before) {
    if ((content = _.trim(content)))
      return this.createTextNode(content, before)
    return undefined
  }
}

module.exports = TemplateInstance
