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
  TextParserCfg = 'TextParser',
  TemplateInstance = require('./templateInstance')

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

let templateId = 0
const templateCache = {}
module.exports = _.dynamicClass({
  statics: {
    get(id) {
      return templateCache[id]
    }
  },
  constructor(templ, cfg = {}) {
    this.id = cfg.id || (templateId++)
    this.directiveReg = getConfig(cfg, directiveRegCfg)
    this.TextParser = getConfig(cfg, TextParserCfg)
    this.el = parseEl(templ, cfg.clone !== false)
    this.parser = new TemplateParser(this.el, this.directiveReg, this.TextParser)
    templateCache[this.id] = this
  },
  complie(scope) {
    let templ = this.parser.clone(),
      els = templ.els,
      bindings

    dom.append(document.createDocumentFragment(), templ.el)
    bindings = _.map(templ.bindings, (binding) => {
      return this.parser.createDirective(binding, {
        el: els[binding.index],
        scope: scope,
        template: this
      })
    })
    return new TemplateInstance(templ.el, bindings)
  }
})
