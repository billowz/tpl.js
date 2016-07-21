const _ = require('../util'),
  dom = require('../dom'),
  expression = require('../expression'),
  Binding = require('./binding'),
  config = require('../config'),
  expressionArgs = ['$el']

module.exports = _.dynamicClass({
  extend: Binding,
  constructor(el, scope, expr) {
    this.super.constructor.call(this, el, scope)
    this.expr = expression.parse(expr, expressionArgs)
    if (config.get(Binding.commentCfg)) {
      this.comment = document.createComment('Text Binding ' + expr)
      dom.before(this.comment, this.el)
    }
    this.observeHandler = this.observeHandler.bind(this)
  },
  value() {
    return this.expr.executeAll.call(this, this.scope(), this.el)
  },
  bind() {
    _.each(this.expr.identities, (ident) => {
      this.observe(ident, this.observeHandler)
    })
    this.update(this.value())
  },
  unbind() {
    _.each(this.expr.identities, (ident) => {
      this.unobserve(ident, this.observeHandler)
    })
  },
  observeHandler(attr, val) {
    if (this.expr.simplePath) {
      this.update(this.expr.applyFilter(val, this, [this.scope(), this.el]))
    } else {
      this.update(this.value())
    }
  },
  update(val) {
    if (_.isNil(val)) val = ''
    if (val !== dom.text(this.el))
      dom.text(this.el, val)
  }
})
