const _ = require('lodash'),
  Directive = require('./directive'),
  {ObserveExpression, EventExpression, EachExpression} = require('./expression'),
  {YieId} = require('./util');

export class AbstractExpressionDirective extends Directive {
  constructor(el, tpl, expr) {
    super(el, tpl, expr);
    this.expression = this.buildExpression();
  }

  buildExpression() {
    throw 'Abstract Method [' + this.className + '.buildExpression]';
  }

  getValue() {
    return this.expression.getValue();
  }

  getBlankValue() {
    let val = this.getValue();
    if (val === undefined || val == null) {
      return '';
    }
    return val;
  }
}

export class EventDirective extends AbstractExpressionDirective {
  constructor(el, tpl, expr) {
    super(el, tpl, expr);
    this.handler = this.handler.bind(this);
  }

  buildExpression() {
    return new EventExpression(this.scope, this.expr);
  }

  getEventType() {
    if (!this.eventType) {
      throw TypeError('EventType[' + this.className + '] is undefined');
    }
    return this.eventType;
  }

  handler(e) {
    this.getValue().call(this.scope, e, e.target, this.scope);
  }

  bind() {
    super.bind();
    this.$el.on(this.getEventType(), this.handler);
  }

  unbind() {
    super.unbind();
    this.$el.un(this.getEventType(), this.handler);
  }
}

export class AbstractObserveExpressionDirective extends AbstractExpressionDirective {
  constructor(el, tpl, expr) {
    super(el, tpl, expr);
    this.update = this.update.bind(this);
  }

  bind() {
    super.bind();
    this.scope = this.expression.observe(this.update);
    this.update();
  }

  unbind() {
    this.scope = this.expression.unobserve(this.update);
  }

  update() {
    throw 'Abstract Method [' + this.className + '.update]';
  }
}

export class SimpleObserveExpressionDirective extends AbstractObserveExpressionDirective {

  buildExpression() {
    return new ObserveExpression(this.scope, this.expr);
  }

  setValue(val) {
    this.expression.setValue(val);
  }
}

export class ObserveExpressionDirective extends AbstractObserveExpressionDirective {

  buildExpression() {
    return new ObserveExpression(this.scope, this.expr);
  }
}

export class EachDirective extends AbstractObserveExpressionDirective {

  buildExpression() {
    return new EachExpression(this.scope, this.expr);
  }
  bind() {}
}
EachDirective.prototype.priority = 10;

Directive.register('each', EachDirective);

const EVENT_CHANGE = 'change',
  EVENT_INPUT = 'input propertychange',
  EVENT_CLICK = 'click',
  TAG_SELECT = 'SELECT',
  TAG_INPUT = 'INPUT',
  TAG_TEXTAREA = 'TEXTAREA',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  simpleExprDirectives = {
    input: {
      constructor(el, tpl, expr) {
        SimpleObserveExpressionDirective.call(this, el, tpl, expr);

        this.onChange = this.onChange.bind(this);

        this.event = EVENT_INPUT;
        let tag = this.tag = el.tagName, type;
        if (this.isSelect()) {
          this.event = EVENT_CHANGE;
        } else if (this.isInput()) {
          type = this.type = el.type;
          if (this.isRadio() || this.isCheckBox()) {
            this.event = EVENT_CLICK;
          }
        } else if (!this.isTextArea()) {
          throw TypeError('Directive[input] not support ' + el.tagName);
        }
      },

      bind() {
        SimpleObserveExpressionDirective.prototype.bind.call(this);
        this.$el.on(this.event, this.onChange);
      },

      unbind() {
        SimpleObserveExpressionDirective.prototype.unbind.call(this);
        this.$el.un(this.event, this.onChange);
      },

      onChange() {
        let val = this.elVal();
        if (val != this.val) {
          this.setValue(val);
        }
      },

      update() {
        this.val = this.getBlankValue();
        if (this.val != this.elVal())
          this.elVal(this.val);
      },

      elVal(val) {
        let isGet = arguments.length == 0;
        if (this.isSelect()) {

        } else if (this.isInput()) {
          if (this.isRadio() || this.isCheckBox()) {
            if (isGet) {
              return this.$el.prop('checked') ? this.$el.val() : undefined;
            } else {
              this.$el.prop('checked', _.isString(val) ? val == this.$el.val() : !!val);
            }
          } else {
            return this.$el.val.apply(this.$el, arguments);
          }
        } else if (this.isTextArea()) {
        }
      },

      isInput() {
        return this.tag == TAG_INPUT;
      },

      isSelect() {
        return this.tag == TAG_SELECT;
      },

      isTextArea() {
        return this.tag == TAG_TEXTAREA;
      },

      isRadio() {
        return this.type == RADIO;
      },

      isCheckBox() {
        return this.type == CHECKBOX;
      }
    }
  },
  exprDirectives = {
    text: {
      update() {
        this.$el.text(this.getBlankValue());
      },
      block: true
    },
    html: {
      update() {
        this.$el.html(this.getBlankValue());
      },
      block: true
    },
    'class': {
      update() {
        let cls = this.getBlankValue();
        console.log('class', cls);
        if (this.oldCls) {
          this.$el.removeClass(this.oldCls);
        }
        this.$el.addClass(cls);
        this.oldCls = cls;
      }
    },
    show: {
      update() {
        this.$el.css('display', this.getValue() ? '' : 'none');
      }
    },
    hide: {
      update() {
        this.$el.css('display', this.getValue() ? 'none' : '');
      }
    },
    value: {
      update() {
        this.$el.val(this.getBlankValue());
      }
    },
    'if': {
      bind() {
        ObserveExpressionDirective.prototype.bind.call(this);
        if (!this.directives) {
          this.yieId = new YieId();
          return this.yieId;
        }
      },
      update() {
        if (!this.getValue()) {
          this.$el.css('display', 'none');
        } else {
          if (!this.directives) {
            this.directives = this.tpl.parseChildNodes(this.el);
            this.directives.forEach(directive => {
              directive.bind();
              this.scope = directive.getScope();
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
        ObserveExpressionDirective.prototype.unbind.call(this);
        if (this.directives) {
          this.directives.forEach(directive => {
            directive.unbind();
            this.scope = directive.getScope();
          });
        }
      },
      priority: 9,
      block: true
    }
  },
  eventDirectives = ['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'keydown', 'keypress', 'keyup', 'load',
    'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload', {
      name: 'oninput',
      eventType: 'input propertychange'
    }];

function registerDirective(name, opt) {
  let cls = Directive.register(name, opt);;
  module.exports[cls.prototype.className] = cls;
}

// register Simple Expression Directive
_.each(simpleExprDirectives, (opt, name) => {
  opt.extend = SimpleObserveExpressionDirective;
  registerDirective(name, opt);
});

// register Expression Directive
_.each(exprDirectives, (opt, name) => {
  opt.extend = ObserveExpressionDirective;
  registerDirective(name, opt);
});

// register eventDirectives
_.each(eventDirectives, (opt) => {
  let name;
  if (_.isString(opt)) {
    name = 'on' + opt;
    opt = {
      eventType: opt
    }
  } else {
    name = opt.name;
  }
  opt.extend = EventDirective;
  registerDirective(name, opt);
});
