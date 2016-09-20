import Binding from './Binding'
import expression from '../expression'
import _ from '../util'
import dom from '../dom'
import config from '../config'
import log from '../log'

const expressionArgs = ['$el']

export default _.dynamicClass({
  extend: Binding,
  constructor(cfg) {
    this.super(arguments)
    this.expr = expression(cfg.expression, expressionArgs)
    if (config.get(Binding.commentCfg)) {
      this.comment = document.createComment('Text Binding ' + this.expr)
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
