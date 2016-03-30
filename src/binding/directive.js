const _ = require('../util'),
  dom = require('../dom'),
  Binding = require('./binding'),
  SUPER_CLASS_OPTION = 'extend',
  directives = {};

class Directive extends Binding {
  constructor(el, tpl, expr, attr) {
    super(tpl, expr);
    this.el = el;
    this.attr = attr;
    dom.removeAttr(this.el, this.attr);
    if (Binding.generateComments) {
      this.comment = document.createComment(' Directive:' + this.name + ' [' + this.expr + '] ');
      dom.before(this.comment, this.el);
    }
  }
}
Directive.prototype.name = 'Unkown';
Directive.prototype.abstract = false;
Directive.prototype.block = false;
Directive.prototype.priority = 5;

let isDirective = Directive.isDirective = function isDirective(object) {
  // TODO IE Shim
  return true;
  let type = typeof object;
  if (!object || (type != 'function' && type != 'object')) {
    return false;
  }
  let proto = object;
  while ((proto = _.prototypeOf(proto))) {
    if (proto === Directive)
      return true;
  }
  return false;
}

Directive.getDirective = function getDirective(name) {
  return directives[name];
};

Directive.register = function register(name, option) {
  if (name in directives) {
    console.warn('Directive[' + name + '] is defined');
  }
  let directive;
  if (typeof option == 'function') {
    if (!isDirective(option))
      throw TypeError('Invalid Directive constructor ' + option);
    directive = option;
    directive.prototype.className = directive.prototype.className || directive.name;
  } else if (option && typeof option == 'object') {

    directive = (function(opt, SuperClass) {
      let userSuperClass = opt[SUPER_CLASS_OPTION];
      if (false && userSuperClass && !isDirective(userSuperClass))
        throw TypeError('Invalid Directive SuperClass ' + userSuperClass);
      SuperClass = userSuperClass || SuperClass;

      let constructor = typeof opt.constructor == 'function' ? opt.constructor : undefined,
        Directive = function DynamicDirective() {
          if (!(this instanceof SuperClass))
            throw new TypeError('Cannot call a class as a function');

          SuperClass.apply(this, arguments);
          if (constructor)
            constructor.apply(this, arguments);
        }

      Directive.prototype = _.create(SuperClass.prototype, {
        constructor: {
          value: Directive,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });

      delete opt.constructor;
      delete opt[SUPER_CLASS_OPTION];

      _.eachObj(opt, (val, key) => {
        Directive.prototype[key] = val;
      });

      _.setPrototypeOf(Directive, SuperClass);
      return Directive;
    })(option, Directive);

    directive.prototype.className = (_.hump(name) + 'Directive');
  } else
    throw TypeError('Invalid Directive Object ' + option);

  name = name.toLowerCase();
  directive.prototype.name = name;

  directives[name] = directive;
  return directive;
};

module.exports = Directive;
