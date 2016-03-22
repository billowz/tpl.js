/*!
 * tpl.js v0.0.5 built in Tue, 22 Mar 2016 10:54:37 GMT
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
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__) {
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
	
	var tpl = __webpack_require__(1).Template;
	tpl.expression = __webpack_require__(8);
	tpl.util = __webpack_require__(3);
	tpl.Directive = __webpack_require__(9).Directive;
	tpl.Directives = __webpack_require__(10);
	tpl.EventDirectives = __webpack_require__(11);
	tpl.EachDirective = __webpack_require__(12);
	module.exports = tpl;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var dom = __webpack_require__(2);
	
	var _require = __webpack_require__(5);
	
	var TemplateInstance = _require.TemplateInstance;
	
	
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
	
	var Template = exports.Template = function () {
	  function Template(templ) {
	    var cfg = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    _classCallCheck(this, Template);
	
	    this.el = $(templ);
	
	    this.directivePrefix = cfg.directivePrefix || defaultCfg.directivePrefix;
	    this.delimiter = cfg.delimiter || defaultCfg.delimiter;
	    this.directiveReg = parseDirectiveReg(this.directivePrefix);
	    this.delimiterReg = parseDelimiterReg(this.delimiter);
	  }
	
	  Template.prototype.complie = function complie(scope) {
	    return new TemplateInstance(dom.clone(this.el), scope, this.delimiterReg, this.directiveReg);
	  };
	
	  return Template;
	}();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.clone = clone;
	exports.remove = remove;
	exports.before = before;
	exports.after = after;
	exports.append = append;
	exports.appendTo = appendTo;
	exports.prepend = prepend;
	exports.prependTo = prependTo;
	exports.replace = replace;
	exports.on = on;
	exports.off = off;
	exports.setHtml = setHtml;
	exports.html = html;
	exports.setText = setText;
	exports.text = text;
	exports.setAttr = setAttr;
	exports.removeAttr = removeAttr;
	exports.attr = attr;
	exports.style = style;
	exports.setStyle = setStyle;
	exports.css = css;
	exports.setCss = setCss;
	exports.val = val;
	exports.setVal = setVal;
	exports.checked = checked;
	exports.setChecked = setChecked;
	exports.setClass = setClass;
	exports.addClass = addClass;
	exports.removeClass = removeClass;
	var _ = __webpack_require__(3);
	
	function clone(el) {
	  return $(el).clone();
	}
	
	function remove(el, coll) {
	  $(el).remove();
	}
	
	function before(el, target) {
	  $(el).insertBefore(target);
	}
	
	function after(el, target) {
	  $(el).insertAfter(target);
	}
	
	function append(target, el) {
	  $(target).append(el);
	}
	
	function appendTo(el, target) {
	  append(target, el);
	}
	
	function prepend(target, el) {
	  if (target.firstChild) {
	    before(el, target.firstChild);
	  } else {
	    append(target, el);
	  }
	}
	
	function prependTo(el, target) {
	  prepend(target, el);
	}
	
	function replace(target, el) {
	  var parent = target.parentNode;
	  if (parent) {
	    parent.replaceChild(el, target);
	  }
	}
	
	function on(el, event, cb, useCapture) {
	  $(el).on(event, cb);
	}
	
	function off(el, event, cb) {
	  $(el).off(event, cb);
	}
	
	function setHtml(el, html) {
	  $(el).html(html);
	}
	
	function html(el) {
	  return $(el).html();
	}
	
	function setText(el, text) {
	  el.data = text;
	}
	
	function text(el) {
	  return el.data;
	}
	
	function setAttr(el, attr, val) {
	  el.setAttribute(attr, val);
	}
	
	function removeAttr(el, attr) {
	  el.removeAttribute(attr);
	}
	
	function attr(el, attr) {
	  return el.getAttribute(attr);
	}
	
	function style(el) {
	  return $(el).attr('style');
	}
	
	function setStyle(el, style) {
	  $(el).attr('style', style);
	}
	
	function css(el, name) {
	  return $(el).css(name);
	}
	
	function setCss(el, name, val) {
	  return $(el).css(name, val);
	}
	
	function val(el) {
	  return $(el).val();
	}
	
	function setVal(el, val) {
	  return $(el).val(val);
	}
	
	function checked(el) {
	  return $(el).prop('checked');
	}
	
	function setChecked(el, val) {
	  return $(el).prop('checked', val);
	}
	
	function setClass(el, cls) {
	  /* istanbul ignore if */
	  if (isIE9 && !/svg$/.test(el.namespaceURI)) {
	    el.className = cls;
	  } else {
	    el.setAttribute('class', cls);
	  }
	}
	
	function addClass(el, cls) {
	  $(el).addClass(cls);
	}
	
	function removeClass(el, cls) {
	  $(el).removeClass(cls);
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var observer = __webpack_require__(4);
	
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
	    strHumpReg = /(^[a-zA-Z])|(_[a-zA-Z])/g;
	
	var util = {
	  YieId: YieId,
	  Map: observer.Map,
	  bind: observer.util.bind,
	  indexOf: observer.util.indexOf,
	  prototypeOf: Object.getPrototypeOf || function (obj) {
	    return obj.__proto__;
	  },
	  setPrototypeOf: Object.setPrototypeOf || function (obj, proto) {
	    obj.__proto__ = proto;
	  },
	  create: Object.create || function () {
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
	  requestAnimationFrame: observer.util.requestAnimationFrame,
	  cancelAnimationFrame: observer.util.cancelAnimationFrame,
	  requestTimeoutFrame: observer.util.requestTimeoutFrame,
	  cancelTimeoutFrame: observer.util.cancelTimeoutFrame,
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
	  hasOwnProp: function hasOwnProp(obj, prop) {
	    return hasOwn.call(observer.obj(obj), prop);
	  },
	
	  keys: Object.keys || function keys(obj) {
	    var arr = [];
	    for (var key in obj) {
	      arr.push(key);
	    }
	    return arr;
	  },
	  eachKeys: function eachKeys(obj, callback) {
	    obj = observer.obj(obj);
	    for (var key in obj) {
	      if (hasOwn.call(obj, key)) if (callback(key) === false) return false;
	    }
	    return true;
	  },
	  eachObj: function eachObj(obj, callback) {
	    obj = observer.obj(obj);
	    for (var key in obj) {
	      if (hasOwn.call(obj, key)) if (callback(obj[key], key) === false) return false;
	    }
	    return true;
	  },
	  trim: function trim(str) {
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
	  }
	};
	function strUpperFirstProcessor(k) {
	  return k.toUpperCase();
	}
	function strHumpProcessor(k) {
	  if (k[0] == '_') return k[1].toUpperCase();
	  return k.toUpperCase();
	}
	module.exports = util;
	
	if (!Object.create) Object.create = util.create;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var observer = __webpack_require__(4);
	var _ = __webpack_require__(3);
	var dom = __webpack_require__(2);
	var Text = __webpack_require__(6);
	
	var _require = __webpack_require__(9);
	
	var Directive = _require.Directive;
	var DirectiveGroup = _require.DirectiveGroup;
	
	var TemplateInstance = exports.TemplateInstance = function () {
	  function TemplateInstance(el, scope, delimiterReg, directiveReg) {
	    _classCallCheck(this, TemplateInstance);
	
	    this.el = el;
	    this.delimiterReg = delimiterReg;
	    this.directiveReg = directiveReg;
	    this.scope = observer.proxy.proxy(scope) || scope;
	    this._scopeProxyListen = _.bind.call(this._scopeProxyListen, this);
	    observer.proxy.on(this.scope, this._scopeProxyListen);
	    this.bindings = this.parse(el, this);
	    this.binded = false;
	    this.bind();
	  }
	
	  TemplateInstance.prototype.before = function before(target) {
	    dom.before(this.el, target);
	    return this;
	  };
	
	  TemplateInstance.prototype.after = function after(target) {
	    dom.after(this.el, target);
	    return this;
	  };
	
	  TemplateInstance.prototype.prependTo = function prependTo(target) {
	    dom.prependTo(this.el, target);
	    return this;
	  };
	
	  TemplateInstance.prototype.appendTo = function appendTo(target) {
	    dom.appendTo(this.el, target);
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
	    dom.remove(this.el);
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
	    var els = [],
	        childNodes = el.childNodes;
	    for (var i = 0, l = childNodes.length; i < l; i++) {
	      els[i] = childNodes[i];
	    }
	    return this.parse(els);
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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(3);
	var dom = __webpack_require__(2);
	
	var _require = __webpack_require__(7);
	
	var Binding = _require.Binding;
	var expression = __webpack_require__(8);
	var expressionArgs = ['$el'];
	var Text = function (_Binding) {
	  _inherits(Text, _Binding);
	
	  function Text(el, tpl, expr) {
	    _classCallCheck(this, Text);
	
	    var _this = _possibleConstructorReturn(this, _Binding.call(this, tpl, expr));
	
	    _this.el = el;
	    _this.observeHandler = _.bind.call(_this.observeHandler, _this);
	    _this.expression = expression.parse(_this.expr, expressionArgs);
	    return _this;
	  }
	
	  Text.prototype.value = function value() {
	    var scope = this.scope();
	
	    return this.filter(this.expression.execute.call(this, scope, this.el));
	  };
	
	  Text.prototype.bind = function bind() {
	    if (!_Binding.prototype.bind.call(this)) return false;
	
	    if (Binding.generateComments && !this.comment) {
	      this.comment = document.createComment('Text Binding ' + this.expr);
	      dom.before(this.comment, this.el);
	    }
	
	    var identities = this.expression.identities;
	    for (var i = 0, l = identities.length; i < l; i++) {
	      this.observe(identities[i], this.observeHandler);
	    }this.update(this.value());
	    return true;
	  };
	
	  Text.prototype.unbind = function unbind() {
	    if (!_Binding.prototype.unbind.call(this)) return false;
	
	    var identities = this.expression.identities;
	    for (var i = 0, l = identities.length; i < l; i++) {
	      this.unobserve(identities[i], this.observeHandler);
	    }return true;
	  };
	
	  Text.prototype.observeHandler = function observeHandler(attr, val) {
	    if (this.expression.simplePath) {
	      this.update(this.filter(val));
	    } else {
	      this.update(this.value());
	    }
	  };
	
	  Text.prototype.update = function update(val) {
	    if (val === undefined || val === null) {
	      val = '';
	    }
	    if (val !== dom.text(this.el)) dom.setText(this.el, val);
	  };
	
	  return Text;
	}(Binding);
	
	module.exports = Text;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(3),
	    observer = __webpack_require__(4);
	
	var AbstractBinding = exports.AbstractBinding = function () {
	  function AbstractBinding(tpl) {
	    _classCallCheck(this, AbstractBinding);
	
	    this.tpl = tpl;
	    this.binded = false;
	  }
	
	  AbstractBinding.prototype.update = function update() {};
	
	  AbstractBinding.prototype.destroy = function destroy() {};
	
	  AbstractBinding.prototype.scope = function scope() {
	    return this.tpl.scope;
	  };
	
	  AbstractBinding.prototype.realScope = function realScope() {
	    return observer.obj(this.tpl.scope);
	  };
	
	  AbstractBinding.prototype.propScope = function propScope(prop) {
	    var scope = this.tpl.scope,
	        parent = scope.$parent;
	
	    if (!parent) return scope;
	
	    while (parent && !_.hasOwnProp(scope, prop)) {
	      scope = parent;
	      parent = scope.$parent;
	    }
	    return observer.proxy.proxy(scope) || scope;
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
	    return observer.proxy.proxy(scope) || scope;
	  };
	
	  AbstractBinding.prototype.observe = function observe(expr, callback) {
	    observer.on(this.exprScope(expr), expr, callback);
	  };
	
	  AbstractBinding.prototype.unobserve = function unobserve(expr, callback) {
	    observer.un(this.exprScope(expr), expr, callback);
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
	
	  AbstractBinding.prototype.bind = function bind() {
	    if (this.binded) return false;
	    this.binded = true;
	    return true;
	  };
	
	  AbstractBinding.prototype.unbind = function unbind() {
	    if (!this.binded) return false;
	    this.binded = false;
	    return true;
	  };
	
	  return AbstractBinding;
	}();
	
	var exprReg = /((?:'[^']*')*(?:(?:[^\|']+(?:'[^']*')*[^\|']*)+|[^\|]+))|^$/g;
	var filterReg = /^$/g;
	
	var Binding = exports.Binding = function (_AbstractBinding) {
	  _inherits(Binding, _AbstractBinding);
	
	  function Binding(tpl, expr) {
	    _classCallCheck(this, Binding);
	
	    var _this = _possibleConstructorReturn(this, _AbstractBinding.call(this, tpl));
	
	    _this.fullExpr = expr;
	    var pipes = expr.match(exprReg);
	    _this.expr = pipes.shift();
	
	    _this.filterExprs = pipes;
	    _this.filters = [];
	    return _this;
	  }
	
	  Binding.prototype.filter = function filter(val) {
	    for (var i = 0; i < this.filters.length; i++) {
	      val = this.filters[i].apply(val);
	    }
	    return val;
	  };
	
	  Binding.prototype.unfilter = function unfilter(val) {
	    for (var i = 0; i < this.filters.length; i++) {
	      val = this.filters[i].unapply(val);
	    }
	    return val;
	  };
	
	  return Binding;
	}(AbstractBinding);
	
	Binding.generateComments = true;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.isSimplePath = isSimplePath;
	exports.parse = parse;
	var _ = __webpack_require__(3);
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
	  'parseFloat': true
	};
	
	var wsReg = /\s/g;
	var newlineReg = /\n/g;
	var translationReg = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g;
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
	function identityProcessor(raw, idx, str) {
	  var l = raw.length,
	      suffix = raw.charAt(l - 1),
	      exp = raw.slice(0, l - 1),
	      prop = exp.match(propReg)[0];
	
	  if (defaultKeywords[prop] || currentKeywords[prop]) return raw;
	
	  currentIdentities[exp] = true;
	  if (suffix == '(') {
	    suffix = idx + l == str.length || str.charAt(idx + l) == ')' ? '' : ',';
	    return '$scope.' + exp + '.call(this.propScope(\'' + prop + '\')' + suffix;
	  }
	  return '$scope.' + exp + suffix;
	}
	
	function compileExecuter(exp, keywords) {
	
	  var body = exp.replace(translationReg, translationProcessor).replace(wsReg, ''),
	      identities = void 0;
	
	  currentIdentities = {};
	  currentKeywords = {};
	  if (keywords) {
	    for (var i = 0, l = keywords.length; i < l; i++) {
	      currentKeywords[keywords[i]] = true;
	    }
	  }
	
	  body = (body + ' ').replace(identityReg, identityProcessor);
	
	  body = body.replace(translationRestoreReg, translationRestoreProcessor);
	
	  identities = _.keys(currentIdentities);
	
	  translations.length = 0;
	  currentKeywords = undefined;
	  currentIdentities = undefined;
	
	  return {
	    fn: makeExecuter(body, keywords),
	    identities: identities
	  };
	}
	
	function makeExecuter(body, args) {
	  var _args = ['$scope'];
	  if (args) _args.push.apply(_args, args);
	  _args.push('return ' + body + ';');
	  try {
	    return Function.apply(Function, _args);
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
	  if (res = cache[exp]) {
	    return res;
	  }
	  res = {
	    exp: exp
	  };
	  if (isSimplePath(exp)) {
	    res.execute = makeExecuter('$scope.' + exp, args);
	    res.identities = [exp];
	    res.simplePath = true;
	    res.path = _.parseExpr(exp);
	  } else {
	    var exe = compileExecuter(exp, args);
	
	    res.simplePath = false;
	    res.execute = exe.fn;
	    res.identities = exe.identities;
	  }
	  cache[exp] = res;
	  return res;
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(3);
	var dom = __webpack_require__(2);
	
	var _require = __webpack_require__(7);
	
	var Binding = _require.Binding;
	var AbstractBinding = _require.AbstractBinding;
	
	var _require2 = __webpack_require__(3);
	
	var YieId = _require2.YieId;
	var SUPER_CLASS_OPTION = 'extend';
	var DirectiveGroup = exports.DirectiveGroup = function (_AbstractBinding) {
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
	    if (!_AbstractBinding.prototype.bind.call(this)) return false;
	
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
	    return true;
	  };
	
	  DirectiveGroup.prototype.unbind = function unbind() {
	    if (!_AbstractBinding.prototype.unbind.call(this)) return false;
	
	    var directives = this.directives;
	    for (var i = 0, l = this.bindedCount; i < l; i++) {
	      directives[i].unbind();
	    }
	    this.bindedCount = 0;
	    return true;
	  };
	
	  return DirectiveGroup;
	}(AbstractBinding);
	
	var Directive = exports.Directive = function (_Binding) {
	  _inherits(Directive, _Binding);
	
	  function Directive(el, tpl, expr, attr) {
	    _classCallCheck(this, Directive);
	
	    var _this2 = _possibleConstructorReturn(this, _Binding.call(this, tpl, expr));
	
	    _this2.el = el;
	    _this2.attr = attr;
	    return _this2;
	  }
	
	  Directive.prototype.bind = function bind() {
	    if (!_Binding.prototype.bind.call(this)) return false;
	    if (Binding.generateComments && !this.comment) {
	      this.comment = document.createComment(' Directive:' + this.name + ' [' + this.expr + '] ');
	      dom.before(this.comment, this.el);
	    }
	    return true;
	  };
	
	  return Directive;
	}(Binding);
	
	Directive.prototype.abstract = false;
	Directive.prototype.name = 'Unkown';
	Directive.prototype.block = false;
	Directive.prototype.priority = 5;
	
	var directives = {};
	
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

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(3);
	var dom = __webpack_require__(2);
	
	var _require = __webpack_require__(9);
	
	var Directive = _require.Directive;
	var YieId = _.YieId;
	
	var _require2 = __webpack_require__(1);
	
	var Template = _require2.Template;
	var expression = __webpack_require__(8);
	var expressionArgs = ['$el'];
	var hasOwn = Object.prototype.hasOwnProperty;
	
	function registerDirective(name, opt) {
	  var cls = Directive.register(name, opt);;
	  module.exports[cls.prototype.className] = cls;
	}
	
	var AbstractExpressionDirective = exports.AbstractExpressionDirective = function (_Directive) {
	  _inherits(AbstractExpressionDirective, _Directive);
	
	  function AbstractExpressionDirective(el, tpl, expr, attr) {
	    _classCallCheck(this, AbstractExpressionDirective);
	
	    var _this = _possibleConstructorReturn(this, _Directive.call(this, el, tpl, expr, attr));
	
	    _this.observeHandler = _.bind.call(_this.observeHandler, _this);
	    _this.expression = expression.parse(_this.expr, expressionArgs);
	    return _this;
	  }
	
	  AbstractExpressionDirective.prototype.setRealValue = function setRealValue(val) {
	    this.set(this.expr, val);
	  };
	
	  AbstractExpressionDirective.prototype.realValue = function realValue() {
	    var scope = this.scope();
	
	    return this.expression.execute.call(this, scope, this.el);
	  };
	
	  AbstractExpressionDirective.prototype.setValue = function setValue(val) {
	    return this.setRealValue(this.unfilter(val));
	  };
	
	  AbstractExpressionDirective.prototype.value = function value() {
	    return this.filter(this.realValue());
	  };
	
	  AbstractExpressionDirective.prototype.bind = function bind() {
	    if (!_Directive.prototype.bind.call(this)) return false;
	
	    var identities = this.expression.identities;
	    for (var i = 0, l = identities.length; i < l; i++) {
	      this.observe(identities[i], this.observeHandler);
	    }this.update(this.value());
	    return true;
	  };
	
	  AbstractExpressionDirective.prototype.unbind = function unbind() {
	    if (!_Directive.prototype.unbind.call(this)) return false;
	
	    var identities = this.expression.identities;
	    for (var i = 0, l = identities.length; i < l; i++) {
	      this.unobserve(identities[i], this.observeHandler);
	    }return true;
	  };
	
	  AbstractExpressionDirective.prototype.blankValue = function blankValue(val) {
	    if (arguments.length == 0) {
	      val = this.value();
	    }
	    if (val === undefined || val == null) {
	      return '';
	    }
	    return val;
	  };
	
	  AbstractExpressionDirective.prototype.observeHandler = function observeHandler(expr, val) {
	    if (this.expression.simplePath) {
	      this.update(this.filter(val));
	    } else {
	      this.update(this.value());
	    }
	  };
	
	  AbstractExpressionDirective.prototype.update = function update(val) {
	    throw 'Abstract Method [' + this.className + '.update]';
	  };
	
	  return AbstractExpressionDirective;
	}(Directive);
	
	var EVENT_CHANGE = 'change',
	    EVENT_INPUT = 'input propertychange',
	    EVENT_CLICK = 'click',
	    TAG_SELECT = 'SELECT',
	    TAG_INPUT = 'INPUT',
	    TAG_TEXTAREA = 'TEXTAREA',
	    RADIO = 'radio',
	    CHECKBOX = 'checkbox',
	    expressions = {
	  text: {
	    update: function update(val) {
	      dom.setText(this.el, this.blankValue(val));
	    },
	
	    block: true
	  },
	  html: {
	    update: function update(val) {
	      dom.setHtml(this.blankValue(val));
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
	        dom.setStyle(this.el, value);
	      } else if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
	        this.handleObject(value);
	      }
	    },
	    handleObject: function handleObject(value) {
	      this.cleanup(value);
	      var keys = this.prevKeys = [],
	          el = this.el;
	      for (var key in value) {
	        dom.setCss(el, key, value[key]);
	      }
	    }
	  },
	  show: {
	    update: function update(val) {
	      dom.setCss(this.el, 'display', val ? '' : 'none');
	    }
	  },
	  hide: {
	    update: function update(val) {
	      dom.setCss(this.el, 'display', val ? 'none' : '');
	    }
	  },
	  value: {
	    update: function update(val) {
	      dom.setVal(this.el, this.blankValue(val));
	    }
	  },
	  'if': {
	    bind: function bind() {
	      if (!AbstractExpressionDirective.prototype.bind.call(this)) return false;
	      if (!this.directives) {
	        this.yieId = new YieId();
	        return this.yieId;
	      }
	      return true;
	    },
	    update: function update(val) {
	      if (!val) {
	        dom.setCss(this.el, 'display', 'none');
	      } else {
	        if (!this.directives) {
	          var directives = this.directives = this.tpl.parseChildNodes(this.el);
	
	          for (var i = 0, l = directives.length; i < l; i++) {
	            directives[i].bind();
	          }if (this.yieId) {
	            this.yieId.done();
	            delete this.yieId;
	          }
	        }
	        dom.setCss(this.el, 'display', '');
	      }
	    },
	    unbind: function unbind() {
	      if (!AbstractExpressionDirective.prototype.unbind.call(this)) return false;
	      if (this.directives) {
	        var directives = this.directives;
	
	        for (var i = 0, l = directives.length; i < l; i++) {
	          directives[i].unbind();
	        }
	      }
	      return true;
	    },
	
	    priority: 9,
	    block: true
	  },
	  checked: {
	    update: function update(val) {
	      if (val instanceof Array) dom.setChecked(this.el, _.indexOf.call(val, dom.val(this.el)));else dom.setChecked(this.el, !!val);
	    }
	  },
	  selected: {
	    update: function update(val) {}
	  },
	  input: {
	    constructor: function constructor(el) {
	      AbstractExpressionDirective.apply(this, arguments);
	
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
	      if (!AbstractExpressionDirective.prototype.bind.call(this)) return false;
	      dom.on(this.el, this.event, this.onChange);
	      return true;
	    },
	    unbind: function unbind() {
	      if (!AbstractExpressionDirective.prototype.unbind.call(this)) return false;
	      dom.off(this.el, this.event, this.onChange);
	      return true;
	    },
	    onChange: function onChange() {
	      var val = this.elVal(),
	          idx = void 0,
	          _val = this.val;
	      if (val != _val) this.setValue(val);
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
	
	              if (dom.checked(this.el) != checked) dom.setChecked(this.el, checked);
	            }
	          } else {
	            if (arguments.length == 0) {
	              return dom.val(this.el);
	            } else if (val != dom.val(this.el)) {
	              dom.setVal(this.el, val);
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
	_.eachObj(expressions, function (opt, name) {
	  opt.extend = AbstractExpressionDirective;
	  registerDirective(name, opt);
	});

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(3);
	var dom = __webpack_require__(2);
	
	var _require = __webpack_require__(9);
	
	var Directive = _require.Directive;
	var expression = __webpack_require__(8);
	var expressionArgs = ['$el', '$event'];
	
	function registerDirective(name, opt) {
	  var cls = Directive.register(name, opt);;
	  module.exports[cls.prototype.className] = cls;
	}
	
	var AbstractEventDirective = function (_Directive) {
	  _inherits(AbstractEventDirective, _Directive);
	
	  function AbstractEventDirective(el, tpl, expr, attr) {
	    _classCallCheck(this, AbstractEventDirective);
	
	    var _this = _possibleConstructorReturn(this, _Directive.call(this, el, tpl, expr, attr));
	
	    _this.handler = _.bind.call(_this.handler, _this);
	    _this.expression = expression.parse(_this.expr, expressionArgs);
	    return _this;
	  }
	
	  AbstractEventDirective.prototype.handler = function handler(e) {
	    var scope = this.scope(),
	        exp = this.expression,
	        fn = exp.execute.call(this, scope, this.el, e);
	    if (exp.simplePath) {
	      if (typeof fn != 'function') throw TypeError('Invalid Event Handler:' + this.expr + ' -> ' + fn);
	
	      fn.call(this.propScope(exp.path[0]), scope, this.el, e);
	    }
	  };
	
	  AbstractEventDirective.prototype.bind = function bind() {
	    if (!_Directive.prototype.bind.call(this)) return false;
	    dom.on(this.el, this.eventType, this.handler);
	    return true;
	  };
	
	  AbstractEventDirective.prototype.unbind = function unbind() {
	    if (!_Directive.prototype.unbind.call(this)) return false;
	    dom.off(this.el, this.eventType, this.handler);
	    return true;
	  };
	
	  return AbstractEventDirective;
	}(Directive);
	
	module.exports = AbstractEventDirective;
	
	var events = ['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'keydown', 'keypress', 'keyup', 'load', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload', {
	  name: 'oninput',
	  eventType: 'input propertychange'
	}];
	
	// register events
	for (var i = 0, l = events.length; i < l; i++) {
	  var name = void 0,
	      opt = events[i];
	  if ((typeof opt === 'undefined' ? 'undefined' : _typeof(opt)) == 'object') {
	    name = opt.name;
	  } else {
	    name = 'on' + opt;
	    opt = {
	      eventType: opt
	    };
	  }
	  opt.extend = AbstractEventDirective;
	  registerDirective(name, opt);
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(3);
	var dom = __webpack_require__(2);
	
	var _require = __webpack_require__(9);
	
	var Directive = _require.Directive;
	
	var _require2 = __webpack_require__(5);
	
	var TemplateInstance = _require2.TemplateInstance;
	
	
	var eachReg = /^\s*([\s\S]+)\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/,
	    eachAliasReg = /^(\(\s*([^,\s]+)(\s*,\s*([\S]+))?\s*\))|([^,\s]+)(\s*,\s*([\S]+))?$/;
	
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
	
	    _this.comment = document.createComment(' Directive:' + _this.name + ' [' + _this.expr + '] ');
	    dom.before(_this.comment, _this.el);
	    dom.removeAttr(_this.el, _this.attr);
	
	    _this.begin = document.createComment('each begin');
	    dom.after(_this.begin, _this.comment);
	    _this.end = document.createComment('each end');
	    dom.after(_this.end, _this.begin);
	
	    dom.remove(_this.el);
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
	        scope.$tpl = new TemplateInstance(dom.clone(this.el), scope, this.tpl.delimiterReg, this.tpl.directiveReg);
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
	        scope.$tpl = new TemplateInstance(dom.clone(this.el), scope, this.tpl.delimiterReg, this.tpl.directiveReg);
	      }
	      data[scope.$sort] = scope[valueAlias];
	      scope.$tpl.after(scope.$sort ? sort[scope.$sort - 1].$tpl.el : begin);
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
	    if (!_Directive.prototype.bind.call(this)) return false;
	    this.observe(this.scopeExpr, this.observeHandler);
	    this.observe(this.scopeExpr + '.length', this.lengthObserveHandler);
	    this.update(this.target());
	    return true;
	  };
	
	  EachDirective.prototype.unbind = function unbind() {
	    if (!_Directive.prototype.unbind.call(this)) return false;
	    this.unobserve(this.scopeExpr, this.observeHandler);
	    this.unobserve(this.scopeExpr + '.length', this.lengthObserveHandler);
	    return true;
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

/***/ }
/******/ ])
});
;
//# sourceMappingURL=tpl.js.map