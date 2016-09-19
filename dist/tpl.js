/*
 * tpl.js v0.0.15 built in Mon, 12 Sep 2016 05:47:25 GMT
 * Copyright (c) 2016 Tao Zeng <tao.zeng.zt@gmail.com>
 * Released under the MIT license
 * support IE6+ and other browsers
 * https://github.com/tao-zeng/tpl.js
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('observer')) :
  typeof define === 'function' && define.amd ? define('tpl', ['observer'], factory) :
  (global.tpl = factory(global.observer));
}(this, function (observer) {

  observer = 'default' in observer ? observer['default'] : observer;

  var regHump = /(^[a-z])|([_-][a-zA-Z])/g;

  function _hump(k) {
    if (k[0] == '_' || k[0] == '-') k = k[1];
    return k.toUpperCase();
  }

  function assign(target, source, alias) {
    observer.each(source, function (v, k) {
      target[alias[k] || k] = v;
    });
    return target;
  }

  var _ = assign({
    hump: function (str) {
      return str.replace(regHump, _hump);
    },

    YieId: observer.dynamicClass({
      constructor: function () {
        this.doned = false;
        this.thens = [];
      },
      then: function (callback) {
        if (this.doned) callback();else this.thens.push(callback);
      },
      done: function () {
        if (!this.doned) {
          var thens = this.thens;
          for (var i = 0, l = thens.length; i < l; i++) {
            thens[i]();
          }
          this.doned = true;
        }
      },
      isDone: function () {
        return this.doned;
      }
    })
  }, observer, {
    on: 'observe',
    un: 'unobserve',
    hasListen: 'isObserved'
  });

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
    dom.prop(el, name);
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
        handlers = void 0;

    if (!listens) el[listenKey] = listens = {};

    if (!(handlers = listens[type])) listens[type] = handlers = [];

    handlers.push({
      handler: handler,
      once: once
    });
    return handlers.length === 1;
  }

  function removeListen(el, type, handler) {
    var listens = el[listenKey],
        handlers = listens ? listens[type] : undefined;

    if (handlers) {
      for (var _i = 0, l = handlers.length; _i < l; _i++) {
        if (handlers[_i].handler === handler) {
          handlers.splice(_i, 1);
          return l === 1;
        }
      }
    }
    return false;
  }

  function getListens(el, type) {
    var listens = el[listenKey],
        handlers = listens ? listens[type] : undefined;

    return handlers ? handlers.slice() : undefined;
  }

  function hasListen(el, type, handler) {
    var listens = el[listenKey],
        handlers = listens ? listens[type] : undefined;

    return handlers ? handler ? _.indexOf(handlers, handler) != -1 : !!handlers.length : false;
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
      event.currentTarget = el;
      var handler = void 0,
          _i2 = void 0,
          l = void 0;
      for (_i2 = 0, l = handlers.length; _i2 < l && !event.isImmediatePropagationStopped; _i2++) {
        handler = handlers[_i2];
        if (isMove) {
          var now = new Date();
          if (now - last > 16) {
            handler.handler.call(el, event);
            last = now;
          }
        } else handler.handler.call(el, event);

        if (handler.once) dom.off(el, event.type, handler.handler);
      }
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

  var config = new _.Configuration();

  var Binding = _.dynamicClass({
    statics: {
      commentCfg: 'generateComments'
    },
    constructor: function (cfg) {
      this._scope = _.obj(cfg.scope);
      this.el = cfg.el;
    },
    scope: function () {
      var scope = this._scope;
      return _.proxy(scope) || scope;
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
      return _.proxy(scope) || scope;
    },
    exprScope: function (expr) {
      return this.propScope(_.parseExpr(expr)[0]);
    },
    observe: function (expr, callback) {
      _.observe(this.exprScope(expr), expr, callback);
    },
    unobserve: function (expr, callback) {
      _.unobserve(this.exprScope(expr), expr, callback);
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

  var slice = Array.prototype.slice;
  var filters = {};
  function apply$1(name, data, args, apply) {
    var f = filters[name],
        type = f ? f.type : undefined,
        fn = void 0;

    fn = f ? apply !== false ? f.apply : f.unapply : undefined;
    if (!fn) {
      log.warn('filter[' + name + '].' + (apply !== false ? 'apply' : 'unapply') + ' is undefined');
    } else {
      if (_.isFunc(args)) args = args();
      data = fn.apply(f, [data].concat(args));
    }
    return {
      stop: type == 'event' && data === false,
      data: data,
      replaceData: type !== 'event'
    };
  }
  var filter = {
    register: function (name, filter) {
      if (filters[name]) throw Error('Filter[' + name + '] is existing');
      if (typeof filter == 'function') filter = {
        apply: filter
      };
      filter.type = filter.type || 'normal';
      filters[name] = filter;
      log.debug('register Filter[%s:%s]', filter.type, name);
    },
    get: function (name) {
      return filters[name];
    },


    apply: apply$1,

    unapply: function (name, data, args) {
      return apply$1(name, data, args, false);
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

  var eventFilters = {
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

  _.each(eventFilters, function (fn, name) {
    filter.register(name, {
      type: 'event',
      apply: fn
    });
  });

  var nomalFilters = {
    json: {
      apply: function (value, indent) {
        return typeof value === 'string' ? value : JSON.stringify(value, null, Number(indent) || 2);
      },
      unapply: function (value) {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
    },

    capitalize: function (value) {
      if (!value && value !== 0) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    uppercase: function (value) {
      return value || value === 0 ? value.toString().toUpperCase() : '';
    },
    lowercase: function (value) {
      return value || value === 0 ? value.toString().toLowerCase() : '';
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
    pluralize: function (value) {
      var args = slice.call(arguments, 1);
      return args.length > 1 ? args[value % 10 - 1] || args[args.length - 1] : args[0] + (value === 1 ? '' : 's');
    }
  };
  _.each(nomalFilters, function (f, name) {
    filter.register(name, f);
  });

  var defaultKeywords = _.reverseConvert('Math,Date,this,true,false,null,undefined,Infinity,NaN,isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,parseInt,parseFloat,$scope'.split(','), function () {
    return true;
  });
  var wsReg = /\s/g;
  var newlineReg = /\n/g;
  var translationReg = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void |(\|\|)/g;
  var translationRestoreReg = /"(\d+)"/g;
  var pathTestReg = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
  var booleanLiteralReg = /^(?:true|false)$/;
  var identityReg = /[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*[^\w$\.]/g;
  var propReg = /^[A-Za-z_$][\w$]*/;
  var translations = [];

  function translationProcessor(str, isString) {
    var i = translations.length;
    translations[i] = isString ? str.replace(newlineReg, '\\n') : str;
    return '"' + i + '"';
  }

  function translationRestoreProcessor(str, i) {
    return translations[i];
  }

  var currentIdentities = void 0;
  var currentKeywords = void 0;
  var prevPropScope = void 0;
  function identityProcessor(raw, idx, str) {
    var l = raw.length,
        suffix = raw.charAt(l - 1),
        exp = raw.slice(0, l - 1),
        prop = exp.match(propReg)[0];

    if (defaultKeywords[prop] || currentKeywords[prop]) return raw;
    if (prop === '$context') return raw.replace(propReg, prevPropScope);
    if (suffix == '(') {
      suffix = idx + l == str.length || str.charAt(idx + l) == ')' ? '' : ',';
      prevPropScope = 'this.propScope(\'' + prop + '\')';
      return '$scope.' + exp + '.call(' + prevPropScope + suffix;
    }
    currentIdentities[exp] = true;
    return '$scope.' + exp + suffix;
  }

  function complileExpr(body) {
    prevPropScope = undefined;
    return (body + ' ').replace(identityReg, identityProcessor).replace(translationRestoreReg, translationRestoreProcessor);
  }

  function compileFilterArgs(argExprs, keywords) {
    for (var i = 0, l = argExprs.length; i < l; i++) {
      argExprs[i] = makeExecuter(complileExpr(argExprs[i]), keywords);
    }
    return argExprs;
  }

  function compileFilter(filterExprs, keywords) {
    if (!filterExprs || !filterExprs.length) return [];

    var filters = [],
        filterExpr = void 0,
        name = void 0,
        argExprs = void 0;

    for (var i = 0, l = filterExprs.length; i < l; i++) {
      if (filterExpr = _.trim(filterExprs[i])) {
        argExprs = filterExpr.replace(/,?\s+/g, ',').split(',');
        filters.push({
          name: argExprs.shift().replace(translationRestoreReg, translationRestoreProcessor),
          args: compileFilterArgs(argExprs, keywords)
        });
      }
    }
    return filters;
  }

  function compileExecuter(exp, keywords) {
    var filterExprs = void 0,
        ret = void 0,
        isSimple = isSimplePath(exp);

    currentIdentities = {};
    currentKeywords = keywords ? _.reverseConvert(keywords, function () {
      return true;
    }) : {};

    if (!isSimple) {
      filterExprs = exp.replace(translationReg, translationProcessor).split('|');
      exp = filterExprs.shift().replace(wsReg, '');
      isSimple = isSimplePath(exp);
    }
    if (isSimple) {
      exp = exp.replace(translationRestoreReg, translationRestoreProcessor);
      currentIdentities[exp] = true;
      ret = {
        execute: makeExecuter('$scope.' + exp, keywords),
        path: _.parseExpr(exp),
        expr: exp
      };
    } else {
      ret = {
        execute: makeExecuter(complileExpr(exp), keywords),
        expr: exp
      };
    }
    ret.filters = compileFilter(filterExprs, keywords);
    ret.simplePath = isSimple;
    ret.identities = _.keys(currentIdentities);

    currentKeywords = undefined;
    currentIdentities = undefined;
    translations.length = 0;
    ret.applyFilter = function (data, argScope, args, apply) {
      var fs = ret.filters,
          f = void 0,
          _args = void 0,
          rs = void 0;

      for (var i = 0, l = fs.length; i < l; i++) {
        f = fs[i];
        _args = parseFilterArgs(f.args, argScope, args);
        rs = (apply !== false ? filter.apply : filter.unapply)(f.name, data, _args);
        if (rs.stop) {
          return rs.data;
        } else if (rs.replaceData) data = rs.data;
      }
      return data;
    };
    ret.executeAll = function () {
      var val = ret.execute.apply(this, arguments);
      val = ret.applyFilter(val, this, arguments);
      return val;
    };
    return ret;
  }

  function parseFilterArgs(executors, scope, args) {
    return _.map(executors, function (executor) {
      return executor.apply(scope, args);
    });
  }

  function makeExecuter(body, args) {
    var _args = ['$scope'];

    args = args ? _args.concat(args) : _args;
    args.push('return ' + body + ';');
    try {
      return Function.apply(Function, args);
    } catch (e) {
      throw Error('Invalid expression. Generated function body: ' + body);
    }
  }

  function isSimplePath(exp) {
    return pathTestReg.test(exp) && !booleanLiteralReg.test(exp);
  }

  var cache = {};

  function expression(exp, args) {
    var res = void 0;

    exp = _.trim(exp);
    if (!(res = cache[exp])) cache[exp] = res = compileExecuter(exp, args);
    return res;
  }

  var expressionArgs = ['$el'];

  var Text = _.dynamicClass({
    extend: Binding,
    constructor: function (cfg) {
      this['super'](arguments);
      this.expr = expression(cfg.expression, expressionArgs);
      if (config.get(Binding.commentCfg)) {
        this.comment = document.createComment('Text Binding ' + this.expr);
        dom.before(this.comment, this.el);
      }
      this.observeHandler = this.observeHandler.bind(this);
    },
    value: function () {
      return this.expr.executeAll.call(this, this.scope(), this.el);
    },
    bind: function () {
      var _this = this;

      _.each(this.expr.identities, function (ident) {
        _this.observe(ident, _this.observeHandler);
      });
      this.update(this.value());
    },
    unbind: function () {
      var _this2 = this;

      _.each(this.expr.identities, function (ident) {
        _this2.unobserve(ident, _this2.observeHandler);
      });
    },
    observeHandler: function (attr, val) {
      if (this.expr.simplePath) {
        this.update(this.expr.applyFilter(val, this, [this.scope(), this.el]));
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
    abstract: false,
    block: false,
    priority: 5,
    constructor: function (cfg) {
      var _this = this;

      this['super'](arguments);
      this.expr = cfg.expression;
      this.attr = cfg.attr;
      this.template = cfg.template;
      this.templateIndex = cfg.index;
      this.children = _.map(cfg.children, function (binding) {
        return _this.template.parser.createBinding(binding, {
          el: cfg.els[binding.index],
          template: _this.template,
          scope: _this.realScope()
        });
      });
      this.group = cfg.group;
      if (config.get(Binding.commentCfg)) {
        this.comment = document.createComment('Directive[' + this.attr + ']: ' + this.expr);
        dom.before(this.comment, this.el);
      }
    },
    bindChildren: function () {
      _.each(this.children, function (directive) {
        directive.bind();
      });
    },
    unbindChildren: function () {
      _.each(this.children, function (directive) {
        directive.unbind();
      });
    },

    statics: {
      getPriority: function (directive) {
        return directive.prototype.priority;
      },
      isBlock: function (directive) {
        return directive.prototype.block;
      },
      isAbstract: function (directive) {
        return directive.prototype.abstract;
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
      var _this = this;

      this['super'](arguments);
      this.template = cfg.template;
      this.directives = _.map(cfg.directives, function (directive) {
        return _this.createDirective(directive);
      });
      this.bindedCount = 0;
      this.bindedChildren = false;
      this.parse = this.parse.bind(this);
      this.children = _.map(cfg.children, function (directive) {
        return _this.createDirective(directive);
      });
    },
    createDirective: function (binding) {
      return this.template.parser.createBinding(binding, {
        el: this.el,
        template: this.template,
        scope: this.realScope(),
        group: this
      });
    },
    parse: function () {
      var idx = this.bindedCount;
      if (idx < this.directives.length) {
        var directive = this.directives[idx],
            ret = void 0;
        ret = directive.bind();
        this.bindedCount++;
        ret && ret instanceof _.YieId ? ret.then(this.parse) : this.parse();
      } else {
        _.each(this.children, function (directive) {
          directive.bind();
        });
        this.bindedChildren = true;
      }
    },
    bind: function () {
      this.parse();
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

  var TextParser = _.dynamicClass({
    constructor: function (text) {
      this.text = text;
    },
    token: function () {
      throw new Error('abstract method');
    }
  });

  TextParser.NormalTextParser = _.dynamicClass({
    extend: TextParser,
    constructor: function () {
      this['super'](arguments);
      this.index = 0;
      this.reg = /{([^{]+)}/g;
    },
    token: function () {
      var tk = void 0,
          reg = this.reg;

      if (tk = reg.exec(this.text)) {
        var index = reg.lastIndex;

        this.index = index;
        return {
          token: tk[1],
          start: index - tk[0].length,
          end: index
        };
      }
      this.index = 0;
    }
  });

  var TemplateParser = _.dynamicClass({
    statics: {
      TEXT: 1,
      DIRECTIVE: 2,
      DIRECTIVE_GROUP: 3
    },
    constructor: function (el, directiveReg, TextParser) {
      this.el = el;
      this.directiveReg = directiveReg;
      this.TextParser = TextParser;
      this.parse();
    },
    createBinding: function (binding, cfg) {
      cfg = _.assign(cfg, binding);
      switch (binding.type) {
        case TemplateParser.TEXT:
          return new Text(cfg);
          break;
        case TemplateParser.DIRECTIVE:
          return new binding.directive(cfg);
        case TemplateParser.DIRECTIVE_GROUP:
          return new DirectiveGroup(cfg);
        default:
          throw new Error('invalid binding');
      }
    },
    clone: function () {
      var el = dom.cloneNode(this.el);

      return {
        el: el,
        els: this.parseEls(el),
        bindings: this.bindings
      };
    },
    parseEls: function (el) {
      var _this = this;

      var els = [];

      if (_.isArrayLike(el)) {
        _.each(el, function (el) {
          _this.parseElsNode(el, els);
        });
      } else {
        this.parseElsNode(el, els);
      }
      return els;
    },
    parseElsNode: function (el, els) {
      var _this2 = this;

      els.push(el);
      if (el.nodeType === 1 && this.els[els.length - 1].parsed) _.each(el.childNodes, function (el) {
        _this2.parseElsNode(el, els);
      });
    },
    parse: function () {
      var _this3 = this;

      this.els = [];
      this.bindings = [];
      if (_.isArrayLike(this.el)) {
        _.each(this.el, function (el) {
          _this3.parseNode(el, _this3.bindings);
        });
      } else {
        this.parseNode(this.el, this.bindings);
      }
    },
    parseNode: function (el, coll) {
      switch (el.nodeType) {
        case 1:
          this.parseElement(el, coll);
          break;
        case 3:
          this.parseText(el, coll);
          break;
      }
    },
    parseText: function (el, coll) {
      var text = dom.text(el),
          parser = new this.TextParser(text),
          token = void 0,
          index = 0,
          els = this.els;

      while (token = parser.token()) {
        this.insertText2(text.substring(index, token.start), el);
        this.insertText('binding', el);
        coll.push({
          expression: token.token,
          index: els.length - 1,
          type: TemplateParser.TEXT
        });
        index = token.end;
      }
      if (index) {
        this.insertText2(text.substr(index), el);
        dom.remove(el);
      } else {
        this.pushEl(el, false);
      }
    },
    parseElement: function (el, coll) {
      var _this4 = this;

      var directives = [],
          index = this.els.length,
          directiveReg = this.directiveReg,
          directive = undefined,
          block = void 0;

      _.each(el.attributes, function (attr) {
        var name = attr.name;
        if (directiveReg.test(name)) {
          var _directive = Directive.getDirective(name.replace(directiveReg, ''));
          if (_directive) {
            var cfg = {
              expression: attr.value,
              index: index,
              directive: _directive,
              attr: name,
              type: TemplateParser.DIRECTIVE
            };
            if (Directive.isAbstract(_directive)) {
              directives = [cfg];
              block = Directive.isBlock(_directive);
              return false;
            }
            if (Directive.isBlock(_directive)) block = true;
            directives.push(cfg);
          } else {
            log.warn('Directive[' + name + '] is undefined');
          }
        }
      });

      if (directives.length == 1) {
        directive = directives[0];
      } else if (directives.length) {
        directive = {
          directives: directives.sort(function (a, b) {
            return Directive.getPriority(b.directive) - Directive.getPriority(a.directive);
          }),
          index: index,
          type: TemplateParser.DIRECTIVE_GROUP
        };
      }
      if (directive) {
        coll.push(directive);
        coll = directive.children = [];
      }

      this.pushEl(el, !block);
      if (!block) _.each(_.map(el.childNodes, function (n) {
        return n;
      }), function (el) {
        _this4.parseNode(el, coll);
      });
    },
    pushEl: function (el, parsed) {
      el.parsed = parsed;
      this.els.push(el);
    },
    insertText: function (content, before) {
      var el = document.createTextNode(content);
      dom.before(el, before);
      this.pushEl(el, false);
      return el;
    },
    insertText2: function (content, before) {
      if (content = _.trim(content)) return this.insertText(content, before);
    }
  });

  var TemplateInstance = _.dynamicClass({
    constructor: function (el, bindings) {
      this.el = el;
      this.bindings = bindings;
    },
    before: function (target) {
      this.bind();
      dom.before(this.el, dom.query(target));
      return this;
    },
    after: function (target) {
      this.bind();
      dom.after(this.el, dom.query(target));
      return this;
    },
    prependTo: function (target) {
      this.bind();
      dom.prepend(dom.query(target), this.el);
      return this;
    },
    appendTo: function (target) {
      this.bind();
      dom.append(dom.query(target), this.el);
      return this;
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
      if (this.binded) _.each(this.bindings, function (bind) {
        bind.unbind();
        bind.destroy();
      });
      dom.remove(this.el);
      this.bindings = undefined;
      this.el = undefined;
    }
  });

  var directiveRegCfg = 'directiveReg';
  var textParserCfg = 'textParser';
  config.register(directiveRegCfg, /^tpl-/);
  config.register(textParserCfg, TextParser.NormalTextParser);

  function parseEl(templ, clone) {
    if (_.isString(templ)) {
      templ = _.trim(templ);
      if (templ.charAt(0) == '<') {
        var el = document.createElement('div');
        dom.html(el, templ);
        return el.childNodes;
      }
      templ = dom.query(templ);
    }
    return clone ? dom.cloneNode(templ) : templ;
  }

  function getConfig(cfg, name) {
    return cfg[name] || config.get(name);
  }

  var templateId = 0;
  var templateCache = {};
  var Template = _.dynamicClass({
    statics: {
      get: function (id) {
        return templateCache[id];
      }
    },
    constructor: function (templ) {
      var cfg = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      this.id = cfg.id || templateId++;
      this.directiveReg = getConfig(cfg, directiveRegCfg);
      this.TextParser = getConfig(cfg, textParserCfg);
      this.el = parseEl(templ, cfg.clone !== false);
      this.parser = new TemplateParser(this.el, this.directiveReg, this.TextParser);
      templateCache[this.id] = this;
    },
    complie: function (scope) {
      var _this = this;

      var templ = this.parser.clone(),
          els = templ.els,
          bindings = void 0;

      dom.append(document.createDocumentFragment(), templ.el);
      bindings = _.map(templ.bindings, function (binding) {
        return _this.parser.createBinding(binding, {
          el: els[binding.index],
          els: els,
          scope: scope,
          template: _this
        });
      });
      return new TemplateInstance(templ.el, bindings);
    }
  });

var   directiveRegCfg$1 = 'directiveReg';
var   textParserCfg$1 = 'textParser';
  config.register(directiveRegCfg$1, /^tpl-/);
  config.register(textParserCfg$1, TextParser.NormalTextParser);

  function parseEl$1(templ, clone) {
    if (_.isString(templ)) {
      templ = _.trim(templ);
      if (templ.charAt(0) == '<') {
        var el = document.createElement('div');
        dom.html(el, templ);
        return el.childNodes;
      }
      templ = dom.query(templ);
    }
    return clone ? dom.cloneNode(templ) : templ;
  }

  function getConfig$1(cfg, name) {
    return cfg[name] || config.get(name);
  }

  var templateId$1 = 0;
  var templateCache$1 = {};
  var Template$1 = _.dynamicClass({
    statics: {
      get: function (id) {
        return templateCache$1[id];
      }
    },
    constructor: function (templ) {
      var cfg = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      this.id = cfg.id || templateId$1++;
      this.directiveReg = getConfig$1(cfg, directiveRegCfg$1);
      this.TextParser = getConfig$1(cfg, textParserCfg$1);
      this.el = parseEl$1(templ, cfg.clone !== false);
      this.parser = new TemplateParser(this.el, this.directiveReg, this.TextParser);
      templateCache$1[this.id] = this;
    },
    complie: function (scope) {
      var _this = this;

      var templ = this.parser.clone(),
          els = templ.els,
          bindings = void 0;

      dom.append(document.createDocumentFragment(), templ.el);
      bindings = _.map(templ.bindings, function (binding) {
        return _this.parser.createBinding(binding, {
          el: els[binding.index],
          els: els,
          scope: scope,
          template: _this
        });
      });
      return new TemplateInstance(templ.el, bindings);
    }
  });

  var eachReg = /^\s*([\s\S]+)\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/;
  var eachAliasReg = /^(\(\s*([^,\s]+)(\s*,\s*([\S]+))?\s*\))|([^,\s]+)(\s*,\s*([\S]+))?$/;
  var EachDirective = Directive.register('each', _.dynamicClass({
    extend: Directive,
    abstract: true,
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

      dom.removeAttr(this.el, this.attr);
      this.begin = document.createComment('each begin');
      this.end = document.createComment('each end');
      dom.replace(this.el, this.begin);
      dom.after(this.end, this.begin);

      var eachTemplateId = this.template.id + '-' + this.templateIndex;
      if (!(this.eachTemplate = Template$1.get(eachTemplateId))) this.eachTemplate = new Template$1(this.el, {
        id: eachTemplateId,
        directiveReg: this.template.directiveReg,
        TextParser: this.template.TextParser,
        clone: false
      });
      this.el = null;
    },
    update: function (data) {
      var _this = this;

      var parentScope = this.realScope(),
          begin = this.begin,
          end = this.end,
          indexExpr = this.indexExpr,
          valueAlias = this.valueAlias,
          keyAlias = this.keyAlias,
          init = !this.cache,
          oldSort = this.sort,
          sort = this.sort = new Array(data.length),
          cache = init ? this.cache = {} : this.cache,
          removed = [],
          added = [];

      _.each(data, function (item, idx) {
        var index = indexExpr ? _.get(item, indexExpr) : idx,
            // read index of data item
        scope = !init && cache[index]; // find scope in cache

        if (scope) {
          // update scope
          _this.initScope(scope, item, idx, index);
        } else {
          // create scope
          scope = cache[index] = _this.createScope(parentScope, item, idx, index);
          if (!init) added.push(scope);
        }
        sort[idx] = scope; // update sort
        if (init) {
          // init compontent
          scope.$tpl = _this.eachTemplate.complie(scope);
          data[idx] = scope[valueAlias];
          scope.$tpl.before(end);
        }
      });
      if (!init) {
        _.each(oldSort, function (oldScope) {
          var scope = cache[oldScope.$index];
          if (scope && scope !== sort[oldScope.$sort]) {
            removed.push(oldScope);
            cache[oldScope.$index] = undefined;
          }
        });

        _.each(added, function (scope) {
          var scope2 = removed.pop();
          if (scope2) {
            _this.initScope(scope2, scope);
            cache[scope.$index] = scope2;
            sort[scope.$sort] = scope2;
            scope = scope2;
          } else {
            scope.$tpl = _this.eachTemplate.complie(scope);
          }
          data[scope.$sort] = scope[valueAlias];
          scope.$tpl.after(scope.$sort ? sort[scope.$sort - 1].$tpl.els : begin);
        });

        _.each(removed, function (scope) {
          scope.$tpl.destroy();
        });
      }
    },
    createScope: function (parentScope, value, i, index) {
      var scope = _.create(parentScope);
      scope.$parent = parentScope;
      scope.$eachContext = this;
      scope.$tpl = null;
      this.initScope(scope, value, i, index, true);
      return scope;
    },
    initScope: function (scope, value, i, index, isCreate) {
      if (!isCreate) scope = scope.$tpl.scope;
      scope.$sort = i;
      scope[this.valueAlias] = value;
      if (this.keyAlias) scope[this.keyAlias] = i;
      scope.$index = index;
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

  var expressionArgs$1 = ['$el', '$event'];

  var EventDirective = _.dynamicClass({
    extend: Directive,
    constructor: function () {
      this['super'](arguments);
      this.handler = this.handler.bind(this);
      this.expression = expression(this.expr, expressionArgs$1);
    },
    handler: function (e) {
      e.stopPropagation();

      var scope = this.scope(),
          exp = this.expression;

      if (this.expression.applyFilter(e, this, [scope, this.el, e]) !== false) {
        var fn = exp.execute.call(this, scope, this.el, e);

        if (exp.simplePath) {
          if (_.isFunc(fn)) {
            var _scope = this.propScope(exp.path[0]);
            fn.call(_scope, scope, this.el, e, _scope);
          } else {
            log.warn('Invalid Event Handler:%s', this.expr, fn);
          }
        }
      }
    },
    bind: function () {
      dom.on(this.el, this.eventType, this.handler);
      this.bindChildren();
    },
    unbind: function () {
      dom.off(this.el, this.eventType, this.handler);
      this.unbindChildren();
    }
  });

  var events = ['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'keydown', 'keypress', 'keyup', 'load', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload', {
    name: 'oninput',
    eventType: 'input propertychange'
  }];

  var event = _.assign(_.convert(events, function (opt) {
    var name = _.isObject(opt) ? opt.name : opt;
    return _.hump(name + 'Directive');
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

  var expressionArgs$2 = ['$el'];

  var SimpleDirective = _.dynamicClass({
    extend: Directive,
    constructor: function () {
      this['super'](arguments);
      this.observeHandler = this.observeHandler.bind(this);
      this.expression = expression(this.expr, expressionArgs$2);
    },
    realValue: function () {
      return this.expression.execute.call(this, this.scope(), this.el);
    },
    value: function () {
      return this.expression.executeAll.call(this, this.scope(), this.el);
    },
    listen: function () {
      var _this = this;

      _.each(this.expression.identities, function (ident) {
        _this.observe(ident, _this.observeHandler);
      });
      this.update(this.value());
    },
    bind: function () {
      this.listen();
    },
    unlisten: function () {
      var _this2 = this;

      _.each(this.expression.identities, function (ident) {
        _this2.unobserve(ident, _this2.observeHandler);
      });
    },
    unbind: function () {
      this.unlisten();
    },
    blankValue: function (val) {
      if (arguments.length == 0) val = this.value();
      return _.isNil(val) ? '' : val;
    },
    observeHandler: function (expr, val) {
      if (this.expression.simplePath) {
        this.update(this.expression.applyFilter(val, this, [this.scope(), this.el]));
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
        this.yieId = new _.YieId();
        this.listen();
        return this.yieId;
      },
      unbind: function () {
        this.unlisten();
        this.unbindChildren();
      },
      update: function (val) {
        if (!val) {
          dom.css(this.el, 'display', 'none');
        } else {
          this.bindChildren();
          if (this.yieId) {
            this.yieId.done();
            this.yieId = undefined;
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
        if (!this.expression.simplePath) throw TypeError('Invalid Expression[' + this.expression.expr + '] on InputDirective');

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
        this['super']();
        dom.on(this.el, this.event, this.onChange);
      },
      unbind: function () {
        this['super']();
        dom.off(this.el, this.event, this.onChange);
      },
      setRealValue: function (val) {
        this.set(this.expression.path, val);
      },
      setValue: function (val) {
        this.setRealValue(this.expression.applyFilter(val, this, [this.scope(), this.el], false));
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
    console.log('name', name);
    return _.hump(name + 'Directive');
  }, function (opt, name) {
    console.log('name2', name);
    opt.extend = SimpleDirective;
    return Directive.register(name, opt);
  }), {
    SimpleDirective: SimpleDirective
  });

  var directives$1 = _.assign({
    EachDirective: EachDirective
  }, event, simple);

  var index = _.assign(Template, _, dom, {
    filter: filter,
    expression: expression,
    Directive: Directive,
    directives: directives$1,
    TextParser: TextParser,
    config: config,
    TemplateParser: TemplateParser,
    init: function (cfg) {
      observer.init(cfg);
      config.config(cfg);
    }
  });

  return index;

}));
//# sourceMappingURL=tpl.js.map