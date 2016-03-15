const _ = require('lodash'),
  {Directive} = require('./directive'),
  {YieId, ScopeData} = require('./util'),
  {Template} = require('./template'),
  expression = require('./expression'),
  expressionArgs = ['$scope', '$el'],
  eventExpressionArgs = ['$scope', '$el', '$event'];

function registerDirective(name, opt) {
  let cls = Directive.register(name, opt);;
  module.exports[cls.prototype.className] = cls;
}

export class AbstractExpressionDirective extends Directive {
  constructor(el, tpl, expr, attr) {
    super(el, tpl, expr, attr);
    this.observeHandler = this.observeHandler.bind(this);
    this.expression = expression.parse(this.expr, expressionArgs);
    this.$el.removeAttr(this.attr);
  }

  setRealValue(val) {
    this.set(this.expr, val);
  }

  realValue() {
    let ret = this.expression.execute.call(this.scope, this.scope, this.scope, this.el);
    if (ret instanceof ScopeData)
      return ret.data;
    return ret;
  }

  setValue(val) {
    return this.setRealValue(this.unfilter(val));
  }

  value() {
    return this.filter(this.realValue());
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
      this.update(this.filter(val));
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
      update(value) {
        if (value && typeof value == 'string') {
          this.handleArray(value.trim().split(/\s+/));
        } else if (value instanceof Array) {
          this.handleArray(value);
        } else if (value && typeof value == 'object') {
          this.handleObject(value);
        } else {
          this.cleanup();
        }
      },

      handleObject(value) {
        this.cleanup(value);
        let keys = this.prevKeys = [];
        for (let key in value) {
          if (value[key]) {
            this.$el.addClass(key);
            keys.push(key);
          } else {
            this.$el.removeClass(key);
          }
        }
      },

      handleArray(value) {
        this.cleanup(value);
        let keys = this.prevKeys = [];
        for (let i = 0, l = value.length; i < l; i++) {
          if (value[i]) {
            keys.push(value[i]);
            this.$el.addClass(value[i]);
          }
        }
      },

      cleanup(value) {
        if (this.prevKeys) {
          let i = this.prevKeys.length,
            isArr = value instanceof Array;
          while (i--) {
            let key = this.prevKeys[i];
            if (!value || (isArr ? value.indexOf(key) != -1 : value.hasOwnProperty(key))) {
              this.$el.removeClass(key);
            }
          }
        }
      }
    },
    'style': {
      update(value) {
        if (value && typeof value == 'string') {
          this.el.style.cssText = value;
        } else if (value && typeof value == 'object') {
          this.handleObject(value);
        }
      },

      handleObject(value) {
        this.cleanup(value);
        let keys = this.prevKeys = [];
        for (let key in value) {
          this.$el.css(key, value[key]);
        }
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
          });
        }
      },
      priority: 9,
      block: true
    },
    checked: {
      update(val) {
        if (val instanceof Array)
          this.$el.prop('checked', _.indexOf(val, this.$el.val()))
        else
          this.$el.prop('checked', !!val);
      }
    },
    selected: {
      update(val) {}
    },
    input: {
      constructor(el) {
        AbstractExpressionDirective.apply(this, arguments);

        this.onChange = this.onChange.bind(this);

        let tag = this.tag = el.tagName;
        switch (tag) {
          case TAG_SELECT:
            this.event = EVENT_CHANGE;
            break;
          case TAG_INPUT:
            let type = this.type = el.type;
            this.event = (type == RADIO || type == CHECKBOX) ? EVENT_CHANGE : EVENT_INPUT;
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
        this.$el.off(this.event, this.onChange);
      },

      onChange() {
        let val = this.elVal(), idx;
        if (this.val instanceof Array) {
          if (val) {
            this.val = this.val.concat(val);
          } else if ((idx = _.indexOf(this.$el.val())) != -1) {
            this.val = this.val.slice().splice(idx, 1);
          }
          this.setValue(this.val);
        } else if (val != this.val)
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
                let checked;
                if (val instanceof Array)
                  checked = _.indexOf(this.$el.val()) != -1;
                else
                  checked = val == this.$el.val();

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
      },
      priority: 4
    }
  };

// register Expression Directive
_.each(expressions, (opt, name) => {
  opt.extend = AbstractExpressionDirective;
  registerDirective(name, opt);
});
