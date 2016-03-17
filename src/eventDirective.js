const _ = require('./util'),
  dom = require('./dom'),
  {Directive} = require('./directive'),
  expression = require('./expression'),
  expressionArgs = ['$el', '$event'];

function registerDirective(name, opt) {
  let cls = Directive.register(name, opt);;
  module.exports[cls.prototype.className] = cls;
}

class AbstractEventDirective extends Directive {
  constructor(el, tpl, expr, attr) {
    super(el, tpl, expr, attr);
    this.handler = _.bind.call(this.handler, this);
    this.expression = expression.parse(this.expr, expressionArgs);
  }

  handler(e) {
    let scope = this.scope(),
      ret = this.expression.execute.call(scope, scope, this.el, e);

    if (typeof ret == 'function')
      ret.call(scope, scope, this.el, e);
  }

  bind() {
    if (!super.bind())
      return false;
    dom.on(this.el, this.eventType, this.handler)
    return true;
  }

  unbind() {
    if (!super.unbind())
      return false;
    dom.off(this.el, this.eventType, this.handler)
    return true;
  }
}
module.exports = AbstractEventDirective;

const events = ['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'keydown', 'keypress', 'keyup', 'load',
  'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload', {
    name: 'oninput',
    eventType: 'input propertychange'
  }];

// register events
for (let i = 0, l = events.length; i < l; i++) {
  let name,
    opt = events[i];
  if (typeof opt == 'object') {
    name = opt.name;
  } else {
    name = 'on' + opt;
    opt = {
      eventType: opt
    }
  }
  opt.extend = AbstractEventDirective;
  registerDirective(name, opt);
}
