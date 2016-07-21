const _ = require('./util'),
  dom = require('./dom'),
  TemplateInstance = require('./templateInstance'),
  TextParser = require('./textParser'),
  config = require('./config'),
  Parser = require('./templateParser'),
  directiveRegCfg = 'directiveReg',
  textParserCfg = 'textParser'

config.register(directiveRegCfg, /^tpl-/)
config.register(textParserCfg, TextParser.NormalTextParser)

class Template {
  constructor(templ, cfg = {}) {
    let el = document.createElement('div')
    if (typeof templ == 'string') {
      templ = _.trim(templ)
      if (templ.charAt(0) == '<')
        el.innerHTML = templ
      else
        dom.append(el, dom.query(templ))
    } else {
      dom.append(el, templ)
    }
    this.el = el
    this.directiveReg = cfg.directiveReg || config.get('directiveReg')
    this.TextParser = cfg.TextParser || config.get('textParser')

    let parser = new Parser(el, cfg.directiveReg || config.get(directiveRegCfg), cfg.TextParser || config.get(textParserCfg))
    let clone = parser.clone()
    console.log(parser.bindings, '\n', parser.els, '\n', clone.els, '\n', el)
  }

  complie(scope) {
    return new TemplateInstance(dom.cloneNode(this.el), scope, this.TextParser, this.directiveReg)
  }
}

module.exports = Template
