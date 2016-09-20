import Binding from './Binding'
import _ from '../util'

export default _.dynamicClass({
  extend: Binding,
  constructor(cfg) {
    this.super(arguments)
    this.directives = cfg.directives
    this.children = cfg.children
    this.directiveCount = cfg.directives.length
    this.bindedCount = 0
    this.bindedChildren = false
    this._bind = this._bind.bind(this)
  },
  _bind() {
    let idx = this.bindedCount
    if (idx < this.directiveCount) {
      let directive = this.directives[idx],
        ret = directive.bind()
      this.bindedCount++;
      (ret && ret instanceof _.YieId) ? ret.then(this._bind): this._bind()
    } else if (this.children) {
      _.each(this.children, (directive) => {
        directive.bind()
      })
      this.bindedChildren = true
    }
  },
  bind() {
    this._bind()
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
