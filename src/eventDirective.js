const _ = require('./util'),
  {Directive} = require('./directive'),
  expression = require('./expression'),
  expressionArgs = ['$scope', '$el', '$event'];

function registerDirective(name, opt) {
  let cls = Directive.register(name, opt);;
  module.exports[cls.prototype.className] = cls;
}

export class AbstractEventDirective extends Directive {
  constructor(el, tpl, expr, attr) {
    super(el, tpl, expr, attr);
    this.handler = this.handler.bind(this);
    this.expression = expression.parse(this.expr, expressionArgs);
  }

  handler(e) {
    let ret = this.expression.execute.call(this.scope, this.scope, this.scope, this.el, e);
    if (typeof ret == 'function') {
      ret.call(this.scope, this.scope, this.scope, this.el, e);
    }
  }

  bind() {
    super.bind();
    this.$el.on(this.eventType, this.handler);
  }

  unbind() {
    super.unbind();
    this.$el.off(this.eventType, this.handler);
  }
}

const events = ['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'keydown', 'keypress', 'keyup', 'load',
  'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload', {
    name: 'oninput',
    eventType: 'input propertychange'
  }];

// register events
for (let i = 0, l = events.length; i < l; i++) {
  let name,
    opt = events[i];
  if (_.isString(opt)) {
    name = 'on' + opt;
    opt = {
      eventType: opt
    }
  } else {
    name = opt.name;
  }
  opt.extend = AbstractEventDirective;
  registerDirective(name, opt);
}
