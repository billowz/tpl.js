const _ = require('../util'),
  dom = require('../dom'),
  Binding = require('./binding'),
  dynamicDirectiveOptions = {
    extend: 'extend',
    constructor: 'constructor'
  },
  directives = {},
  config = require('../config'),
  log = require('../log')

class Directive extends Binding {
  constructor(el, tpl, expr, attr) {
    super(tpl, expr)
    this.el = el
    this.attr = attr
    dom.removeAttr(this.el, this.attr)
    if (config.get('generateComments')) {
      this.comment = document.createComment(' Directive:' + this.name + ' [' + this.expr + '] ')
      dom.before(this.comment, this.el)
    }
  }
}
Directive.prototype.abstract = false
Directive.prototype.block = false
Directive.prototype.priority = 5

_.assign(Directive, {
  getDirective(name) {
    return directives[name.toLowerCase()]
  },
  isDirective(object) {
    return _.isExtendOf(object, Directive)
  },
  register(name, option) {
    let directive

    if (_.isFunc(option)) {
      if (!_.isExtendOf(option, Directive))
        throw TypeError(`Invalid Class Constructor, ${option.name} is not extend of Directive`)
      directive = option
    } else {
      directive = _.dynamicClass(option, Directive, dynamicDirectiveOptions)
    }
    if (!directive.className)
      directive.prototype.className = directive.className = (_.hump(name) + 'Directive')
    name = name.toLowerCase()
    if (name in directives)
      throw new Error(`Directive[${name}] is existing`)

    directives[name] = directive
    log.debug('register Directive[%s]', name)
    return directive
  }
})
module.exports = Directive
