/*!
 * tpl.js v0.0.12 built in Sun, 10 Apr 2016 06:15:15 GMT
 * Copyright (c) 2016 Tao Zeng <tao.zeng.zt@gmail.com>
 * Based on observer.js v0.0.x
 * Released under the MIT license
 * support IE6+ and other browsers
 * support ES6 Proxy and Object.observe
 * https://github.com/tao-zeng/tpl.js
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("observer"));
	else if(typeof define === 'function' && define.amd)
		define(["observer"], factory);
	else if(typeof exports === 'object')
		exports["tpl"] = factory(require("observer"));
	else
		root["tpl"] = factory(root["observer"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:8088/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var tpl = __webpack_require__(1),
	    _ = __webpack_require__(2);
	
	_.assign(tpl, _, __webpack_require__(4));
	tpl.expression = __webpack_require__(18);
	tpl.Directive = __webpack_require__(11).Directive;
	tpl.Directives = __webpack_require__(20);
	module.exports = tpl;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(4),
	    TemplateInstance = __webpack_require__(10);
	
	var parseDelimiterReg = function parseDelimiterReg(delimiter) {
	  return new RegExp([delimiter[0], '([^', delimiter[0], delimiter[0], ']*)', delimiter[1]].join(''), 'g');
	},
	    parseDirectiveReg = function parseDirectiveReg(prefix) {
	  return new RegExp('^' + prefix);
	},
	    defaultCfg = {
	  delimiter: ['{', '}'],
	  directivePrefix: 'tpl-'
	};
	
	var Template = function () {
	  function Template(templ) {
	    var cfg = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    _classCallCheck(this, Template);
	
	    var el = document.createElement('div');
	    if (typeof templ == 'string') {
	      templ = _.trim(templ);
	      if (templ.charAt(0) == '<') el.innerHTML = templ;else dom.append(el, dom.querySelector(templ));
	    } else {
	      dom.append(el, templ);
	    }
	    this.el = el;
	    this.directivePrefix = cfg.directivePrefix || defaultCfg.directivePrefix;
	    this.delimiter = cfg.delimiter || defaultCfg.delimiter;
	    this.directiveReg = parseDirectiveReg(this.directivePrefix);
	    this.delimiterReg = parseDelimiterReg(this.delimiter);
	  }
	
	  Template.prototype.complie = function complie(scope) {
	    return new TemplateInstance(dom.cloneNode(this.el), scope, this.delimiterReg, this.directiveReg);
	  };
	
	  return Template;
	}();
	
	module.exports = Template;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var observer = __webpack_require__(3);
	
	var YieId = function () {
	  function YieId() {
	    _classCallCheck(this, YieId);
	
	    this.doned = false;
	    this.thens = [];
	  }
	
	  YieId.prototype.then = function then(callback) {
	    if (this.doned) callback();else this.thens.push(callback);
	  };
	
	  YieId.prototype.done = function done() {
	    if (!this.doned) {
	      var thens = this.thens;
	      for (var i = 0, l = thens.length; i < l; i++) {
	        thens[i]();
	      }
	      this.doned = true;
	    }
	  };
	
	  YieId.prototype.isDone = function isDone() {
	    return this.doned;
	  };
	
	  return YieId;
	}();
	
	var hasOwn = Object.prototype.hasOwnProperty,
	    trimReg = /^\s+|\s+$/g,
	    strFirstLetterReg = /^[a-zA-Z]/,
	    strHumpReg = /(^[a-zA-Z])|([_-][a-zA-Z])/g;
	
	var util = {
	  YieId: YieId,
	  observe: observer.on,
	  unobserve: observer.un,
	  obj: observer.obj,
	  proxy: observer.proxy.proxy,
	  proxyChange: observer.proxy.on,
	  unProxyChange: observer.proxy.un,
	  Map: observer.Map,
	  bind: observer.util.bind,
	  indexOf: observer.util.indexOf,
	  requestAnimationFrame: observer.util.requestAnimationFrame,
	  cancelAnimationFrame: observer.util.cancelAnimationFrame,
	  requestTimeoutFrame: observer.util.requestTimeoutFrame,
	  cancelTimeoutFrame: observer.util.cancelTimeoutFrame,
	  hasOwnProp: function hasOwnProp(obj, prop) {
	    return hasOwn.call(observer.obj(obj), prop);
	  },
	
	  parseExpr: observer.util.parseExpr,
	  get: observer.util.get,
	  has: function has(object, path) {
	    if (object) {
	      path = util.parseExpr(path);
	      var index = 0,
	          l = path.length - 1;
	
	      while (object && index < l) {
	        object = object[path[index++]];
	      }
	      return index == l && object && path[index++] in object;
	    }
	    return false;
	  },
	  set: function set(object, path, value) {
	    if (object) {
	      path = util.parseExpr(path);
	      var obj = object,
	          attr = path[0];
	      for (var i = 0, l = path.length - 1; i < l; i++) {
	        if (!obj[attr]) obj = obj[attr] = {};
	        attr = path[i + 1];
	      }
	      obj[attr] = value;
	    }
	    return object;
	  },
	  eachKeys: function eachKeys(obj, callback, own) {
	    obj = observer.obj(obj);
	    for (var key in obj) {
	      if (own === false || hasOwn.call(obj, key)) if (callback(key) === false) return false;
	    }
	    return true;
	  },
	  eachObj: function eachObj(obj, callback, own) {
	    obj = observer.obj(obj);
	    for (var key in obj) {
	      if (own === false || hasOwn.call(obj, key)) if (callback(obj[key], key) === false) return false;
	    }
	    return true;
	  },
	  each: function each(arr, callback) {
	    for (var i = 0, l = arr.length; i < l; i++) {
	      callback(arr[i], i);
	    }
	  },
	
	  prototypeOf: Object.getPrototypeOf || function getPrototypeOf(obj) {
	    return obj.__proto__;
	  },
	  setPrototypeOf: Object.setPrototypeOf || function setPrototypeOf(obj, proto) {
	    obj.__proto__ = proto;
	  },
	  assign: Object.assign || function assign(target) {
	    var to = Object(target),
	        nextSource = void 0,
	        key = void 0;
	    for (var i = 1, l = arguments.length; i < l; i++) {
	      nextSource = Object(arguments[i]);
	      for (key in nextSource) {
	        if (hasOwn.call(nextSource, key)) to[key] = nextSource[key];
	      }
	    }
	    return to;
	  },
	  assignIf: function assignIf(target) {
	    var to = Object(target),
	        nextSource = void 0,
	        key = void 0;
	    for (var i = 1, l = arguments.length; i < l; i++) {
	      nextSource = Object(arguments[i]);
	      for (key in nextSource) {
	        if (hasOwn.call(nextSource, key) && !hasOwn.call(to, key)) to[key] = nextSource[key];
	      }
	    }
	    return to;
	  },
	
	  create: Object.create || function create() {
	    function Temp() {}
	    return function (O, props) {
	      if ((typeof O === 'undefined' ? 'undefined' : _typeof(O)) != 'object') throw TypeError('Object prototype may only be an Object or null');
	
	      Temp.prototype = O;
	      var obj = new Temp();
	      Temp.prototype = undefined;
	      if (props) {
	        for (var prop in props) {
	          if (hasOwn.call(props, prop)) obj[prop] = props[prop];
	        }
	      }
	      return obj;
	    };
	  }(),
	  keys: Object.keys || function keys(obj, own) {
	    var arr = [];
	    for (var key in obj) {
	      if (own === false || hasOwn.call(obj, key)) arr.push(key);
	    }
	    return arr;
	  },
	  trim: ''.trim ? function trim(str) {
	    return str.trim();
	  } : function trim(str) {
	    return str.replace(trimReg, '');
	  },
	  capitalize: function capitalize(str) {
	    return str;
	  },
	  upperFirst: function upperFirst(str) {
	    return str.replace(strFirstLetterReg, strUpperFirstProcessor);
	  },
	  hump: function hump(str) {
	    return str.replace(strHumpReg, strHumpProcessor);
	  },
	  isNumeric: function isNumeric(n) {
	    return !isNaN(parseFloat(n)) && isFinite(n);
	  }
	};
	function strUpperFirstProcessor(k) {
	  return k.toUpperCase();
	}
	function strHumpProcessor(k) {
	  if (k[0] == '_' || k[0] == '-') return k[1].toUpperCase();
	  return k.toUpperCase();
	}
	
	Object.create = util.create;
	module.exports = util;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var dom = __webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);
	module.exports = dom;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2),
	    W3C = window.dispatchEvent;
	
	var dom = {
	  W3C: W3C,
	  inDoc: function inDoc(el, root) {
	    root = root || document.documentElement;
	    if (root.contains) return root.contains(el);
	
	    try {
	      while (el = el.parentNode) {
	        if (el === root) return true;
	        return false;
	      }
	    } catch (e) {
	      return false;
	    }
	  },
	  query: function query(selectors, all) {
	    if (typeof selectors == 'string') return all ? document.querySelectorAll(selectors) : document.querySelector(selectors);
	    return selectors;
	  },
	  cloneNode: function cloneNode(el, deep) {
	    if (el instanceof Array) {
	      var els = [];
	      for (var i = 0, l = el.length; i < l; i++) {
	        els[i] = el.cloneNode(deep !== false);
	      }return els;
	    } else return el.cloneNode(deep !== false);
	  },
	  remove: function remove(el) {
	    if (el instanceof Array) {
	      var _el = void 0;
	      for (var i = 0, l = el.length; i < l; i++) {
	        _el = el[i];
	        _el.parentNode.removeChild(_el);
	      }
	    } else el.parentNode.removeChild(el);
	  },
	  before: function before(el, target) {
	    if (target instanceof Array) target = target[0];
	
	    var parent = target.parentNode;
	
	    if (el instanceof Array) {
	      for (var i = 0, l = el.length; i < l; i++) {
	        parent.insertBefore(el[i], target);
	      }
	    } else parent.insertBefore(el, target);
	  },
	  after: function after(el, target) {
	    if (target instanceof Array) target = target[target.length - 1];
	
	    var parent = target.parentNode;
	
	    if (el instanceof Array) {
	      for (var i = 0, l = el.length; i < l; i++) {
	        insertAfter(parent, el[i], target);
	      }
	    } else insertAfter(parent, el, target);
	  },
	  append: function append(el, target) {
	    if (target instanceof Array) {
	      for (var i = 0, l = target.length; i < l; i++) {
	        el.appendChild(target[i]);
	      }
	    } else el.appendChild(target);
	  },
	  prepend: function prepend(el, target) {
	    if (el.firstChild) {
	      dom.before(target, el.firstChild);
	    } else {
	      dom.append(el, target);
	    }
	  },
	  html: function html(el, _html) {
	    if (arguments.length > 1) return el.innerHTML = _html;
	    return el.innerHTML;
	  },
	  outerHtml: function outerHtml(el) {
	    if (el.outerHTML) {
	      return el.outerHTML;
	    } else {
	      var container = document.createElement('div');
	      container.appendChild(el.cloneNode(true));
	      return container.innerHTML;
	    }
	  },
	  text: function text(el, _text) {
	    if (el.nodeType == 3) {
	      if (arguments.length > 1) return el.data = _text;
	      return el.data;
	    } else {
	      return dom.html.apply(this, arguments);
	    }
	  },
	  focus: function focus(el) {
	    el.focus();
	  }
	};
	module.exports = dom;
	
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
	
	function insertAfter(parentEl, el, target) {
	  if (parentEl.lastChild == target) parentEl.appendChild(el);else parentEl.insertBefore(el, target.nextSibling);
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(5);
	
	_.assign(dom, {
	  prop: function prop(elem, name, value) {
	    name = propFix[name] || name;
	    var hook = propHooks[name];
	    if (arguments.length > 2) {
	      if (hook && hook.set) return hook.set(elem, name, value);
	      return elem[name] = value;
	    } else {
	      if (hook && hook.get) return hook.get(elem, name);
	      return elem[name];
	    }
	  },
	  attr: function attr(el, _attr, val) {
	    if (arguments.length > 2) return el.setAttribute(_attr, val);
	    return el.getAttribute(_attr);
	  },
	  removeAttr: function removeAttr(el, attr) {
	    el.removeAttribute(attr);
	  },
	  checked: function checked(el, check) {
	    if (arguments.length > 1) return dom.prop(el, 'checked', check);
	    return dom.prop(el, 'checked');
	  },
	  'class': function _class(el, cls) {
	    if (arguments.length > 1) return dom.prop(el, 'class', cls);
	    return dom.prop(el, 'class');
	  },
	  addClass: function addClass(el, cls) {
	    if (el.classList) {
	      el.classList.add(cls);
	    } else {
	      var cur = ' ' + (dom.prop(el, 'class') || '') + ' ';
	      if (cur.indexOf(' ' + cls + ' ') < 0) {
	        dom['class'](el, _.trim(cur + cls));
	      }
	    }
	  },
	  removeClass: function removeClass(el, cls) {
	    if (el.classList) {
	      el.classList.remove(cls);
	    } else {
	      var cur = ' ' + (dom.prop(el, 'class') || '') + ' ';
	      var tar = ' ' + cls + ' ';
	      while (cur.indexOf(tar) >= 0) {
	        cur = cur.replace(tar, ' ');
	      }
	      dom['class'](el, _.trim(cur));
	    }
	  },
	  style: function style(el, _style) {
	    if (arguments.length > 1) return dom.prop(el, 'style', _style);
	    return dom.prop(el, 'style');
	  }
	});
	
	module.exports = dom;
	
	var rfocusable = /^(?:input|select|textarea|button|object)$/i,
	    rclickable = /^(?:a|area)$/i,
	    propFix = dom.propFix = {
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
	},
	    propHooks = dom.propHooks = {
	  tabIndex: {
	    get: function get(elem) {
	      var attributeNode = elem.getAttributeNode('tabindex');
	
	      return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : undefined;
	    }
	  }
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(5);
	
	_.assign(dom, {
	  css: function css(el, name, value) {
	    var prop = /[_-]/.test(name) ? camelize(name) : name,
	        hook = void 0;
	
	    name = cssName(prop) || prop;
	    hook = cssHooks[prop] || cssDefaultHook;
	    if (arguments.length == 2 || typeof value === 'boolean') {
	      var convert = value,
	          num = void 0;
	
	      if (name === 'background') name = 'backgroundColor';
	      value = hook.get(el, name);
	      return convert !== false && isFinite(num = parseFloat(value)) ? num : value;
	    } else if (value === '' || value === undefined || value === null) {
	      el.style[name] = '';
	    } else {
	      if (isFinite(value) && !cssNumber[prop]) value += 'px';
	      hook.set(el, name, value);
	    }
	  },
	
	  position: function position(el) {
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
	  scrollTop: function scrollTop(el, val) {
	    var win = getWindow(el);
	    if (arguments.length == 1) {
	      return (win ? 'scrollTop' in win ? win.scrollTop : root.pageYOffset : el.pageYOffset) || 0;
	    } else if (win) {
	      win.scrollTo(dom.scrollLeft(el), val);
	    } else {
	      el.pageYOffset = val;
	    }
	  },
	  scrollLeft: function scrollLeft(el, val) {
	    var win = getWindow(el);
	    if (arguments.length == 1) {
	      return (win ? 'scrollLeft' in win ? win.scrollLeft : root.pageXOffset : el.pageXOffset) || 0;
	    } else if (win) {
	      win.scrollTo(val, dom.scrollTop(el));
	    } else {
	      el.pageXOffset = val;
	    }
	  },
	  scroll: function scroll(el, left, top) {
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
	  }
	});
	
	module.exports = dom;
	
	var cssFix = dom.cssFix = {
	  'float': dom.W3C ? 'cssFloat' : 'styleFloat'
	},
	    cssHooks = dom.cssHooks = {},
	    cssDefaultHook = {},
	    prefixes = ['', '-webkit-', '-o-', '-moz-', '-ms-'],
	    cssNumber = {
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
	},
	    cssShow = {
	  position: 'absolute',
	  visibility: 'hidden',
	  display: 'block'
	},
	    rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	    root = document.documentElement,
	    css = dom.css;
	
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
	    get: function get(el, name) {
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
	      get: function get(el, name) {
	        var alpha = el.filters.alpha || el.filters[salpha],
	            op = alpha && alpha.enabled ? alpha.opacity : 100;
	
	        return op / 100 + '';
	      },
	      set: function set(el, name, value) {
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
	    get: function get(el, name) {
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
	      return val + css(el, 'margin' + which[0], true) + css(el, 'margin' + which[1], true);
	    if (boxSizing < 0) // padding-box  -2
	      val = val - css(el, 'border' + which[0] + 'Width', true) - css(el, 'border' + which[1] + 'Width', true);
	    if (boxSizing === -4) // content-box -4
	      val = val - css(el, 'padding' + which[0], true) - css(el, 'padding' + which[1], true);
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
	  while (offsetParent && css(offsetParent, "position") === "static") {
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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(5);
	
	_.assign(dom, {
	  val: function val(el, _val) {
	    var hook = valHooks[el.type || el.tagName.toLowerCase()];
	    if (arguments.length > 1) {
	      if (hook && hook.set) {
	        hook.set(el, _val);
	      } else {
	        if (_val === undefined || _val === null || _val === NaN) {
	          _val = '';
	        } else if (typeof _val != 'string') _val = _val + '';
	        el.value = _val;
	      }
	    } else {
	      if (hook && hook.get) {
	        return hook.get(el);
	      } else return el.value || '';
	    }
	  }
	});
	
	module.exports = dom;
	
	var valHooks = dom.valHooks = {
	  option: {
	    get: function get(elem) {
	      var val = elem.attributes.value;
	      return !val || val.specified ? elem.value : elem.text;
	    }
	  },
	
	  select: {
	    get: function get(elem) {
	      var signle = elem.type == 'select-one',
	          index = elem.selectedIndex;
	      if (index < 0) return signle ? undefined : [];
	
	      var options = elem.options,
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
	
	    set: function set(elem, value) {
	      var signle = elem.type == 'select-one',
	          options = elem.options,
	          option = void 0,
	          i = void 0,
	          l = void 0;
	
	      elem.selectedIndex = -1;
	      if (value instanceof Array) {
	        if (signle) {
	          value = value[0];
	        } else {
	          if (!value.length) return;
	          var vals = {};
	          for (i = 0, l = value.length; i < l; i++) {
	            vals[value[i]] = true;
	          }for (i = 0, l = options.length; i < l; i++) {
	            option = options[i];
	            if (vals[dom.val(option)] === true) option.selected = true;
	          }
	          return;
	        }
	      }
	      if (value !== undefined && value !== null) {
	        if (typeof value != 'string') value = value + '';
	        for (i = 0, l = options.length; i < l; i++) {
	          option = options[i];
	          if (dom.val(option) == value) {
	            option.selected = true;
	            return;
	          }
	        }
	      }
	    }
	  }
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(5);
	var Map = _.Map;
	var W3C = dom.W3C;
	var root = document.documentElement;
	
	_.assign(dom, {
	  on: function on(el, type, cb, once) {
	    if (eventListeners.addHandler(el, type, cb, once === true)) {
	      canBubbleUp[type] ? delegateEvent(type, cb) : bandEvent(el, type, cb);
	      return cb;
	    }
	    return false;
	  },
	  once: function once(el, type, cb) {
	    return dom.on(el, type, cb, true);
	  },
	  off: function off(el, type, cb) {
	    if (eventListeners.removeHandler(el, type, cb)) {
	      canBubbleUp[type] ? undelegateEvent(type, cb) : unbandEvent(el, type, cb);
	      return cb;
	    }
	    return false;
	  },
	  dispatchEvent: function dispatchEvent(el, type, opts) {
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
	
	module.exports = dom;
	
	var mouseEventReg = /^(?:mouse|contextmenu|drag)|click/,
	    keyEventReg = /^key/,
	    eventProps = ['altKey', 'bubbles', 'cancelable', 'ctrlKey', 'currentTarget', 'propertyName', 'eventPhase', 'metaKey', 'relatedTarget', 'shiftKey', 'target', 'view', 'which'],
	    eventFixHooks = {},
	    keyEventFixHook = {
	  props: ['char', 'charCode', 'key', 'keyCode'],
	  fix: function fix(event, original) {
	    if (event.which == null) event.which = original.charCode != null ? original.charCode : original.keyCode;
	  }
	},
	    mouseEventFixHook = {
	  props: ['button', 'buttons', 'clientX', 'clientY', 'offsetX', 'offsetY', 'pageX', 'pageY', 'screenX', 'screenY', 'toElement'],
	  fix: function fix(event, original) {
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
	    _classCallCheck(this, Event);
	
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
	
	var eventListeners = new Map();
	_.assign(eventListeners, {
	  addHandler: function addHandler(el, type, handler, once) {
	    if (!(typeof handler === 'undefined' ? 'undefined' : _typeof(handler)) == 'function') throw TypeError('Invalid Event Handler');
	
	    var listens = eventListeners.get(el),
	        handlers = void 0;
	
	    if (!listens) {
	      listens = {
	        typeNR: 0,
	        handlers: {}
	      };
	      eventListeners.set(el, listens);
	    }
	    if (!(handlers = listens.handlers[type])) {
	      handlers = listens.handlers[type] = [{
	        handler: handler,
	        once: once
	      }];
	      listens.typeNR++;
	      return true;
	    }
	    handlers.push({
	      handler: handler,
	      once: once
	    });
	    return false;
	  },
	  removeHandler: function removeHandler(el, type, handler) {
	    var listens = eventListeners.get(el),
	        handlers = listens ? listens.handlers[type] : undefined;
	
	    if (handlers) {
	      for (var i = 0, l = handlers.length; i < l; i++) {
	        if (handlers[i].handler == handler) {
	          handlers.splice(i, 1);
	          if (!handlers.length) {
	            delete listens.handlers[type];
	            listens.typeNR--;
	            if (!listens.typeNR) eventListeners['delete'](el);
	            return true;
	          }
	          return false;
	        }
	      }
	    }
	    return false;
	  },
	  getHandlers: function getHandlers(el, type) {
	    var listens = eventListeners.get(el),
	        handlers = listens ? listens.handlers[type] : undefined;
	
	    if (handlers) handlers = handlers.slice();
	    return handlers;
	  },
	  hasHandler: function hasHandler(el, type) {
	    var listens = eventListeners.get(el);
	    return listens ? listens.handlers[type] || false : false;
	  }
	});
	
	var bind = W3C ? function (el, type, fn, capture) {
	  el.addEventListener(type, fn, capture);
	} : function (el, type, fn) {
	  el.attachEvent('on' + type, fn);
	},
	    unbind = W3C ? function (el, type, fn) {
	  el.removeEventListener(type, fn);
	} : function (el, type, fn) {
	  el.detachEvent('on' + type, fn);
	},
	    canBubbleUpArray = ['click', 'dblclick', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseup', 'mouseover', 'mouseout', 'wheel', 'mousewheel', 'input', 'change', 'beforeinput', 'compositionstart', 'compositionupdate', 'compositionend', 'select', 'cut', 'copy', 'paste', 'beforecut', 'beforecopy', 'beforepaste', 'focusin', 'focusout', 'DOMFocusIn', 'DOMFocusOut', 'DOMActivate', 'dragend', 'datasetchanged'],
	    canBubbleUp = {},
	    focusBlur = {
	  focus: true,
	  blur: true
	},
	    eventHooks = {},
	    eventHookTypes = {},
	    delegateEvents = {};
	
	_.each(canBubbleUpArray, function (name) {
	  canBubbleUp[name] = true;
	});
	if (!W3C) {
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
	    bandEvent(root, type, cb);
	    delegateEvents[type] = 1;
	  } else {
	    delegateEvents[type]++;
	  }
	}
	
	function undelegateEvent(type, cb) {
	  if (delegateEvents[type]) {
	    delegateEvents[type]--;
	    if (!delegateEvents[type]) unbandEvent(root, type, cb);
	  }
	}
	
	var last = new Date();
	function dispatchElement(el, event, isMove) {
	  var handlers = eventListeners.getHandlers(el, event.type);
	
	  if (handlers) {
	    event.currentTarget = el;
	    var handler = void 0,
	        i = void 0,
	        l = void 0;
	    for (i = 0, l = handlers.length; i < l && !event.isImmediatePropagationStopped; i++) {
	      handler = handlers[i];
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
	  if (type = eventHookTypes[type]) {
	    var hook = eventHooks[type];
	    if (hook && hook.fix && hook.fix(el, event) === false) return;
	    event.type = type;
	    dispatchEvent(el, type, event);
	  } else {
	    dispatchEvent(el, type, event);
	  }
	}
	
	//针对firefox, chrome修正mouseenter, mouseleave
	if (!('onmouseenter' in root)) {
	  _.eachObj({
	    mouseenter: 'mouseover',
	    mouseleave: 'mouseout'
	  }, function (origType, fixType) {
	    eventHooks[origType] = {
	      type: fixType,
	      fix: function fix(elem, event, fn) {
	        var t = event.relatedTarget;
	        return !t || t !== elem && !(elem.compareDocumentPosition(t) & 16);
	      }
	    };
	  });
	}
	//针对IE9+, w3c修正animationend
	_.eachObj({
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
	    fix: function fix(elem, event) {
	      return event.propertyName == 'value';
	    }
	  };
	  eventHooks.change = {
	    bind: function bind(elem) {
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
	    unbind: function unbind(elem) {
	      if (elem.type == 'checkbox' || elem.type == 'radio') {
	        dom.off(elem, 'click', elem.$onchange);
	        return false;
	      }
	    }
	  };
	} else if (navigator.userAgent.indexOf('MSIE 9') !== -1) {
	  eventHooks.input = {
	    type: 'input',
	    fix: function fix(elem) {
	      elem.oldValue = elem.value;
	    }
	  };
	  // http://stackoverflow.com/questions/6382389/oninput-in-ie9-doesnt-fire-when-we-hit-backspace-del-do-cut
	  document.addEventListener('selectionchange', function (event) {
	    var actEl = document.activeElement;
	    if (actEl.tagName === 'TEXTAREA' || actEl.tagName === 'INPUT' && actEl.type === 'text') {
	      if (actEl.value == actEl.oldValue) return;
	      actEl.oldValue = actEl.value;
	      if (eventListeners.hasHandler(actEl, 'input')) {
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
	      fix: function fix(elem, event) {
	        event.wheelDeltaY = event.wheelDelta = event[fixWheelDelta] > 0 ? -120 : 120;
	        event.wheelDeltaX = 0;
	        return true;
	      }
	    };
	  })();
	}
	_.eachObj(eventHooks, function (hook, type) {
	  eventHookTypes[hook.type || type] = type;
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var observer = __webpack_require__(3);
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(4);
	
	var _require = __webpack_require__(11);
	
	var Text = _require.Text;
	var Directive = _require.Directive;
	var DirectiveGroup = _require.DirectiveGroup;
	
	
	function cpyChildNodes(el) {
	  var els = [],
	      childNodes = el.childNodes;
	  for (var i = 0, l = childNodes.length; i < l; i++) {
	    els[i] = childNodes[i];
	  }return els;
	}
	
	var TemplateInstance = function () {
	  function TemplateInstance(el, scope, delimiterReg, directiveReg) {
	    _classCallCheck(this, TemplateInstance);
	
	    this.delimiterReg = delimiterReg;
	    this.directiveReg = directiveReg;
	    this.scope = observer.proxy.proxy(scope) || scope;
	    this._scopeProxyListen = _.bind.call(this._scopeProxyListen, this);
	    observer.proxy.on(this.scope, this._scopeProxyListen);
	    this.bindings = this.parse(el, this);
	    this.binded = false;
	    this.bind();
	    this.els = cpyChildNodes(el);
	  }
	
	  TemplateInstance.prototype.parentEl = function parentEl() {
	    return this.els[0].parentNode;
	  };
	
	  TemplateInstance.prototype.before = function before(target) {
	    dom.before(this.els, dom.query(target));
	    return this;
	  };
	
	  TemplateInstance.prototype.after = function after(target) {
	    dom.after(this.els, dom.query(target));
	    return this;
	  };
	
	  TemplateInstance.prototype.prependTo = function prependTo(target) {
	    dom.prepend(dom.query(target), this.els);
	    return this;
	  };
	
	  TemplateInstance.prototype.appendTo = function appendTo(target) {
	    dom.append(dom.query(target), this.els);
	    return this;
	  };
	
	  TemplateInstance.prototype.bind = function bind() {
	    if (this.binded) return;
	    var bindings = this.bindings;
	    for (var i = 0, l = bindings.length; i < l; i++) {
	      bindings[i].bind();
	    }
	    this.binded = true;
	    return this;
	  };
	
	  TemplateInstance.prototype.unbind = function unbind() {
	    if (!this.binded) return;
	    var bindings = this.bindings;
	    for (var i = 0, l = bindings.length; i < l; i++) {
	      bindings[i].unbind();
	    }
	    this.binded = false;
	    return this;
	  };
	
	  TemplateInstance.prototype.destroy = function destroy() {
	    observer.proxy.un(this.scope, this._scopeProxyListen);
	    var bindings = this.bindings;
	    for (var i = 0, l = bindings.length; i < l; i++) {
	      if (this.binded) bindings[i].unbind();
	      bindings[i].destroy();
	    }
	    dom.remove(this.els);
	    this.bindings = undefined;
	    this.scope = undefined;
	  };
	
	  TemplateInstance.prototype._scopeProxyListen = function _scopeProxyListen(obj, proxy) {
	    this.scope = proxy || obj;
	  };
	
	  TemplateInstance.prototype.parse = function parse(els) {
	    if (els.jquery || els instanceof Array) {
	      var bindings = [];
	      for (var i = 0, l = els.length; i < l; i++) {
	        bindings.push.apply(bindings, this.parseEl(els[i]));
	      }
	      return bindings;
	    }
	    return this.parseEl(els);
	  };
	
	  TemplateInstance.prototype.parseEl = function parseEl(el) {
	    switch (el.nodeType) {
	      case 1:
	        return this.parseElement(el);
	      case 3:
	        return this.parseText(el);
	    }
	  };
	
	  TemplateInstance.prototype.parseText = function parseText(el) {
	    var text = el.data,
	        delimiterReg = this.delimiterReg,
	        token = void 0,
	        lastIndex = 0,
	        bindings = [];
	
	    while (token = delimiterReg.exec(text)) {
	
	      this.createTextNode2(text.substring(lastIndex, delimiterReg.lastIndex - token[0].length), el);
	
	      bindings.push(new Text(this.createTextNode('binding', el), this, token[1]));
	
	      lastIndex = delimiterReg.lastIndex;
	    }
	
	    if (bindings.length) {
	
	      this.createTextNode2(text.substr(lastIndex), el);
	
	      dom.remove(el);
	    }
	
	    return bindings;
	  };
	
	  TemplateInstance.prototype.parseElement = function parseElement(el) {
	    var block = false,
	        directives = [],
	        attributes = el.attributes,
	        attribute = void 0,
	        name = void 0,
	        directiveName = void 0,
	        directiveConst = void 0,
	        directiveConsts = [];
	
	    for (var i = 0, l = attributes.length; i < l; i++) {
	      attribute = attributes[i];
	      name = attribute.name;
	      directiveName = this.parseDirectiveName(name);
	      if (!directiveName) continue;
	
	      directiveConst = Directive.getDirective(directiveName);
	      if (!directiveConst) {
	        console.warn('Directive is undefined ' + name);
	        continue;
	      }
	
	      if (directiveConst.prototype.abstract) {
	        block = true;
	        directiveConsts = [{
	          'const': directiveConst,
	          expression: attribute.value,
	          attr: name
	        }];
	        break;
	      } else {
	        directiveConsts.push({
	          'const': directiveConst,
	          expression: attribute.value,
	          attr: name
	        });
	        if (directiveConst.prototype.block) block = true;
	      }
	    }
	    if (directiveConsts.length) directives.push(new DirectiveGroup(el, this, directiveConsts));
	    if (!block) directives.push.apply(directives, this.parseChildNodes(el));
	    return directives;
	  };
	
	  TemplateInstance.prototype.parseChildNodes = function parseChildNodes(el) {
	    return this.parse(cpyChildNodes(el));
	  };
	
	  TemplateInstance.prototype.parseDirectiveName = function parseDirectiveName(name) {
	    var directiveName = name.replace(this.directiveReg, '');
	    return directiveName == name ? undefined : directiveName;
	  };
	
	  TemplateInstance.prototype.createTextNode = function createTextNode(content, before) {
	    var el = document.createTextNode(content);
	    dom.before(el, before);
	    return el;
	  };
	
	  TemplateInstance.prototype.createTextNode2 = function createTextNode2(content, before) {
	    if (content = _.trim(content)) {
	      return this.createTextNode(content, before);
	    }
	    return undefined;
	  };
	
	  return TemplateInstance;
	}();
	
	module.exports = TemplateInstance;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2);
	_.each(['abstractBinding', 'binding', 'text', 'directive', 'directiveGroup', 'text'], function (name) {
	  module.exports[_.upperFirst(name)] = __webpack_require__(12)("./" + name);
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./abstractBinding": 13,
		"./abstractBinding.js": 13,
		"./binding": 14,
		"./binding.js": 14,
		"./directive": 15,
		"./directive.js": 15,
		"./directiveGroup": 16,
		"./directiveGroup.js": 16,
		"./index": 11,
		"./index.js": 11,
		"./text": 17,
		"./text.js": 17
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 12;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2);
	
	var AbstractBinding = function () {
	  function AbstractBinding(tpl) {
	    _classCallCheck(this, AbstractBinding);
	
	    this.tpl = tpl;
	    this.binded = false;
	  }
	
	  AbstractBinding.prototype.destroy = function destroy() {};
	
	  AbstractBinding.prototype.scope = function scope() {
	    return this.tpl.scope;
	  };
	
	  AbstractBinding.prototype.realScope = function realScope() {
	    return _.obj(this.tpl.scope);
	  };
	
	  AbstractBinding.prototype.propScope = function propScope(prop) {
	    var scope = this.tpl.scope,
	        parent = scope.$parent;
	
	    if (!parent) return scope;
	
	    while (parent && !_.hasOwnProp(scope, prop)) {
	      scope = parent;
	      parent = scope.$parent;
	    }
	    return _.proxy(scope) || scope;
	  };
	
	  AbstractBinding.prototype.exprScope = function exprScope(expr) {
	    var scope = this.tpl.scope,
	        parent = scope.$parent,
	        prop = void 0;
	
	    if (!parent) return scope;
	
	    prop = _.parseExpr(expr)[0];
	    while (parent && !_.hasOwnProp(scope, prop)) {
	      scope = parent;
	      parent = scope.$parent;
	    }
	    return _.proxy(scope) || scope;
	  };
	
	  AbstractBinding.prototype.observe = function observe(expr, callback) {
	    _.observe(this.exprScope(expr), expr, callback);
	  };
	
	  AbstractBinding.prototype.unobserve = function unobserve(expr, callback) {
	    _.unobserve(this.exprScope(expr), expr, callback);
	  };
	
	  AbstractBinding.prototype.get = function get(expr) {
	    return _.get(this.tpl.scope, expr);
	  };
	
	  AbstractBinding.prototype.has = function has(expr) {
	    return _.has(this.tpl.scope, expr);
	  };
	
	  AbstractBinding.prototype.set = function set(expr, value) {
	    _.set(this.tpl.scope, expr, value);
	  };
	
	  AbstractBinding.prototype.bind = function bind() {};
	
	  AbstractBinding.prototype.unbind = function unbind() {};
	
	  return AbstractBinding;
	}();
	
	module.exports = AbstractBinding;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var AbstractBinding = __webpack_require__(13),
	    exprReg = /((?:'[^']*')*(?:(?:[^\|']+(?:'[^']*')*[^\|']*)+|[^\|]+))|^$/g,
	    filterReg = /^$/g;
	
	var Binding = function (_AbstractBinding) {
	  _inherits(Binding, _AbstractBinding);
	
	  function Binding(tpl, expr) {
	    _classCallCheck(this, Binding);
	
	    var _this = _possibleConstructorReturn(this, _AbstractBinding.call(this, tpl));
	
	    _this.expr = expr;
	    return _this;
	  }
	
	  return Binding;
	}(AbstractBinding);
	
	Binding.generateComments = true;
	
	module.exports = Binding;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(4),
	    Binding = __webpack_require__(14),
	    SUPER_CLASS_OPTION = 'extend',
	    directives = {};
	
	var Directive = function (_Binding) {
	  _inherits(Directive, _Binding);
	
	  function Directive(el, tpl, expr, attr) {
	    _classCallCheck(this, Directive);
	
	    var _this = _possibleConstructorReturn(this, _Binding.call(this, tpl, expr));
	
	    _this.el = el;
	    _this.attr = attr;
	    dom.removeAttr(_this.el, _this.attr);
	    if (Binding.generateComments) {
	      _this.comment = document.createComment(' Directive:' + _this.name + ' [' + _this.expr + '] ');
	      dom.before(_this.comment, _this.el);
	    }
	    return _this;
	  }
	
	  return Directive;
	}(Binding);
	
	Directive.prototype.name = 'Unkown';
	Directive.prototype.abstract = false;
	Directive.prototype.block = false;
	Directive.prototype.priority = 5;
	
	var isDirective = Directive.isDirective = function isDirective(object) {
	  // TODO IE Shim
	  return true;
	  var type = typeof object === 'undefined' ? 'undefined' : _typeof(object);
	  if (!object || type != 'function' && type != 'object') {
	    return false;
	  }
	  var proto = object;
	  while (proto = _.prototypeOf(proto)) {
	    if (proto === Directive) return true;
	  }
	  return false;
	};
	
	Directive.getDirective = function getDirective(name) {
	  return directives[name];
	};
	
	Directive.register = function register(name, option) {
	  if (name in directives) {
	    console.warn('Directive[' + name + '] is defined');
	  }
	  var directive = void 0;
	  if (typeof option == 'function') {
	    if (!isDirective(option)) throw TypeError('Invalid Directive constructor ' + option);
	    directive = option;
	    directive.prototype.className = directive.prototype.className || directive.name;
	  } else if (option && (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object') {
	
	    directive = function (opt, SuperClass) {
	      var userSuperClass = opt[SUPER_CLASS_OPTION];
	      if (false) throw TypeError('Invalid Directive SuperClass ' + userSuperClass);
	      SuperClass = userSuperClass || SuperClass;
	
	      var constructor = typeof opt.constructor == 'function' ? opt.constructor : undefined,
	          Directive = function DynamicDirective() {
	        if (!(this instanceof SuperClass)) throw new TypeError('Cannot call a class as a function');
	
	        SuperClass.apply(this, arguments);
	        if (constructor) constructor.apply(this, arguments);
	      };
	
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
	
	      _.eachObj(opt, function (val, key) {
	        Directive.prototype[key] = val;
	      });
	
	      _.setPrototypeOf(Directive, SuperClass);
	      return Directive;
	    }(option, Directive);
	
	    directive.prototype.className = _.hump(name) + 'Directive';
	  } else throw TypeError('Invalid Directive Object ' + option);
	
	  name = name.toLowerCase();
	  directive.prototype.name = name;
	
	  directives[name] = directive;
	  return directive;
	};
	
	module.exports = Directive;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var AbstractBinding = __webpack_require__(13);
	
	var _require = __webpack_require__(2);
	
	var YieId = _require.YieId;
	
	var DirectiveGroup = function (_AbstractBinding) {
	  _inherits(DirectiveGroup, _AbstractBinding);
	
	  function DirectiveGroup(el, tpl, directiveConfigs) {
	    _classCallCheck(this, DirectiveGroup);
	
	    var _this = _possibleConstructorReturn(this, _AbstractBinding.call(this, tpl));
	
	    _this.el = el;
	    _this.directiveConfigs = directiveConfigs.sort(function (a, b) {
	      return b['const'].prototype.priority - a['const'].prototype.priority || 0;
	    });
	    _this.directives = [];
	    _this.bindedCount = 0;
	    return _this;
	  }
	
	  DirectiveGroup.prototype.bind = function bind() {
	    _AbstractBinding.prototype.bind.call(this);
	    var directives = this.directives,
	        directiveConfigs = this.directiveConfigs,
	        tpl = this.tpl,
	        el = this.el,
	        directiveCount = this.directiveConfigs.length,
	        self = this;
	    function parse() {
	      var idx = self.bindedCount,
	          directive = directives[idx],
	          ret = void 0;
	      if (!directive) {
	        var cfg = directiveConfigs[idx];
	        directive = directives[idx] = new cfg['const'](el, tpl, cfg.expression, cfg.attr);
	      }
	      ret = directive.bind();
	      if (++self.bindedCount < directiveCount) {
	        if (ret && ret instanceof YieId) ret.then(parse);else parse();
	      }
	    }
	    parse();
	  };
	
	  DirectiveGroup.prototype.unbind = function unbind() {
	    _AbstractBinding.prototype.unbind.call(this);
	    var directives = this.directives;
	    for (var i = 0, l = this.bindedCount; i < l; i++) {
	      directives[i].unbind();
	    }
	    this.bindedCount = 0;
	  };
	
	  return DirectiveGroup;
	}(AbstractBinding);
	
	module.exports = DirectiveGroup;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(4),
	    expression = __webpack_require__(18),
	    Binding = __webpack_require__(14),
	    expressionArgs = ['$el'];
	
	var Text = function (_Binding) {
	  _inherits(Text, _Binding);
	
	  function Text(el, tpl, expr) {
	    _classCallCheck(this, Text);
	
	    var _this = _possibleConstructorReturn(this, _Binding.call(this, tpl, expr));
	
	    _this.el = el;
	    _this.observeHandler = _.bind.call(_this.observeHandler, _this);
	    _this.expression = expression.parse(_this.expr, expressionArgs);
	
	    if (Binding.generateComments) {
	      _this.comment = document.createComment('Text Binding ' + _this.expr);
	      dom.before(_this.comment, _this.el);
	    }
	    return _this;
	  }
	
	  Text.prototype.value = function value() {
	    return this.expression.executeAll.call(this, this.scope(), this.el);
	  };
	
	  Text.prototype.bind = function bind() {
	    _Binding.prototype.bind.call(this);
	    var identities = this.expression.identities;
	    for (var i = 0, l = identities.length; i < l; i++) {
	      this.observe(identities[i], this.observeHandler);
	    }this.update(this.value());
	  };
	
	  Text.prototype.unbind = function unbind() {
	    _Binding.prototype.unbind.call(this);
	    var identities = this.expression.identities;
	    for (var i = 0, l = identities.length; i < l; i++) {
	      this.unobserve(identities[i], this.observeHandler);
	    }
	  };
	
	  Text.prototype.observeHandler = function observeHandler(attr, val) {
	    if (this.expression.simplePath) {
	      this.update(this.expression.applyFilter(val, this, [this.scope(), this.el]));
	    } else {
	      this.update(this.value());
	    }
	  };
	
	  Text.prototype.update = function update(val) {
	    if (val === undefined || val === null) {
	      val = '';
	    }
	    if (val !== dom.text(this.el)) dom.text(this.el, val);
	  };
	
	  return Text;
	}(Binding);
	
	module.exports = Text;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.parse = parse;
	var _ = __webpack_require__(2),
	    filter = __webpack_require__(19);
	var defaultKeywords = {
	  'Math': true,
	  'Date': true,
	  'this': true,
	  'true': true,
	  'false': true,
	  'null': true,
	  'undefined': true,
	  'Infinity': true,
	  'NaN': true,
	  'isNaN': true,
	  'isFinite': true,
	  'decodeURI': true,
	  'decodeURIComponent': true,
	  'encodeURI': true,
	  'encodeURIComponent': true,
	  'parseInt': true,
	  'parseFloat': true,
	  '$scope': true
	};
	
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
	  var i = void 0,
	      l = void 0;
	
	  for (i = 0, l = argExprs.length; i < l; i++) {
	    argExprs[i] = makeExecuter(complileExpr(argExprs[i]), keywords);
	    console.log(argExprs[i].toString());
	  }
	  return argExprs;
	}
	
	function compileFilter(filterExprs, keywords) {
	  if (!filterExprs || !filterExprs.length) return [];
	
	  var filters = [],
	      filterExpr = void 0,
	      i = void 0,
	      l = void 0,
	      name = void 0,
	      argExprs = void 0;
	
	  for (i = 0, l = filterExprs.length; i < l; i++) {
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
	  currentKeywords = {};
	  if (keywords) {
	    for (var i = 0, l = keywords.length; i < l; i++) {
	      currentKeywords[keywords[i]] = true;
	    }
	  }
	
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
	      path: _.parseExpr(exp)
	    };
	  } else {
	    ret = {
	      execute: makeExecuter(complileExpr(exp), keywords)
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
	
	    for (var _i = 0, _l = fs.length; _i < _l; _i++) {
	      f = fs[_i];
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
	  var _args = [];
	  for (var i = 0, l = executors.length; i < l; i++) {
	    _args[i] = executors[i].apply(scope, args);
	  }
	  return _args;
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
	
	function parse(exp, args) {
	  exp = _.trim(exp);
	  var res = void 0;
	  if (res = cache[exp]) return res;
	  cache[exp] = res = compileExecuter(exp, args);
	  console.log(res);
	  return res;
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	var _ = __webpack_require__(2),
	    slice = Array.prototype.slice,
	    filters = {};
	function apply(name, data, args, apply) {
	  var f = filters[name],
	      type = f ? f.type : undefined,
	      fn = void 0;
	
	  fn = f ? apply !== false ? f.apply : f.unapply : undefined;
	  if (!fn) {
	    console.warn('filter[' + name + '].' + (apply !== false ? 'apply' : 'unapply') + ' is undefined');
	  } else {
	    if (typeof args == 'function') args = args();
	    data = fn.apply(f, [data].concat(args));
	  }
	  return {
	    stop: type == 'event' && data === false,
	    data: data,
	    replaceData: type !== 'event'
	  };
	}
	var filter = {
	  register: function register(name, filter) {
	    if (filters[name]) throw Error('Filter is existing');
	    if (typeof filter == 'function') filter = {
	      apply: filter
	    };
	    filter.type = filter.type || 'normal';
	    filters[name] = filter;
	  },
	  get: function get(name) {
	    return filters[name];
	  },
	
	
	  apply: apply,
	
	  unapply: function unapply(name, data, args) {
	    return apply(name, data, args, false);
	  }
	};
	
	module.exports = filter;
	
	var keyCodes = exports.keyCodes = {
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
	  key: function key(e) {
	    var keys = slice.call(arguments, 1),
	        codes = {},
	        key = void 0;
	
	    for (var i = 0, l = keys.length; i < l; i++) {
	      key = keys[i];
	      codes[keyCodes[key] || key] = true;
	    }
	    return codes[e.which] || false;
	  },
	  stop: function stop(e) {
	    e.stopPropagation();
	  },
	  prevent: function prevent(e) {
	    e.preventDefault();
	  },
	  self: function self(e) {
	    return e.target === e.currentTarget;
	  }
	};
	_.eachObj(eventFilters, function (fn, name) {
	  filter.register(name, {
	    type: 'event',
	    apply: fn
	  });
	});
	var nomalFilters = {
	  json: {
	    apply: function apply(value, indent) {
	      return typeof value === 'string' ? value : JSON.stringify(value, null, Number(indent) || 2);
	    },
	    unapply: function unapply(value) {
	      try {
	        return JSON.parse(value);
	      } catch (e) {
	        return value;
	      }
	    }
	  },
	
	  capitalize: function capitalize(value) {
	    if (!value && value !== 0) return '';
	    value = value.toString();
	    return value.charAt(0).toUpperCase() + value.slice(1);
	  },
	  uppercase: function uppercase(value) {
	    return value || value === 0 ? value.toString().toUpperCase() : '';
	  },
	  lowercase: function lowercase(value) {
	    return value || value === 0 ? value.toString().toLowerCase() : '';
	  },
	  currency: function currency(value, _currency) {
	    value = parseFloat(value);
	    if (!isFinite(value) || !value && value !== 0) return '';
	    _currency = _currency != null ? _currency : '$';
	    var stringified = Math.abs(value).toFixed(2);
	    var _int = stringified.slice(0, -3);
	    var i = _int.length % 3;
	    var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
	    var _float = stringified.slice(-3);
	    var sign = value < 0 ? '-' : '';
	    return sign + _currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
	  },
	  pluralize: function pluralize(value) {
	    var args = slice.call(arguments, 1);
	    return args.length > 1 ? args[value % 10 - 1] || args[args.length - 1] : args[0] + (value === 1 ? '' : 's');
	  }
	};
	_.eachObj(nomalFilters, function (f, name) {
	  filter.register(name, f);
	});

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2);
	
	module.exports = _.assign({}, __webpack_require__(21), __webpack_require__(22), __webpack_require__(23));

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(4);
	
	var _require = __webpack_require__(11);
	
	var Directive = _require.Directive;
	var TemplateInstance = __webpack_require__(10);
	var eachReg = /^\s*([\s\S]+)\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/;
	var eachAliasReg = /^(\(\s*([^,\s]+)(\s*,\s*([\S]+))?\s*\))|([^,\s]+)(\s*,\s*([\S]+))?$/;
	var EachDirective = exports.EachDirective = function (_Directive) {
	  _inherits(EachDirective, _Directive);
	
	  function EachDirective(el, tpl, expr, attr) {
	    _classCallCheck(this, EachDirective);
	
	    var _this = _possibleConstructorReturn(this, _Directive.call(this, el, tpl, expr, attr));
	
	    _this.observeHandler = _.bind.call(_this.observeHandler, _this);
	    _this.lengthObserveHandler = _.bind.call(_this.lengthObserveHandler, _this);
	
	    var token = expr.match(eachReg);
	    if (!token) throw Error('Invalid Expression[' + expr + '] on Each Directive');
	
	    _this.scopeExpr = token[2];
	    _this.indexExpr = token[4];
	
	    var aliasToken = token[1].match(eachAliasReg);
	    if (!aliasToken) throw Error('Invalid Expression[' + token[1] + '] on Each Directive');
	
	    _this.valueAlias = aliasToken[2] || aliasToken[5];
	    _this.keyAlias = aliasToken[4] || aliasToken[7];
	
	    _this.begin = document.createComment('each begin');
	    dom.before(_this.begin, _this.el);
	    _this.end = document.createComment('each end');
	    dom.after(_this.end, _this.begin);
	
	    dom.remove(_this.el);
	    var div = document.createElement('div');
	    dom.append(div, _this.el);
	    _this.el = div;
	    return _this;
	  }
	
	  EachDirective.prototype.update = function update(data) {
	    var parentScope = this.realScope(),
	        item = void 0,
	        scope = void 0,
	        oldScope = void 0,
	        i = void 0,
	        l = void 0,
	        index = void 0,
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
	
	    for (i = 0, l = data.length; i < l; i++) {
	      item = data[i];
	      index = indexExpr ? _.get(item, indexExpr) : i;
	      scope = !init && cache[index];
	      if (scope) {
	        this.initScope(scope, item, i, index);
	      } else {
	        scope = cache[index] = this.createScope(parentScope, item, i, index);
	        if (!init) added.push(scope);
	      }
	      sort[i] = scope;
	      if (init) {
	        scope.$tpl = new TemplateInstance(dom.cloneNode(this.el), scope, this.tpl.delimiterReg, this.tpl.directiveReg);
	        data[i] = scope[valueAlias];
	        scope.$tpl.before(end);
	      }
	    }
	
	    if (init) return;
	
	    for (i = 0, l = oldSort.length; i < l; i++) {
	      oldScope = oldSort[i];
	      scope = cache[oldScope.$index];
	      if (scope && scope !== sort[oldScope.$sort]) {
	        removed.push(oldScope);
	        cache[oldScope.$index] = undefined;
	      }
	    }
	    for (i = 0, l = added.length; i < l; i++) {
	      scope = added[i];
	      if (oldScope = removed.pop()) {
	        this.initScope(oldScope, scope);
	        cache[scope.$index] = oldScope;
	        sort[scope.$sort] = oldScope;
	        scope = oldScope;
	      } else {
	        scope.$tpl = new TemplateInstance(dom.cloneNode(this.el), scope, this.tpl.delimiterReg, this.tpl.directiveReg);
	      }
	      data[scope.$sort] = scope[valueAlias];
	      scope.$tpl.after(scope.$sort ? sort[scope.$sort - 1].$tpl.els : begin);
	    }
	
	    for (i = 0, l = removed.length; i < l; i++) {
	      removed[i].$tpl.destroy();
	    }
	  };
	
	  EachDirective.prototype.createScope = function createScope(parentScope, value, i, index) {
	    var scope = _.create(parentScope, {});
	    scope.$parent = parentScope;
	    scope.$eachContext = this;
	    scope.$tpl = null;
	    this.initScope(scope, value, i, index, true);
	    return scope;
	  };
	
	  EachDirective.prototype.initScope = function initScope(scope, value, i, index, isCreate) {
	    if (!isCreate) scope = scope.$tpl.scope;
	    scope.$sort = i;
	    scope[this.valueAlias] = value;
	    if (this.keyAlias) scope[this.keyAlias] = i;
	    scope.$index = index;
	  };
	
	  EachDirective.prototype.bind = function bind() {
	    _Directive.prototype.bind.call(this);
	    this.observe(this.scopeExpr, this.observeHandler);
	    this.observe(this.scopeExpr + '.length', this.lengthObserveHandler);
	    this.update(this.target());
	  };
	
	  EachDirective.prototype.unbind = function unbind() {
	    _Directive.prototype.unbind.call(this);
	    this.unobserve(this.scopeExpr, this.observeHandler);
	    this.unobserve(this.scopeExpr + '.length', this.lengthObserveHandler);
	  };
	
	  EachDirective.prototype.target = function target() {
	    return this.get(this.scopeExpr);
	  };
	
	  EachDirective.prototype.observeHandler = function observeHandler(expr, target) {
	    this.update(target);
	  };
	
	  EachDirective.prototype.lengthObserveHandler = function lengthObserveHandler() {
	    this.update(this.target());
	  };
	
	  return EachDirective;
	}(Directive);
	
	EachDirective.prototype.abstract = true;
	EachDirective.prototype.block = true;
	EachDirective.prototype.priority = 10;
	
	Directive.register('each', EachDirective);

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(4);
	
	var _require = __webpack_require__(11);
	
	var Directive = _require.Directive;
	var expression = __webpack_require__(18);
	var expressionArgs = ['$el', '$event'];
	
	function registerDirective(name, opt) {
	  var cls = Directive.register(name, opt);
	  module.exports[cls.prototype.className] = cls;
	}
	
	var EventDirective = exports.EventDirective = function (_Directive) {
	  _inherits(EventDirective, _Directive);
	
	  function EventDirective(el, tpl, expr, attr) {
	    _classCallCheck(this, EventDirective);
	
	    var _this = _possibleConstructorReturn(this, _Directive.call(this, el, tpl, expr, attr));
	
	    _this.handler = _.bind.call(_this.handler, _this);
	    _this.expression = expression.parse(_this.expr, expressionArgs);
	    return _this;
	  }
	
	  EventDirective.prototype.handler = function handler(e) {
	    var scope = this.scope(),
	        exp = this.expression,
	        fn = void 0;
	    e.stopPropagation();
	
	    if (this.expression.applyFilter(e, this, [scope, this.el, e]) === false) return;
	    fn = exp.execute.call(this, scope, this.el, e);
	    if (exp.simplePath) {
	      if (typeof fn != 'function') throw TypeError('Invalid Event Handler:' + this.expr + ' -> ' + fn);
	      var _scope = this.propScope(exp.path[0]);
	      fn.call(_scope, scope, this.el, e, _scope);
	    }
	  };
	
	  EventDirective.prototype.bind = function bind() {
	    _Directive.prototype.bind.call(this);
	    dom.on(this.el, this.eventType, this.handler);
	  };
	
	  EventDirective.prototype.unbind = function unbind() {
	    _Directive.prototype.unbind.call(this);
	    dom.off(this.el, this.eventType, this.handler);
	  };
	
	  return EventDirective;
	}(Directive);
	
	var events = ['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'keydown', 'keypress', 'keyup', 'load', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload', {
	  name: 'oninput',
	  eventType: 'input propertychange'
	}];
	
	_.each(events, function (opt) {
	  opt = (typeof opt === 'undefined' ? 'undefined' : _typeof(opt)) == 'object' ? opt : {
	    eventType: opt
	  };
	  opt.name = opt.name || 'on' + opt.eventType;
	  opt.extend = EventDirective;
	  registerDirective(opt.name, opt);
	});

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(4);
	
	var _require = __webpack_require__(11);
	
	var Directive = _require.Directive;
	var expression = __webpack_require__(18);
	var YieId = _.YieId;
	var expressionArgs = ['$el'];
	var hasOwn = Object.prototype.hasOwnProperty;
	
	function registerDirective(name, opt) {
	  var cls = Directive.register(name, opt);
	  module.exports[cls.prototype.className] = cls;
	}
	
	var SimpleDirective = exports.SimpleDirective = function (_Directive) {
	  _inherits(SimpleDirective, _Directive);
	
	  function SimpleDirective(el, tpl, expr, attr) {
	    _classCallCheck(this, SimpleDirective);
	
	    var _this = _possibleConstructorReturn(this, _Directive.call(this, el, tpl, expr, attr));
	
	    _this.observeHandler = _.bind.call(_this.observeHandler, _this);
	    _this.expression = expression.parse(_this.expr, expressionArgs);
	    return _this;
	  }
	
	  SimpleDirective.prototype.setRealValue = function setRealValue(val) {
	    this.set(this.expr, val);
	  };
	
	  SimpleDirective.prototype.realValue = function realValue() {
	    return this.expression.execute.call(this, this.scope(), this.el);
	  };
	
	  SimpleDirective.prototype.setValue = function setValue(val) {
	    return this.expression.applyFilter(val, this, [this.scope(), this.el], false);
	  };
	
	  SimpleDirective.prototype.value = function value() {
	    return this.expression.executeAll.call(this, this.scope(), this.el);
	  };
	
	  SimpleDirective.prototype.bind = function bind() {
	    _Directive.prototype.bind.call(this);
	    var identities = this.expression.identities;
	    for (var i = 0, l = identities.length; i < l; i++) {
	      this.observe(identities[i], this.observeHandler);
	    }this.update(this.value());
	  };
	
	  SimpleDirective.prototype.unbind = function unbind() {
	    _Directive.prototype.unbind.call(this);
	
	    var identities = this.expression.identities;
	    for (var i = 0, l = identities.length; i < l; i++) {
	      this.unobserve(identities[i], this.observeHandler);
	    }
	  };
	
	  SimpleDirective.prototype.blankValue = function blankValue(val) {
	    if (arguments.length == 0) {
	      val = this.value();
	    }
	    if (val === undefined || val == null) {
	      return '';
	    }
	    return val;
	  };
	
	  SimpleDirective.prototype.observeHandler = function observeHandler(expr, val) {
	    if (this.expression.simplePath) {
	      this.update(this.expression.applyFilter(val, this, [this.scope(), this.el]));
	    } else {
	      this.update(this.value());
	    }
	  };
	
	  SimpleDirective.prototype.update = function update(val) {
	    throw 'Abstract Method [' + this.className + '.update]';
	  };
	
	  return SimpleDirective;
	}(Directive);
	
	var EVENT_CHANGE = 'change',
	    EVENT_INPUT = 'input',
	    EVENT_CLICK = 'click',
	    TAG_SELECT = 'SELECT',
	    TAG_INPUT = 'INPUT',
	    TAG_TEXTAREA = 'TEXTAREA',
	    RADIO = 'radio',
	    CHECKBOX = 'checkbox',
	    directives = {
	  text: {
	    update: function update(val) {
	      dom.text(this.el, this.blankValue(val));
	    },
	
	    block: true
	  },
	  html: {
	    update: function update(val) {
	      dom.html(this.el, this.blankValue(val));
	    },
	
	    block: true
	  },
	  'class': {
	    update: function update(value) {
	      if (value && typeof value == 'string') {
	        this.handleArray(_.trim(value).split(/\s+/));
	      } else if (value instanceof Array) {
	        this.handleArray(value);
	      } else if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
	        this.handleObject(value);
	      } else {
	        this.cleanup();
	      }
	    },
	    handleObject: function handleObject(value) {
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
	    handleArray: function handleArray(value) {
	      this.cleanup(value, true);
	      var keys = this.prevKeys = [],
	          el = this.el;
	      for (var i = 0, l = value.length; i < l; i++) {
	        if (value[i]) {
	          keys.push(value[i]);
	          dom.addClass(el, value[i]);
	        }
	      }
	    },
	    cleanup: function cleanup(value, isArr) {
	      var prevKeys = this.prevKeys;
	      if (prevKeys) {
	        var i = prevKeys.length,
	            el = this.el;
	        while (i--) {
	          var key = prevKeys[i];
	          if (!value || (isArr ? _.indexOf.call(value, key) == -1 : !hasOwn.call(value, key))) {
	            dom.removeClass(el, key);
	          }
	        }
	      }
	    }
	  },
	  'style': {
	    update: function update(value) {
	      if (value && typeof value == 'string') {
	        dom.style(this.el, value);
	      } else if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
	        this.handleObject(value);
	      }
	    },
	    handleObject: function handleObject(value) {
	      this.cleanup(value);
	      var keys = this.prevKeys = [],
	          el = this.el;
	      for (var key in value) {
	        dom.css(el, key, value[key]);
	      }
	    }
	  },
	  show: {
	    update: function update(val) {
	      dom.css(this.el, 'display', val ? '' : 'none');
	    }
	  },
	  hide: {
	    update: function update(val) {
	      dom.css(this.el, 'display', val ? 'none' : '');
	    }
	  },
	  value: {
	    update: function update(val) {
	      dom.val(this.el, this.blankValue(val));
	    }
	  },
	  'if': {
	    bind: function bind() {
	      SimpleDirective.prototype.bind.call(this);
	      if (!this.directives) {
	        this.yieId = new YieId();
	        return this.yieId;
	      }
	    },
	    update: function update(val) {
	      if (!val) {
	        dom.css(this.el, 'display', 'none');
	      } else {
	        if (!this.directives) {
	          var _directives = this.directives = this.tpl.parseChildNodes(this.el);
	
	          for (var i = 0, l = _directives.length; i < l; i++) {
	            _directives[i].bind();
	          }if (this.yieId) {
	            this.yieId.done();
	            delete this.yieId;
	          }
	        }
	        dom.css(this.el, 'display', '');
	      }
	    },
	    unbind: function unbind() {
	      SimpleDirective.prototype.unbind.call(this);
	      if (this.directives) {
	        var _directives2 = this.directives;
	
	        for (var i = 0, l = _directives2.length; i < l; i++) {
	          _directives2[i].unbind();
	        }
	      }
	    },
	
	    priority: 9,
	    block: true
	  },
	  checked: {
	    update: function update(val) {
	      if (val instanceof Array) dom.checked(this.el, _.indexOf.call(val, dom.val(this.el)));else dom.checked(this.el, !!val);
	    }
	  },
	  selected: {
	    update: function update(val) {}
	  },
	  focus: {
	    update: function update(val) {
	      if (!val) return;
	      dom.focus(this.el);
	    }
	  },
	  input: {
	    constructor: function constructor(el) {
	      SimpleDirective.apply(this, arguments);
	
	      this.onChange = _.bind.call(this.onChange, this);
	
	      var tag = this.tag = el.tagName;
	      switch (tag) {
	        case TAG_SELECT:
	          this.event = EVENT_CHANGE;
	          break;
	        case TAG_INPUT:
	          var type = this.type = el.type;
	          this.event = type == RADIO || type == CHECKBOX ? EVENT_CHANGE : EVENT_INPUT;
	          break;
	        case TAG_TEXTAREA:
	          throw TypeError('Directive[input] not support ' + tag);
	          break;
	        default:
	          throw TypeError('Directive[input] not support ' + tag);
	      }
	    },
	    bind: function bind() {
	      SimpleDirective.prototype.bind.call(this);
	      dom.on(this.el, this.event, this.onChange);
	    },
	    unbind: function unbind() {
	      SimpleDirective.prototype.unbind.call(this);
	      dom.off(this.el, this.event, this.onChange);
	    },
	    onChange: function onChange(e) {
	      var val = this.elVal(),
	          idx = void 0,
	          _val = this.val;
	      if (val != _val) this.setValue(val);
	      e.stopPropagation();
	    },
	    update: function update(val) {
	      var _val = this.blankValue(val);
	      if (_val != this.val) {
	        this.elVal(_val);
	        this.val = _val;
	      }
	    },
	    elVal: function elVal(val) {
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
	    },
	
	    priority: 4
	  }
	};
	
	_.eachObj(directives, function (opt, name) {
	  opt.extend = SimpleDirective;
	  registerDirective(name, opt);
	});

/***/ }
/******/ ])
});
;
//# sourceMappingURL=tpl.js.map