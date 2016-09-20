import {
  Directive
} from '../binding'
import Template from '../template'
import expression from '../expression'
import _ from '../util'
import dom from '../dom'
import log from '../log'

const expressionArgs = ['$el', '$event']

const EventDirective = _.dynamicClass({
  extend: Directive,
  constructor() {
    this.super(arguments)
    this.handler = this.handler.bind(this)
    this.expression = expression(this.expr, expressionArgs)
  },
  handler(e) {
    e.stopPropagation()

    let scope = this.scope(),
      exp = this.expression

    if (this.expression.applyFilter(e, this, [scope, this.el, e]) !== false) {
      let fn = exp.execute.call(this, scope, this.el, e)

      if (exp.simplePath) {
        if (_.isFunc(fn)) {
          let _scope = this.propScope(exp.path[0])
          fn.call(_scope, scope, this.el, e, _scope)
        } else {
          log.warn('Invalid Event Handler:%s', this.expr, fn)
        }
      }
    }
  },
  bind() {
    dom.on(this.el, this.eventType, this.handler)
    this.super(arguments)
  },
  unbind() {
    dom.off(this.el, this.eventType, this.handler)
    this.super(arguments)
  }
})

const events = ['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'keydown', 'keypress', 'keyup', 'load',
  'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload', {
    name: 'oninput',
    eventType: 'input propertychange'
  }
]

export default _.assign(_.convert(events, (opt) => {
  let name = _.isObject(opt) ? opt.name : opt
  return _.hump(name + 'Directive')
}, (opt) => {
  if (!_.isObject(opt))
    opt = {
      eventType: opt
    }
  let name = opt.name || `on${opt.eventType}`
  opt.extend = EventDirective
  return Directive.register(name, opt)
}), {
  EventDirective
})
