const _ = require('lodash'),
  $ = require('jquery'),
  Binding = require('./binding'),
  SUPER_CLASS_OPTION = 'extend';

class Directive extends Binding {
  constructor(el, tpl, expr) {
    super(tpl);
    this.el = el;
    this.$el = $(el);
    this.expr = expr;
  }

  getPriority() {
    return this.priority;
  }

  isBlock() {
    return this.block;
  }

  bind() {
    if (Binding.genComment && !this.comment) {
      this.comment = $(document.createComment(' Directive:' + this.name + ' [' + this.expr + '] '));
      this.comment.insertBefore(this.el);
    }
  }

  unbind() {}

}

Directive.prototype.name = null;
Directive.prototype.priority = 0;
Directive.prototype.block = false;

const directives = {},
  isDirective = Directive.isDirective = function isDirective(object) {
    let type = typeof object;
    if (!object || (type != 'function' && type != 'object')) {
      return false;
    } else {
      let proto = object;
      while ((proto = Object.getPrototypeOf(proto))) {
        if (proto === Directive) {
          return true;
        }
      }
      return false;
    }
  },
  register = Directive.register = function register(name, option) {
    if (name in directives) {
      console.warn('Directive[' + name + '] is defined');
    }
    let directive;
    if (_.isPlainObject(option)) {

      directive = (function(opt, SuperClass) {
        let userSuperClass = opt[SUPER_CLASS_OPTION];
        if (userSuperClass && !isDirective(userSuperClass)) {
          throw 'Invalid Directive SuperClass ' + userSuperClass;
        }
        SuperClass = userSuperClass || SuperClass;

        let constructor = _.isFunction(opt.constructor) ? opt.constructor : undefined,
          Directive = (function() {
            let fn = function() {
              if (!(this instanceof SuperClass)) {
                throw new TypeError('Cannot call a class as a function');
              }
              SuperClass.apply(this, arguments);
              if (constructor) {
                constructor.apply(this, arguments);
              }
            }
            return fn;
          })();

        Directive.prototype = Object.create(SuperClass.prototype, {
          constructor: {
            value: Directive,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });

        delete opt.constructor;
        delete opt[SUPER_CLASS_OPTION];

        _.each(opt, (val, key) => {
          Directive.prototype[key] = val;
        });

        Object.setPrototypeOf(Directive, SuperClass);
        return Directive;

      })(option, Directive);

    } else if (isDirective(option)) {
      directive = option;
    } else {
      throw TypeError('Invalid Directive Object ' + option);
    }

    directive.prototype.name = name;
    let clsName = directive.prototype.constructor.name;
    directive.prototype.className = clsName ? clsName : (_.capitalize(name) + 'Directive');

    directives[name] = directive;
    return directive;
  },
  getDirective = Directive.getDirective = function getDirective(name) {
    return directives[name];
  };

module.exports = Directive;
