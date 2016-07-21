const _ = require('./util'),
  dom = require('./dom'),
  {
    Text,
    DirectiveGroup
  } = require('./binding'),
  TextParser = require('./textParser'),
  config = require('./config'),
  TemplateParser = require('./templateParser'),
  directiveRegCfg = 'directiveReg',
  TextParserCfg = 'TextParser'

config.register(directiveRegCfg, /^tpl-/)
config.register(TextParserCfg, TextParser.NormalTextParser)

function parseEl(templ, clone) {
  if (_.isString(templ)) {
    templ = _.trim(templ)
    if (templ.charAt(0) == '<') {
      let el = document.createElement('div')
      dom.html(el, templ)
      return el.childNodes
    }
    templ = dom.query(templ)
  }
  return clone ? dom.cloneNode(templ) : templ
}

function getConfig(cfg, name) {
  return cfg[name] || config.get(name)
}

class Template {
  constructor(templ, cfg = {}) {
    this.parser = new TemplateParser(parseEl(templ, cfg.clone !== false),
      getConfig(cfg, directiveRegCfg), getConfig(cfg, TextParserCfg))
  }
  complie(scope) {
    let templ = this.parser.clone(),
      els = templ.els,
      bindings = _.map(templ.bindings, (binding) => {
        let el = els[binding.index]
        switch (binding.type) {
          case TemplateParser.TEXT:
            return new Text(el, scope, binding.expression)
            break
          case TemplateParser.DIRECTIVE:
            return new binding.directive(el, scope, binding.expression, binding.attr)
            break
          case TemplateParser.DIRECTIVE_GROUP:
            return new DirectiveGroup(el, scope, binding.directives)
            break
          default:
            throw new Error('invalid binding')
        }
      })
      console.log(bindings)
  }
}

class TemplateInstance {
  constructor(scope, tmpl) {
    this.scope = scope
    this.el = _.map(tmpl.el.childNodes, (n) => n)
    dom.remove(this.el)
  }

  before(target) {
    dom.before(this.el, dom.query(target))
    return this
  }

  after(target) {
    dom.after(this.el, dom.query(target))
    return this
  }

  prependTo(target) {
    dom.prepend(dom.query(target), this.el)
    return this
  }

  appendTo(target) {
    dom.append(dom.query(target), this.el)
    return this
  }

  destroy() {
    dom.remove(this.el)
    this.bindings = undefined
    this.scope = undefined
  }
}
module.exports = Template
