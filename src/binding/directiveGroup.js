const Binding = require('./binding'),
  Directive = require('./directive'),
  _ = require('../util'),
  {
    YieId
  } = _

module.exports = _.dynamicClass({
  extend: Binding,
  constructor(el, scope, Directives) {
    this.super.constructor.call(this, el, scope)
    this.Directives = Directives
    this.directives = []
    this.bindedCount = 0
    this.parse = this.parse.bind(this)
  },
  createDirective(cfg) {
    return new cfg.directive(this.el, this.scope, cfg.expression, cfg.attr)
  },
  parse() {
    let idx = this.bindedCount,
      directive = this.directives[idx],
      ret

    if (!directive)
      directive = this.directives[idx] = this.createDirective(this.Directives[idx])

    ret = directive.bind()
    if ((++this.bindedCount) < this.directives.length)
      (ret && ret instanceof YieId) ? ret.then(this.parse) : this.parse()
  },
  bind() {
    this.parse()
  },
  unbind() {
    let directives = this.directives,
      i = this.bindedCount

    while (i--) {
      directives[i].unbind()
    }
    this.bindedCount = 0
  }
})
