const _ = require('./util'),
  dom = require('./dom'),
  TextParser = require('./textParser'),
  config = require('./config')

config.register('directiveReg', /^tpl-/)
config.register('TextParser', TextParser.NormalTextParser)

function parseEl(arg){
  let el = document.createElement('div')

  if(_.isString(arg)){
    arg = _.trim(arg)
    if(arg.charAt(0) == '<'){
      dom.html(el, arg)
    }else{
      dom.append(el, dom.query(arg))
    }
  }else{
    dom.append(el, arg)
  }
  return el
}
function getConfig(cfg, name){
  return cfg[name] || config.get(name)
}
class Template {
  constructor(templ, cfg = {}) {
    this.el = parseEl(templ)
    this.parser = new Parser(el, getConfig('directiveReg'), getConfig('TextParser'))
  }
}

module.exports = Template
