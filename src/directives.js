const _ = require('./util'),
  dom = require('./dom'),
  {Directive} = require('./directive'),
  {YieId} = _,
  {Template} = require('./template'),
  expression = require('./expression'),
  expressionArgs = ['$el'],
  hasOwn = Object.prototype.hasOwnProperty;

function registerDirective(name, opt) {
  let cls = Directive.register(name, opt);;
  module.exports[cls.prototype.className] = cls;
}

export class AbstractExpressionDirective extends Directive {
  constructor(el, tpl, expr, attr) {
    super(el, tpl, expr, attr);
    this.observeHandler = _.bind.call(this.observeHandler, this);
    this.expression = expression.parse(this.expr, expressionArgs);
  }

  setRealValue(val) {
    this.set(this.expr, val);
  }

  realValue() {
    let scope = this.scope();

    return this.expression.execute.call(this, scope, this.el);
  }

  setValue(val) {
    return this.setRealValue(this.unfilter(val));
  }

  value() {
    return this.filter(this.realValue());
  }

  bind() {
    super.bind();
    let identities = this.expression.identities;
    for (let i = 0, l = identities.length; i < l; i++)
      this.observe(identities[i], this.observeHandler);

    this.update(this.value());
  }

  unbind() {
    super.unbind();

    let identities = this.expression.identities;
    for (let i = 0, l = identities.length; i < l; i++)
      this.unobserve(identities[i], this.observeHandler);

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
  directives = {
    text: {
      update(val) {
        dom.setText(this.el, this.blankValue(val))
      },
      block: true
    },
    html: {
      update(val) {
        dom.setHtml(this.blankValue(val))
      },
      block: true
    },
    'class': {
      update(value) {
        if (value && typeof value == 'string') {
          this.handleArray(_.trim(value).split(/\s+/));
        } else if (value instanceof Array) {
          this.handleArray(value);
        } else if (value && typeof value == 'object') {
          this.handleObject(value);
        } else {
          this.cleanup();
        }
      },

      handleObject(value) {
        this.cleanup(value, false);
        let keys = this.prevKeys = [],
          el = this.el;
        for (let key in value) {
          if (value[key]) {
            dom.addClass(el, key)
            keys.push(key);
          } else {
            dom.removeClass(el, key)
          }
        }
      },

      handleArray(value) {
        this.cleanup(value, true);
        let keys = this.prevKeys = [],
          el = this.el;
        for (let i = 0, l = value.length; i < l; i++) {
          if (value[i]) {
            keys.push(value[i]);
            dom.addClass(el, value[i])
          }
        }
      },

      cleanup(value, isArr) {
        let prevKeys = this.prevKeys;
        if (prevKeys) {
          let i = prevKeys.length,
            el = this.el;
          while (i--) {
            let key = prevKeys[i];
            if (!value || (isArr ? _.indexOf.call(value, key) == -1 : !hasOwn.call(value, key))) {
              dom.removeClass(el, key)
            }
          }
        }
      }
    },
    'style': {
      update(value) {
        if (value && typeof value == 'string') {
          dom.setStyle(this.el, value)
        } else if (value && typeof value == 'object') {
          this.handleObject(value);
        }
      },

      handleObject(value) {
        this.cleanup(value);
        let keys = this.prevKeys = [],
          el = this.el;
        for (let key in value) {
          dom.setCss(el, key, value[key]);
        }
      }
    },
    show: {
      update(val) {
        dom.setCss(this.el, 'display', val ? '' : 'none')
      }
    },
    hide: {
      update(val) {
        dom.setCss(this.el, 'display', val ? 'none' : '')
      }
    },
    value: {
      update(val) {
        dom.setVal(this.el, this.blankValue(val))
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
          dom.setCss(this.el, 'display', 'none');
        } else {
          if (!this.directives) {
            let directives = this.directives = this.tpl.parseChildNodes(this.el);

            for (let i = 0, l = directives.length; i < l; i++)
              directives[i].bind();

            if (this.yieId) {
              this.yieId.done();
              delete this.yieId;
            }
          }
          dom.setCss(this.el, 'display', '');
        }
      },
      unbind() {
        AbstractExpressionDirective.prototype.unbind.call(this);
        if (this.directives) {
          let directives = this.directives;

          for (let i = 0, l = directives.length; i < l; i++)
            directives[i].unbind();
        }
      },
      priority: 9,
      block: true
    },
    checked: {
      update(val) {
        if (val instanceof Array)
          dom.setChecked(this.el, _.indexOf.call(val, dom.val(this.el)))
        else
          dom.setChecked(this.el, !!val);
      }
    },
    selected: {
      update(val) {}
    },
    focus: {
      update(val) {
        if (!val)
          return;
        dom.focus(this.el);
      }
    },
    input: {
      constructor(el) {
        AbstractExpressionDirective.apply(this, arguments);

        this.onChange = _.bind.call(this.onChange, this);

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
        dom.on(this.el, this.event, this.onChange);
      },

      unbind() {
        AbstractExpressionDirective.prototype.unbind.call(this);
        dom.off(this.el, this.event, this.onChange);
      },

      onChange() {
        let val = this.elVal(), idx,
          _val = this.val;
        if (val != _val)
          this.setValue(val);
      },

      update(val) {
        let _val = this.blankValue(val);
        if (_val != this.val) {
          this.elVal(_val);
          this.val = _val;
        }
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
                return dom.checked(this.el) ? dom.val(this.el) : undefined;
              } else {
                let checked;

                checked = val == dom.val(this.el);

                if (dom.checked(this.el) != checked)
                  dom.setChecked(this.el, checked);
              }
            } else {
              if (arguments.length == 0) {
                return dom.val(this.el);
              } else if (val != dom.val(this.el)) {
                dom.setVal(this.el, val)
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

_.eachObj(directives, (opt, name) => {
  opt.extend = AbstractExpressionDirective;
  registerDirective(name, opt);
});
