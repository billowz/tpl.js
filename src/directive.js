
const _ = require('lodash'),
  $ = require('jquery'),
  observer = require('observer'),
  ExpressionReg = /[\+\-\*/\(\)]/g;

class Expression {
  constructor(bind, expression) {
    this.bind = bind;
    this.expression = expression;
  }
  getValue() {
    return _.get(this.bind, this.expression);
  }
  observe(callback) {
    return observer.observe(this.bind, this.expression, callback);
  }
  unobserve(callback) {
    return observer.unobserve(this.bind, this.expression, callback);
  }
}

class AbstractDirective {
  constructor(el, bind, expr) {
    this.el = el;
    this.nodeType = el.nodeType;
    this.target = bind;
    this.expr = expr;
  }
  bind() {
    throw 'Abstract Method [bind]';
  }
  unbind() {
    throw 'Abstract Method [unbind]';
  }
  isBlock() {
    throw 'Abstract Method [unbind]';
  }
}


class TextDirective extends AbstractDirective {
  constructor(el, bind, expression) {
    super(el, bind, expression);
    this.expression = new Expression(bind, expression);
    this.update = this.update.bind(this);
  }

  bind() {
    let ret = this.expression.observe(this.update);
    this.update();
    return ret;
  }

  unbind() {
    return this.expression.unobserve(this.update);
  }

  isBlock() {
    return true;
  }

  update() {
    this.el.data = this.expression.getValue();
  }
}

let directives = {},
  defaultDirectiveOpt = {
    block: false,
    bind: function() {},
    unbind: function() {}
  };
function registerDirective(name, directive) {
  if (name in directives) {
    console.warn('Directive[' + name + '] is defined');
  }
  directive = (function(opt) {
    let constructor = _.isFunction(opt.constructor) ? opt.constructor : undefined;
    delete opt.constructor;

    function Directive() {
      this.prototype = Object.create(AbstractDirective.prototype, {
        constructor: {
          value: this,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      Object.setPrototypeOf ? Object.setPrototypeOf(this, AbstractDirective) : this.__proto__ = AbstractDirective;

      AbstractDirective.apply(this, arguments);
      if (constructor) {
        constructor.apply(this, arguments);
      }
    }
    _.assign(TextDirective.prototype, opt);
    return Directive;
  })(directive);
  directives[name] = directive;
  return directive;
}

function getDirective(name) {
  return directives[name];
}

module.exports = {
  AbstractDirective: AbstractDirective,
  TextDirective: TextDirective,
  registerDirective: registerDirective,
  getDirective: getDirective
}
