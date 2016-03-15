const _ = require('./util'),
  dom = require('./dom'),
  $ = require('jquery'),
  {Binding, AbstractBinding} = require('./binding'),
  {ArrayIterator, YieId} = require('./util'),
  SUPER_CLASS_OPTION = 'extend';

export class DirectiveGroup extends AbstractBinding {
  constructor(el, tpl, directiveConfigs) {
    super(tpl);
    this.el = el;
    this.directiveConfigs = directiveConfigs.sort((a, b) => {
      return (b.const.prototype.priority - a.const.prototype.priority) || 0;
    });
    this.directives = [];
    this.bindedCount = 0;
  }

  bind() {
    if (!super.bind())
      return;

    let directives = this.directives,
      directiveConfigs = this.directiveConfigs,
      tpl = this.tpl,
      el = this.el,
      directiveCount = this.directiveConfigs.length,
      self = this;
    function parse() {
      let idx = self.bindedCount,
        directive = directives[idx],
        ret;
      if (!directive) {
        let cfg = directiveConfigs[idx];
        directive = directives[idx] = new cfg.const(el, tpl,
          cfg.expression, cfg.attr);
      }
      ret = directive.bind();
      if ((++self.bindedCount) < directiveCount) {
        if (ret && ret instanceof YieId)
          ret.then(parse);
        else
          parse();
      }
    }
    parse();
  }

  unbind() {
    if (!super.unbind())
      return;

    let directives = this.directives;
    for (let i = 0, l = this.bindedCount; i < l; i++) {
      directives[i].unbind();
    }
    this.bindedCount = 0;
  }
}

export class Directive extends Binding {
  constructor(el, tpl, expr, attr) {
    super(tpl, expr);
    this.el = el;
    this.$el = $(el);
    this.attr = attr;
  }

  bind() {
    if (Binding.generateComments && !this.comment) {
      let comment = this.comment = document.createComment(' Directive:' + this.name + ' [' + this.expr + '] ');
      dom.before(comment, this.el);
    }
  }

  unbind() {}
}
Directive.prototype.abstract = false;
Directive.prototype.name = 'Unkown';
Directive.prototype.block = false;
Directive.prototype.priority = 5;

const directives = {};

let isDirective = Directive.isDirective = function isDirective(object) {
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
      if (userSuperClass && !isDirective(userSuperClass))
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

    directive.prototype.className = (_.capitalize(name) + 'Directive');
  } else
    throw TypeError('Invalid Directive Object ' + option);

  directive.prototype.name = name;

  directives[name] = directive;
  return directive;
};

