const _ = require('./util'),
  dom = require('./dom')

module.exports = _.dynamicClass({
  constructor(el, bindings) {
    this.el = el
    this.bindings = bindings
  },
  before(target) {
    this.bind()
    dom.before(this.el, dom.query(target))
    return this
  },
  after(target) {
    this.bind()
    dom.after(this.el, dom.query(target))
    return this
  },
  prependTo(target) {
    this.bind()
    dom.prepend(dom.query(target), this.el)
    return this
  },
  appendTo(target) {
    this.bind()
    dom.append(dom.query(target), this.el)
    return this
  },
  bind() {
    if (!this.binded) {
      _.each(this.bindings, (bind) => {
        bind.bind()
      })
      this.binded = true
    }
    return this
  },
  unbind() {
    if (this.binded) {
      _.each(this.bindings, (bind) => {
        bind.unbind()
      })
      this.binded = false
    }
    return this
  },
  destroy() {
    if (this.binded)
      _.each(this.bindings, (bind) => {
        bind.unbind()
        bind.destroy()
      })
    dom.remove(this.el)
    this.bindings = undefined
    this.el = undefined
  }
})
