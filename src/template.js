import _ from './util'
import dom from './dom'
import {
  Text,
  DirectiveGroup
} from './binding'
import TextParser from './TextParser'
import config from './config'
import TemplateParser from './TemplateParser'
import TemplateInstance from './templateInstance'

const directiveRegCfg = 'directiveReg',
  textParserCfg = 'textParser'

config.register(directiveRegCfg, /^tpl-/)
config.register(textParserCfg, TextParser.NormalTextParser)

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
export default _.dynamicClass({
  statics: {
    get(id) {
      return templateCache[id]
    }
  },
  constructor(templ, cfg = {}) {
    this.id = cfg.id || (templateId++)
    this.directiveReg = getConfig(cfg, directiveRegCfg)
    this.TextParser = getConfig(cfg, textParserCfg)
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
      return this.parser.createBinding(binding, {
        el: els[binding.index],
        els: els,
        scope: scope,
        template: this
      })
    })
    return new TemplateInstance(templ.el, bindings)
  }
})
