const _ = require('lodash'),
  {Directive} = require('./directive'),
  Template = require('./template'),
  expression = require('./expression'),
  {YieId} = require('./util'),
  expressionArgs = ['$scope', '$el'],
  eventExpressionArgs = ['$scope', '$el', '$event'];

function registerDirective(name, opt) {
  let cls = Directive.register(name, opt);;
  module.exports[cls.prototype.className] = cls;
}

export class AbstractEventDirective extends Directive {
  constructor(el, tpl, expr) {
    super(el, tpl, expr);
    this.handler = this.handler.bind(this);
    this.expression = expression.parse(this.expr, eventExpressionArgs);
  }

  handler(e) {
    let ret = this.expression.execute.call(this.scope, this.scope, this.el, e);
    if (typeof ret == 'function') {
      ret.call(this.scope, this.scope, this.el, e);
    }
  }

  bind() {
    super.bind();
    this.$el.on(this.eventType, this.handler);
  }

  unbind() {
    super.unbind();
    this.$el.un(this.eventType, this.handler);
  }
}

const events = ['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'keydown', 'keypress', 'keyup', 'load',
  'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload', {
    name: 'oninput',
    eventType: 'input propertychange'
  }];

// register events
_.each(events, (opt) => {
  let name;
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
});


export class AbstractExpressionDirective extends Directive {
  constructor(el, tpl, expr) {
    super(el, tpl, expr);
    this.observeHandler = this.observeHandler.bind(this);
    this.expression = expression.parse(this.expr, expressionArgs);
  }

  setRealValue(val) {
    _.set(this.scope, this.expr, val);
  }

  realValue() {
    return this.expression.execute.call(this.scope, this.scope, this.el);
  }

  setValue(val) {
    return this.setRealValue(this.unapplyFilter(val));
  }

  value() {
    return this.applyFilter(this.realValue());
  }

  bind() {
    super.bind();
    this.expression.identities.forEach((ident) => {
      this.observe(ident, this.observeHandler);
    });
    this.update(this.value());
  }

  unbind() {
    super.unbind();
    this.expression.identities.forEach((ident) => {
      this.unobserve(ident, this.observeHandler);
    });
  }

  blankValue(val) {
    if (arguments.length == 0) {
      val = this.value();
    }
    if (val === undefined || val == null) {
      return '';
    }
    return val;
  }

  observeHandler(expr, val) {
    if (this.expression.simplePath) {
      this.update(this.applyFilter(val));
    } else {
      this.update(this.value());
    }
  }

  update(val) {
    throw 'Abstract Method [' + this.className + '.update]';
  }
}

const EVENT_CHANGE = 'change',
  EVENT_INPUT = 'input propertychange',
  EVENT_CLICK = 'click',
  TAG_SELECT = 'SELECT',
  TAG_INPUT = 'INPUT',
  TAG_TEXTAREA = 'TEXTAREA',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  expressions = {
    text: {
      update(val) {
        this.$el.text(this.blankValue(val));
      },
      block: true
    },
    html: {
      update(val) {
        this.$el.html(this.blankValue(val));
      },
      block: true
    },
    'class': {
      update(val) {
        let cls = this.blankValue(val);
        if (this.oldCls) {
          this.$el.removeClass(this.oldCls);
        }
        this.$el.addClass(cls);
        this.oldCls = cls;
      }
    },
    show: {
      update(val) {
        this.$el.css('display', val ? '' : 'none');
      }
    },
    hide: {
      update(val) {
        this.$el.css('display', val ? 'none' : '');
      }
    },
    value: {
      update(val) {
        this.$el.val(this.blankValue(val));
      }
    },
    checked: {
      update(val) {
        this.$el.prop('checked', !!val);
      }
    },
    'if': {
      bind() {
        AbstractExpressionDirective.prototype.bind.call(this);
        if (!this.directives) {
          this.yieId = new YieId();
          return this.yieId;
        }
      },
      update(val) {
        if (!val) {
          this.$el.css('display', 'none');
        } else {
          if (!this.directives) {
            this.directives = this.tpl.parseChildNodes(this.el);
            this.directives.forEach(directive => {
              directive.bind();
              this.scope = directive.scope;
            });
            if (this.yieId) {
              this.yieId.done();
              delete this.yieId;
            }
          }
          this.$el.css('display', '');
        }
      },
      unbind() {
        AbstractExpressionDirective.prototype.unbind.call(this);
        if (this.directives) {
          this.directives.forEach(directive => {
            directive.unbind();
            this.scope = directive.scope;
          });
        }
      },
      priority: 9,
      block: true
    },
    input: {
      constructor(el, tpl, expr) {
        AbstractExpressionDirective.call(this, el, tpl, expr);

        this.onChange = this.onChange.bind(this);

        let tag = this.tag = el.tagName;
        switch (tag) {
          case TAG_SELECT:
            this.event = EVENT_CHANGE;
            break;
          case TAG_INPUT:
            let type = this.type = el.type;
            this.event = (type == RADIO || type == CHECKBOX) ? EVENT_CLICK : EVENT_INPUT;
            break;
          case TAG_TEXTAREA:
            throw TypeError('Directive[input] not support ' + tag);
            break;
          default: throw TypeError('Directive[input] not support ' + tag);
        }
      },

      bind() {
        AbstractExpressionDirective.prototype.bind.call(this);
        this.$el.on(this.event, this.onChange);
      },

      unbind() {
        AbstractExpressionDirective.prototype.unbind.call(this);
        this.$el.un(this.event, this.onChange);
      },

      onChange() {
        let val = this.elVal();
        if (val != this.val)
          this.setValue(val);
      },

      update(val) {
        this.val = this.blankValue(val);
        this.elVal(this.val);
      },

      elVal(val) {
        let tag = this.tag;

        switch (tag) {
          case TAG_SELECT:
            break;
          case TAG_INPUT:
            let type = this.type;

            if (type == RADIO || type == CHECKBOX) {
              if (arguments.length == 0) {
                return this.$el.prop('checked') ? this.$el.val() : undefined;
              } else {
                let checked = _.isString(val) ? val == this.$el.val() : !!val;
                if (this.$el.prop('checked') != checked)
                  this.$el.prop('checked', checked);
              }
            } else {
              if (arguments.length == 0) {
                return this.$el.val();
              } else if (val != this.$el.val()) {
                this.$el.val(val);
              }
            }
            break;
          case TAG_TEXTAREA:
            throw TypeError('Directive[input] not support ' + tag);
            break;
          default:
            throw TypeError('Directive[input] not support ' + tag);
        }
      }
    }
  };

// register Expression Directive
_.each(expressions, (opt, name) => {
  opt.extend = AbstractExpressionDirective;
  registerDirective(name, opt);
});

const eachReg = /^\s*([\S][\s\S]+[\S])\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/,
  eachAliasReg = /^(\(\s*([\S]+)(\s*,\s*([\S]+))?\s*\))|([\S]+)(\s*,\s*([\S]+))$/;

export class EachDirective extends Directive {
  constructor(el, tpl, expr) {
    super(el, tpl, expr);
    this.observeHandler = this.observeHandler.bind(this);
    this.lengthObserveHandler = this.lengthObserveHandler.bind(this);

    let token = expr.match(eachReg);
    if (!token)
      throw Error(`Invalid Expression[${expr}] on Each Directive`);

    this.scopeExpr = token[2];
    this.indexExpr = token[4];

    let aliasToken = token[1].match(eachAliasReg);
    if (!aliasToken)
      throw Error(`Invalid Expression[${token[1]}] on Each Directive`);

    this.valueAlias = aliasToken[2] || aliasToken[5];
    this.keyAlias = aliasToken[4] || aliasToken[7];

    this.$parentEl = this.$el.parent();
    this.$el.remove().removeAttr(this.attr);
    this.childTpl = new Template(this.$el);
  }

  bindChild(idx, data) {
    let scope = {
      __index__: this.indexExpr ? _.get(data, this.indexExpr) : idx
    };

    if (this.keyAlias)
      scope[this.keyAlias] = idx;
    scope[this.valueAlias] = data;

    let tpl = this.childTpl.complie(scope, this.tpl).renderTo(this.$parentEl);
  }

  bind() {
    super.bind();
    this.observe(this.scopeExpr, this.observeHandler);
    this.observe(this.scopeExpr + '.length', this.lengthObserveHandler);
    this.update(this.target());
  }

  unbind() {
    super.unbind();
    this.unobserve(this.scopeExpr, this.observeHandler);
    this.unobserve(this.scopeExpr + '.length', this.lengthObserveHandler);
  }

  update(scope) {
    if (scope instanceof Array) {
      for (let i = 0; i < scope.length; i++) {
        this.bindChild(i, scope[i]);
      }
    } else {
      throw Error(`Invalid Each Scope[${this.scopeExpr}]`);
    }
  }

  target() {
    return _.get(this.scope, this.scopeExpr);
  }

  observeHandler(expr, target) {
    this.update(target);
  }

  lengthObserveHandler() {
    this.update(this.target());
  }
}
EachDirective.prototype.abstract = true;
EachDirective.prototype.block = true;
EachDirective.prototype.priority = 10;

Directive.register('each', EachDirective);
