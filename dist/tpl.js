/*
 * tpl.js v0.1.0 built in Fri, 30 Sep 2016 07:52:33 GMT
 * Copyright (c) 2016 Tao Zeng <tao.zeng.zt@gmail.com>
 * Released under the MIT license
 * support IE6+ and other browsers
 * https://github.com/tao-zeng/tpl.js
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('utility'), require('observer')) :
  typeof define === 'function' && define.amd ? define('tpl', ['utility', 'observer'], factory) :
  (global.tpl = factory(global.utility,global.observer));
}(this, function (_,observer) {

  _ = 'default' in _ ? _['default'] : _;
  observer = 'default' in observer ? observer['default'] : observer;

  var reg = /{([^{]+)}/g;
  var TextParser = _.dynamicClass({
    constructor: function (text) {
      this.text = text;
      this.index = 0;
    },
    nextToken: function () {
      var token = reg.exec(this.text);

      if (token) {
        var index = this.index = reg.lastIndex;

        return {
          token: token[1],
          start: index - token[0].length,
          end: index
        };
      }
      this.index = 0;
    }
  });

  var config = new _.Configuration();

  var Binding = _.dynamicClass({
    statics: {
      commentCfg: 'generateComments'
    },
    constructor: function (cfg) {
      this._scope = observer.obj(cfg.scope);
      this.el = cfg.el;
      this.tpl = cfg.tpl;
    },
    expressionScopeProvider: function (expr, realScope) {
      return realScope ? '$binding.exprScope(\'' + expr + '\')' : '$scope';
    },
    scope: function () {
      var scope = this._scope;
      return observer.proxy(scope) || scope;
    },
    realScope: function () {
      return this._scope;
    },
    propScope: function (prop) {
      var scope = this.realScope(),
          parent = void 0;

      while ((parent = scope.$parent) && !_.hasOwnProp(scope, prop)) {
        scope = parent;
      }
      return observer.proxy(scope) || scope;
    },
    exprScope: function (expr) {
      return this.propScope(_.parseExpr(expr)[0]);
    },
    observe: function (expr, callback) {
      observer.on(this.exprScope(expr), expr, callback);
    },
    unobserve: function (expr, callback) {
      observer.un(this.exprScope(expr), expr, callback);
    },
    get: function (expr) {
      return _.get(this.realScope(), expr);
    },
    has: function (expr) {
      return _.has(this.realScope(), expr);
    },
    set: function (expr, value) {
      _.set(this.scope(), expr, value);
    },
    bind: function () {
      throw new Error('abstract method');
    },
    unbind: function () {
      throw new Error('abstract method');
    },
    destroy: function () {}
  });
  config.register(Binding.commentCfg, true);

  var log = new _.Logger('tpl', 'debug');

  var translations = {};
  var translate = {
    register: function (name, desc) {
      if (translations[name]) throw Error('Translate[' + name + '] is existing');
      if (_.isFunc(desc)) desc = {
        transform: desc
      };
      desc.type = desc.type || 'normal';
      translations[name] = desc;
      log.debug('register Translate[' + desc.type + ':' + name + ']');
    },
    get: function (name) {
      return translations[name];
    },
    transform: function (name, scope, data, args, restore) {
      var f = translations[name],
          type = f && f.type,
          fn = f && (restore ? f.restore : f.transform);

      if (!fn) {
        log.warn('Translate[' + name + '].' + (restore ? 'Restore' : 'Transform') + ' is undefined');
      } else {
        data = fn.apply(scope, [data].concat(args));
      }
      return {
        stop: type == 'event' && data === false,
        data: data,
        replace: type !== 'event'
      };
    },
    restore: function (name, data, args) {
      return this.apply(name, data, args, false);
    }
  };

  var keyCodes = {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    'delete': [8, 46],
    up: 38,
    left: 37,
    right: 39,
    down: 40
  };

  var eventTranslates = {
    key: function (e) {
      var which = e.which,
          k = void 0;

      for (var i = 1, l = arguments.length; i < l; i++) {
        k = arguments[i];
        if (which == (keyCodes[k] || k)) return true;
      }
      return false;
    },
    stop: function (e) {
      e.stopPropagation();
    },
    prevent: function (e) {
      e.preventDefault();
    },
    self: function (e) {
      return e.target === e.currentTarget;
    }
  };

  _.each(eventTranslates, function (fn, name) {
    translate.register(name, {
      type: 'event',
      transform: fn
    });
  });

  var nomalTranslates = {
    json: {
      transform: function (value, indent) {
        return typeof value === 'string' ? value : JSON.stringify(value, null, Number(indent) || 2);
      },
      restore: function (value) {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
    },
    trim: {
      transform: _.trim,
      restore: _.trim
    },

    capitalize: function (value) {
      if (_.isString(value)) return value.charAt(0).toUpperCase() + value.slice(1);
      return value;
    },
    uppercase: function (value) {
      return _.isString(value) ? value.toUpperCase() : value;
    },
    lowercase: function (value) {
      return _.isString(value) ? value.toLowerCase() : value;
    },
    currency: function (value, currency) {
      value = parseFloat(value);
      if (!isFinite(value) || !value && value !== 0) return '';
      currency = currency != null ? currency : '$';
      var stringified = Math.abs(value).toFixed(2);
      var _int = stringified.slice(0, -3);
      var i = _int.length % 3;
      var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
      var _float = stringified.slice(-3);
      var sign = value < 0 ? '-' : '';
      return sign + currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
    },

    plural: {
      transform: function (value) {
        return _.isString(value) ? _.plural(value) : value;
      },
      restore: function (value) {
        return _.isString(value) ? _.singular(value) : value;
      }
    },
    singular: {
      transform: function (value, plural) {
        return _.isString(value) ? _.singular(value) : value;
      },
      restore: function (value) {
        return _.isString(value) ? _.plural(value) : value;
      }
    },
    unit: {
      transform: function (value, unit, format, plural) {
        if (plural !== false && value != 1 && value != 0) unit = _.plural(unit);
        return format ? _.format(format, value, unit) : value + unit;
      }
    },
    format: {
      transform: function (value, format) {
        var args = [format, value].concat(Array.prototype.slice.call(arguments, 2));
        return _.format.apply(_, args);
      }
    }
  };
  _.each(nomalTranslates, function (f, name) {
    translate.register(name, f);
  });

  var keywords = _.reverseConvert('tpl,observer,utility,window,document,Math,Date,this,true,false,null,undefined,Infinity,NaN,isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,parseInt,parseFloat'.split(','), function () {
    return true;
  });
  var wsReg = /\s/g;
  var newlineReg = /\n/g;
  var transformReg = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\"']|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void |(\|\|)/g;
  var restoreReg = /"(\d+)"/g;
  var identityReg = /[^\w$\.](?:(?:this\.)?[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)/g;
  var propReg = /^[A-Za-z_$][\w$]*/;
  var simplePathReg = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
  var literalValueReg = /^(?:true|false|null|undefined|Infinity|NaN)$/;
  var exprReg = /\s*\|\s*(?:\|\s*)*/;
  var applyFuncReg = /\.call|\.apply$/;
  var thisReg = /^this\./;
  config.register('keywords', {});

  var cfg = config.get();

  var saved = [];

  function transform(str, isString) {
    var i = saved.length;
    saved[i] = isString ? str.replace(newlineReg, '\\n') : str;
    return '"' + i + '"';
  }

  function restore(str, i) {
    return saved[i];
  }

  var identities = void 0;
  var params = void 0;
  var scopeProvider = void 0;
  function defaultScopeProvider() {
    return 'this';
  }

  function initStatus(_params, _scopeProvider) {
    identities = {};
    scopeProvider = _scopeProvider || defaultScopeProvider;
    params = _params.__MAP__;
    if (!params) params = _params.__MAP__ = _.reverseConvert(_params, function () {
      return true;
    });
  }

  function cleanStates() {
    identities = undefined;
    params = undefined;
    scopeProvider = undefined;
    saved.length = 0;
  }

  function rewrite(raw, idx, str) {
    var prefix = raw.charAt(0),
        userExpr = raw.slice(1),
        expr = userExpr.replace(thisReg, ''),
        prop = expr.match(propReg)[0];

    if (expr == userExpr && (keywords[prop] || params[prop] || cfg.keywords[prop])) return raw;

    var nextIdx = idx + raw.length,
        nextChar = str.charAt(nextIdx++),
        realScope = false,
        ident = true;

    switch (nextChar) {
      case '(':
        realScope = !applyFuncReg.test(expr);
        ident = false;
        break;
      case '=':
        realScope = str.charAt(nextIdx) != '=';
        break;
      case '/':
      case '*':
      case '+':
      case '-':
      case '%':
      case '&':
      case '&':
        realScope = str.charAt(nextIdx) == '=';
        break;
      case '>':
      case '<':
        realScope = str.charAt(nextIdx) == nextChar && str.charAt(nextIdx + 1) == '=';
        break;
    }
    if (!realScope && ident) identities[expr] = true;
    return '' + prefix + scopeProvider(expr, realScope) + '.' + expr;
  }

  function makeExecutor(body, params) {
    params = params.slice();
    params.push('return ' + body + ';');
    try {
      return Function.apply(Function, params);
    } catch (e) {
      throw Error('Invalid expression. Generated function body: ' + body);
    }
  }

  function complileExpr(body) {
    return (' ' + body).replace(identityReg, rewrite).replace(restoreReg, restore);
  }

  function compileFilter(exprs, params) {
    return _.map(exprs, function (expr) {
      var args = expr.replace(/,?\s+/g, ',').split(',');
      return {
        name: args.shift().replace(restoreReg, restore),
        argExecutors: _.map(args, function (expr) {
          return makeExecutor(complileExpr(expr), params);
        })
      };
    });
  }

  function isSimplePath(expr) {
    return simplePathReg.test(expr) && !literalValueReg.test(expr) && expr.slice(0, 5) !== 'Math.';
  }

  var Expression = _.dynamicClass({
    constructor: function (fullExpr, params) {
      var exprs = fullExpr.replace(transformReg, transform).split(exprReg),
          expr = exprs.shift().replace(wsReg, ''),
          filterExprs = exprs;

      this.expr = expr.replace(restoreReg, restore);
      this.filterExprs = _.map(function (expr) {
        return expr.replace(restoreReg, restore);
      });
      this.fullExpr = fullExpr;
      this.params = params;
      this.executor = makeExecutor(complileExpr(expr), params);
      this.filters = compileFilter(filterExprs, params);
      this.identities = _.keys(identities);
      this.simplePath = isSimplePath(this.expr);
    },
    executeFilter: function (scope, params, data, transform) {
      _.each(this.filters, function (filter) {
        var args = _.map(filter.argExecutors, function (executor) {
          return executor.apply(scope, params);
        }),
            rs = void 0;
        if (transform != false) {
          rs = translate.transform(filter.name, scope, data, args);
        } else {
          rs = translate.restore(filter.name, scope, data, args);
        }
        if (rs.replace || rs.stop) data = rs.data;
        return !rs.stop;
      });
      return data;
    },
    restore: function (scope, params, data) {
      return this.executeFilter(scope, params, data, false);
    },
    execute: function (scope, params) {
      return this.executor.apply(scope, params);
    },
    executeAll: function (scope, params) {
      return this.executeFilter(scope, params, this.executor.apply(scope, params), true);
    },
    isSimple: function () {
      return this.simplePath;
    }
  });

  var cache = {};

  function expression(expr, params, scopeProvider) {
    var rs = cache[expr];
    if (!rs) {
      initStatus(params, scopeProvider);
      cache[expr] = rs = new Expression(expr, params);
      cleanStates();
    }
    return rs;
  }

  expression.cache = cache;

  var textContent = typeof document.createElement('div').textContent == 'string' ? 'textContent' : 'innerText';

  function firstEl(el) {
    return _.isArrayLike(el) ? el[0] : el;
  }

  function lastEl(el) {
    return _.isArrayLike(el) ? el[el.length - 1] : el;
  }

  function apply(coll, callback) {
    _.isArrayLike(coll) ? _.each(coll, callback) : callback(coll);
  }

  var dom = {
    W3C: !!window.dispatchEvent,
    inDoc: function (el, root) {
      root = root || document.documentElement;
      if (root.contains) return root.contains(el);
      try {
        while (el = el.parentNode) {
          if (el === root) return true;
        }
      } catch (e) {}
      return false;
    },
    query: function (selectors, all) {
      if (_.isString(selectors)) return all ? document.querySelectorAll(selectors) : document.querySelector(selectors);
      return selectors;
    },
    cloneNode: function (el, deep) {
      function clone(el) {
        return el.cloneNode(deep !== false);
      }
      return _.isArrayLike(el) ? _.map(el, clone) : clone(el);
    },
    parent: function (el) {
      return firstEl(el).parentNode;
    },
    next: function (el, all) {
      el = lastEl(el);
      return all ? el.nextSibling : el.nextElementSibling;
    },
    prev: function (el, all) {
      el = firstEl(el);
      return all ? el.previousSibling : el.previousElementSibling;
    },
    children: function (el, all) {
      el = firstEl(el);
      return all ? el.childNodes : el.children;
    },
    remove: function (el) {
      apply(el, function (el) {
        var parent = el.parentNode;
        if (parent) parent.removeChild(el);
      });
      return dom;
    },
    before: function (el, target) {
      target = firstEl(target);
      var parent = target.parentNode;
      apply(el, function (el) {
        parent.insertBefore(el, target);
      });
      return dom;
    },
    after: function (el, target) {
      target = lastEl(target);
      var parent = target.parentNode;

      apply(el, parent.lastChild === target ? function (el) {
        parent.insertBefore(el, target);
      } : function () {
        var next = target.nextSibling;
        return function (el) {
          parent.insertBefore(el, next);
        };
      }());
      return dom;
    },
    append: function (target, el) {
      target = firstEl(target);
      apply(el, function (el) {
        target.appendChild(el);
      });
      return dom;
    },
    prepend: function (target, el) {
      target.firstChild ? dom.before(el, el.firstChild) : dom.append(target, el);
      return dom;
    },
    replace: function (source, target) {
      var parent = source.parentNode;
      parent.replaceChild(target, source);
    },
    html: function (el, html) {
      return arguments.length > 1 ? el.innerHTML = html : el.innerHTML;
    },
    outerHtml: function (el) {
      if (el.outerHTML) return el.outerHTML;

      var container = document.createElement('div');
      container.appendChild(el.cloneNode(true));
      return container.innerHTML;
    },
    text: function (el, text) {
      if (el.nodeType == 3) return arguments.length > 1 ? el.data = text : el.data;
      return arguments.length > 1 ? el[textContent] = text : el[textContent];
    },
    focus: function (el) {
      el.focus();
      return dom;
    }
  };

  //====================== Query =============================
  if (!document.querySelectorAll) {
    document.querySelectorAll = function querySelectorAll(selector) {
      var doc = document,
          head = doc.documentElement.firstChild,
          styleTag = doc.createElement('STYLE');

      head.appendChild(styleTag);
      doc.__qsaels = [];
      if (styleTag.styleSheet) {
        // for IE
        styleTag.styleSheet.cssText = selector + '{x:expression(document.__qsaels.push(this))}';
      } else {
        // others
        var textnode = document.createTextNode(selector + '{x:expression(document.__qsaels.push(this))}');
        styleTag.appendChild(textnode);
      }
      window.scrollBy(0, 0);
      return doc.__qsaels;
    };
  }
  if (!document.querySelector) {
    document.querySelector = function querySelector(selectors) {
      var elements = document.querySelectorAll(selectors);
      return elements.length ? elements[0] : null;
    };
  }

  var rfocusable = /^(?:input|select|textarea|button|object)$/i;
  var rclickable = /^(?:a|area)$/i;
  _.assign(dom, {
    prop: function (el, name, value) {
      name = dom.propFix[name] || name;
      var hook = dom.propHooks[name];

      if (arguments.length == 2) return hook && hook.get ? hook.get(el, name) : el[name];
      hook && hook.set ? hook.set(el, name, value) : el[name] = value;
      return dom;
    },
    attr: function (el, name, val) {
      if (arguments.length == 2) return el.getAttribute(name);
      el.setAttribute(name, val);
      return dom;
    },
    removeAttr: function (el, name) {
      el.removeAttribute(name);
      return dom;
    },
    checked: function (el, check) {
      return _prop(el, 'checked', arguments.length > 1, check);
    },
    'class': function (el, cls) {
      return _prop(el, 'class', arguments.length > 1, cls);
    },
    addClass: function (el, cls) {
      if (el.classList) {
        el.classList.add(cls);
      } else {
        var cur = ' ' + dom.prop(el, 'class') + ' ';
        if (cur.indexOf(' ' + cls + ' ') === -1) dom['class'](el, _.trim(cur + cls));
      }
      return dom;
    },
    removeClass: function (el, cls) {
      el.classList ? el.classList.remove(cls) : dom['class'](el, _.trim((' ' + dom.prop(el, 'class') + ' ').replace(new RegExp(' ' + cls + ' ', 'g'), '')));
      return dom;
    },
    style: function (el, style) {
      return _prop(el, 'style', arguments.length > 1, style);
    },

    propHooks: {
      tabIndex: {
        get: function (elem) {
          var attributeNode = elem.getAttributeNode('tabindex');

          return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : undefined;
        }
      }
    },
    propFix: {
      tabindex: 'tabIndex',
      readonly: 'readOnly',
      'for': 'htmlFor',
      'class': 'className',
      maxlength: 'maxLength',
      cellspacing: 'cellSpacing',
      cellpadding: 'cellPadding',
      rowspan: 'rowSpan',
      colspan: 'colSpan',
      usemap: 'useMap',
      frameborder: 'frameBorder',
      contenteditable: 'contentEditable'
    }
  });

  function _prop(el, name, set, val) {
    if (!set) return dom.prop(el, name);
    dom.prop(el, name, val);
    return dom;
  }

  _.assign(dom, {
    css: function (el, name, value) {
      var prop = /[_-]/.test(name) ? camelize(name) : name,
          hook = void 0;

      name = cssName(prop) || prop;
      hook = cssHooks[prop] || cssDefaultHook;
      if (arguments.length == 2) {
        var convert = value,
            num = void 0;

        if (name === 'background') name = 'backgroundColor';
        value = hook.get(el, name);
        return convert !== false && isFinite(num = parseFloat(value)) ? num : value;
      } else if (!value && value !== 0) {
        el.style[name] = '';
      } else {
        if (isFinite(value) && !cssNumber[prop]) value += 'px';
        hook.set(el, name, value);
      }
      return dom;
    },

    position: function (el) {
      var _offsetParent = void 0,
          _offset = void 0,
          parentOffset = {
        top: 0,
        left: 0
      };
      if (dom.css(el, 'position') === 'fixed') {
        _offset = el.getBoundingClientRect();
      } else {
        _offsetParent = offsetParent(el);
        _offset = offset(el);
        if (_offsetParent.tagName !== 'HTML') parentOffset = offset(_offsetParent);
        parentOffset.top += dom.css(_offsetParent, 'borderTopWidth', true);
        parentOffset.left += dom.css(_offsetParent, 'borderLeftWidth', true);

        parentOffset.top -= dom.scrollTop(_offsetParent);
        parentOffset.left -= dom.scrollLeft(_offsetParent);
      }
      return {
        top: _offset.top - parentOffset.top - dom.css(el, 'marginTop', true),
        left: _offset.left - parentOffset.left - dom.css(el, 'marginLeft', true)
      };
    },
    scrollTop: function (el, val) {
      var win = getWindow(el);
      if (arguments.length == 1) {
        return (win ? 'scrollTop' in win ? win.scrollTop : root.pageYOffset : el.pageYOffset) || 0;
      } else if (win) {
        win.scrollTo(dom.scrollLeft(el), val);
      } else {
        el.pageYOffset = val;
      }
      return dom;
    },
    scrollLeft: function (el, val) {
      var win = getWindow(el);
      if (arguments.length == 1) {
        return (win ? 'scrollLeft' in win ? win.scrollLeft : root.pageXOffset : el.pageXOffset) || 0;
      } else if (win) {
        win.scrollTo(val, dom.scrollTop(el));
      } else {
        el.pageXOffset = val;
      }
      return dom;
    },
    scroll: function (el, left, top) {
      var win = getWindow(el);
      if (arguments.length == 1) {
        return {
          left: dom.scrollLeft(el),
          top: dom.scrollTop(el)
        };
      } else if (win) {
        win.scrollTo(left, top);
      } else {
        el.pageXOffset = left;
        el.pageYOffset = top;
      }
      return dom;
    }
  });

  var cssFix = dom.cssFix = {
    'float': dom.W3C ? 'cssFloat' : 'styleFloat'
  };
  var cssHooks = dom.cssHooks = {};
  var cssDefaultHook = {};
  var prefixes = ['', '-webkit-', '-o-', '-moz-', '-ms-'];
  var cssNumber = {
    animationIterationCount: true,
    columnCount: true,
    order: true,
    flex: true,
    flexGrow: true,
    flexShrink: true,
    fillOpacity: true,
    fontWeight: true,
    lineHeight: true,
    opacity: true,
    orphans: true,
    widows: true,
    zIndex: true,
    zoom: true
  };
  var root = document.documentElement;
var   css$1 = dom.css;
  function camelize(target) {
    if (!target || target.indexOf('-') < 0 && target.indexOf('_') < 0) {
      return target;
    }
    return target.replace(/[-_][^-_]/g, function (match) {
      return match.charAt(1).toUpperCase();
    });
  }

  function cssName(name, host, camelCase) {
    if (cssFix[name]) return cssFix[name];
    host = host || root.style;
    for (var i = 0, n = prefixes.length; i < n; i++) {
      camelCase = camelize(prefixes[i] + name);
      if (camelCase in host) {
        return cssFix[name] = camelCase;
      }
    }
    return null;
  }
  cssDefaultHook.set = function cssDefaultSet(el, name, value) {
    try {
      el.style[name] = value;
    } catch (e) {}
  };

  var cssDefaultGet = void 0;
  if (window.getComputedStyle) {
    cssDefaultGet = cssDefaultHook.get = function cssDefaultGet(el, name) {
      var val = void 0,
          styles = getComputedStyle(el, null);

      if (styles) {
        val = name === 'filter' ? styles.getPropertyValue(name) : styles[name];
        if (val === '') val = el.style[name];
      }
      return val;
    };
    cssHooks.opacity = {
      get: function (el, name) {
        var val = cssDefaultGet(el, name);
        return val === '' ? '1' : ret;
      }
    };
  } else {
    (function () {
      var rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
          rposition = /^(top|right|bottom|left)$/,
          ralpha = /alpha\([^)]*\)/i,
          ie8 = !!window.XDomainRequest,
          salpha = 'DXImageTransform.Microsoft.Alpha',
          border = {
        thin: ie8 ? '1px' : '2px',
        medium: ie8 ? '3px' : '4px',
        thick: ie8 ? '5px' : '6px'
      };

      cssDefaultGet = cssDefaultHook.get = function cssDefaultGet(el, name) {
        var currentStyle = el.currentStyle,
            val = currentStyle[name];

        if (rnumnonpx.test(val) && !rposition.test(val)) {
          var style = el.style,
              left = style.left,
              rsLeft = el.runtimeStyle.left;

          el.runtimeStyle.left = currentStyle.left;
          style.left = name === 'fontSize' ? '1em' : val || 0;
          val = style.pixelLeft + 'px';
          style.left = left;
          el.runtimeStyle.left = rsLeft;
        }
        if (val === 'medium') {
          name = name.replace('Width', 'Style');
          if (currentStyle[name] === 'none') val = '0px';
        }
        return val === '' ? 'auto' : border[val] || val;
      };
      cssHooks.opacity = {
        get: function (el, name) {
          var alpha = el.filters.alpha || el.filters[salpha],
              op = alpha && alpha.enabled ? alpha.opacity : 100;

          return op / 100 + '';
        },
        set: function (el, name, value) {
          var style = el.style,
              opacity = isFinite(value) && value <= 1 ? 'alpha(opacity=' + value * 100 + ')' : '',
              filter = style.filter || '';

          style.zoom = 1;
          style.filter = (ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + ' ' + opacity).trim();
          if (!style.filter) style.removeAttribute('filter');
        }
      };
    })();
  }

  _.each(['top', 'left'], function (name) {
    cssHooks[name] = {
      get: function (el, name) {
        var val = cssDefaultGet(el, name);
        return (/px$/.test(val) ? val : dom.position(el)[name] + 'px'
        );
      }
    };
  });

  _.each(['Width', 'Height'], function (name) {
    var method = name.toLowerCase(),
        clientProp = 'client' + name,
        scrollProp = 'scroll' + name,
        offsetProp = 'offset' + name,
        which = name == 'Width' ? ['Left', 'Right'] : ['Top', 'Bottom'];

    function get(el, boxSizing) {
      var val = void 0;

      val = el[offsetProp]; // border-box 0
      if (boxSizing === 2) // margin-box 2
        return val + css$1(el, 'margin' + which[0], true) + css$1(el, 'margin' + which[1], true);
      if (boxSizing < 0) // padding-box  -2
        val = val - css$1(el, 'border' + which[0] + 'Width', true) - css$1(el, 'border' + which[1] + 'Width', true);
      if (boxSizing === -4) // content-box -4
        val = val - css$1(el, 'padding' + which[0], true) - css$1(el, 'padding' + which[1], true);
      return val;
    }

    dom[method] = function (el) {
      return get(el, -4);
    };

    dom['inner' + name] = function (el) {
      return get(el, -2);
    };
    dom['outer' + name] = function (el, includeMargin) {
      return get(el, includeMargin === true ? 2 : 0);
    };
  });

  function offsetParent(el) {
    var offsetParent = el.offsetParent;
    while (offsetParent && css$1(offsetParent, "position") === "static") {
      offsetParent = offsetParent.offsetParent;
    }
    return offsetParent || root;
  }

  function offset(el) {
    //取得距离页面左右角的坐标
    var box = {
      left: 0,
      top: 0
    };

    if (!el || !el.tagName || !el.ownerDocument) return box;

    var doc = el.ownerDocument,
        body = doc.body,
        root = doc.documentElement,
        win = doc.defaultView || doc.parentWindow;

    if (!dom.inDoc(el, root)) return box;

    if (el.getBoundingClientRect) box = el.getBoundingClientRect();

    var clientTop = root.clientTop || body.clientTop,
        clientLeft = root.clientLeft || body.clientLeft,
        scrollTop = Math.max(win.pageYOffset || 0, root.scrollTop, body.scrollTop),
        scrollLeft = Math.max(win.pageXOffset || 0, root.scrollLeft, body.scrollLeft);
    return {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  }

  function getWindow(node) {
    return node.window && node.document ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
  }

  function stringValue(val) {
    if (_.isNil(val) || val === NaN) return '';
    if (!_.isString(val)) return val + '';
    return val;
  }

  _.assign(dom, {
    val: function (el, val) {
      var hook = dom.valHooks[el.type || el.tagName.toLowerCase()];

      if (arguments.length == 1) return hook && hook.get ? hook.get(el) : el.value || '';

      if (hook && hook.set) {
        hook.set(el, val);
      } else {
        el.value = stringValue(val);
      }
      return dom;
    },

    valHooks: {
      option: {
        get: function (el) {
          var val = el.attributes.value;

          return !val || val.specified ? el.value : el.text;
        }
      },

      select: {
        get: function (el) {
          var signle = el.type == 'select-one',
              index = el.selectedIndex;

          if (index < 0) return signle ? undefined : [];

          var options = el.options,
              option = void 0,
              values = signle ? undefined : [];

          for (var i = 0, l = options.length; i < l; i++) {
            option = options[i];
            if (option.selected || i == index) {
              if (signle) return dom.val(option);
              values.push(dom.val(option));
            }
          }
          return values;
        },
        set: function (el, value) {
          var signle = el.type == 'select-one',
              options = el.options,
              option = void 0,
              i = void 0,
              l = void 0,
              vl = void 0,
              val = void 0;

          el.selectedIndex = -1;

          if (!_.isArray(value)) value = _.isNil(value) ? [] : [value];

          if (vl = value.length) {
            if (signle) vl = value.length = 1;

            var map = _.reverseConvert(value, function () {
              return false;
            }),
                nr = 0;

            for (i = 0, l = options.length; i < l; i++) {
              option = options[i];
              val = dom.val(option);
              if (_.isBoolean(map[val])) {
                map[val] = option.selected = true;
                if (++nr === vl) break;
              }
              value = _.keys(map, function (v) {
                return v === true;
              });
            }
          }
          return signle ? value[0] : value;
        }
      }
    }
  });

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var root$1 = document.documentElement;

  var dom$1 = _.assign(dom, {
    hasListen: function (el, type, cb) {
      return hasListen(el, type, cb);
    },
    on: function (el, type, cb, once) {
      if (addListen(el, type, cb, once === true)) canBubbleUp[type] ? delegateEvent(type, cb) : bandEvent(el, type, cb);
      return dom;
    },
    once: function (el, type, cb) {
      return dom.on(el, type, cb, true);
    },
    off: function (el, type, cb) {
      if (removeListen(el, type, cb)) canBubbleUp[type] ? undelegateEvent(type, cb) : unbandEvent(el, type, cb);
      return dom;
    },
    dispatchEvent: function (el, type, opts) {
      var hackEvent = void 0;
      if (document.createEvent) {
        hackEvent = document.createEvent('Events');
        hackEvent.initEvent(type, true, true, opts);
        _.assign(hackEvent, opts);
        el.dispatchEvent(hackEvent);
      } else if (dom.inDoc(el)) {
        //IE6-8触发事件必须保证在DOM树中,否则报'SCRIPT16389: 未指明的错误'
        hackEvent = document.createEventObject();
        _.assign(hackEvent, opts);
        el.fireEvent('on' + type, hackEvent);
      }
      return hackEvent;
    }
  });

  var mouseEventReg = /^(?:mouse|contextmenu|drag)|click/;
  var keyEventReg = /^key/;
  var eventProps = ['altKey', 'bubbles', 'cancelable', 'ctrlKey', 'currentTarget', 'propertyName', 'eventPhase', 'metaKey', 'relatedTarget', 'shiftKey', 'target', 'view', 'which'];
  var eventFixHooks = {};
  var keyEventFixHook = {
    props: ['char', 'charCode', 'key', 'keyCode'],
    fix: function (event, original) {
      if (event.which == null) event.which = original.charCode != null ? original.charCode : original.keyCode;
    }
  };
  var mouseEventFixHook = {
    props: ['button', 'buttons', 'clientX', 'clientY', 'offsetX', 'offsetY', 'pageX', 'pageY', 'screenX', 'screenY', 'toElement'],
    fix: function (event, original) {
      var eventDoc,
          doc,
          body,
          button = original.button;

      if (event.pageX == null && original.clientX != null) {
        eventDoc = event.target.ownerDocument || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;
        event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
      }
      if (!event.which && button !== undefined) event.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
    }
  };
  var Event = function () {
    function Event(event) {
      classCallCheck(this, Event);

      var type = event.type,
          fixHook = eventFixHooks[type],
          i = void 0,
          prop = void 0;

      this.originalEvent = event;
      this.type = event.type;
      this.returnValue = !(event.defaultPrevented || event.returnValue === false || event.getPreventDefault && event.getPreventDefault());
      this.timeStamp = event && event.timeStamp || new Date() + 0;

      i = eventProps.length;
      while (i--) {
        prop = eventProps[i];
        this[prop] = event[prop];
      }

      if (!fixHook) eventFixHooks[type] = fixHook = mouseEventReg.test(type) ? mouseEventFixHook : keyEventReg.test(type) ? keyEventFixHook : {};

      if (fixHook.props) {
        var props = fixHook.props;
        i = props.length;
        while (i--) {
          prop = props[i];
          this[prop] = event[prop];
        }
      }

      if (!this.target) this.target = event.srcElement || document;
      if (this.target.nodeType == 3) this.target = this.target.parentNode;

      if (fixHook.fix) fixHook.fix(this, event);
    }

    Event.prototype.preventDefault = function preventDefault() {
      var e = this.originalEvent;
      this.returnValue = false;
      if (e) {
        e.returnValue = false;
        if (e.preventDefault) e.preventDefault();
      }
    };

    Event.prototype.stopPropagation = function stopPropagation() {
      var e = this.originalEvent;
      this.cancelBubble = true;
      if (e) {
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
      }
    };

    Event.prototype.stopImmediatePropagation = function stopImmediatePropagation() {
      var e = this.originalEvent;
      this.isImmediatePropagationStopped = true;
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      this.stopPropagation();
    };

    return Event;
  }();

  var listenKey = '__LISTEN__';

  function addListen(el, type, handler, once) {
    if (!_.isFunc(handler)) throw TypeError('Invalid Event Handler');

    var listens = el[listenKey],
        handlers = void 0,
        ret = false;

    if (!listens) el[listenKey] = listens = {};

    if (!(handlers = listens[type])) {
      listens[type] = handlers = new _.LinkedList();
      ret = true;
    } else if (handlers.contains(handler)) {
      return false;
    }
    handlers.push({
      handler: handler,
      once: once
    });
    return ret;
  }

  function removeListen(el, type, handler) {
    var listens = el[listenKey],
        handlers = listens && listens[type];

    if (handlers && !handlers.empty()) {
      handlers.remove(handler);
      return handlers.empty();
    }
    return false;
  }

  function getListens(el, type) {
    var listens = el[listenKey];

    return listens && listens[type];
  }

  function hasListen(el, type, handler) {
    var listens = el[listenKey],
        handlers = listens && listens[type];

    if (handlers) return handler ? handlers.contains(handler) : !handlers.empty();
    return false;
  }

  var bind = dom.W3C ? function (el, type, fn, capture) {
    el.addEventListener(type, fn, capture);
  } : function (el, type, fn) {
    el.attachEvent('on' + type, fn);
  };
  var unbind = dom.W3C ? function (el, type, fn) {
    el.removeEventListener(type, fn);
  } : function (el, type, fn) {
    el.detachEvent('on' + type, fn);
  };
  var canBubbleUpArray = ['click', 'dblclick', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseup', 'mouseover', 'mouseout', 'wheel', 'mousewheel', 'input', 'change', 'beforeinput', 'compositionstart', 'compositionupdate', 'compositionend', 'select', 'cut', 'copy', 'paste', 'beforecut', 'beforecopy', 'beforepaste', 'focusin', 'focusout', 'DOMFocusIn', 'DOMFocusOut', 'DOMActivate', 'dragend', 'datasetchanged'];
  var canBubbleUp = {};
  var focusBlur = {
    focus: true,
    blur: true
  };
  var eventHooks = {};
  var eventHookTypes = {};
  var delegateEvents = {};
  _.each(canBubbleUpArray, function (name) {
    canBubbleUp[name] = true;
  });
  if (!dom.W3C) {
    delete canBubbleUp.change;
    delete canBubbleUp.select;
  }

  function bandEvent(el, type, cb) {
    var hook = eventHooks[type];
    if (!hook || !hook.bind || hook.bind(el, type, cb) !== false) bind(el, hook ? hook.type || type : type, dispatch, !!focusBlur[type]);
  }

  function unbandEvent(el, type, cb) {
    var hook = eventHooks[type];
    if (!hook || !hook.unbind || hook.unbind(el, type, cb) !== false) unbind(el, hook ? hook.type || type : type, dispatch);
  }

  function delegateEvent(type, cb) {
    if (!delegateEvents[type]) {
      bandEvent(root$1, type, cb);
      delegateEvents[type] = 1;
    } else {
      delegateEvents[type]++;
    }
  }

  function undelegateEvent(type, cb) {
    if (delegateEvents[type]) {
      delegateEvents[type]--;
      if (!delegateEvents[type]) unbandEvent(root$1, type, cb);
    }
  }

  var last = new Date();

  function dispatchElement(el, event, isMove) {
    var handlers = getListens(el, event.type);

    if (handlers) {
      var handler = void 0,
          _i = void 0,
          l = void 0;

      event.currentTarget = el;
      event.isImmediatePropagationStopped = false;
      handlers.each(function (handler) {
        if (isMove) {
          var now = new Date();
          if (now - last > 16) {
            handler.handler.call(el, event);
            last = now;
          }
        } else {
          handler.handler.call(el, event);
        }

        if (handler.once) dom.off(el, event.type, handler.handler);
        return !event.isImmediatePropagationStopped;
      });
    }
  }

  function dispatchEvent(el, type, event) {
    if (el.disabled !== true || type !== 'click') {
      var isMove = /move|scroll/.test(type);
      if (canBubbleUp[type]) {
        while (el && el.getAttribute && !event.cancelBubble) {
          dispatchElement(el, event, isMove);
          el = el.parentNode;
        }
      } else dispatchElement(el, event, isMove);
    }
  }

  function dispatch(event) {
    event = new Event(event);
    var type = event.type,
        el = event.target;
    if (eventHookTypes[type]) {
      type = eventHookTypes[type];
      var hook = eventHooks[type];
      if (hook && hook.fix && hook.fix(el, event) === false) return;
      event.type = type;
      dispatchEvent(el, type, event);
    } else {
      dispatchEvent(el, type, event);
    }
  }

  //针对firefox, chrome修正mouseenter, mouseleave
  if (!('onmouseenter' in root$1)) {
    _.each({
      mouseenter: 'mouseover',
      mouseleave: 'mouseout'
    }, function (origType, fixType) {
      eventHooks[origType] = {
        type: fixType,
        fix: function (elem, event, fn) {
          var t = event.relatedTarget;
          return !t || t !== elem && !(elem.compareDocumentPosition(t) & 16);
        }
      };
    });
  }
  //针对IE9+, w3c修正animationend
  _.each({
    AnimationEvent: 'animationend',
    WebKitAnimationEvent: 'webkitAnimationEnd'
  }, function (construct, fixType) {
    if (window[construct] && !eventHooks.animationend) {
      eventHooks.animationend = {
        type: fixType
      };
    }
  });

  //针对IE6-8修正input
  if (!('oninput' in document.createElement('input'))) {
    delete canBubbleUp.input;
    eventHooks.input = {
      type: 'propertychange',
      fix: function (elem, event) {
        return event.propertyName == 'value';
      }
    };
    eventHooks.change = {
      bind: function (elem) {
        if (elem.type == 'checkbox' || elem.type == 'radio') {
          if (!elem.$onchange) {
            elem.$onchange = function (event) {
              event.type = 'change';
              dispatchEvent(elem, 'change', event);
            };
            dom.on(elem, 'click', elem.$onchange);
          }
          return false;
        }
      },
      unbind: function (elem) {
        if (elem.type == 'checkbox' || elem.type == 'radio') {
          dom.off(elem, 'click', elem.$onchange);
          return false;
        }
      }
    };
  } else if (navigator.userAgent.indexOf('MSIE 9') !== -1) {
    eventHooks.input = {
      type: 'input',
      fix: function (elem) {
        elem.oldValue = elem.value;
      }
    };
    // http://stackoverflow.com/questions/6382389/oninput-in-ie9-doesnt-fire-when-we-hit-backspace-del-do-cut
    document.addEventListener('selectionchange', function (event) {
      var actEl = document.activeElement;
      if (actEl.tagName === 'TEXTAREA' || actEl.tagName === 'INPUT' && actEl.type === 'text') {
        if (actEl.value == actEl.oldValue) return;
        actEl.oldValue = actEl.value;
        if (hasListen(actEl, 'input')) {
          event = new Event(event);
          event.type = 'input';
          dispatchEvent(actEl, 'input', event);
        }
      }
    });
  }

  if (document.onmousewheel === void 0) {
    (function () {
      /* IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
       firefox DOMMouseScroll detail 下3 上-3
       firefox wheel detlaY 下3 上-3
       IE9-11 wheel deltaY 下40 上-40
       chrome wheel deltaY 下100 上-100 */
      var fixWheelType = document.onwheel ? 'wheel' : 'DOMMouseScroll',
          fixWheelDelta = fixWheelType === 'wheel' ? 'deltaY' : 'detail';
      eventHooks.mousewheel = {
        type: fixWheelType,
        fix: function (elem, event) {
          event.wheelDeltaY = event.wheelDelta = event[fixWheelDelta] > 0 ? -120 : 120;
          event.wheelDeltaX = 0;
          return true;
        }
      };
    })();
  }
  _.each(eventHooks, function (hook, type) {
    eventHookTypes[hook.type || type] = type;
  });

  var readyList = [];
  var isReady = void 0;
var   root$2 = document.documentElement;
  function fireReady(fn) {
    isReady = true;
    while (fn = readyList.shift()) {
      fn();
    }
  }

  if (document.readyState === 'complete') {
    setTimeout(fireReady);
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fireReady);
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', function () {
      if (document.readyState === 'complete') fireReady();
    });
    if (root$2.doScroll && window.frameElement === null && window.external) {
      (function () {
        var doScrollCheck = function () {
          try {
            root$2.doScroll('left');
            fireReady();
          } catch (e) {
            setTimeout(doScrollCheck);
          }
        };

        doScrollCheck();
      })();
    }
  }

  dom$1.on(window, 'load', fireReady);

  dom$1.ready = function (fn) {
    !isReady ? readyList.push(fn) : fn();
    return dom$1;
  };

  var expressionArgs = ['$scope', '$el', '$tpl', '$binding'];

  var Text = _.dynamicClass({
    extend: Binding,
    constructor: function (cfg) {
      this['super'](arguments);
      this.expression = expression(cfg.expression, expressionArgs, this.expressionScopeProvider);
      if (config.get(Binding.commentCfg)) {
        this.comment = document.createComment('Text Binding ' + cfg.expression);
        dom.before(this.comment, this.el);
      }
      this.observeHandler = this.observeHandler.bind(this);
    },
    value: function () {
      var scope = this.scope();
      return this.expression.executeAll(scope, [scope, this.el, this.tpl, this]);
    },
    bind: function () {
      var _this = this;

      _.each(this.expression.identities, function (ident) {
        _this.observe(ident, _this.observeHandler);
      });
      this.update(this.value());
    },
    unbind: function () {
      var _this2 = this;

      _.each(this.expression.identities, function (ident) {
        _this2.unobserve(ident, _this2.observeHandler);
      });
    },
    observeHandler: function (attr, val) {
      if (this.expression.isSimple()) {
        var scope = this.scope();
        this.update(this.expression.executeFilter(scope, [scope, this.el, this.tpl, this], val));
      } else {
        this.update(this.value());
      }
    },
    update: function (val) {
      if (_.isNil(val)) val = '';
      if (val !== dom.text(this.el)) dom.text(this.el, val);
    }
  });

  var directives = {};

  var Directive = _.dynamicClass({
    extend: Binding,
    independent: false,
    block: false,
    priority: 5,
    constructor: function (cfg) {
      this['super'](arguments);
      this.expr = cfg.expression;
      this.attr = cfg.attr;
      this.children = cfg.children;
      this.domParser = cfg.domParser;
      this.group = cfg.group;
      if (config.get(Binding.commentCfg)) {
        this.comment = document.createComment('Directive[' + this.attr + ']: ' + this.expr);
        dom.before(this.comment, this.el);
      }
    },
    bindChildren: function () {
      if (this.children) _.each(this.children, function (directive) {
        directive.bind();
      });
    },
    bind: function () {
      this.bindChildren();
    },
    unbindChildren: function () {
      if (this.children) _.each(this.children, function (directive) {
        directive.unbind();
      });
    },
    unbind: function () {
      this.unbindChildren();
    },

    statics: {
      getPriority: function (directive) {
        return directive.prototype.priority;
      },
      isBlock: function (directive) {
        return directive.prototype.block;
      },
      isIndependent: function (directive) {
        return directive.prototype.independent;
      },
      getDirective: function (name) {
        return directives[name.toLowerCase()];
      },
      isDirective: function (obj) {
        return _.isExtendOf(obj, Directive);
      },
      register: function (name, option) {
        var directive = void 0;

        name = name.toLowerCase();

        if (_.isObject(option)) {
          option.extend = option.extend || Directive;
          directive = _.dynamicClass(option);
        } else if (_.isFunc(option) && _.isExtendOf(option, Directive)) {
          directive = option;
        } else {
          throw TypeError('Invalid Directive[' + name + '] ' + option);
        }

        if (name in directives) throw new Error('Directive[' + name + '] is existing');

        directives[name] = directive;
        log.debug('register Directive[%s]', name);
        return directive;
      }
    }
  });

  var DirectiveGroup = _.dynamicClass({
    extend: Binding,
    constructor: function (cfg) {
      this['super'](arguments);
      this.children = cfg.children;
      this.bindedCount = 0;
      this.bindedChildren = false;
      this._bind = this._bind.bind(this);
    },
    _setDirectives: function (directives) {
      this.directives = directives;
      this.directiveCount = directives.length;
    },
    _bind: function () {
      var idx = this.bindedCount;
      if (idx < this.directiveCount) {
        var directive = this.directives[idx],
            ret = directive.bind();
        this.bindedCount++;
        ret && ret instanceof _.YieId ? ret.then(this._bind) : this._bind();
      } else if (this.children) {
        _.each(this.children, function (directive) {
          directive.bind();
        });
        this.bindedChildren = true;
      }
    },
    bind: function () {
      this._bind();
    },
    unbind: function () {
      var directives = this.directives,
          i = this.bindedCount;

      if (this.bindedChildren) {
        _.each(this.children, function (directive) {
          directive.unbind();
        });
        this.bindedChildren = false;
      }
      while (i--) {
        directives[i].unbind();
      }
      this.bindedCount = 0;
    }
  });

  config.register('directiveReg', /^tpl-/, [RegExp]);

  var DirectiveParser = _.dynamicClass({
    constructor: function () {
      this.reg = config.get('directiveReg');
    },
    isDirective: function (attr) {
      return this.reg.test(attr);
    },
    getDirective: function (attr) {
      return Directive.getDirective(attr.replace(this.reg, ''));
    }
  });

  var Template$1 = _.dynamicClass({
    constructor: function (scope) {
      this.scope = scope;
      this.proxyHandler = this.proxyHandler.bind(this);
      observer.proxy.on(scope, this.proxyHandler);
    },
    proxyHandler: function (obj, proxy) {
      this.scope = proxy || obj;
    },
    before: function (target, bind) {
      if (bind !== false) this.bind();
      dom.before(this.el, dom.query(target));
      return this;
    },
    after: function (target, bind) {
      if (bind !== false) this.bind();
      dom.after(this.el, dom.query(target));
      return this;
    },
    prependTo: function (target, bind) {
      if (bind !== false) this.bind();
      dom.prepend(dom.query(target), this.el);
      return this;
    },
    appendTo: function (target, bind) {
      if (bind !== false) this.bind();
      dom.append(dom.query(target), this.el);
      return this;
    },
    remove: function (unbind) {
      dom.remove(this.el);
      if (unbind !== false) this.unbind();
    },
    bind: function () {
      if (!this.binded) {
        _.each(this.bindings, function (bind) {
          bind.bind();
        });
        this.binded = true;
      }
      return this;
    },
    unbind: function () {
      if (this.binded) {
        _.each(this.bindings, function (bind) {
          bind.unbind();
        });
        this.binded = false;
      }
      return this;
    },
    destroy: function () {
      observer.proxy.un(this.scope, this.proxyHandler);
      if (this.binded) _.each(this.bindings, function (bind) {
        bind.unbind();
        bind.destroy();
      });
      dom.remove(this.el);
      this.bindings = undefined;
      this.el = undefined;
    }
  });

  config.register('directiveParser', new DirectiveParser(), [DirectiveParser]);
  config.register('TextParser', TextParser, TextParser, true);

  function _clone(el) {
    var elem = el.cloneNode(false);
    if (el.nodeType == 1) _.each(el.childNodes, function (c) {
      elem.appendChild(_clone(c));
    });
    return elem;
  }

  function clone(el) {
    return _.isArrayLike(el) ? _.map(el, _clone) : _clone(el);
  }

  var TEXT = 1;
  var DIRECTIVE = 2;
  var DIRECTIVE_GROUP = 3;
  var DomParser = _.dynamicClass({
    constructor: function (el, clone) {
      this.el = this.parseEl(el, clone);
      this.directiveParser = config.get('directiveParser');
      this.TextParser = config.get('TextParser');
      this.parse();
    },
    complie: function (scope) {
      var el = clone(this.el),
          df = document.createDocumentFragment(),
          tpl = new Template$1(scope);

      dom.append(df, el);

      tpl.el = el;
      tpl.bindings = this.parseBindings(this.bindings, scope, this.parseEls(el), tpl);
      return tpl;
    },
    parseBindings: function (descs, scope, els, tpl) {
      var _this = this;

      return _.map(descs, function (desc) {
        var type = desc.type,
            cfg = {
          el: els[desc.index],
          scope: scope,
          tpl: tpl
        };

        if (type === TEXT) {
          cfg.expression = desc.expression;
          return new Text(cfg);
        }

        cfg.block = desc.block;
        cfg.children = desc.children ? _this.parseBindings(desc.children || [], scope, els) : undefined;

        if (type === DIRECTIVE) {
          cfg.expression = desc.expression;
          cfg.attr = desc.attr;
          cfg.domParser = desc.domParser;
          cfg.independent = desc.independent;
          cfg.group = undefined;
          return new desc.directive(cfg);
        } else {
          var group = new DirectiveGroup(cfg);
          group._setDirectives(_.map(desc.directives, function (desc) {
            return new desc.directive({
              el: cfg.el,
              scope: scope,
              expression: desc.expression,
              attr: desc.attr,
              tpl: tpl,
              group: group
            });
          }));
          return group;
        }
      });
    },
    parseEls: function (el) {
      var index = 0,
          elStatus = this.elStatus;
      return this.eachDom(el, [], function (el, els) {
        els.push(el);
        return elStatus[index++].marked && els;
      }, function (el, els) {
        els.push(el);
        index++;
      });
    },
    parseEl: function (el, clone) {
      if (_.isString(el)) {
        el = _.trim(el);
        if (el.charAt(0) == '<') {
          var templ = document.createElement('div');
          dom.html(templ, el);
          el = templ.childNodes;
        }
        el = dom.query(el);
      } else if (clone) {
        el = dom.cloneNode(el);
      }
      return el;
    },
    eachDom: function (el, data, elemHandler, textHandler) {
      var _this2 = this;

      if (_.isArrayLike(el)) {
        _.each(el, function (el) {
          _this2._eachDom(el, data, elemHandler, textHandler);
        });
      } else {
        this._eachDom(el, data, elemHandler, textHandler);
      }
      return data;
    },
    _eachDom: function (el, data, elemHandler, textHandler) {
      var _this3 = this;

      switch (el.nodeType) {
        case 1:
          if (data = elemHandler(el, data)) _.each(_.map(el.childNodes, function (n) {
            return n;
          }), function (el) {
            _this3._eachDom(el, data, elemHandler, textHandler);
          });
          break;
        case 3:
          textHandler(el, data);
          break;
      }
    },
    parse: function () {
      var _this4 = this;

      var elStatus = [],
          index = 0,
          TextParser = this.TextParser,
          directiveParser = this.directiveParser;

      function markEl(el, marked) {
        if (el) {
          elStatus.push({
            el: el,
            marked: marked
          });
          index++;
        }
        return el;
      }
      this.elStatus = elStatus;
      this.bindings = this.eachDom(this.el, [], function (el, bindings) {
        var directives = [],
            block = false,
            independent = false,
            desc = void 0;

        _.each(el.attributes, function (attr) {
          var name = attr.name,
              directive = void 0;

          if (!directiveParser.isDirective(name)) return;

          if (!(directive = directiveParser.getDirective(name))) {
            log.warn('Directive[' + name + '] is undefined');
            return;
          }
          var desc = {
            type: DIRECTIVE,
            index: index,
            expression: attr.value,
            directive: directive,
            attr: name,
            block: Directive.isBlock(directive),
            independent: Directive.isIndependent(directive)
          };
          if (desc.independent) {
            desc.block = block = independent = true;
            directives = [desc];
            return false;
          } else if (desc.block) {
            block = true;
          }
          directives.push(desc);
        });

        if (!directives.length) {
          markEl(el, true);
          return bindings;
        }

        if (directives.length == 1) {
          desc = directives[0];
        } else {
          desc = {
            type: DIRECTIVE_GROUP,
            index: index,
            directives: directives.sort(function (a, b) {
              return Directive.getPriority(b.directive) - Directive.getPriority(a.directive) || 0;
            }),
            block: block,
            independent: independent
          };
        }
        desc.children = !block && [];

        bindings.push(desc);
        if (independent) {
          var childEl = dom.cloneNode(el, false);
          dom.removeAttr(childEl, directives[0].attr);
          dom.append(childEl, _.map(el.childNodes, function (n) {
            return n;
          }));
          desc.domParser = new DomParser(childEl, false);
        }
        markEl(el, !block);
        return desc.children;
      }, function (el, bindings) {
        var expr = dom.text(el),
            parser = new TextParser(expr),
            token = void 0,
            i = 0;

        var p = el.parentNode,
            l = p.childNodes.length,
            ii = index;
        while (token = parser.nextToken()) {
          if (i < token.start) markEl(_this4.insertNotBlankText(expr.substring(i, token.start), el), false);
          bindings.push({
            type: TEXT,
            index: index,
            expression: token.token
          });
          markEl(_this4.insertText('binding', el), false);
          i = token.end;
        }
        if (i) {
          markEl(_this4.insertNotBlankText(expr.substr(i), el), false);
          dom.remove(el);
        } else {
          markEl(el, false);
        }
      });
    },
    insertNotBlankText: function (content, before) {
      return content ? this.insertText(content || '&nbsp;', before) : undefined;
    },
    insertText: function (content, before) {
      var el = document.createTextNode(content);
      dom.before(el, before);
      return el;
    }
  });

  var templateId = 0;
  var templateCache = {};

  var Template = _.dynamicClass({
    statics: {
      get: function (id) {
        return templateCache[id];
      },

      DomParser: DomParser,
      DirectiveParser: DirectiveParser,
      TextParser: TextParser
    },
    constructor: function (templ) {
      var cfg = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      this.id = cfg.id || templateId++;
      if (_.hasOwnProp(templateCache, this.id)) {
        throw new Error('Existing Template[' + this.id + ']');
      }
      this.parser = new DomParser(templ);
      templateCache[this.id] = this;
    },
    complie: function (scope) {
      return this.parser.complie(scope);
    }
  });

  var eachReg = /^\s*([\s\S]+)\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/;
  var eachAliasReg = /^(\(\s*([^,\s]+)(\s*,\s*([\S]+))?\s*\))|([^,\s]+)(\s*,\s*([\S]+))?$/;
  var EachDirective = Directive.register('each', _.dynamicClass({
    extend: Directive,
    independent: true,
    block: true,
    priority: 10,
    constructor: function () {
      this['super'](arguments);
      this.observeHandler = this.observeHandler.bind(this);
      var token = this.expr.match(eachReg);
      if (!token) throw Error('Invalid Expression[' + this.expr + '] on Each Directive');

      this.scopeExpr = token[2];
      this.indexExpr = token[4];

      var aliasToken = token[1].match(eachAliasReg);
      if (!aliasToken) throw Error('Invalid Expression[' + token[1] + '] on Each Directive');

      this.valueAlias = aliasToken[2] || aliasToken[5];
      this.keyAlias = aliasToken[4] || aliasToken[7];

      this.begin = document.createComment('each begin');
      this.end = document.createComment('each end');
      dom.replace(this.el, this.begin);
      dom.after(this.end, this.begin);
      this.el = undefined;
      this.version = 1;
    },
    update: function (data) {
      var _this = this;

      var domParser = this.domParser,
          parentScope = this.realScope(),
          begin = this.begin,
          end = this.end,
          indexExpr = this.indexExpr,
          used = this.used,
          version = this.version++,
          indexMap = this.used = {},
          descs = _.map(data, function (item, idx) {
        var index = indexExpr ? _.get(item, indexExpr) : idx,
            // read index of data item
        reuse = used && used[index],
            desc = void 0;

        if (reuse && reuse.version === version) reuse = undefined;

        desc = reuse || {
          index: index
        };
        desc.version = version;
        desc.data = observer.proxy(item);
        indexMap[index] = desc;
        return desc;
      }),
          idles = [],
          fragment = document.createDocumentFragment();

      if (used) tpl.each(used, function (desc) {
        if (desc.version != version) idles.push(desc);
        desc.tpl.remove(false);
      });

      tpl.each(descs, function (desc) {
        var newScope = false;
        if (!desc.scope) {
          var idle = idles.pop();

          if (!idle) {
            desc.scope = _this.createScope(parentScope, desc.data, desc.index);
            desc.tpl = domParser.complie(desc.scope);
            newScope = true;
          } else {
            desc.scope = idle.scope;
            desc.tpl = idle.tpl;
          }
        }
        if (!newScope) _this.initScope(desc.scope, desc.data, desc.index);
        dom.append(fragment, desc.tpl.el);
        if (newScope) desc.tpl.bind();
      });
      tpl.before(fragment, end);
      tpl.each(idles, function (idle) {
        return idle.tpl.destroy();
      });
    },
    createScope: function (parentScope, value, index) {
      var scope = _.create(parentScope);
      scope.$parent = parentScope;
      scope.$eachContext = this;
      this.initScope(scope, value, index, true);
      return scope;
    },
    initScope: function (scope, value, index, isCreate) {
      if (!isCreate) scope = observer.proxy(scope);
      scope[this.valueAlias] = value;
      if (this.keyAlias) scope[this.keyAlias] = index;
    },
    bind: function () {
      this.observe(this.scopeExpr, this.observeHandler);
      this.update(this.target());
    },
    unbind: function () {
      this.unobserve(this.scopeExpr, this.observeHandler);
    },
    target: function () {
      return this.get(this.scopeExpr);
    },
    observeHandler: function (expr, target) {
      this.update(target);
    }
  }));

  var regHump = /^[a-z]|[_-]+[a-zA-Z]/g;

  function _hump(k) {
    return k.charAt(k.length - 1).toUpperCase();
  }

  function hump(str) {
    return str.replace(regHump, _hump);
  }

  var YieId = _.dynamicClass({
    constructor: function () {
      this.doned = false;
      this.thens = [];
    },
    then: function (callback) {
      if (this.doned) callback();else this.thens.push(callback);
    },
    done: function () {
      if (!this.doned) {
        this.doned = true;
        var thens = this.thens;
        for (var i = 0, l = thens.length; i < l; i++) {
          thens[i]();
        }
      }
    },
    isDone: function () {
      return this.doned;
    }
  });

var util = Object.freeze({
    hump: hump,
    YieId: YieId
  });

  var expressionArgs$1 = ['$scope', '$el', '$event', '$tpl', '$binding'];

  var EventDirective = _.dynamicClass({
    extend: Directive,
    constructor: function () {
      this['super'](arguments);
      this.handler = this.handler.bind(this);
      this.expression = expression(this.expr, expressionArgs$1, this.expressionScopeProvider);
    },
    handler: function (e) {
      e.stopPropagation();

      var scope = this.scope(),
          exp = this.expression;

      if (exp.executeFilter(scope, [scope, this.el, e, this.tpl, this], e) !== false) {
        var fn = exp.execute(scope, [scope, this.el, e, this.tpl, this]);
        if (exp.isSimple()) {
          if (_.isFunc(fn)) {
            scope = this.exprScope(exp.expr);
            fn.call(scope, scope, this.el, e, this.tpl, this);
          } else {
            log.warn('Invalid Event Handler:%s', this.expr, fn);
          }
        }
      }
    },
    bind: function () {
      dom.on(this.el, this.eventType, this.handler);
      this['super'](arguments);
    },
    unbind: function () {
      this['super'](arguments);
      dom.off(this.el, this.eventType, this.handler);
    }
  });

  var events = ['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'keydown', 'keypress', 'keyup', 'load', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload', {
    name: 'oninput',
    eventType: 'input propertychange'
  }];

  var event = _.assign(_.convert(events, function (opt) {
    var name = _.isObject(opt) ? opt.name : opt;
    return hump(name + 'Directive');
  }, function (opt) {
    if (!_.isObject(opt)) opt = {
      eventType: opt
    };
    var name = opt.name || 'on' + opt.eventType;
    opt.extend = EventDirective;
    return Directive.register(name, opt);
  }), {
    EventDirective: EventDirective
  });

  var expressionArgs$2 = ['$scope', '$el', '$tpl', '$binding'];

  var SimpleDirective = _.dynamicClass({
    extend: Directive,
    constructor: function () {
      this['super'](arguments);
      this.observeHandler = this.observeHandler.bind(this);
      this.expression = expression(this.expr, expressionArgs$2, this.expressionScopeProvider);
    },
    realValue: function () {
      var scope = this.scope();
      return this.expression.execute(scope, [scope, this.el, this.tpl, this]);
    },
    value: function () {
      var scope = this.scope();
      return this.expression.executeAll(scope, [scope, this.el, this.tpl, this]);
    },
    listen: function () {
      var _this = this;

      _.each(this.expression.identities, function (ident) {
        _this.observe(ident, _this.observeHandler);
      });
      this.update(this.value());
    },
    unlisten: function () {
      var _this2 = this;

      _.each(this.expression.identities, function (ident) {
        _this2.unobserve(ident, _this2.observeHandler);
      });
    },
    bind: function () {
      this.listen();
      this['super'](arguments);
    },
    unbind: function () {
      this['super'](arguments);
      this.unlisten();
    },
    blankValue: function (val) {
      if (arguments.length == 0) val = this.value();
      return _.isNil(val) ? '' : val;
    },
    observeHandler: function (expr, val) {
      if (this.expression.isSimple()) {
        var scope = this.scope();
        this.update(this.expression.executeFilter(scope, [scope, this.el, this.tpl, this], val));
      } else {
        this.update(this.value());
      }
    },
    update: function (val) {
      throw 'abstract method';
    }
  });

  var EVENT_CHANGE = 'change';
  var EVENT_INPUT = 'input';
  var TAG_SELECT = 'SELECT';
  var TAG_INPUT = 'INPUT';
  var TAG_TEXTAREA = 'TEXTAREA';
  var RADIO = 'radio';
  var CHECKBOX = 'checkbox';
var   directives$2 = {
    text: {
      block: true,
      update: function (val) {
        dom.text(this.el, this.blankValue(val));
      }
    },
    html: {
      block: true,
      update: function (val) {
        dom.html(this.el, this.blankValue(val));
      }
    },
    'class': {
      update: function (value) {
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
      handleObject: function (value) {
        this.cleanup(value, false);
        var keys = this.prevKeys = [],
            el = this.el;
        for (var key in value) {
          if (value[key]) {
            dom.addClass(el, key);
            keys.push(key);
          } else {
            dom.removeClass(el, key);
          }
        }
      },
      handleArray: function (value) {
        this.cleanup(value, true);
        var keys = this.prevKeys = [],
            el = this.el;
        _.each(value, function (val) {
          if (val) {
            keys.push(val);
            dom.addClass(el, val);
          }
        });
      },
      cleanup: function (value, isArr) {
        var prevKeys = this.prevKeys;
        if (prevKeys) {
          var i = prevKeys.length,
              el = this.el;
          while (i--) {
            var key = prevKeys[i];
            if (!value || (isArr ? _.indexOf(value, key) == -1 : !_.hasOwnProp(value, key))) {
              dom.removeClass(el, key);
            }
          }
        }
      }
    },
    'style': {
      update: function (value) {
        if (value && _.isString(value)) {
          dom.style(this.el, value);
        } else if (value && _.isObject(value)) {
          this.handleObject(value);
        }
      },
      handleObject: function (value) {
        this.cleanup(value);
        var keys = this.prevKeys = [],
            el = this.el;
        _.each(value, function (val, key) {
          dom.css(el, key, val);
        });
      }
    },
    show: {
      update: function (val) {
        dom.css(this.el, 'display', val ? '' : 'none');
      }
    },
    hide: {
      update: function (val) {
        dom.css(this.el, 'display', val ? 'none' : '');
      }
    },
    value: {
      update: function (val) {
        dom.val(this.el, this.blankValue(val));
      }
    },
    'if': {
      priority: 9,
      bind: function () {
        this.yieId = new YieId();
        this.listen();
        return this.yieId;
      },
      unbind: function () {
        if (!this.yieId) this.unbindChildren();
        this.unlisten();
      },
      update: function (val) {
        if (!val) {
          dom.css(this.el, 'display', 'none');
        } else {
          if (this.yieId) {
            this.yieId.done();
            this.yieId = undefined;
            this.bindChildren();
          }
          dom.css(this.el, 'display', '');
        }
      }
    },
    checked: {
      update: function (val) {
        _.isArray(val) ? dom.checked(this.el, _.indexOf(val, dom.val(this.el))) : dom.checked(this.el, !!val);
      }
    },
    selected: {
      update: function (val) {}
    },
    focus: {
      update: function (val) {
        if (val) dom.focus(this.el);
      }
    },
    input: {
      priority: 4,
      constructor: function () {
        this['super'](arguments);
        if (!this.expression.isSimple()) throw TypeError('Invalid Expression[' + this.expression.expr + '] on InputDirective');

        this.onChange = this.onChange.bind(this);
        var tag = this.tag = this.el.tagName;
        switch (tag) {
          case TAG_SELECT:
            this.event = EVENT_CHANGE;
            break;
          case TAG_INPUT:
            var type = this.type = this.el.type;
            this.event = type == RADIO || type == CHECKBOX ? EVENT_CHANGE : EVENT_INPUT;
            break;
          case TAG_TEXTAREA:
            throw TypeError('Directive[input] not support ' + tag);
            break;
          default:
            throw TypeError('Directive[input] not support ' + tag);
        }
      },
      bind: function () {
        dom.on(this.el, this.event, this.onChange);
        this['super']();
      },
      unbind: function () {
        this['super']();
        dom.off(this.el, this.event, this.onChange);
      },
      setRealValue: function (val) {
        this.set(this.expression.expr, val);
      },
      setValue: function (val) {
        var scope = this.scope();
        this.setRealValue(this.expression.restore(scope, [scope, this.el, this.tpl, this], val));
      },
      onChange: function (e) {
        var val = this.elVal(),
            idx = void 0,
            _val = this.val;
        if (val != _val) this.setValue(val);
        e.stopPropagation();
      },
      update: function (val) {
        var _val = this.blankValue(val);
        if (_val != this.val) this.elVal(this.val = _val);
      },
      elVal: function (val) {
        var tag = this.tag;

        switch (tag) {
          case TAG_SELECT:
            break;
          case TAG_INPUT:
            var type = this.type;

            if (type == RADIO || type == CHECKBOX) {
              if (arguments.length == 0) {
                return dom.checked(this.el) ? dom.val(this.el) : undefined;
              } else {
                var checked = void 0;

                checked = val == dom.val(this.el);
                if (dom.checked(this.el) != checked) dom.checked(this.el, checked);
              }
            } else {
              if (arguments.length == 0) {
                return dom.val(this.el);
              } else if (val != dom.val(this.el)) {
                dom.val(this.el, val);
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
  var simple = _.assign(_.convert(directives$2, function (opt, name) {
    return hump(name + 'Directive');
  }, function (opt, name) {
    opt.extend = SimpleDirective;
    return Directive.register(name, opt);
  }), {
    SimpleDirective: SimpleDirective
  });

  var directives$1 = _.assign({
    EachDirective: EachDirective
  }, event, simple);

  _.assign(Template, {
    translate: translate,
    expression: expression,
    Directive: Directive,
    directives: directives$1,
    config: config,
    logger: log,
    init: function (cfg) {
      observer.init(cfg);
      config.config(cfg);
    }
  }, dom, util);

  function assign(target, source, alias) {
    observer.each(source, function (v, k) {
      target[alias[k] || k] = v;
    });
    return target;
  }
  var tpl$1 = function (el, cfg) {
    return new Template(el, cfg);
  };
  _.assign(tpl$1, Template, {
    Template: Template,
    utility: _,
    observer: observer
  });
  assign(_.assign(tpl$1, _), observer.observer, {
    on: 'observe',
    un: 'unobserve',
    hasListen: 'isObserved'
  });

  return tpl$1;

}));
//# sourceMappingURL=tpl.js.map