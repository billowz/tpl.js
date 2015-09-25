const _ = require('lodash'),
  $ = require('jquery'),
  observer = require('observer'),
  ExpressionReg = /[\+\-\*/\(\)]/g;

class AbstractDirective {
  constructor(el, templateInst, expr) {
    this.el = el;
    this.nodeType = el.nodeType;
    this.template = templateInst;
    this.target = templateInst.bind;
    this.expr = expr;
    if (!this.directiveName) {
      this.directiveName = this.constructor.name;
    }
  }

  getDirectiveClassName() {
    return this.constructor.name ? this.constructor.name : (_.capitalize(this.directiveName) + 'Directive');
  }

  bind() {
    throw 'Abstract Method [' + this.getDirectiveClassName() + '.bind]';
  }

  unbind() {
    throw 'Abstract Method [' + this.getDirectiveClassName() + '.unbind]';
  }

  isBlock() {
    return false;
  }
}

let directives = {},
  defaultDirectiveOpt = {
    block: false,
    bind: function() {},
    unbind: function() {}
  };
function isDirective(object) {
  let type = typeof object;
  if (!object || (type != 'function' && type != 'object')) {
    return false;
  }
  let proto = object;
  while ((proto = Object.getPrototypeOf(proto))) {
    if (proto === AbstractDirective) {
      return true;
    }
  }
  return false;
}
function register(name, option) {
  if (name in directives) {
    console.warn('Directive[' + name + '] is defined');
  }
  let directive;
  if (_.isPlainObject(option)) {
    directive = (function(opt) {
      let constructor = _.isFunction(opt.constructor) ? opt.constructor : undefined;
      delete opt.constructor;

      let Directive = (function() {
        return function() {
          if (!(this instanceof AbstractDirective)) {
            throw new TypeError('Cannot call a class as a function');
          }
          AbstractDirective.apply(this, arguments);
          if (constructor) {
            constructor.apply(this, arguments);
          }
        }
      })();
      Directive.prototype = Object.create(AbstractDirective.prototype, {
        constructor: {
          value: Directive,
          enumerable: false,
          writable: true,
          configurable: true
        },
        directiveName: {
          value: name,
          enumerable: false,
          writable: false,
          configurable: false
        }
      });
      Object.setPrototypeOf(Directive, AbstractDirective);
      return Directive;
    })(option);
  } else if (!isDirective(option)) {
    throw TypeError('Invalid Directive Object ' + option);
  } else {
    directive = option;
    directive.prototype.directiveName = name;
  }
  directives[name] = directive;
  return directive;
}

function getDirective(name) {
  return directives[name];
}
module.exports = {
  AbstractDirective: AbstractDirective,
  register: register,
  getDirective: getDirective,
  isDirective: isDirective
}
