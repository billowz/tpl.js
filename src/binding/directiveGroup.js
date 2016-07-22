const Binding = require('./binding'),
  Directive = require('./directive'),
  _ = require('../util'),
  {
    YieId
  } = _

module.exports = _.dynamicClass({
  extend: Binding,
  constructor(cfg) {
    this.super(arguments)
    this.template = cfg.template
    this.directives = _.map(cfg.directives, (directive) => {
      return this.createDirective(directive)
    })
    this.bindedCount = 0
    this.bindedChildren = false
    this.parse = this.parse.bind(this)
    this.children = _.map(cfg.children, (directive) => {
      return this.createDirective(directive)
    })
  },
  createDirective(binding) {
    return this.template.parser.createDirective(binding, {
      el: this.el,
      template: this.template,
      scope: this.realScope(),
      group: this
    })
  },
  parse() {
    let idx = this.bindedCount
    if (idx < this.directives.length) {
      let directive = this.directives[idx],
        ret
      ret = directive.bind()
      this.bindedCount++;
      (ret && ret instanceof YieId) ? ret.then(this.parse): this.parse()
    } else {
      _.each(this.children, (directive) => {
        directive.bind()
      })
      this.bindedChildren = true
    }
  },
  bind() {
    this.parse()
  },
  unbind() {
    let directives = this.directives,
      i = this.bindedCount

    if (this.bindedChildren) {
      _.each(this.children, (directive) => {
        directive.unbind()
      })
      this.bindedChildren = false
    }
    while (i--) {
      directives[i].unbind()
    }
    this.bindedCount = 0
  }
})
