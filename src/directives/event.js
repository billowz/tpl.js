const _ = require('../util'),
  dom = require('../dom'),
  {
    Directive
  } = require('../binding'),
  expression = require('../expression'),
  log = require('../log'),
  expressionArgs = ['$el', '$event']

function registerDirective(name, opt) {
  let cls = Directive.register(name, opt)
  module.exports[cls.className] = cls
}

export const EventDirective = _.dynamicClass({
  extend: Directive,
  constructor() {
    this.super(arguments)
    this.handler = this.handler.bind(this)
    this.expression = expression.parse(this.expr, expressionArgs)
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
    this.bindChildren()
  },
  unbind() {
    dom.off(this.el, this.eventType, this.handler)
    this.unbindChildren()
  }
})

const events = ['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'keydown', 'keypress', 'keyup', 'load',
  'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload', {
    name: 'oninput',
    eventType: 'input propertychange'
  }
]

_.each(events, (opt) => {
  opt = _.isObject(opt) ? opt : {
    eventType: opt
  }
  opt.name = opt.name || `on${opt.eventType}`
  opt.extend = EventDirective
  registerDirective(opt.name, opt)
})
