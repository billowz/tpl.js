const _ = require('lodash'),
  $ = require('jquery'),
  {Binding, AbstractBinding} = require('./binding'),
  {ArrayIterator, YieId} = require('./util'),
  SUPER_CLASS_OPTION = 'extend';

export class DirectiveGroup extends AbstractBinding {
  constructor(el, tpl, directiveConsts) {
    super(tpl);

    this.el = el;
    directiveConsts.sort((a, b) => {
      return (b.const.prototype.priority - a.const.prototype.priority) || 0;
    });
    this.directives = directiveConsts.map((dir) => {
      return new dir.const(el, tpl, dir.val);
    });
  }

  bind() {
    let iter = new ArrayIterator(this.directives),
      _self = this;
    function parse() {
      let directive, ret;
      while (iter.hasNext()) {
        directive = iter.next();
        ret = directive.bind();
        _self.scope = directive.scope;
        if (iter.hasNext() && ret && ret instanceof YieId) {
          ret.then(parse);
          break;
        }
      }
    }
    parse();
  }

  unbind() {
    this.directives.forEach(directive => {
      directive.unbind();
      this.scope = directive.scope;
    });
  }
}

export class Directive extends Binding {
  constructor(el, tpl, expr) {
    super(tpl, expr);
    this.el = el;
    this.$el = $(el);
    this.attr = tpl.tpl.directivePrefix + this.name;
  }

  bind() {
    if (Binding.generateComments && !this.comment) {
      this.comment = $(document.createComment(' Directive:' + this.name + ' [' + this.expr + '] '));
      this.comment.insertBefore(this.el);
    }
  }

  unbind() {}
}
Directive.prototype.abstract = false;
Directive.prototype.name = 'Unkown';
Directive.prototype.block = false;
Directive.prototype.priority = 0;

const directives = {};

let isDirective = Directive.isDirective = function isDirective(object) {
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
}

Directive.getDirective = function getDirective(name) {
  return directives[name];
};

Directive.register = function register(name, option) {
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

    directive.prototype.className = (_.capitalize(name) + 'Directive');
  } else if (isDirective(option)) {
    directive = option;
    directive.prototype.className = directive.prototype.constructor.name;
  } else {
    throw TypeError('Invalid Directive Object ' + option);
  }

  directive.prototype.name = name;

  directives[name] = directive;
  return directive;
};

