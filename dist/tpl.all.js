/*!
 * tpl.js v0.0.8 built in Wed, 23 Mar 2016 15:21:07 GMT
 * Copyright (c) 2016 Tao Zeng <tao.zeng.zt@gmail.com>
 * Based on observer.js v0.0.x
 * Released under the MIT license
 * support IE6+ and other browsers
 * support ES6 Proxy and Object.observe
 * https://github.com/tao-zeng/tpl.js
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["tpl"] = factory();
	else
		root["tpl"] = factory();
})(this, function() {
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
	
	var tpl = __webpack_require__(1).Template,
	    util = __webpack_require__(2),
	    observer = __webpack_require__(3);
	
	util.assign(tpl, util, __webpack_require__(12));
	tpl.observe = observer.on;
	tpl.unobserve = observer.un;
	tpl.obj = observer.obj;
	tpl.proxy = observer.proxy.proxy;
	tpl.proxyChange = observer.proxy.on;
	tpl.unProxyChange = observer.proxy.un;
	tpl.expression = __webpack_require__(16);
	tpl.Directive = __webpack_require__(17).Directive;
	tpl.Directives = __webpack_require__(18);
	tpl.EventDirectives = __webpack_require__(19);
	tpl.EachDirective = __webpack_require__(20);
	module.exports = tpl;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(12);
	
	var _require = __webpack_require__(13);
	
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
	    strHumpReg = /(^[a-zA-Z])|(_[a-zA-Z])/g;
	
	var util = {
	  YieId: YieId,
	  Map: observer.Map,
	  bind: observer.util.bind,
	  indexOf: observer.util.indexOf,
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
	
	  keys: Object.keys || function keys(obj, own) {
	    var arr = [];
	    for (var key in obj) {
	      if (own === false || hasOwn.call(obj, key)) arr.push(key);
	    }
	    return arr;
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _require = __webpack_require__(4);
	
	var proxy = _require.proxy;
	var Exp = __webpack_require__(7);
	var exp = __webpack_require__(11);
	var Observer = __webpack_require__(9);
	
	window.observer = {
	  on: exp.on,
	  un: exp.un,
	  hasListen: exp.hasListen,
	  obj: function obj(_obj) {
	    return proxy.obj(_obj);
	  },
	  eq: function eq(obj1, obj2) {
	    return proxy.eq(obj1, obj2);
	  },
	
	  proxy: proxy,
	  util: __webpack_require__(6),
	  Map: __webpack_require__(5),
	  VBProxyFactory: Observer.VBProxyFactory,
	  setConfig: Observer.setConfig,
	  config: function config() {
	    return Observer.config;
	  },
	  policy: function policy() {
	    return Observer.policy;
	  }
	};
	module.exports = window.observer;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.proxyEnable = proxyEnable;
	exports.proxyDisable = proxyDisable;
	exports.proxyChange = proxyChange;
	var Map = __webpack_require__(5),
	    _ = __webpack_require__(6);
	
	var proxyEvents = new Map();
	
	function empty() {}
	
	function default_equal(obj1, obj2) {
	  return obj1 === obj2;
	}
	
	function default_obj(obj) {
	  return obj;
	}
	
	function default_proxy(obj) {
	  return obj;
	}
	
	function bind(obj, handler) {
	  var handlers = void 0;
	
	  if (typeof handler !== 'function') {
	    throw TypeError('Invalid Proxy Event Handler');
	  }
	  obj = proxy.obj(obj);
	  handlers = proxyEvents.get(obj);
	  if (!handlers) {
	    handlers = [];
	    proxyEvents.set(obj, handlers);
	  }
	  handlers.push(handler);
	}
	
	function unbind(obj, handler) {
	  var handlers = void 0;
	
	  obj = proxy.obj(obj);
	  handlers = proxyEvents.get(obj);
	  if (handlers) {
	    if (arguments.length > 1) {
	      if (typeof handler === 'function') {
	        var idx = _.indexOf.call(handlers, handler);
	        if (idx != -1) {
	          handlers.splice(idx, 1);
	        }
	      }
	    } else {
	      proxyEvents['delete'](obj);
	    }
	  }
	}
	
	var proxy = exports.proxy = {};
	
	function proxyEnable() {
	  proxy.on = bind;
	  proxy.un = unbind;
	  proxy.eq = undefined;
	  proxy.obj = undefined;
	  proxy.proxy = undefined;
	}
	
	function proxyDisable() {
	  proxy.on = empty;
	  proxy.un = empty;
	  proxy.eq = default_equal;
	  proxy.obj = default_obj;
	  proxy.proxy = default_proxy;
	}
	
	function proxyChange(obj, proxy) {
	  var handlers = proxyEvents.get(obj);
	  if (handlers) {
	    for (var i = handlers.length - 1; i >= 0; i--) {
	      handlers[i](obj, proxy);
	    }
	  }
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Map = window.Map;
	
	if (!Map) {
	  (function () {
	    var ITERATOR_TYPE = {
	      KEY: 'key',
	      VALUE: 'value',
	      ENTRY: 'entry'
	    },
	        HASH_BIND = '__hash__',
	        hash_generator = 0,
	        hasOwn = Object.prototype.hasOwnProperty;
	
	    var _Map = function () {
	      function _Map() {
	        _classCallCheck(this, _Map);
	
	        this._map = {};
	        this._keyMap = {};
	        this._size = 0;
	      }
	
	      _Map.prototype._hash = function _hash(value) {
	        if (hasOwn.call(value, HASH_BIND)) return value[HASH_BIND];
	        return value[HASH_BIND] = ++hash_generator;
	      };
	
	      _Map.prototype.has = function has(key) {
	        return this._hash(key) in this._keyMap;
	      };
	
	      _Map.prototype.get = function get(key) {
	        var hcode = this._hash(key);
	        if (hcode in this._keyMap) {
	          return this._map[hcode];
	        }
	        return undefined;
	      };
	
	      _Map.prototype.set = function set(key, val) {
	        var hcode = this._hash(key);
	        this._keyMap[hcode] = key;
	        this._map[hcode] = val;
	        if (!(hcode in this._keyMap)) {
	          this._size++;
	        }
	        return this;
	      };
	
	      _Map.prototype['delete'] = function _delete(key) {
	        var hcode = this._hash(key);
	        if (hcode in this._keyMap) {
	          delete this._keyMap[hcode];
	          delete this._map[hcode];
	          this._size--;
	          return true;
	        }
	        return false;
	      };
	
	      _Map.prototype.size = function size() {
	        return this._size;
	      };
	
	      _Map.prototype.clear = function clear() {
	        this._keyMap = {};
	        this._map = {};
	        this._size = 0;
	      };
	
	      _Map.prototype.forEach = function forEach(callback) {
	        for (var key in this._map) {
	          if (key in this._keyMap) callback(this._map[key], key, this);
	        }
	      };
	
	      _Map.prototype.keys = function keys() {
	        return new MapIterator(this, ITERATOR_TYPE.KEY);
	      };
	
	      _Map.prototype.values = function values() {
	        return new MapIterator(this, ITERATOR_TYPE.VALUE);
	      };
	
	      _Map.prototype.entries = function entries() {
	        return new MapIterator(this, ITERATOR_TYPE.ENTRY);
	      };
	
	      _Map.prototype.toString = function toString() {
	        return '[Object Map]';
	      };
	
	      return _Map;
	    }();
	
	    var MapIterator = function () {
	      function MapIterator(map, type) {
	        _classCallCheck(this, MapIterator);
	
	        this._index = 0;
	        this._map = map;
	        this._type = type;
	        this._hashs = [];
	        for (var h in map._map) {
	          this._hashs.push(h);
	        }
	      }
	
	      MapIterator.prototype.next = function next() {
	        var val = undefined;
	        if (this._index < this._hashs.length) {
	          var hash = this._hashs[this.index++];
	          switch (this._type) {
	            case ITERATOR_TYPE.KEY:
	              val = this._map._keyMap[hash];
	            case ITERATOR_TYPE.VALUE:
	              val = this._map._map[hash];
	            case ITERATOR_TYPE.ENTRY:
	              val = [this._map._keyMap[hash], this._map._map[hash]];
	            default:
	              throw new TypeError('Invalid iterator type');
	          }
	        }
	        return {
	          value: val,
	          done: this._index >= this._keys.length
	        };
	      };
	
	      MapIterator.prototype.toString = function toString() {
	        return '[object Map Iterator]';
	      };
	
	      return MapIterator;
	    }();
	
	    Map = _Map;
	    Map.HASH_BIND = HASH_BIND;
	  })();
	}
	module.exports = Map;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var lastTime = void 0,
	    requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame,
	    cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame,
	    bind = Function.prototype.bind || function bind(scope) {
	  var fn = this,
	      args = Array.prototype.slice.call(arguments, 1);
	  return function () {
	    return fn.apply(scope, args.concat(Array.prototype.slice.call(arguments)));
	  };
	};
	
	function requestTimeoutFrame(callback) {
	  var currTime = new Date().getTime(),
	      timeToCall = Math.max(0, 16 - (currTime - lastTime)),
	      reqId = setTimeout(function () {
	    callback(currTime + timeToCall);
	  }, timeToCall);
	  lastTime = currTime + timeToCall;
	  return reqId;
	}
	
	function cancelTimeoutFrame(reqId) {
	  clearTimeout(reqId);
	}
	
	if (requestAnimationFrame && cancelAnimationFrame) {
	  requestAnimationFrame = bind.call(requestAnimationFrame, window);
	  cancelAnimationFrame = bind.call(cancelAnimationFrame, window);
	} else {
	  requestAnimationFrame = requestTimeoutFrame;
	  cancelAnimationFrame = cancelTimeoutFrame;
	}
	
	var propNameReg = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,
	    escapeCharReg = /\\(\\)?/g;
	
	var exprCache = {};
	
	function parseExpr(exp) {
	  if (exp instanceof Array) {
	    return exp;
	  } else {
	    var _ret = function () {
	      var result = exprCache[exp];
	      if (!result) {
	        result = exprCache[exp] = [];
	        (exp + '').replace(propNameReg, function (match, number, quote, string) {
	          result.push(quote ? string.replace(escapeCharReg, '$1') : number || match);
	        });
	      }
	      return {
	        v: result
	      };
	    }();
	
	    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	  }
	}
	
	var util = {
	  requestTimeoutFrame: requestTimeoutFrame,
	
	  cancelTimeoutFrame: cancelTimeoutFrame,
	
	  requestAnimationFrame: requestAnimationFrame,
	
	  cancelAnimationFrame: cancelAnimationFrame,
	
	  bind: bind,
	
	  indexOf: Array.prototype.indexOf || function indexOf(val) {
	    for (var i = 0, l = this.length; i < l; i++) {
	      if (this[i] === val) {
	        return i;
	      }
	    }
	    return -1;
	  },
	
	  parseExpr: parseExpr,
	
	  get: function get(object, path, defaultValue) {
	    if (object) {
	      path = parseExpr(path);
	      var index = 0,
	          l = path.length;
	
	      while (object && index < l) {
	        object = object[path[index++]];
	      }
	      return index == l ? object : defaultValue;
	    }
	    return defaultValue;
	  }
	};
	
	module.exports = util;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var observer = __webpack_require__(8);
	
	var _require = __webpack_require__(4);
	
	var proxy = _require.proxy;
	var _ = __webpack_require__(6);
	var Expression = function () {
	  function Expression(target, expression, path) {
	    _classCallCheck(this, Expression);
	
	    if (!target || !(target instanceof Array || (typeof target === 'undefined' ? 'undefined' : _typeof(target)) == 'object')) {
	      throw TypeError('can not observe object[' + (typeof target === 'undefined' ? 'undefined' : _typeof(target)) + ']');
	    }
	    this.expression = expression;
	    this.handlers = [];
	    this.path = path || _.parseExpr(expression);
	    this.observers = [];
	    this.observeHandlers = this._initObserveHandlers();
	    this.target = this._observe(target, 0);
	    this._onTargetProxy = _.bind.call(this._onTargetProxy, this);
	    proxy.on(target, this._onTargetProxy);
	  }
	
	  Expression.prototype._onTargetProxy = function _onTargetProxy(obj, proxy) {
	    this.target = proxy;
	  };
	
	  Expression.prototype._observe = function _observe(obj, idx) {
	    var attr = this.path[idx];
	
	    if (idx + 1 < this.path.length) {
	      if (obj[attr]) obj[attr] = this._observe(obj[attr], idx + 1);
	    }
	    return observer.on(obj, attr, this.observeHandlers[idx]);
	  };
	
	  Expression.prototype._unobserve = function _unobserve(obj, idx) {
	    var attr = this.path[idx];
	
	    obj = observer.un(obj, attr, this.observeHandlers[idx]);
	    if (idx + 1 < this.path.length) obj[attr] = this._unobserve(obj[attr], idx + 1);
	    return obj;
	  };
	
	  Expression.prototype._initObserveHandlers = function _initObserveHandlers() {
	    var handlers = [];
	
	    for (var i = 0, l = this.path.length; i < l; i++) {
	      handlers.push(this._createObserveHandler(i));
	    }
	    return handlers;
	  };
	
	  Expression.prototype._createObserveHandler = function _createObserveHandler(idx) {
	    var _this = this;
	
	    var path = this.path.slice(0, idx + 1),
	        rpath = this.path.slice(idx + 1),
	        ridx = this.path.length - idx - 1;
	
	    return function (attr, val, oldVal) {
	      if (ridx) {
	        if (oldVal) {
	          _this._unobserve(oldVal, idx + 1);
	          oldVal = _.get(oldVal, rpath);
	        } else {
	          oldVal = undefined;
	        }
	        if (val) {
	          _this._observe(val, idx + 1);
	          val = _.get(val, rpath);
	        } else {
	          val = undefined;
	        }
	        if (proxy.eq(val, oldVal)) return;
	      }
	
	      var hs = _this.handlers.slice();
	
	      for (var i = 0, l = hs.length; i < l; i++) {
	        hs[i](_this.expression, val, oldVal, _this.target);
	      }
	    };
	  };
	
	  Expression.prototype.on = function on(handler) {
	    if (typeof handler != 'function') {
	      throw TypeError('Invalid Observe Handler');
	    }
	    this.handlers.push(handler);
	    return this;
	  };
	
	  Expression.prototype.un = function un(handler) {
	    if (!arguments.length) {
	      this.handlers = [];
	    } else {
	      if (typeof handler != 'function') {
	        throw TypeError('Invalid Observe Handler');
	      }
	
	      var handlers = this.handlers;
	
	      for (var i = handlers.length - 1; i >= 0; i--) {
	        if (handlers[i] === handler) {
	          handlers.splice(i, 1);
	          break;
	        }
	      }
	    }
	    return this;
	  };
	
	  Expression.prototype.hasListen = function hasListen(handler) {
	    if (arguments.length) return _.indexOf.call(this.handlers, handler) != -1;
	    return !!this.handlers.length;
	  };
	
	  Expression.prototype.destory = function destory() {
	    proxy.un(this.target, this._onTargetProxy);
	    var obj = this._unobserve(this.target, 0);
	    this.target = undefined;
	    this.expression = undefined;
	    this.handlers = undefined;
	    this.path = undefined;
	    this.observers = undefined;
	    this.observeHandlers = undefined;
	    this.target = undefined;
	    return obj;
	  };
	
	  return Expression;
	}();
	
	module.exports = Expression;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Observer = __webpack_require__(9);
	var Map = __webpack_require__(5);
	
	var _require = __webpack_require__(4);
	
	var proxy = _require.proxy;
	
	
	var observers = new Map();
	var factory = {
	  _bind: function _bind(obj, observer) {
	    observers.set(obj, observer);
	  },
	  _unbind: function _unbind(obj, observer) {
	    if (observers.get(obj) === observer) {
	      observers['delete'](obj);
	    }
	  },
	  _get: function _get(obj) {
	    return observers.get(obj);
	  },
	  hasListen: function hasListen(obj, attr, handler) {
	    var observer = void 0,
	        l = arguments.length;
	
	    obj = proxy.obj(obj);
	    observer = observers.get(obj);
	    if (!observer) {
	      return false;
	    } else if (l == 1) {
	      return true;
	    } else if (l == 2) {
	      return observer.hasListen(obj, attr);
	    }
	    return observer.hasListen(obj, attr, handler);
	  },
	  on: function on(obj, attr, handler) {
	    var observer = void 0;
	
	    obj = proxy.obj(obj);
	    observer = observers.get(obj);
	    if (!observer) {
	      observer = new Observer(obj);
	      factory._bind(obj, observer);
	    }
	    return observer.on(attr, handler);
	  },
	  un: function un(obj, attr, handler) {
	    var observer = void 0;
	
	    obj = proxy.obj(obj);
	    observer = observers.get(obj);
	    if (observer) {
	      obj = arguments.length > 2 ? observer.un(attr, handler) : observer.un(attr);
	      if (!observer.hasListen()) {
	        factory._unbind(obj, observer);
	        observer.destroy();
	      }
	    }
	    return obj;
	  }
	};
	module.exports = factory;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _require = __webpack_require__(10);
	
	var VBProxyFactory = _require.VBProxyFactory;
	
	var _require2 = __webpack_require__(4);
	
	var proxy = _require2.proxy;
	var proxyChange = _require2.proxyChange;
	var proxyEnable = _require2.proxyEnable;
	var proxyDisable = _require2.proxyDisable;
	var _ = __webpack_require__(6);
	
	var arrayHockMethods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
	var config = {
	  lazy: true,
	  animationFrame: true,
	  chromeObserve: true,
	  es6Proxy: true
	};
	
	var Observer = function () {
	  function Observer(target) {
	    _classCallCheck(this, Observer);
	
	    if (target instanceof Array) {
	      this.isArray = true;
	    } else if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) == 'object') {
	      this.isArray = false;
	    } else {
	      throw TypeError('can not observe object[' + (typeof target === 'undefined' ? 'undefined' : _typeof(target)) + ']');
	    }
	    this.target = target;
	    this.obj = target;
	    this.listens = {};
	    this.changeRecords = {};
	    this._notify = _.bind.call(this._notify, this);
	    this.watchPropNum = 0;
	    this._init();
	  }
	
	  Observer.prototype._fire = function _fire(attr, val, oldVal) {
	    if (proxy.eq(val, oldVal)) return;
	    var handlers = this.listens[attr];
	    if (!handlers) return;
	    handlers = handlers.slice();
	    for (var i = 0, l = handlers.length; i < l; i++) {
	      handlers[i](attr, val, oldVal, this.target);
	    }
	  };
	
	  Observer.prototype._notify = function _notify() {
	    var changeRecords = this.changeRecords;
	    for (var attr in changeRecords) {
	      this._fire(attr, this.obj[attr], changeRecords[attr]);
	    }
	    this.request_frame = undefined;
	    this.changeRecords = {};
	  };
	
	  Observer.prototype._addChangeRecord = function _addChangeRecord(attr, oldVal) {
	    if (!config.lazy) {
	      this._fire(attr, this.obj[attr], oldVal);
	    } else if (!(attr in this.changeRecords)) {
	      this.changeRecords[attr] = oldVal;
	      if (!this.request_frame) this.request_frame = (config.animationFrame ? _.requestAnimationFrame : _.requestTimeoutFrame)(this._notify);
	    }
	  };
	
	  Observer.prototype.hasListen = function hasListen(attr, handler) {
	    var l = arguments.length,
	        listens = this.listens;
	    if (!l) {
	      return !!this.watchPropNum;
	    } else if (l == 1) {
	      if (typeof attr == 'function') {
	        var handlers = void 0;
	        for (var k in listens) {
	          handlers = listens[k];
	          if (handlers && _.indexOf.call(handlers, attr) != -1) return true;
	        }
	        return false;
	      } else return !!listens[attr];
	    } else {
	      if (typeof handler != 'function') {
	        throw TypeError('Invalid Observe Handler');
	      }
	      var _handlers = listens[attr];
	      return _handlers && _.indexOf.call(_handlers, handler) != -1;
	    }
	  };
	
	  Observer.prototype.on = function on(attr, handler) {
	    if (typeof handler != 'function') {
	      throw TypeError('Invalid Observe Handler');
	    }
	
	    var handlers = this.listens[attr];
	
	    if (!handlers) {
	      this.listens[attr] = [handler];
	      this.watchPropNum++;
	      this._watch(attr);
	    } else handlers.push(handler);
	    return this.target;
	  };
	
	  Observer.prototype._cleanListen = function _cleanListen(attr) {
	    this.listens[attr] = undefined;
	    this.watchPropNum--;
	    this._unwatch(attr);
	  };
	
	  Observer.prototype.un = function un(attr, handler) {
	    var handlers = this.listens[attr];
	    if (handlers) {
	      if (arguments.length == 1) {
	        this._cleanListen(attr);
	      } else {
	        if (typeof handler != 'function') throw TypeError('Invalid Observe Handler');
	
	        for (var i = handlers.length - 1; i >= 0; i--) {
	          if (handlers[i] === handler) {
	            handlers.splice(i, 1);
	            if (!handlers.length) this._cleanListen(attr);
	            break;
	          }
	        }
	      }
	    }
	    return this.target;
	  };
	
	  Observer.prototype.destroy = function destroy() {
	    if (this.request_frame) {
	      (config.animationFrame ? _.cancelAnimationFrame : _.cancelTimeoutFrame)(this.request_frame);
	      this.request_frame = undefined;
	    }
	    this._destroy();
	    this.obj = undefined;
	    this.target = undefined;
	    this.listens = undefined;
	    this.changeRecords = undefined;
	  };
	
	  return Observer;
	}();
	
	function applyProto(name, fn) {
	  Observer.prototype[name] = fn;
	  return fn;
	}
	
	function chromeObserve() {
	  Observer.policy = 'chromeObserve';
	  proxyDisable();
	
	  applyProto('_init', function _init() {
	    this._onObserveChanged = _.bind.call(this._onObserveChanged, this);
	    this.chromeObserve = false;
	  });
	
	  applyProto('_destroy', function _destroy() {
	    if (this.chromeObserve) {
	      Object.unobserve(this.target, this._onObserveChanged);
	      this.chromeObserve = false;
	    }
	  });
	
	  applyProto('_onObserveChanged', function _onObserveChanged(changes) {
	    var c = void 0;
	    for (var i = 0, l = changes.length; i < l; i++) {
	      c = changes[i];
	      if (this.listens[c.name]) this._addChangeRecord(c.name, c.oldValue);
	    }
	  });
	
	  applyProto('_watch', function _watch(attr) {
	    if (!this.chromeObserve) {
	      Object.observe(this.target, this._onObserveChanged);
	      this.chromeObserve = true;
	    }
	  });
	
	  applyProto('_unwatch', function _unwatch(attr) {
	    if (this.chromeObserve && !this.hasListen()) {
	      Object.unobserve(this.target, this._onObserveChanged);
	      this.chromeObserve = false;
	    }
	  });
	}
	
	function es6Proxy() {
	  Observer.policy = 'es6Proxy';
	
	  var objProxyLoop = new Map(),
	      proxyObjLoop = new Map();
	
	  proxyEnable();
	
	  proxy.obj = function (proxy) {
	    if (!proxy) return proxy;
	    return proxyObjLoop.get(proxy) || proxy;
	  };
	
	  proxy.eq = function (obj1, obj2) {
	    return proxy.obj(obj1) === proxy.obj(obj2);
	  };
	
	  proxy.proxy = function (obj) {
	    return objProxyLoop.get(obj);
	  };
	
	  applyProto('_init', function _init() {
	    this.obj = proxy.obj(this.target);
	    this.es6proxy = false;
	  });
	
	  applyProto('_destroy', function _destroy() {
	    if (this.es6proxy) {
	      proxyChange(this.obj, undefined);
	      proxyObjLoop['delete'](this.target);
	      objProxyLoop['delete'](this.obj);
	      this.es6proxy = false;
	    }
	  });
	
	  applyProto('_createArrayProxy', function _arrayProxy() {
	    var _this = this;
	
	    var oldLength = this.target.length;
	    return new Proxy(this.obj, {
	      set: function set(obj, prop, value) {
	        if (!_this.listens[prop]) {
	          obj[prop] = value;
	          return true;
	        }
	        var oldVal = void 0;
	        if (prop === 'length') {
	          oldVal = oldLength;
	          oldLength = value;
	        } else {
	          oldVal = obj[prop];
	        }
	        obj[prop] = value;
	        if (value !== oldVal) _this._addChangeRecord(prop, oldVal);
	        return true;
	      }
	    });
	  });
	
	  applyProto('_createObjectProxy', function _arrayProxy() {
	    var _this2 = this;
	
	    return new Proxy(this.obj, {
	      set: function set(obj, prop, value) {
	        if (!_this2.listens[prop]) {
	          obj[prop] = value;
	          return true;
	        }
	        var oldVal = obj[prop];
	        obj[prop] = value;
	        if (value !== oldVal) _this2._addChangeRecord(prop, oldVal);
	        return true;
	      }
	    });
	  });
	
	  applyProto('_watch', function _watch(attr) {
	    if (!this.es6proxy) {
	      var _proxy = this.isArray ? this._createArrayProxy() : this._createObjectProxy();
	
	      this.target = _proxy;
	      proxyObjLoop.set(_proxy, this.obj);
	      objProxyLoop.set(this.obj, _proxy);
	      proxyChange(this.obj, _proxy);
	      this.es6proxy = true;
	    }
	  });
	
	  applyProto('_unwatch', function _unwatch(attr) {
	    if (this.es6proxy && !this.hasListen()) {
	      proxyChange(this.obj, undefined);
	      proxyObjLoop['delete'](this.target);
	      objProxyLoop['delete'](this.obj);
	      this.target = this.obj;
	      this.es6proxy = false;
	    }
	  });
	}
	
	function es5DefineProperty() {
	  var init = applyProto('_init', function _init() {
	    this.watchers = {};
	  });
	
	  var destroy = applyProto('_destroy', function _destroy() {
	    for (var attr in this.watchers) {
	      if (this.watchers[attr]) this._unwatch(attr);
	    }
	    this.watchers = undefined;
	  });
	
	  applyProto('_hockArrayLength', function _hockArrayLength(method) {
	    var self = this;
	
	    this.obj[method] = function () {
	      var len = this.length;
	
	      Array.prototype[method].apply(this, arguments);
	      if (self.obj.length != len) self._addChangeRecord('length', len);
	    };
	  });
	
	  applyProto('_watch', function _watch(attr) {
	    if (!this.watchers[attr]) {
	      if (this.isArray && attr === 'length') {
	        for (var i = 0, l = arrayHockMethods.length; i < l; i++) {
	          this._hockArrayLength(arrayHockMethods[i]);
	        }
	      } else {
	        this._defineProperty(attr, this.obj[attr]);
	      }
	      this.watchers[attr] = true;
	    }
	  });
	
	  applyProto('_unwatch', function _unwatch(attr) {
	    if (this.watchers[attr]) {
	      if (this.isArray && attr === 'length') {
	        for (var i = 0, l = arrayHockMethods.length; i < l; i++) {
	          delete this.obj[arrayHockMethods[i]];
	        }
	      } else {
	        this._undefineProperty(attr, this.obj[attr]);
	      }
	      this.watchers[attr] = false;
	    }
	  });
	
	  function doesDefinePropertyWork(defineProperty, object) {
	    try {
	      var _ret = function () {
	        var val = void 0;
	        defineProperty(object, 'sentinel', {
	          get: function get() {
	            return val;
	          },
	          set: function set(value) {
	            val = value;
	          }
	        });
	        object.sentinel = 1;
	        return {
	          v: object.sentinel === val
	        };
	      }();
	
	      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	    } catch (exception) {
	      return false;
	    }
	  }
	
	  if (Object.defineProperty && doesDefinePropertyWork(Object.defineProperty, {})) {
	    Observer.policy = 'es5DefineProperty';
	    proxyDisable();
	    applyProto('_defineProperty', function _defineProperty(attr, value) {
	      var _this3 = this;
	
	      Object.defineProperty(this.target, attr, {
	        enumerable: true,
	        configurable: true,
	        get: function get() {
	          return value;
	        },
	        set: function set(val) {
	          var oldVal = value;
	          value = val;
	          _this3._addChangeRecord(attr, oldVal);
	        }
	      });
	    });
	
	    applyProto('_undefineProperty', function _undefineProperty(attr, value) {
	      Object.defineProperty(this.target, attr, {
	        enumerable: true,
	        configurable: true,
	        writable: true,
	        value: value
	      });
	    });
	  } else if ('__defineGetter__' in {}) {
	    Observer.policy = 'defineGetterAndSetter';
	    proxyDisable();
	    applyProto('_defineProperty', function _defineProperty(attr, value) {
	      var _this4 = this;
	
	      this.target.__defineGetter__(attr, function () {
	        return value;
	      });
	      this.target.__defineSetter__(attr, function (val) {
	        var oldVal = value;
	        value = val;
	        _this4._addChangeRecord(attr, oldVal);
	      });
	    });
	
	    applyProto('_undefineProperty', function _undefineProperty(attr, value) {
	      this.target.__defineGetter__(attr, function () {
	        return value;
	      });
	      this.target.__defineSetter__(attr, function (val) {
	        value = val;
	      });
	    });
	  } else if (VBProxyFactory.isSupport()) {
	    (function () {
	      Observer.policy = 'VBProxy';
	      proxyEnable();
	
	      var factory = Observer.VBProxyFactory = new VBProxyFactory(proxyChange);
	      proxy.obj = factory.obj;
	      proxy.eq = factory.eq;
	      proxy.proxy = factory.getVBProxy;
	
	      applyProto('_init', function _init() {
	        init.call(this);
	        this.obj = factory.obj(this.target);
	      });
	
	      applyProto('_destroy', function _destroy() {
	        destroy.call(this);
	      });
	
	      applyProto('_defineProperty', function _defineProperty(attr, value) {
	        var _this5 = this;
	
	        var obj = this.obj,
	            desc = factory.getVBProxyDesc(obj);
	
	        if (!desc) desc = factory.getVBProxyDesc(factory.createVBProxy(obj));
	        this.target = desc.defineProperty(attr, {
	          set: function set(val) {
	            var oldVal = _this5.obj[attr];
	            _this5.obj[attr] = val;
	            _this5._addChangeRecord(attr, oldVal);
	          }
	        });
	      });
	
	      applyProto('_undefineProperty', function _undefineProperty(attr, value) {
	        var obj = this.obj,
	            desc = factory.getVBProxyDesc(obj);
	
	        if (desc) {
	          this.target = desc.defineProperty(attr, {
	            value: value
	          });
	          if (!desc.hasAccessor()) {
	            this.target = factory.freeVBProxy(obj);
	          }
	        }
	      });
	    })();
	  } else {
	    throw new Error('Not Supported.');
	  }
	}
	
	function applyPolicy() {
	  if (Object.observe && config.chromeObserve && Observer.policy != 'chromeObserve') {
	    chromeObserve();
	  } else if (window.Proxy && config.es6Proxy && Observer.policy != 'es6Proxy') {
	    es6Proxy();
	  } else if (!Observer.policy) {
	    es5DefineProperty();
	  }
	}
	
	Observer.setConfig = function setConfig(cfg) {
	  var oldCfg = {};
	  for (var attr in cfg) {
	    if (attr in config) {
	      oldCfg[attr] = config[attr];
	      config[attr] = cfg[attr];
	    }
	  }
	  if (cfg.chromeObserve != oldCfg.chromeObserve || cfg.es6Proxy != oldCfg.es6Proxy) {
	    applyPolicy();
	  }
	  return cfg;
	};
	
	Observer.config = config;
	
	applyPolicy();
	
	module.exports = Observer;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.VBProxyFactory = VBProxyFactory;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Map = __webpack_require__(5),
	    _ = __webpack_require__(6);
	
	function VBProxyFactory(onProxyChange) {
	  var OBJECT_PROTO_PROPS = [Map.HASH_BIND, 'hasOwnProperty', 'toString', 'toLocaleString', 'isPrototypeOf', 'propertyIsEnumerable', 'valueOf'],
	      ARRAY_PROTO_PROPS = OBJECT_PROTO_PROPS.concat(['concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex', 'forEach', 'indexOf', 'lastIndexOf', 'length', 'map', 'keys', 'join', 'pop', 'push', 'reverse', 'reverseRight', 'some', 'shift', 'slice', 'sort', 'splice', 'toSource', 'unshift']),
	      OBJECT_PROTO_PROPS_MAP = {},
	      ARRAY_PROTO_PROPS_MAP = {},
	      DESC_BINDING = '__VB_PROXY__',
	      CONST_BINDING = '__VB_CONST__',
	      CONST_SCRIPT = ['\tPublic [', DESC_BINDING, ']\r\n', '\tPublic Default Function [', CONST_BINDING, '](desc)\r\n', '\t\tset [', DESC_BINDING, '] = desc\r\n', '\t\tSet [', CONST_BINDING, '] = Me\r\n', '\tEnd Function\r\n'].join(''),
	      VBClassPool = {},
	      ClassNameGenerator = 0,
	      hasOwn = Object.prototype.hasOwnProperty;
	
	  for (var i = OBJECT_PROTO_PROPS.length - 1; i >= 0; i--) {
	    OBJECT_PROTO_PROPS_MAP[OBJECT_PROTO_PROPS[i]] = true;
	  }
	  for (var _i = ARRAY_PROTO_PROPS.length - 1; _i >= 0; _i--) {
	    ARRAY_PROTO_PROPS_MAP[ARRAY_PROTO_PROPS[_i]] = true;
	  }
	
	  function generateVBClassName() {
	    return 'VBClass' + ClassNameGenerator++;
	  }
	
	  function parseVBClassConstructorName(className) {
	    return className + 'Constructor';
	  }
	
	  function generateSetter(attr) {
	    return ['\tPublic Property Get [', attr, ']\r\n', '\tOn Error Resume Next\r\n', '\t\tSet[', attr, '] = [', DESC_BINDING, '].get("', attr, '")\r\n', '\tIf Err.Number <> 0 Then\r\n', '\t\t[', attr, '] = [', DESC_BINDING, '].get("', attr, '")\r\n', '\tEnd If\r\n', '\tOn Error Goto 0\r\n', '\tEnd Property\r\n'];
	  }
	
	  function generateGetter(attr) {
	    return ['\tPublic Property Let [', attr, '](val)\r\n', '\t\tCall [', DESC_BINDING, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n', '\tPublic Property Set [', attr, '](val)\r\n', '\t\tCall [', DESC_BINDING, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n'];
	  }
	
	  function generateVBClass(VBClassName, properties) {
	    var buffer = void 0,
	        i = void 0,
	        l = void 0,
	        attr = void 0,
	        added = {};
	
	    buffer = ['Class ', VBClassName, '\r\n', CONST_SCRIPT, '\r\n'];
	    for (i = 0, l = properties.length; i < l; i++) {
	      attr = properties[i];
	      buffer.push.apply(buffer, generateSetter(attr));
	      buffer.push.apply(buffer, generateGetter(attr));
	      added[attr] = true;
	    }
	    buffer.push('End Class\r\n');
	    return buffer.join('');
	  }
	
	  function generateVBClassConstructor(properties) {
	    var key = [properties.length, '[', properties.join(','), ']'].join(''),
	        VBClassConstructorName = VBClassPool[key];
	
	    if (VBClassConstructorName) return VBClassConstructorName;
	
	    var VBClassName = generateVBClassName();
	    VBClassConstructorName = parseVBClassConstructorName(VBClassName);
	    parseVB(generateVBClass(VBClassName, properties));
	    parseVB(['Function ', VBClassConstructorName, '(desc)\r\n', '\tDim o\r\n', '\tSet o = (New ', VBClassName, ')(desc)\r\n', '\tSet ', VBClassConstructorName, ' = o\r\n', 'End Function'].join(''));
	    VBClassPool[key] = VBClassConstructorName;
	    return VBClassConstructorName;
	  }
	
	  function _createVBProxy(object, desc) {
	    var isArray = object instanceof Array,
	        props = void 0,
	        proxy = void 0;
	
	    if (isArray) {
	      props = ARRAY_PROTO_PROPS.slice();
	      for (var attr in object) {
	        if (attr !== DESC_BINDING) if (!(attr in ARRAY_PROTO_PROPS_MAP)) props.push(attr);
	      }
	    } else {
	      props = OBJECT_PROTO_PROPS.slice();
	      for (var _attr in object) {
	        if (_attr !== DESC_BINDING) if (!(_attr in OBJECT_PROTO_PROPS_MAP)) props.push(_attr);
	      }
	    }
	    desc = desc || new ObjectDescriptor(object, props);
	    proxy = window[generateVBClassConstructor(props)](desc);
	    desc.proxy = proxy;
	    onProxyChange(object, proxy);
	    return proxy;
	  }
	
	  var ObjectDescriptor = function () {
	    function ObjectDescriptor(object, props) {
	      _classCallCheck(this, ObjectDescriptor);
	
	      var defines = {};
	      for (var _i2 = 0, l = props.length; _i2 < l; _i2++) {
	        defines[props[_i2]] = false;
	      }
	      this.object = object;
	      this.defines = defines;
	      object[DESC_BINDING] = this;
	      this.accessorNR = 0;
	    }
	
	    ObjectDescriptor.prototype.isAccessor = function isAccessor(desc) {
	      return desc && (desc.get || desc.set);
	    };
	
	    ObjectDescriptor.prototype.hasAccessor = function hasAccessor() {
	      return !!this.accessorNR;
	    };
	
	    ObjectDescriptor.prototype.defineProperty = function defineProperty(attr, desc) {
	      if (!(attr in this.defines)) {
	        if (!(attr in this.object)) this.object[attr] = undefined;
	        _createVBProxy(this.object, this);
	      }
	      if (!this.isAccessor(desc)) {
	        if (this.defines[attr]) {
	          this.defines[attr] = false;
	          this.accessorNR--;
	        }
	        this.object[attr] = desc.value;
	      } else {
	        this.accessorNR++;
	        this.defines[attr] = desc;
	        if (desc.get) this.object[attr] = desc.get();
	      }
	      return this.proxy;
	    };
	
	    ObjectDescriptor.prototype.getPropertyDefine = function getPropertyDefine(attr) {
	      return this.defines[attr] || undefined;
	    };
	
	    ObjectDescriptor.prototype.get = function get(attr) {
	      var define = this.defines[attr],
	          ret = void 0;
	      if (define && define.get) {
	        return define.get.call(this.proxy);
	      } else {
	        return this.object[attr];
	      }
	    };
	
	    ObjectDescriptor.prototype.set = function set(attr, value) {
	      var define = this.defines[attr];
	      if (define && define.set) {
	        define.set.call(this.proxy, value);
	      }
	      this.object[attr] = value;
	    };
	
	    ObjectDescriptor.prototype.destroy = function destroy() {
	      this.defines = {};
	    };
	
	    return ObjectDescriptor;
	  }();
	
	  var api = {
	    eq: function eq(obj1, obj2) {
	      var desc1 = api.getVBProxyDesc(obj1),
	          desc2 = api.getVBProxyDesc(obj2);
	      if (desc1) obj1 = desc1.object;
	      if (desc2) obj2 = desc2.object;
	      return obj1 === obj2;
	    },
	    obj: function obj(object) {
	      if (!object) return object;
	      var desc = api.getVBProxyDesc(object);
	      return desc ? desc.object : object;
	    },
	    isVBProxy: function isVBProxy(object) {
	      return hasOwn.call(object, CONST_BINDING);
	    },
	    getVBProxy: function getVBProxy(object) {
	      var desc = api.getVBProxyDesc(object);
	      return desc ? desc.proxy : undefined;
	    },
	    getVBProxyDesc: function getVBProxyDesc(object) {
	      if (!object || !hasOwn.call(object, DESC_BINDING)) return undefined;
	      return object[DESC_BINDING];
	    },
	    createVBProxy: function createVBProxy(object) {
	      var desc = api.getVBProxyDesc(object);
	
	      if (desc) {
	        object = desc.object;
	      }
	      return _createVBProxy(object, desc);
	    },
	    freeVBProxy: function freeVBProxy(object) {
	      var desc = api.getVBProxyDesc(object);
	      if (desc) {
	        object = desc.object;
	        desc.destroy();
	        object[DESC_BINDING] = undefined;
	        onProxyChange(object, undefined);
	      }
	      return object;
	    }
	  };
	  return api;
	}
	
	var supported = undefined;
	VBProxyFactory.isSupport = function isSupport() {
	  if (supported !== undefined) return supported;
	  supported = false;
	  if (window.VBArray) {
	    try {
	      window.execScript(['Function parseVB(code)', '\tExecuteGlobal(code)', 'End Function'].join('\n'), 'VBScript');
	      supported = true;
	    } catch (e) {
	      console.error(e.message, e);
	    }
	  }
	  return supported;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Exp = __webpack_require__(7);
	var observer = __webpack_require__(8);
	var Map = __webpack_require__(5);
	
	var _require = __webpack_require__(4);
	
	var proxy = _require.proxy;
	var _ = __webpack_require__(6);
	
	var exps = new Map();
	var factory = {
	  _bind: function _bind(obj, exp) {
	    var desc = exps.get(obj);
	
	    if (!desc) {
	      exps.set(obj, desc = {
	        exprNum: 1,
	        map: {}
	      });
	    } else desc.exprNum++;
	    desc.map[exp.expression] = exp;
	  },
	  _unbind: function _unbind(obj, exp) {
	    var desc = exps.get(obj);
	
	    if (desc) {
	      var map = desc.map,
	          expression = exp.expression;
	
	      if (map[expression] === exp) {
	        map[expression] = undefined;
	        if (! --desc.exprNum) exps['delete'](obj);
	      }
	    }
	  },
	  _get: function _get(obj, expression) {
	    var desc = exps.get(obj);
	
	    return desc ? desc.map[expression] : undefined;
	  },
	  on: function on(obj, expression, handler) {
	    var path = _.parseExpr(expression);
	
	    if (path.length > 1) {
	      var exp = void 0;
	
	      obj = proxy.obj(obj);
	      exp = factory._get(obj, expression);
	      if (!exp) {
	        exp = new Exp(obj, expression, path);
	        factory._bind(obj, exp);
	      }
	      exp.on(handler);
	      return exp.target;
	    } else {
	      return observer.on(obj, expression, handler);
	    }
	  },
	  un: function un(obj, expression, handler) {
	    var path = _.parseExpr(expression);
	
	    if (path.length > 1) {
	      var exp = void 0;
	
	      obj = proxy.obj(obj);
	      exp = factory._get(obj, expression);
	      if (exp) {
	        if (arguments.length > 2) exp.un(handler);else exp.un();
	
	        if (!exp.hasListen()) {
	          factory._unbind(obj, exp);
	          return exp.destory();
	        }
	        return exp.target;
	      } else {
	        var ob = observer._get(obj);
	
	        return ob ? ob.target : obj;
	      }
	    } else {
	      return observer.un(obj, expression, handler);
	    }
	  },
	  hasListen: function hasListen(obj, expression, handler) {
	    var l = arguments.length;
	    if (l == 1) {
	      return observer.hasListen(obj);
	    } else if (l == 2) {
	      if (typeof expression == 'function') {
	        return observer.hasListen(obj, expression);
	      }
	    }
	    var path = _.parseExpr(expression);
	    if (path.length > 1) {
	      var exp = factory._get(proxy.obj(obj), expression);
	      if (exp) return l == 2 ? true : exp.hasListen(handler);
	      return false;
	    } else if (l == 2) {
	      return observer.hasListen(obj, expression);
	    } else {
	      return observer.hasListen(obj, expression, handler);
	    }
	  }
	};
	module.exports = factory;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2),
	    tmpDiv = document.createElement('div');
	if (!document.querySelectorAll) {
	  document.querySelectorAll = function querySelectorAll(selector) {
	    var doc = document,
	        head = doc.documentElement.firstChild,
	        styleTag = doc.createElement('STYLE');
	
	    head.appendChild(styleTag);
	    doc.__qsaels = [];
	    if (styleTag.styleSheet) {
	      // for IE
	      styleTag.styleSheet.cssText = selector + "{x:expression(document.__qsaels.push(this))}";
	    } else {
	      // others
	      var textnode = document.createTextNode(selector + "{x:expression(document.__qsaels.push(this))}");
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
	
	var propFix = {
	  tabindex: "tabIndex",
	  readonly: "readOnly",
	  "for": "htmlFor",
	  "class": "className",
	  maxlength: "maxLength",
	  cellspacing: "cellSpacing",
	  cellpadding: "cellPadding",
	  rowspan: "rowSpan",
	  colspan: "colSpan",
	  usemap: "useMap",
	  frameborder: "frameBorder",
	  contenteditable: "contentEditable"
	},
	    propHooks = {};
	
	var dom = {
	  prop: function prop(elem, name, value) {
	    name = propFix[name] || name;
	    hook = propHooks[name];
	    if (arguments.length > 2) {
	      if (hook && hook.set) return hook.set(elem, name, value);
	      return elem[name] = value;
	    } else {
	      if (hook && hook.get) return hook.get(elem, name);
	      return elem[name];
	    }
	  },
	  query: function query(selectors, all) {
	    if (typeof selectors == 'string') return all ? document.querySelectorAll(selectors) : document.querySelector(selectors);
	    return selectors;
	  },
	  inDoc: function inDoc(node) {
	    var doc = document.documentElement,
	        parent = node && node.parentNode;
	
	    return doc === node || doc === parent || !!(parent && parent.nodeType === 1 && doc.contains(parent));
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
	  append: function append(target, el) {
	    if (el instanceof Array) {
	      for (var i = 0, l = el.length; i < l; i++) {
	        target.appendChild(el[i]);
	      }
	    } else target.appendChild(el);
	  },
	  appendTo: function appendTo(el, target) {
	    dom.append(target, el);
	  },
	  prepend: function prepend(target, el) {
	    if (target.firstChild) {
	      dom.before(el, target.firstChild);
	    } else {
	      dom.append(target, el);
	    }
	  },
	  prependTo: function prependTo(el, target) {
	    dom.prepend(target, el);
	  },
	  on: function on(el, event, cb) {
	    $(el).on(event, cb);
	  },
	  off: function off(el, event, cb) {
	    $(el).off(event, cb);
	  },
	  html: function html(el) {
	    return el.innerHTML;
	  },
	  setHtml: function setHtml(el, html) {
	    el.innerHTML = html;
	  },
	  text: function text(el) {
	    return el.data;
	  },
	  setText: function setText(el, text) {
	    el.data = text;
	  },
	  attr: function attr(el, _attr) {
	    return el.getAttribute(_attr);
	  },
	  setAttr: function setAttr(el, attr, val) {
	    el.setAttribute(attr, val);
	  },
	  removeAttr: function removeAttr(el, attr) {
	    el.removeAttribute(attr);
	  },
	  style: function style(el) {
	    return dom.attr('style');
	  },
	  setStyle: function setStyle(el, style) {
	    return dom.setAttr('style', style);
	  },
	  css: function css(el, name) {
	    return $(el).css(name);
	  },
	  setCss: function setCss(el, name, val) {
	    $(el).css(name, val);
	  },
	  val: function val(el) {
	    return $(el).val();
	  },
	  setVal: function setVal(el, val) {
	    $(el).val(val);
	  },
	  checked: function checked(el) {
	    return $(el).prop('checked');
	  },
	  setChecked: function setChecked(el, val) {
	    $(el).prop('checked', val);
	  },
	  'class': function _class(el, cls) {
	    return dom.prop(el, 'class');
	  },
	  setClass: function setClass(el, cls) {
	    dom.prop(el, 'class', cls);
	  },
	  addClass: function addClass(el, cls) {
	    if (el.classList) {
	      el.classList.add(cls);
	    } else {
	      var cur = ' ' + (dom.prop(el, 'class') || '') + ' ';
	      if (cur.indexOf(' ' + cls + ' ') < 0) {
	        dom.setClass(el, _.trim(cur + cls));
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
	      dom.setClass(el, _.trim(cur));
	    }
	  },
	  focus: function focus(el) {
	    el.focus();
	  },
	  outerHtml: function outerHtml(el) {
	    if (el.outerHTML) {
	      return el.outerHTML;
	    } else {
	      var container = document.createElement('div');
	      container.appendChild(el.cloneNode(true));
	      return container.innerHTML;
	    }
	  }
	};
	module.exports = dom;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var observer = __webpack_require__(3);
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(12);
	var Text = __webpack_require__(14);
	
	var _require = __webpack_require__(17);
	
	var Directive = _require.Directive;
	var DirectiveGroup = _require.DirectiveGroup;
	
	
	function cpyChildNodes(el) {
	  var els = [],
	      childNodes = el.childNodes;
	  for (var i = 0, l = childNodes.length; i < l; i++) {
	    els[i] = childNodes[i];
	  }return els;
	}
	
	var TemplateInstance = exports.TemplateInstance = function () {
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
	
	  TemplateInstance.prototype.before = function before(target) {
	    dom.before(this.els, dom.query(target));
	    return this;
	  };
	
	  TemplateInstance.prototype.after = function after(target) {
	    dom.after(this.els, dom.query(target));
	    return this;
	  };
	
	  TemplateInstance.prototype.prependTo = function prependTo(target) {
	    dom.prependTo(this.els, dom.query(target));
	    return this;
	  };
	
	  TemplateInstance.prototype.appendTo = function appendTo(target) {
	    dom.appendTo(this.els, dom.query(target));
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

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(12);
	
	var _require = __webpack_require__(15);
	
	var Binding = _require.Binding;
	var expression = __webpack_require__(16);
	var expressionArgs = ['$el'];
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
	    var scope = this.scope();
	
	    return this.filter(this.expression.execute.call(this, scope, this.el));
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2),
	    observer = __webpack_require__(3);
	
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
	
	  AbstractBinding.prototype.bind = function bind() {};
	
	  AbstractBinding.prototype.unbind = function unbind() {};
	
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.isSimplePath = isSimplePath;
	exports.parse = parse;
	var _ = __webpack_require__(2);
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(12);
	
	var _require = __webpack_require__(15);
	
	var Binding = _require.Binding;
	var AbstractBinding = _require.AbstractBinding;
	
	var _require2 = __webpack_require__(2);
	
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
	
	var Directive = exports.Directive = function (_Binding) {
	  _inherits(Directive, _Binding);
	
	  function Directive(el, tpl, expr, attr) {
	    _classCallCheck(this, Directive);
	
	    var _this2 = _possibleConstructorReturn(this, _Binding.call(this, tpl, expr));
	
	    _this2.el = el;
	    _this2.attr = attr;
	
	    dom.removeAttr(_this2.el, _this2.attr);
	    if (Binding.generateComments) {
	      _this2.comment = document.createComment(' Directive:' + _this2.name + ' [' + _this2.expr + '] ');
	      dom.before(_this2.comment, _this2.el);
	    }
	    return _this2;
	  }
	
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
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(12);
	
	var _require = __webpack_require__(17);
	
	var Directive = _require.Directive;
	var YieId = _.YieId;
	
	var _require2 = __webpack_require__(1);
	
	var Template = _require2.Template;
	var expression = __webpack_require__(16);
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
	    _Directive.prototype.bind.call(this);
	    var identities = this.expression.identities;
	    for (var i = 0, l = identities.length; i < l; i++) {
	      this.observe(identities[i], this.observeHandler);
	    }this.update(this.value());
	  };
	
	  AbstractExpressionDirective.prototype.unbind = function unbind() {
	    _Directive.prototype.unbind.call(this);
	
	    var identities = this.expression.identities;
	    for (var i = 0, l = identities.length; i < l; i++) {
	      this.unobserve(identities[i], this.observeHandler);
	    }
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
	    directives = {
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
	      AbstractExpressionDirective.prototype.bind.call(this);
	      if (!this.directives) {
	        this.yieId = new YieId();
	        return this.yieId;
	      }
	    },
	    update: function update(val) {
	      if (!val) {
	        dom.setCss(this.el, 'display', 'none');
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
	        dom.setCss(this.el, 'display', '');
	      }
	    },
	    unbind: function unbind() {
	      AbstractExpressionDirective.prototype.unbind.call(this);
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
	      if (val instanceof Array) dom.setChecked(this.el, _.indexOf.call(val, dom.val(this.el)));else dom.setChecked(this.el, !!val);
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
	      AbstractExpressionDirective.prototype.bind.call(this);
	      dom.on(this.el, this.event, this.onChange);
	    },
	    unbind: function unbind() {
	      AbstractExpressionDirective.prototype.unbind.call(this);
	      dom.off(this.el, this.event, this.onChange);
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
	
	_.eachObj(directives, function (opt, name) {
	  opt.extend = AbstractExpressionDirective;
	  registerDirective(name, opt);
	});

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(12);
	
	var _require = __webpack_require__(17);
	
	var Directive = _require.Directive;
	var expression = __webpack_require__(16);
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
	    _Directive.prototype.bind.call(this);
	    dom.on(this.el, this.eventType, this.handler);
	  };
	
	  AbstractEventDirective.prototype.unbind = function unbind() {
	    _Directive.prototype.unbind.call(this);
	    dom.off(this.el, this.eventType, this.handler);
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(12);
	
	var _require = __webpack_require__(17);
	
	var Directive = _require.Directive;
	
	var _require2 = __webpack_require__(13);
	
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

/***/ }
/******/ ])
});
;
//# sourceMappingURL=tpl.all.js.map