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

export class AbstractEventDirective extends Directive {
  constructor(el, tpl, expr) {
    super(el, tpl, expr);
    this.handler = this.handler.bind(this);
    this.expression = expression.parse(this.expr, eventExpressionArgs);
  }

  handler(e) {
    let ret = this.expression.execute.call(this.scope, this, this.scope, this.el, e);
    if (ret && ret instanceof ScopeData && typeof ret.data == 'function') {
      ret.data.call(ret.scope, ret.scope, this.el, e);
    }
  }

  bind() {
    super.bind();
    this.$el.on(this.eventType, this.handler);
  }

  unbind() {
    super.unbind();
    this.$el.off(this.eventType, this.handler);
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
    this.$el.removeAttr(this.attr);
  }

  setRealValue(val) {
    this.set(this.expr, val);
  }

  realValue() {
    let ret = this.expression.execute.call(this.scope, this, this.scope, this.el);
    if (ret instanceof ScopeData)
      return ret.data;
    return ret;
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
      }
    }
  };

// register Expression Directive
_.each(expressions, (opt, name) => {
  opt.extend = AbstractExpressionDirective;
  registerDirective(name, opt);
});

const eachReg = /^\s*([\s\S]+)\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/,
  eachAliasReg = /^(\(\s*([^,\s]+)(\s*,\s*([\S]+))?\s*\))|([^,\s]+)(\s*,\s*([\S]+))?$/;

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

    this.comment = $(document.createComment(' Directive:' + this.name + ' [' + this.expr + '] '));
    this.comment.insertBefore(this.el);

    this.$el.remove().removeAttr(this.attr);
    this.childTpl = new Template(this.$el);
  }

  createChildScope(key, data, idx) {
    let scope = {
      __index__: idx
    };

    if (this.keyAlias)
      scope[this.keyAlias] = key;
    scope[this.valueAlias] = data;
    return scope;
  }

  createChild(key, data, idx) {
    return this.childTpl.complie(this.createChildScope(key, data, idx), this.tpl);
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

  update(value) {
    if (value instanceof Array) {
      let childrenIdx = this.childrenIdx,
        childrenSortedIdx = this.childrenSortedIdx,
        data, idx,
        i, l;

      if (!childrenIdx) {
        let tpl,
          before = this.comment, el;

        childrenIdx = this.childrenIdx = {};
        childrenSortedIdx = this.childrenSortedIdx = [];

        for (i = 0, l = value.length; i < l; i++) {
          data = value[i];
          idx = this.indexExpr ? _.get(data, this.indexExpr) : i;
          tpl = this.createChild(i, data, idx);
          el = tpl.el;
          el.insertAfter(before);
          before = el;

          childrenSortedIdx[i] = childrenIdx[idx] = {
            idx: idx,
            scope: data,
            tpl: tpl,
            index: i
          }
        }
      } else {
        let child, child2, tpl,
          added = [],
          removed = [],
          currentSortedIdx = [];

        for (i = 0, l = value.length; i < l; i++) {
          data = value[i];
          idx = this.indexExpr ? _.get(data, this.indexExpr) : i;

          if (!(child = childrenIdx[idx])) {
            child = childrenIdx[idx] = {
              idx: idx,
              scope: data,
              tpl: undefined,
              index: i
            }
            added.push(child);
            childrenIdx[idx] = child;
          } else {
            if (child.scope != data) {
              if (child.tpl)
                child.tpl.updateScope(this.createChildScope(i, data, idx));
              else
                throw Error('index for each is not uk')
            // todo update: child.tpl.updateScope(child.scope)
            }
            child.index = i;
          }
          currentSortedIdx[i] = child;
        }

        for (i = 0, l = childrenSortedIdx.length; i < l; i++) {
          child = childrenSortedIdx[i];
          child2 = childrenIdx[child.idx];
          if (child2 && child !== currentSortedIdx[child2.index]) {
            removed.push(child);
            childrenIdx[child.idx] = undefined;
          }
        }

        for (i = 0, l = added.length; i < l; i++) {
          child = added[i];
          if( (child2 = removed.pop()) ) {
            child.tpl = child2.tpl;
            child.tpl.updateScope(this.createChildScope(child.index, child.scope, child.idx));
          // todo update: child.tpl.updateScope(child.scope)
          } else {
            tpl = this.createChild(child.index, child.scope, idx);
            child.tpl = tpl;
          }
          if (child.index) {
            child.tpl.el.insertAfter(currentSortedIdx[child.index - 1].tpl.el);
          } else {
            child.tpl.el.insertAfter(this.comment);
          }
        }

        while ((child = removed.pop()))
        child.tpl.destroy();

        this.childrenSortedIdx = currentSortedIdx;
      }
    } else {
      console.warn(`Invalid Each Scope[${this.scopeExpr}] ${scope}`);
    }
  }

  target() {
    return this.get(this.scopeExpr);
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
