/*!
 * tpl.js v0.0.15 built in Wed, 13 Jul 2016 08:24:43 GMT
 * Copyright (c) 2016 Tao Zeng <tao.zeng.zt@gmail.com>
 * Based on observer.js v0.2.x
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
	
	var tpl = __webpack_require__(1),
	    observer = __webpack_require__(3),
	    _ = __webpack_require__(2),
	    config = __webpack_require__(28);
	
	_.assign(tpl, _, __webpack_require__(16), {
	  filter: __webpack_require__(34),
	  expression: __webpack_require__(33),
	  Directive: __webpack_require__(24).Directive,
	  directives: __webpack_require__(36),
	  TextParser: __webpack_require__(35),
	  config: config.get(),
	  init: function init(cfg) {
	    observer.init(cfg);
	    config.config(cfg);
	  }
	});
	module.exports = tpl;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(16),
	    TemplateInstance = __webpack_require__(23),
	    TextParser = __webpack_require__(35),
	    config = __webpack_require__(28);
	
	config.register('directiveReg', /^tpl-/);
	config.register('textParser', TextParser.NormalTextParser);
	
	var Template = function () {
	  function Template(templ) {
	    var cfg = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    _classCallCheck(this, Template);
	
	    var el = document.createElement('div');
	    if (typeof templ == 'string') {
	      templ = _.trim(templ);
	      if (templ.charAt(0) == '<') el.innerHTML = templ;else dom.append(el, dom.query(templ));
	    } else {
	      dom.append(el, templ);
	    }
	    this.el = el;
	    this.directiveReg = cfg.directiveReg || config.get('directiveReg');
	    this.TextParser = cfg.TextParser || config.get('textParser');
	  }
	
	  Template.prototype.complie = function complie(scope) {
	    return new TemplateInstance(dom.cloneNode(this.el), scope, this.TextParser, this.directiveReg);
	  };
	
	  return Template;
	}();
	
	module.exports = Template;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var observer = __webpack_require__(3),
	    regHump = /(^[a-z])|([_-][a-zA-Z])/g;
	
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
	
	module.exports = assign({
	    hump: function hump(str) {
	        return str.replace(regHump, _hump);
	    },
	
	    YieId: observer.dynamicClass({
	        constructor: function constructor() {
	            this.doned = false;
	            this.thens = [];
	        },
	        then: function then(callback) {
	            if (this.doned) callback();else this.thens.push(callback);
	        },
	        done: function done() {
	            if (!this.doned) {
	                var thens = this.thens;
	                for (var i = 0, l = thens.length; i < l; i++) {
	                    thens[i]();
	                }
	                this.doned = true;
	            }
	        },
	        isDone: function isDone() {
	            return this.doned;
	        }
	    })
	}, observer, {
	    on: 'observe',
	    un: 'unobserve',
	    hasListen: 'isObserved'
	});
	
	if (!Object.create) Object.create = observer.create;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(4),
	    observer = __webpack_require__(10),
	    _proxy = __webpack_require__(11),
	    configuration = __webpack_require__(12);
	
	__webpack_require__(14);
	__webpack_require__(15);
	
	_.assignIf(observer, _, {
	  eq: function eq(o1, o2) {
	    return _proxy.eq(o1, o2);
	  },
	  obj: function obj(o) {
	    return _proxy.obj(o);
	  },
	  onproxy: function onproxy(o, h) {
	    return _proxy.on(o, h);
	  },
	  unproxy: function unproxy(o, h) {
	    return _proxy.un(o, h);
	  },
	
	  proxy: _proxy,
	  config: configuration.get()
	});
	
	module.exports = observer;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(5);
	var _ = __webpack_require__(7);
	
	module.exports = _.assignIf(_, {
	  timeoutframe: __webpack_require__(6),
	  Configuration: __webpack_require__(8)
	}, __webpack_require__(9));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var tf = __webpack_require__(6);
	
	window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || tf.request;
	
	window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || tf.cancel;
	
	function fixProto(Type, prop, val) {
	  if (!Type.prototype[prop]) Type.prototype[prop] = val;
	}
	
	fixProto(Function, 'bind', function bind(scope) {
	  var fn = this,
	      args = Array.prototype.slice.call(arguments, 1);
	
	  return function () {
	    return fn.apply(scope, args.concat(Array.prototype.slice.call(arguments)));
	  };
	});

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.request = request;
	exports.cancel = cancel;
	var lastTime = void 0;
	
	function request(callback) {
	  var currTime = new Date().getTime(),
	      timeToCall = Math.max(0, 16 - (currTime - lastTime)),
	      reqId = setTimeout(function () {
	    callback(currTime + timeToCall);
	  }, timeToCall);
	  lastTime = currTime + timeToCall;
	  return reqId;
	}
	
	function cancel(reqId) {
	  clearTimeout(reqId);
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.hasOwnProp = hasOwnProp;
	exports.isDefine = isDefine;
	exports.isNull = isNull;
	exports.isNil = isNil;
	exports.isArray = isArray;
	exports.isFunc = isFunc;
	exports.isNumber = isNumber;
	exports.isNaN = isNaN;
	exports.isBool = isBool;
	exports.isDate = isDate;
	exports.isString = isString;
	exports.isObject = isObject;
	exports.isRegExp = isRegExp;
	exports.isArrayLike = isArrayLike;
	exports.each = each;
	exports.map = map;
	exports.filter = filter;
	exports.aggregate = aggregate;
	exports.keys = keys;
	exports.indexOf = indexOf;
	exports.lastIndexOf = lastIndexOf;
	exports.convert = convert;
	exports.reverseConvert = reverseConvert;
	exports.upperFirst = upperFirst;
	exports.ltrim = ltrim;
	exports.rtrim = rtrim;
	exports.trim = trim;
	exports.format = format;
	exports._format = _format;
	exports.parseExpr = parseExpr;
	exports.get = get;
	exports.has = has;
	exports.set = set;
	exports.getOwnProp = getOwnProp;
	exports.assignIf = assignIf;
	exports.emptyFunc = emptyFunc;
	exports.isExtendOf = isExtendOf;
	exports.dynamicClass = dynamicClass;
	var toStr = Object.prototype.toString,
	    hasOwn = Object.prototype.hasOwnProperty;
	
	function hasOwnProp(obj, prop) {
	  return hasOwn.call(obj, prop);
	}
	
	// ==============================================
	// type utils
	// ==============================================
	var argsType = exports.argsType = '[object Arguments]';
	var arrayType = exports.arrayType = '[object Array]';
	var funcType = exports.funcType = '[object Function]';
	var boolType = exports.boolType = '[object Boolean]';
	var numberType = exports.numberType = '[object Number]';
	var dateType = exports.dateType = '[object Date]';
	var stringType = exports.stringType = '[object String]';
	var objectType = exports.objectType = '[object Object]';
	var regexpType = exports.regexpType = '[object RegExp]';
	var nodeListType = exports.nodeListType = '[object NodeList]';
	
	function isDefine(obj) {
	  return obj === undefined;
	}
	
	function isNull(obj) {
	  return obj === null;
	}
	
	function isNil(obj) {
	  return obj === undefined || obj === null;
	}
	
	function isArray(obj) {
	  return toStr.call(obj) === arrayType;
	}
	
	function isFunc(obj) {
	  return toStr.call(obj) === funcType;
	}
	
	function isNumber(obj) {
	  return toStr.call(obj) === numberType;
	}
	
	function isNaN(obj) {
	  return obj === NaN;
	}
	
	function isBool(obj) {
	  return toStr.call(obj) === boolType;
	}
	
	function isDate(obj) {
	  return toStr.call(obj) === dateType;
	}
	
	function isString(obj) {
	  return toStr.call(obj) === stringType;
	}
	
	function isObject(obj) {
	  return toStr.call(obj) === objectType;
	}
	
	function isRegExp(obj) {
	  return toStr.call(obj) === regexpType;
	}
	
	function isArrayLike(obj) {
	  var type = toStr.call(obj);
	  switch (type) {
	    case argsType:
	    case arrayType:
	    case stringType:
	    case nodeListType:
	      return true;
	    default:
	      if (obj) {
	        var length = obj.length;
	        return isNumber(length) && length > 0 && length - 1 in obj;
	      }
	      return false;
	  }
	}
	
	// ==============================================
	// array utils
	// ==============================================
	function _eachObj(obj, callback, scope, own) {
	  var key = void 0,
	      isOwn = void 0;
	
	  scope = scope || obj;
	  for (key in obj) {
	    isOwn = hasOwnProp(obj, key);
	    if (own === false || isOwn) {
	      if (callback.call(scope, obj[key], key, obj, isOwn) === false) return false;
	    }
	  }
	  return true;
	}
	
	function _eachArray(obj, callback, scope) {
	  var i = 0,
	      j = obj.length;
	
	  scope = scope || obj;
	  for (; i < j; i++) {
	    if (callback.call(scope, obj[i], i, obj, true) === false) return false;
	  }
	  return true;
	}
	
	function each(obj, callback, scope, own) {
	  if (isArrayLike(obj)) {
	    return _eachArray(obj, callback, scope);
	  } else if (!isNil(obj)) {
	    return _eachObj(obj, callback, scope, own);
	  }
	  return true;
	}
	
	function map(obj, callback, scope, own) {
	  var ret = void 0;
	
	  function cb(val, key) {
	    ret[key] = callback.apply(this, arguments);
	  }
	
	  if (isArrayLike(obj)) {
	    ret = [];
	    _eachArray(obj, cb, scope);
	  } else {
	    ret = {};
	    if (!isNil(obj)) _eachObj(obj, cb, scope, own);
	  }
	  return ret;
	}
	
	function filter(obj, callback, scope, own) {
	  var ret = void 0;
	
	  if (isArrayLike(obj)) {
	    ret = [];
	    _eachArray(obj, function (val) {
	      if (callback.apply(this, arguments)) ret.push(val);
	    }, scope);
	  } else {
	    ret = {};
	    if (!isNil(obj)) _eachObj(obj, function (val, key) {
	      if (callback.apply(this, arguments)) ret[key] = val;
	    }, scope, own);
	  }
	  return ret;
	}
	
	function aggregate(obj, callback, defVal, scope, own) {
	  var rs = defVal;
	
	  each(obj, function (val, key, obj, isOwn) {
	    rs = callback.call(this, rs, val, key, obj, isOwn);
	  }, scope, own);
	  return rs;
	}
	
	function keys(obj, filter, scope, own) {
	  var keys = [];
	
	  each(obj, function (val, key) {
	    if (!filter || filter.apply(this, arguments)) keys.push(key);
	  }, scope, own);
	  return keys;
	}
	
	function _indexOfArray(array, val) {
	  var i = 0,
	      l = array.length;
	
	  for (; i < l; i++) {
	    if (array[i] === val) return i;
	  }
	  return -1;
	}
	
	function _lastIndexOfArray(array, val) {
	  var i = array.length;
	
	  while (i-- > 0) {
	    if (array[i] === val) return i;
	  }
	}
	
	function _indexOfObj(obj, val, own) {
	  for (key in obj) {
	    if (own === false || hasOwnProp(obj, key)) {
	      if (obj[key] === val) return key;
	    }
	  }
	  return undefined;
	}
	
	function indexOf(obj, val, own) {
	  if (isArrayLike(obj)) {
	    return _indexOfArray(obj, val);
	  } else {
	    return _indexOfObj(obj, val, own);
	  }
	}
	
	function lastIndexOf(obj, val, own) {
	  if (isArrayLike(obj)) {
	    return _lastIndexOfArray(obj, val);
	  } else {
	    return _indexOfObj(obj, val, own);
	  }
	}
	
	function convert(obj, keyGen, valGen, scope, own) {
	  var o = {};
	
	  each(obj, function (val, key) {
	    o[keyGen ? keyGen.apply(this, arguments) : key] = valGen ? valGen.apply(this, arguments) : val;
	  }, scope, own);
	  return o;
	}
	
	function reverseConvert(obj, valGen, scope, own) {
	  var o = {};
	
	  each(obj, function (val, key) {
	    o[val] = valGen ? valGen.apply(this, arguments) : key;
	  }, scope, own);
	  return o;
	}
	
	// ==============================================
	// string utils
	// ==============================================
	var regFirstChar = /^[a-z]/,
	    regLeftTrim = /^\s+/,
	    regRightTrim = /\s+$/,
	    regTrim = /(^\s+)|(\s+$)/g;
	
	function _uppercase(k) {
	  return k.toUpperCase();
	}
	
	function upperFirst(str) {
	  return str.replace(regFirstChar, _uppercase);
	}
	
	function ltrim(str) {
	  return str.replace(regLeftTrim, '');
	}
	
	function rtrim(str) {
	  return str.replace(regRightTrim, '');
	}
	
	function trim(str) {
	  return str.replace(regTrim, '');
	}
	
	var regFormat = /%%|%(\d+\$)?([-+#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegpEGP])/g;
	
	function pad(str, len, chr, leftJustify) {
	  var padding = str.length >= len ? '' : Array(1 + len - str.length >>> 0).join(chr);
	
	  return leftJustify ? str + padding : padding + str;
	}
	
	function justify(value, prefix, leftJustify, minWidth, zeroPad) {
	  var diff = minWidth - value.length;
	
	  if (diff > 0) return leftJustify || !zeroPad ? pad(value, minWidth, ' ', leftJustify) : value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
	  return value;
	}
	
	function format(str) {
	  return _format(str, Array.prototype.slice.call(arguments, 1)).format;
	}
	
	function _format(str, args) {
	  var i = 0;
	  str = str.replace(regFormat, function (substring, valueIndex, flags, minWidth, _, precision, type) {
	    if (substring == '%%') return '%';
	
	    var leftJustify = false,
	        positivePrefix = '',
	        zeroPad = false,
	        prefixBaseX = false;
	
	    if (flags) each(flags, function (c) {
	      switch (c) {
	        case ' ':
	          positivePrefix = ' ';
	          break;
	        case '+':
	          positivePrefix = '+';
	          break;
	        case '-':
	          leftJustify = true;
	          break;
	        case '0':
	          zeroPad = true;
	          break;
	        case '#':
	          prefixBaseX = true;
	          break;
	      }
	    });
	
	    if (!minWidth) {
	      minWidth = 0;
	    } else if (minWidth == '*') {
	      minWidth = +args[i++];
	    } else if (minWidth.charAt(0) == '*') {
	      minWidth = +args[minWidth.slice(1, -1)];
	    } else {
	      minWidth = +minWidth;
	    }
	
	    if (minWidth < 0) {
	      minWidth = -minWidth;
	      leftJustify = true;
	    }
	
	    if (!isFinite(minWidth)) throw new Error('sprintf: (minimum-)width must be finite');
	
	    if (precision && precision.charAt(0) == '*') {
	      precision = +args[precision == '*' ? i++ : precision.slice(1, -1)];
	      if (precision < 0) precision = null;
	    }
	
	    if (precision == null) {
	      precision = 'fFeE'.indexOf(type) > -1 ? 6 : type == 'd' ? 0 : void 0;
	    } else {
	      precision = +precision;
	    }
	
	    var value = valueIndex ? args[valueIndex.slice(0, -1)] : args[i++],
	        prefix = void 0,
	        base = void 0;
	
	    switch (type) {
	      case 'c':
	        value = String.fromCharCode(+value);
	      case 's':
	        {
	          value = String(value);
	          if (precision != null) value = value.slice(0, precision);
	          prefix = '';
	          break;
	        }
	      case 'b':
	        base = 2;
	        break;
	      case 'o':
	        base = 8;
	        break;
	      case 'u':
	        base = 10;
	        break;
	      case 'x':
	      case 'X':
	        base = 16;
	        break;
	      case 'i':
	      case 'd':
	        {
	          var _number = parseInt(+value);
	          if (isNaN(_number)) return '';
	          prefix = _number < 0 ? '-' : positivePrefix;
	          value = prefix + pad(String(Math.abs(_number)), precision, '0', false);
	          break;
	        }
	      case 'e':
	      case 'E':
	      case 'f':
	      case 'F':
	      case 'g':
	      case 'G':
	      case 'p':
	      case 'P':
	        {
	          var _number2 = +value;
	          if (isNaN(_number2)) return '';
	          prefix = _number2 < 0 ? '-' : positivePrefix;
	          var method = void 0;
	          if ('p' != type.toLowerCase()) {
	            method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
	          } else {
	            // Count significant-figures, taking special-care of zeroes ('0' vs '0.00' etc.)
	            var sf = String(value).replace(/[eE].*|[^\d]/g, '');
	            sf = (_number2 ? sf.replace(/^0+/, '') : sf).length;
	            precision = precision ? Math.min(precision, sf) : precision;
	            method = !precision || precision <= sf ? 'toPrecision' : 'toExponential';
	          }
	          var number_str = Math.abs(_number2)[method](precision);
	          // number_str = thousandSeparation ? thousand_separate(number_str): number_str
	          value = prefix + number_str;
	          break;
	        }
	      case 'n':
	        return '';
	      default:
	        return substring;
	    }
	
	    if (base) {
	      var number = value >>> 0;
	      prefix = prefixBaseX && base != 10 && number && ['0b', '0', '0x'][base >> 3] || '';
	      value = prefix + pad(number.toString(base), precision || 0, '0', false);
	    }
	    var justified = justify(value, prefix, leftJustify, minWidth, zeroPad);
	    return 'EFGPX'.indexOf(type) > -1 ? justified.toUpperCase() : justified;
	  });
	  return {
	    format: str,
	    formatArgCount: i
	  };
	}
	
	// ==============================================
	// object utils
	// ==============================================
	var exprCache = {},
	    regPropertyName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,
	    regEscapeChar = /\\(\\)?/g;
	
	function parseExpr(expr, autoCache) {
	  if (isArray(expr)) {
	    return expr;
	  } else if (isString(expr)) {
	    var _ret = function () {
	      var rs = exprCache[expr];
	
	      if (rs) return {
	          v: rs
	        };
	      rs = autoCache ? exprCache[expr] = [] : [];
	      expr.replace(regPropertyName, function (match, number, quote, string) {
	        rs.push(quote ? string.replace(regEscapeChar, '$1') : number || match);
	      });
	      return {
	        v: rs
	      };
	    }();
	
	    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	  } else {
	    return [];
	  }
	}
	
	function get(obj, expr, defVal, lastOwn, own) {
	  var i = 0,
	      path = parseExpr(expr, true),
	      l = path.length - 1,
	      prop = void 0;
	
	  while (!isNil(obj) && i < l) {
	    prop = path[i++];
	    if (own && !hasOwnProp(obj, prop)) return defVal;
	    obj = obj[prop];
	  }
	  prop = path[i];
	  return i == l && !isNil(obj) && (own ? hasOwnProp(obj, prop) : prop in obj) ? obj[prop] : defVal;
	}
	
	function has(obj, expr, lastOwn, own) {
	  var i = 0,
	      path = parseExpr(expr, true),
	      l = path.length - 1,
	      prop = void 0;
	
	  while (!isNil(obj) && i < l) {
	    prop = path[i++];
	    if (own && !hasOwnProp(obj, prop)) return false;
	    obj = obj[prop];
	  }
	  prop = path[i];
	  return i == l && !isNil(obj) && (own ? hasOwnProp(obj, prop) : prop in obj);
	}
	
	function set(obj, expr, value) {
	  var i = 0,
	      path = parseExpr(expr, true),
	      l = path.length - 1,
	      prop = path[0],
	      _obj = obj;
	
	  for (; i < l; i++) {
	    if (isNil(_obj[prop])) _obj = _obj[prop] = {};
	    prop = path[i + 1];
	  }
	  obj[prop] = value;
	  return obj;
	}
	
	function getOwnProp(obj, key) {
	  return hasOwnProp(obj, key) ? obj[key] : undefined;
	}
	
	var prototypeOf = exports.prototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(obj) {
	  return obj.__proto__;
	};
	
	var setPrototypeOf = exports.setPrototypeOf = Object.setPrototypeOf || function setPrototypeOf(obj, proto) {
	  obj.__proto__ = proto;
	};
	
	var assign = exports.assign = Object.assign || function assign(target) {
	  var source = void 0,
	      key = void 0,
	      i = 1,
	      l = arguments.length;
	
	  for (; i < l; i++) {
	    source = arguments[i];
	    for (key in source) {
	      if (hasOwnProp(source, key)) target[key] = source[key];
	    }
	  }
	  return target;
	};
	
	function assignIf(target) {
	  var source = void 0,
	      key = void 0,
	      i = 1,
	      l = arguments.length;
	
	  for (; i < l; i++) {
	    source = arguments[i];
	    for (key in source) {
	      if (hasOwnProp(source, key) && !hasOwnProp(target, key)) target[key] = source[key];
	    }
	  }
	  return target;
	}
	
	function emptyFunc() {}
	
	var create = exports.create = Object.create || function (parent, props) {
	  emptyFunc.prototype = parent;
	  var obj = new emptyFunc();
	  emptyFunc.prototype = undefined;
	  if (props) {
	    for (var prop in props) {
	      if (hasOwnProp(props, prop)) obj[prop] = props[prop];
	    }
	  }
	  return obj;
	};
	
	function isExtendOf(cls, parent) {
	  if (!isFunc(cls)) return cls instanceof parent;
	
	  var proto = cls;
	
	  while (proto = prototypeOf(proto)) {
	    if (proto === parent) return true;
	  }
	  return false;
	}
	
	var classOptionConstructorKey = 'constructor',
	    classOptionExtendKey = 'extend';
	
	function dynamicClass(cfg, options) {
	  var constructorKey = void 0,
	      extendKey = void 0,
	      constructor = void 0,
	      superCls = void 0,
	      cls = void 0;
	
	  if (!isObject(cfg)) throw TypeError('Invalid Class Config: ' + cfg);
	
	  options = options || {};
	  constructorKey = isString(options.constructor) ? options.constructor : classOptionConstructorKey;
	  extendKey = isString(options.extend) ? options.extend : classOptionExtendKey;
	  constructor = cfg[constructorKey];
	  superCls = cfg[extendKey];
	
	  if (!isFunc(constructor) || constructor === Object) constructor = undefined;
	  if (!isFunc(superCls) || superCls === Object) superCls = undefined;
	
	  cls = function (constructor, superCls) {
	    function DynamicClass() {
	      if (superCls && !(this instanceof superCls)) throw new TypeError('Cannot call a class as a function');
	      if (constructor) {
	        constructor.apply(this, arguments);
	      } else if (superCls) {
	        superCls.apply(this, arguments);
	      }
	    }
	    var proto = {
	      constructor: {
	        value: DynamicClass,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    };
	
	    DynamicClass.prototype = superCls ? create(superCls.prototype, proto) : proto;
	    setPrototypeOf(DynamicClass, superCls || {});
	    return DynamicClass;
	  }(constructor, superCls);
	
	  each(cfg, function (val, key) {
	    if (key !== constructorKey) cls.prototype[key] = val;
	  });
	  return cls;
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(7);
	
	var Configuration = _.dynamicClass({
	  constructor: function constructor(def) {
	    this.cfg = def || {};
	  },
	  register: function register(name, defVal) {
	    var _this = this;
	
	    if (arguments.length == 1) {
	      _.each(name, function (val, name) {
	        _this.cfg[name] = val;
	      });
	    } else {
	      this.cfg[name] = defVal;
	    }
	    return this;
	  },
	  config: function config(cfg) {
	    var _this2 = this;
	
	    if (cfg) _.each(this.cfg, function (val, key) {
	      if (_.hasOwnProp(cfg, key)) _this2.cfg[key] = cfg[key];
	    });
	    return this;
	  },
	  get: function get(name) {
	    return arguments.length ? this.cfg[name] : _.create(this.cfg);
	  }
	});
	module.exports = Configuration;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	var _ = __webpack_require__(7);
	
	var logLevels = ['debug', 'info', 'warn', 'error'],
	    tmpEl = document.createElement('div'),
	    slice = Array.prototype.slice;
	
	var SimulationConsole = _.dynamicClass({
	  constructor: function constructor() {
	    tmpEl.innerHTML = '<div id="simulation_console"\n    style="position:absolute; top:0; right:0; font-family:courier,monospace; background:#eee; font-size:10px; padding:10px; width:200px; height:200px;">\n  <a style="float:right; padding-left:1em; padding-bottom:.5em; text-align:right;">Clear</a>\n  <div id="simulation_console_body"></div>\n</div>';
	    this.el = tmpEl.childNodes[0];
	    this.clearEl = this.el.childNodes[0];
	    this.bodyEl = this.el.childNodes[1];
	  },
	  appendTo: function appendTo(el) {
	    el.appendChild(this.el);
	  },
	  log: function log(style, msg) {
	    tmpEl.innerHTML = '<span style="' + style + '">' + msg + '</span>';
	    this.bodyEl.appendChild(tmpEl.childNodes[0]);
	  },
	  parseMsg: function parseMsg(args) {
	    var msg = args[0];
	
	    if (_.isString(msg)) {
	      var f = _._format.apply(_, args);
	
	      return [f.format].concat(slice.call(args, f.formatArgCount)).join(' ');
	    }
	    return args.join(' ');
	  },
	  debug: function debug() {
	    this.log('color: red;', this.parseMsg(arguments));
	  },
	  info: function info() {
	    this.log('color: red;', this.parseMsg(arguments));
	  },
	  warn: function warn() {
	    this.log('color: red;', this.parseMsg(arguments));
	  },
	  error: function error() {
	    this.log('color: red;', this.parseMsg(arguments));
	  },
	  clear: function clear() {
	    this.bodyEl.innerHTML = '';
	  }
	});
	
	var console = window.console;
	
	if (console && !console.debug) console.debug = function () {
	  console.log.apply(this, arguments);
	};
	
	var Logger = exports.Logger = _.dynamicClass({
	  constructor: function constructor(_module, level) {
	    this.module = _module;
	    this.level = _.indexOf(logLevels, level || 'info');
	  },
	  setLevel: function setLevel(level) {
	    this.level = _.indexOf(logLevels, level || 'info');
	  },
	  getLevel: function getLevel() {
	    return logLevels[this.level];
	  },
	  _print: function _print(level, args, trace) {
	    console[level].apply(console, args);
	    if (trace && console.trace) console.trace();
	  },
	  _log: function _log(level, args, trace) {
	    if (level < this.level || !console) return;
	    var msg = '[%s] %s -' + (_.isString(args[0]) ? ' ' + args.shift() : ''),
	        errors = [];
	
	    args = _.filter(args, function (arg) {
	      if (arg instanceof Error) {
	        errors.push(arg);
	        return false;
	      }
	      return true;
	    });
	    _.each(errors, function (err) {
	      args.push.call(args, err.message, '\n', err.stack);
	    });
	    level = logLevels[level];
	    this._print(level, [msg, level, this.module].concat(args), trace);
	  },
	  debug: function debug() {
	    this._log(0, slice.call(arguments, 0));
	  },
	  info: function info() {
	    this._log(1, slice.call(arguments, 0));
	  },
	  warn: function warn() {
	    this._log(2, slice.call(arguments, 0));
	  },
	  error: function error() {
	    this._log(3, slice.call(arguments, 0));
	  }
	});
	
	Logger.enableSimulationConsole = function enableSimulationConsole() {
	  if (!console) {
	    console = new SimulationConsole();
	    console.appendTo(document.body);
	  }
	};
	
	var logger = exports.logger = new Logger('default', 'info');

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var proxy = __webpack_require__(11);
	var vbproxy = __webpack_require__(13);
	var _ = __webpack_require__(4);
	var timeoutframe = _.timeoutframe;
	var configuration = __webpack_require__(12);
	var config = configuration.cfg;
	
	configuration.register({
	  lazy: true,
	  animationFrame: true,
	  observerKey: '__OBSERVER__',
	  expressionKey: '__EXPR_OBSERVER__'
	});
	
	function abstractFunc() {}
	
	var Observer = _.dynamicClass({
	  constructor: function constructor(target) {
	    this.isArray = _.isArray(target);
	    if (!this.isArray && !_.isObject(target)) throw TypeError('can not observe object[' + Object.prototype.toString.call(target) + ']');
	    this.target = target;
	    this.obj = target;
	    this.listens = {};
	    this.changeRecords = {};
	    this._notify = this._notify.bind(this);
	    this.watchPropNum = 0;
	    this._init();
	  },
	  _fire: function _fire(attr, val, oldVal) {
	    var _this = this;
	
	    var handlers = void 0;
	
	    if (proxy.eq(val, oldVal) && !(this.isArray && attr === 'length')) return;
	    if (!(handlers = this.listens[attr])) return;
	
	    _.each(handlers.slice(), function (handler) {
	      handler(attr, val, oldVal, _this.target);
	    });
	  },
	  _notify: function _notify() {
	    var _this2 = this;
	
	    var obj = this.obj;
	
	    _.each(this.changeRecords, function (val, attr) {
	      _this2._fire(attr, obj[attr], val);
	    });
	    this.request_frame = undefined;
	    this.changeRecords = {};
	  },
	  _addChangeRecord: function _addChangeRecord(attr, oldVal) {
	    if (!config.lazy) {
	      this._fire(attr, this.obj[attr], oldVal);
	    } else if (!(attr in this.changeRecords)) {
	      this.changeRecords[attr] = oldVal;
	      if (!this.request_frame) {
	        this.request_frame = config.animationFrame ? window.requestAnimationFrame(this._notify) : timeoutframe.request(this._notify);
	      }
	    }
	  },
	  checkHandler: function checkHandler(handler) {
	    if (!_.isFunc(handler)) throw TypeError('Invalid Observe Handler');
	  },
	  hasListen: function hasListen(attr, handler) {
	    switch (arguments.length) {
	      case 0:
	        return !!this.watchPropNum;
	      case 1:
	        if (_.isFunc(attr)) {
	          return !_.each(this.listens, function (handlers) {
	            return _.lastIndexOf(handlers, attr) !== -1;
	          });
	        }
	        return !!listens[attr];
	      default:
	        this.checkHandler(handler);
	        return _.lastIndexOf(listens[attr], handler) !== -1;
	    }
	  },
	  on: function on(attr, handler) {
	    var handlers = void 0;
	
	    this.checkHandler(handler);
	    if (!(handlers = this.listens[attr])) {
	      this.listens[attr] = [handler];
	      this.watchPropNum++;
	      this._watch(attr);
	    } else {
	      handlers.push(handler);
	    }
	    return this.target;
	  },
	  _cleanListen: function _cleanListen(attr) {
	    this.listens[attr] = undefined;
	    this.watchPropNum--;
	    this._unwatch(attr);
	  },
	  un: function un(attr, handler) {
	    var handlers = this.listens[attr];
	
	    if (handlers) {
	      if (arguments.length == 1) {
	        this._cleanListen(attr);
	      } else {
	        this.checkHandler(handler);
	
	        var i = handlers.length;
	        while (i--) {
	          if (handlers[i] === handler) {
	            handlers.splice(i, 1);
	            if (!handlers.length) this._cleanListen(attr);
	            break;
	          }
	        }
	      }
	    }
	    return this.target;
	  },
	  destroy: function destroy() {
	    if (this.request_frame) {
	      config.animationFrame ? window.cancelAnimationFrame(this.request_frame) : timeoutframe.cancel(this.request_frame);
	      this.request_frame = undefined;
	    }
	    var obj = this.obj;
	    this._destroy();
	    this.obj = undefined;
	    this.target = undefined;
	    this.listens = undefined;
	    this.changeRecords = undefined;
	    return obj;
	  },
	
	  _init: abstractFunc,
	  _destroy: abstractFunc,
	  _watch: abstractFunc,
	  _unwatch: abstractFunc
	});
	
	function _hasListen(obj, attr, handler) {
	  var observer = _.getOwnProp(obj, config.observerKey);
	
	  return observer ? arguments.length == 1 ? observer.hasListen() : arguments.length == 2 ? observer.hasListen(attr) : observer.hasListen(attr, handler) : false;
	}
	
	function _on(obj, attr, handler) {
	  var observer = _.getOwnProp(obj, config.observerKey);
	
	  if (!observer) {
	    obj = proxy.obj(obj);
	    observer = new Observer(obj);
	    obj[config.observerKey] = observer;
	  }
	  return observer.on(attr, handler);
	}
	
	function _un(obj, attr, handler) {
	  var observer = _.getOwnProp(obj, config.observerKey);
	
	  if (observer) {
	    obj = arguments.length == 2 ? observer.un(attr) : observer.un(attr, handler);
	    if (!observer.hasListen()) {
	      obj[config.observerKey] = undefined;
	      return observer.destroy();
	    }
	  }
	  return obj;
	}
	
	var expressionIdGenerator = 0;
	
	var Expression = _.dynamicClass({
	  constructor: function constructor(target, expr, path) {
	    this.id = expressionIdGenerator++;
	    this.expr = expr;
	    this.handlers = [];
	    this.observers = [];
	    this.path = path || _.parseExpr(expr);
	    this.observeHandlers = this._initObserveHandlers();
	    this.obj = proxy.obj(target);
	    this.target = this._observe(this.obj, 0);
	    this._onTargetProxy = this._onTargetProxy.bind(this);
	    proxy.on(target, this._onTargetProxy);
	  },
	  _onTargetProxy: function _onTargetProxy(obj, proxy) {
	    this.target = proxy;
	  },
	  _observe: function _observe(obj, idx) {
	    var prop = this.path[idx],
	        o = void 0;
	
	    if (idx + 1 < this.path.length && (o = obj[prop])) obj[prop] = this._observe(proxy.obj(o), idx + 1);
	    return _on(obj, prop, this.observeHandlers[idx]);
	  },
	  _unobserve: function _unobserve(obj, idx) {
	    var prop = this.path[idx],
	        o = void 0,
	        ret = void 0;
	
	    ret = _un(obj, prop, this.observeHandlers[idx]);
	    if (idx + 1 < this.path.length && (o = obj[prop])) obj[prop] = this._unobserve(proxy.obj(o), idx + 1);
	    return ret;
	  },
	  _initObserveHandlers: function _initObserveHandlers() {
	    return _.map(this.path, function (prop, i) {
	      return this._createObserveHandler(i);
	    }, this);
	  },
	  _createObserveHandler: function _createObserveHandler(idx) {
	    var _this3 = this;
	
	    var path = this.path.slice(0, idx + 1),
	        rpath = this.path.slice(idx + 1),
	        ridx = this.path.length - idx - 1;
	
	    return function (prop, val, oldVal) {
	      if (ridx) {
	        if (oldVal) {
	          oldVal = proxy.obj(oldVal);
	          _this3._unobserve(oldVal, idx + 1);
	          oldVal = _.get(oldVal, rpath);
	        } else {
	          oldVal = undefined;
	        }
	        if (val) {
	          val = proxy.obj(val);
	          _this3._observe(val, idx + 1);
	          val = _.get(val, rpath);
	        } else {
	          val = undefined;
	        }
	        if (proxy.eq(val, oldVal)) return;
	      }
	      _.each(_this3.handlers.slice(), function (h) {
	        h(this.expr, val, oldVal, this.target);
	      }, _this3);
	    };
	  },
	  checkHandler: function checkHandler(handler) {
	    if (!_.isFunc(handler)) throw TypeError('Invalid Observe Handler');
	  },
	  on: function on(handler) {
	    this.checkHandler(handler);
	    this.handlers.push(handler);
	    return this;
	  },
	  un: function un(handler) {
	    if (!arguments.length) {
	      this.handlers = [];
	    } else {
	      this.checkHandler(handler);
	
	      var handlers = this.handlers,
	          i = handlers.length;
	
	      while (i--) {
	        if (handlers[i] === handler) {
	          handlers.splice(i, 1);
	          break;
	        }
	      }
	    }
	    return this;
	  },
	  hasListen: function hasListen(handler) {
	    return arguments.length ? _.lastIndexOf(this.handlers, handler) != -1 : !!this.handlers.length;
	  },
	  destory: function destory() {
	    proxy.un(this.target, this._onTargetProxy);
	    var obj = this._unobserve(this.obj, 0);
	    this.obj = undefined;
	    this.target = undefined;
	    this.expr = undefined;
	    this.handlers = undefined;
	    this.path = undefined;
	    this.observers = undefined;
	    this.observeHandlers = undefined;
	    this.target = undefined;
	    return obj;
	  }
	});
	
	var policies = [],
	    policyNames = {};
	
	var inited = false;
	
	module.exports = {
	  registerPolicy: function registerPolicy(name, priority, checker, policy) {
	    policies.push({
	      name: name,
	      priority: priority,
	      policy: policy,
	      checker: checker
	    });
	    policies.sort(function (p1, p2) {
	      return p1.priority - p2.priority;
	    });
	    return this;
	  },
	  init: function init(cfg) {
	    if (!inited) {
	      configuration.config(cfg);
	      if (_.each(policies, function (policy) {
	        if (policy.checker(config)) {
	          _.each(policy.policy(config), function (val, key) {
	            Observer.prototype[key] = val;
	          });
	          config.policy = policy.name;
	          return false;
	        }
	      }) !== false) throw Error('not supported');
	      inited = true;
	    }
	    return this;
	  },
	  on: function on(obj, expr, handler) {
	    var path = _.parseExpr(expr);
	
	    if (path.length > 1) {
	      var map = _.getOwnProp(obj, config.expressionKey),
	          exp = map ? map[expr] : undefined;
	
	      if (!exp) {
	        exp = new Expression(obj, expr, path);
	        if (!map) map = obj[config.expressionKey] = {};
	        map[expr] = exp;
	      }
	      exp.on(handler);
	      return exp.target;
	    }
	    return _on(obj, expr, handler);
	  },
	  un: function un(obj, expr, handler) {
	    var path = _.parseExpr(expr);
	
	    if (path.length > 1) {
	      var map = _.getOwnProp(obj, config.expressionKey),
	          exp = map ? map[expr] : undefined;
	
	      if (exp) {
	        arguments.length == 2 ? exp.un() : exp.un(handler);
	        if (!exp.hasListen()) {
	          map[expr] = undefined;
	          return exp.destory();
	        }
	        return exp.target;
	      }
	      return proxy.proxy(obj) || obj;
	    }
	    return arguments.length == 2 ? _un(obj, expr) : _un(obj, expr, handler);
	  },
	  hasListen: function hasListen(obj, expr, handler) {
	    var l = arguments.length;
	
	    switch (l) {
	      case 1:
	        return _hasListen(obj);
	      case 2:
	        if (_.isFunc(expr)) return _hasListen(obj, expr);
	    }
	
	    var path = _.parseExpr(expr);
	
	    if (path.length > 1) {
	      var map = _.getOwnProp(obj, config.expressionKey),
	          exp = map ? map[expr] : undefined;
	
	      return exp ? l == 2 ? true : exp.hasListen(handler) : false;
	    }
	    return _hasListen.apply(window, arguments);
	  }
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var toStr = Object.prototype.toString;
	var _ = __webpack_require__(4);
	var hasOwnProp = _.hasOwnProp;
	var configuration = __webpack_require__(12);
	var LISTEN_CONFIG = 'proxyListenKey';
	
	configuration.register(LISTEN_CONFIG, '__PROXY_LISTENERS__');
	
	var defaultPolicy = {
	  eq: function eq(o1, o2) {
	    return o1 === o2;
	  },
	  obj: function obj(o) {
	    return o;
	  },
	  proxy: function proxy(o) {
	    return o;
	  }
	},
	    apply = {
	  change: function change(obj, p) {
	    var handlers = _.getOwnProp(obj, configuration.get(LISTEN_CONFIG));
	
	    if (handlers) {
	      var i = handlers.length;
	      while (i--) {
	        handlers[i](obj, p);
	      }
	    }
	  },
	  on: function on(obj, handler) {
	    if (!_.isFunc(handler)) throw TypeError('Invalid Proxy Event Handler[' + handler);
	    var key = configuration.get(LISTEN_CONFIG),
	        handlers = _.getOwnProp(obj, key);
	
	    if (!handlers) obj[key] = handlers = [];
	    handlers.push(handler);
	  },
	  un: function un(obj, handler) {
	    var handlers = _.getOwnProp(obj, configuration.get(LISTEN_CONFIG));
	
	    if (handlers) {
	      if (_.isFunc(handler)) {
	        var i = handlers.length;
	
	        while (i-- > 0) {
	          if (handlers[i] === handler) {
	            handlers.splice(i, 1);
	            return true;
	          }
	        }
	      }
	    }
	    return false;
	  },
	  clean: function clean(obj) {
	    if (obj[proxy.listenKey]) obj[proxy.listenKey] = undefined;
	  }
	};
	
	function proxy(o) {
	  return proxy.proxy(o);
	}
	
	_.assign(proxy, {
	  isEnable: function isEnable() {
	    return policy === defaultPolicy;
	  },
	  enable: function enable(policy) {
	    applyPolicy(policy);
	  },
	  disable: function disable() {
	    applyPolicy(defaultPolicy);
	  }
	});
	
	function applyPolicy(policy) {
	  var _apply = policy !== defaultPolicy ? function (fn, name) {
	    proxy[name] = fn;
	  } : function (fn, name) {
	    proxy[name] = _.emptyFunc;
	  };
	  _.each(apply, _apply);
	  _.each(policy, function (fn, name) {
	    proxy[name] = fn;
	  });
	}
	
	proxy.disable();
	
	_.get = function (obj, expr, defVal, lastOwn, own) {
	  var i = 0,
	      path = _.parseExpr(expr, true),
	      l = path.length - 1,
	      prop = void 0;
	
	  while (!_.isNil(obj) && i < l) {
	    prop = path[i++];
	    obj = proxy.obj(obj);
	    if (own && !hasOwnProp(obj, prop)) return defVal;
	    obj = obj[prop];
	  }
	  obj = proxy.obj(obj);
	  prop = path[i];
	  return i == l && !_.isNil(obj) && (own ? hasOwnProp(obj, prop) : prop in obj) ? obj[prop] : defVal;
	};
	
	_.hasOwnProp = function (obj, prop) {
	  return hasOwnProp(proxy.obj(obj), prop);
	};
	module.exports = proxy;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _require = __webpack_require__(4);
	
	var Configuration = _require.Configuration;
	
	
	module.exports = new Configuration();

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(4),
	    hasOwn = Object.prototype.hasOwnProperty,
	    RESERVE_PROPS = 'hasOwnProperty,toString,toLocaleString,isPrototypeOf,propertyIsEnumerable,valueOf'.split(','),
	    RESERVE_ARRAY_PROPS = 'concat,copyWithin,entries,every,fill,filter,find,findIndex,forEach,indexOf,lastIndexOf,length,map,keys,join,pop,push,reverse,reverseRight,some,shift,slice,sort,splice,toSource,unshift'.split(',');
	
	var VBClassFactory = _.dynamicClass({
	  constBind: '__VB_CONST__',
	  descBind: '__VB_PROXY__',
	  classNameGenerator: 0,
	  constructor: function constructor(defProps, onProxyChange) {
	    this.classPool = {};
	    this.defPropMap = {};
	    this.onProxyChange = onProxyChange;
	    this.addDefProps(defProps);
	    this.initConstScript();
	  },
	  setConstBind: function setConstBind(constBind) {
	    this.constBind = constBind;
	    this.initConstScript();
	  },
	  setDescBind: function setDescBind(descBind) {
	    this.descBind = descBind;
	    this.initConstScript();
	  },
	  addDefProps: function addDefProps(defProps) {
	    var defPropMap = this.defPropMap;
	
	    _.each(defProps || [], function (prop) {
	      defPropMap[prop] = true;
	    });
	    this.defProps = _.keys(defPropMap);
	    this.initReserveProps();
	  },
	  initReserveProps: function initReserveProps() {
	    this.reserveProps = RESERVE_PROPS.concat(_.keys(this.defPropMap) || []);
	    this.reserveArrayProps = this.reserveProps.concat(RESERVE_ARRAY_PROPS);
	    this.reservePropMap = _.reverseConvert(this.reserveProps);
	    this.reserveArrayPropMap = _.reverseConvert(this.reserveArrayProps);
	  },
	  initConstScript: function initConstScript() {
	    this.constScript = ['\tPublic [', this.descBind, ']\r\n', '\tPublic Default Function [', this.constBind, '](desc)\r\n', '\t\tset [', this.descBind, '] = desc\r\n', '\t\tSet [', this.constBind, '] = Me\r\n', '\tEnd Function\r\n'].join('');
	  },
	  generateClassName: function generateClassName() {
	    return 'VBClass' + this.classNameGenerator++;
	  },
	  parseClassConstructorName: function parseClassConstructorName(className) {
	    return className + 'Constructor';
	  },
	  generateSetter: function generateSetter(attr) {
	    var descBind = this.descBind;
	
	    return ['\tPublic Property Get [', attr, ']\r\n', '\tOn Error Resume Next\r\n', '\t\tSet[', attr, '] = [', descBind, '].get("', attr, '")\r\n', '\tIf Err.Number <> 0 Then\r\n', '\t\t[', attr, '] = [', descBind, '].get("', attr, '")\r\n', '\tEnd If\r\n', '\tOn Error Goto 0\r\n', '\tEnd Property\r\n'];
	  },
	  generateGetter: function generateGetter(attr) {
	    var descBind = this.descBind;
	
	    return ['\tPublic Property Let [', attr, '](val)\r\n', '\t\tCall [', descBind, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n', '\tPublic Property Set [', attr, '](val)\r\n', '\t\tCall [', descBind, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n'];
	  },
	  generateClass: function generateClass(className, props, funcMap) {
	    var _this = this;
	
	    var buffer = ['Class ', className, '\r\n', this.constScript, '\r\n'];
	
	    _.each(props, function (attr) {
	      if (funcMap[attr]) {
	        buffer.push('\tPublic [' + attr + ']\r\n');
	      } else {
	        buffer.push.apply(buffer, _this.generateSetter(attr));
	        buffer.push.apply(buffer, _this.generateGetter(attr));
	      }
	    });
	    buffer.push('End Class\r\n');
	    return buffer.join('');
	  },
	  generateClassConstructor: function generateClassConstructor(props, funcMap, funcArray) {
	    var key = [props.length, '[', props.join(','), ']', '[', funcArray.join(','), ']'].join(''),
	        classConstName = this.classPool[key];
	
	    if (classConstName) return classConstName;
	
	    var className = this.generateClassName();
	    classConstName = this.parseClassConstructorName(className);
	    parseVB(this.generateClass(className, props, funcMap));
	    parseVB(['Function ', classConstName, '(desc)\r\n', '\tDim o\r\n', '\tSet o = (New ', className, ')(desc)\r\n', '\tSet ', classConstName, ' = o\r\n', 'End Function'].join(''));
	    this.classPool[key] = classConstName;
	    return classConstName;
	  },
	  create: function create(obj, desc) {
	    var _this2 = this;
	
	    var protoProps = void 0,
	        protoPropMap = void 0,
	        props = [],
	        funcs = [],
	        funcMap = {},
	        descBind = this.descBind;
	
	    function addProp(prop) {
	      if (_.isFunc(obj[prop])) {
	        funcMap[prop] = true;
	        funcs.push(prop);
	      }
	      props.push(prop);
	    }
	
	    if (_.isArray(obj)) {
	      protoProps = this.reserveArrayProps;
	      protoPropMap = this.reserveArrayPropMap;
	    } else {
	      protoProps = this.reserveProps;
	      protoPropMap = this.reservePropMap;
	    }
	    _.each(protoProps, addProp);
	    _.each(obj, function (val, prop) {
	      if (prop !== descBind && !(prop in protoPropMap)) addProp(prop);
	    }, obj, false);
	
	    if (!desc) {
	      desc = this.descriptor(obj);
	      if (desc) {
	        obj = desc.obj;
	      } else {
	        desc = new ObjectDescriptor(obj, props, this);
	      }
	    }
	
	    proxy = window[this.generateClassConstructor(props, funcMap, funcs)](desc);
	    _.each(funcs, function (prop) {
	      proxy[prop] = _this2.funcProxy(obj[prop], proxy);
	    });
	    desc.proxy = proxy;
	
	    this.onProxyChange(obj, proxy);
	    return proxy;
	  },
	  funcProxy: function funcProxy(fn, proxy) {
	    return function () {
	      fn.apply(!this || this == window ? proxy : this, arguments);
	    };
	  },
	  eq: function eq(o1, o2) {
	    var d1 = this.descriptor(o1),
	        d2 = this.descriptor(o2);
	
	    if (d1) o1 = d1.obj;
	    if (d2) o2 = d2.obj;
	    return o1 === o2;
	  },
	  obj: function obj(_obj) {
	    var desc = this.descriptor(_obj);
	
	    return desc ? desc.obj : _obj;
	  },
	  proxy: function proxy(obj) {
	    var desc = this.descriptor(obj);
	
	    return desc ? desc.proxy : undefined;
	  },
	  isProxy: function isProxy(obj) {
	    return hasOwn.call(obj, this.constBind);
	  },
	  descriptor: function descriptor(obj) {
	    var descBind = this.descBind;
	
	    return hasOwn.call(obj, descBind) ? obj[descBind] : undefined;
	  },
	  destroy: function destroy(obj) {
	    var desc = this.descriptor(obj);
	
	    if (desc) {
	      obj = desc.obj;
	      this.onProxyChange(obj, undefined);
	    }
	    return obj;
	  }
	});
	
	var ObjectDescriptor = _.dynamicClass({
	  constructor: function constructor(obj, props, classGenerator) {
	    this.classGenerator = classGenerator;
	    this.obj = obj;
	    this.defines = _.reverseConvert(props, function () {
	      return false;
	    });
	    obj[classGenerator.descBind] = this;
	    this.accessorNR = 0;
	  },
	  isAccessor: function isAccessor(desc) {
	    return desc && (desc.get || desc.set);
	  },
	  hasAccessor: function hasAccessor() {
	    return !!this.accessorNR;
	  },
	  defineProperty: function defineProperty(attr, desc) {
	    var defines = this.defines,
	        obj = this.obj;
	
	    if (!(attr in defines)) {
	      if (!(attr in obj)) {
	        obj[attr] = undefined;
	      } else if (_.isFunc(obj[attr])) {
	        console.warn('defineProperty not support function [' + attr + ']');
	      }
	      this.classGenerator.create(this.obj, this);
	    }
	
	    if (!this.isAccessor(desc)) {
	      if (defines[attr]) {
	        defines[attr] = false;
	        this.accessorNR--;
	      }
	      obj[attr] = desc.value;
	    } else {
	      defines[attr] = desc;
	      this.accessorNR++;
	      if (desc.get) obj[attr] = desc.get();
	    }
	    return this.proxy;
	  },
	  getPropertyDefine: function getPropertyDefine(attr) {
	    return this.defines[attr] || undefined;
	  },
	  get: function get(attr) {
	    var define = this.defines[attr];
	
	    return define && define.get ? define.get.call(this.proxy) : this.obj[attr];
	  },
	  set: function set(attr, value) {
	    var define = this.defines[attr];
	
	    if (define && define.set) define.set.call(this.proxy, value);
	    this.obj[attr] = value;
	  }
	});
	
	var supported = undefined;
	VBClassFactory.isSupport = function isSupport() {
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
	module.exports = VBClassFactory;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var core = __webpack_require__(10),
	    proxy = __webpack_require__(11),
	    _ = __webpack_require__(4),
	    configuration = __webpack_require__(12);
	
	configuration.register({
	  es6Proxy: true,
	  es6SourceKey: '__ES6_PROXY_SOURCE__',
	  es6ProxyKey: '__ES6_PROXY__'
	});
	
	core.registerPolicy('ES6Proxy', 1, function (config) {
	  return window.Proxy && config.es6Proxy !== false;
	}, function (config) {
	  var es6SourceKey = config.es6SourceKey;
	  var es6ProxyKey = config.es6ProxyKey;
	
	
	  proxy.enable({
	    obj: function obj(_obj) {
	      return _obj ? _.getOwnProp(_obj, es6SourceKey) || _obj : _obj;
	    },
	    eq: function eq(o1, o2) {
	      return o1 === o2 || o1 && o2 && proxy.obj(o1) === proxy.obj(o2);
	    },
	    proxy: function proxy(obj) {
	      return obj ? _.getOwnProp(obj, es6ProxyKey) : undefined;
	    }
	  });
	
	  return {
	    _init: function _init() {
	      this.obj = proxy.obj(this.target);
	      this.es6proxy = false;
	    },
	    _destroy: function _destroy() {
	      this.es6proxy = false;
	      this.obj[es6ProxyKey] = undefined;
	      proxy.change(this.obj, undefined);
	    },
	    _watch: function _watch(attr) {
	      if (!this.es6proxy) {
	        var _proxy = this.isArray ? this._arrayProxy() : this._objectProxy(),
	            obj = this.obj;
	
	        this.target = _proxy;
	        obj[es6ProxyKey] = _proxy;
	        obj[es6SourceKey] = obj;
	        proxy.change(obj, _proxy);
	        this.es6proxy = true;
	      }
	    },
	    _unwatch: function _unwatch(attr) {},
	    _arrayProxy: function _arrayProxy() {
	      var _this = this;
	
	      var oldLength = this.target.length;
	
	      return new Proxy(this.obj, {
	        set: function set(obj, prop, value) {
	          if (_this.listens[prop]) {
	            var oldVal = void 0;
	
	            if (prop === 'length') {
	              oldVal = oldLength;
	              oldLength = value;
	            } else {
	              oldVal = obj[prop];
	            }
	            obj[prop] = value;
	            if (value !== oldVal) _this._addChangeRecord(prop, oldVal);
	          } else {
	            obj[prop] = value;
	          }
	          return true;
	        }
	      });
	    },
	    _objectProxy: function _objectProxy() {
	      var _this2 = this;
	
	      return new Proxy(this.obj, {
	        set: function set(obj, prop, value) {
	          if (_this2.listens[prop]) {
	            var oldVal = obj[prop];
	
	            obj[prop] = value;
	            if (value !== oldVal) _this2._addChangeRecord(prop, oldVal);
	          } else {
	            obj[prop] = value;
	          }
	          return true;
	        }
	      });
	    }
	  };
	});

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var core = __webpack_require__(10),
	    proxyPro = __webpack_require__(11),
	    VBClassFactory = __webpack_require__(13),
	    _ = __webpack_require__(4),
	    arrayHockMethods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'],
	    policy = {
	  _init: function _init() {
	    this.watchers = {};
	  },
	  _destroy: function _destroy() {
	    for (var attr in this.watchers) {
	      if (this.watchers[attr]) this._unwatch(attr);
	    }
	    this.watchers = undefined;
	  },
	  _hockArrayLength: function _hockArrayLength(method) {
	    var self = this;
	
	    this.obj[method] = function () {
	      var len = this.length;
	
	      Array.prototype[method].apply(this, arguments);
	      if (self.obj.length != len) self._addChangeRecord('length', len);
	    };
	  },
	  _watch: function _watch(attr) {
	    var _this = this;
	
	    if (!this.watchers[attr]) {
	      if (this.isArray && attr === 'length') {
	        _.each(arrayHockMethods, function (method) {
	          _this._hockArrayLength(method);
	        });
	      } else {
	        this._defineProperty(attr, this.obj[attr]);
	      }
	      this.watchers[attr] = true;
	    }
	  },
	  _unwatch: function _unwatch(attr) {
	    var _this2 = this;
	
	    if (this.watchers[attr]) {
	      if (this.isArray && attr === 'length') {
	        _.each(arrayHockMethods, function (method) {
	          delete _this2.obj[method];
	        });
	      } else {
	        this._undefineProperty(attr, this.obj[attr]);
	      }
	      this.watchers[attr] = false;
	    }
	  }
	};
	
	core.registerPolicy('ES5DefineProperty', 10, function (config) {
	  if (Object.defineProperty) {
	    try {
	      var _ret = function () {
	        var val = void 0,
	            obj = {};
	        Object.defineProperty(obj, 'sentinel', {
	          get: function get() {
	            return val;
	          },
	          set: function set(value) {
	            val = value;
	          }
	        });
	        obj.sentinel = 1;
	        return {
	          v: obj.sentinel === val
	        };
	      }();
	
	      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	    } catch (e) {}
	  }
	  return false;
	}, function (config) {
	  proxyPro.disable();
	  return _.assignIf({
	    _defineProperty: function _defineProperty(attr, value) {
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
	    },
	    _undefineProperty: function _undefineProperty(attr, value) {
	      Object.defineProperty(this.target, attr, {
	        enumerable: true,
	        configurable: true,
	        writable: true,
	        value: value
	      });
	    }
	  }, policy);
	});
	
	core.registerPolicy('DefineGetterAndSetter', 20, function (config) {
	  return '__defineGetter__' in {};
	}, function (config) {
	  proxyPro.disable();
	  return _.assignIf({
	    _defineProperty: function _defineProperty(attr, value) {
	      var _this4 = this;
	
	      this.target.__defineGetter__(attr, function () {
	        return value;
	      });
	      this.target.__defineSetter__(attr, function (val) {
	        var oldVal = value;
	
	        value = val;
	        _this4._addChangeRecord(attr, oldVal);
	      });
	    },
	    _undefineProperty: function _undefineProperty(attr, value) {
	      this.target.__defineGetter__(attr, function () {
	        return value;
	      });
	      this.target.__defineSetter__(attr, function (val) {
	        value = val;
	      });
	    }
	  }, policy);
	});
	
	core.registerPolicy('VBScriptProxy', 30, function (config) {
	  return VBClassFactory.isSupport();
	}, function (config) {
	  var init = policy._init,
	      factory = void 0;
	
	  proxyPro.enable({
	    obj: function obj(_obj) {
	      return _obj ? factory.obj(_obj) : _obj;
	    },
	    eq: function eq(o1, o2) {
	      return o1 === o2 || o1 && o2 && factory.obj(o1) === factory.obj(o2);
	    },
	    proxy: function proxy(obj) {
	      return obj ? factory.proxy(obj) : undefined;
	    }
	  });
	  factory = core.vbfactory = new VBClassFactory([proxyPro.listenKey, config.observerKey, config.expressionKey], proxyPro.change);
	
	  return _.assignIf({
	    _init: function _init() {
	      init.call(this);
	      this.obj = factory.obj(this.target);
	    },
	    _defineProperty: function _defineProperty(attr, value) {
	      var _this5 = this;
	
	      var obj = this.obj,
	          desc = factory.descriptor(obj);
	
	      if (!desc) desc = factory.descriptor(factory.create(obj));
	
	      this.target = desc.defineProperty(attr, {
	        set: function set(val) {
	          var oldVal = _this5.obj[attr];
	          _this5.obj[attr] = val;
	          _this5._addChangeRecord(attr, oldVal);
	        }
	      });
	    },
	    _undefineProperty: function _undefineProperty(attr, value) {
	      var obj = this.obj,
	          desc = factory.descriptor(obj);
	
	      if (desc) {
	        this.target = desc.defineProperty(attr, {
	          value: value
	        });
	        if (!desc.hasAccessor()) {
	          this.target = factory.destroy(obj);
	        }
	      }
	    }
	  }, policy);
	});

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var dom = __webpack_require__(17);
	__webpack_require__(18);
	__webpack_require__(19);
	__webpack_require__(20);
	__webpack_require__(21);
	__webpack_require__(22);
	module.exports = dom;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2),
	    textContent = typeof document.createElement('div').textContent == 'string' ? 'textContent' : 'innerText';
	
	var dom = {
	  W3C: !!window.dispatchEvent,
	  inDoc: function inDoc(el, root) {
	    root = root || document.documentElement;
	    if (root.contains) return root.contains(el);
	    try {
	      while (el = el.parentNode) {
	        if (el === root) return true;
	      }
	    } catch (e) {}
	    return false;
	  },
	  query: function query(selectors, all) {
	    if (_.isString(selectors)) return all ? document.querySelectorAll(selectors) : document.querySelector(selectors);
	    return selectors;
	  },
	  cloneNode: function cloneNode(el, deep) {
	    function clone(el) {
	      return el.cloneNode(deep !== false);
	    }
	    return _.isArrayLike(el) ? _.map(el, clone) : clone(el);
	  },
	  remove: function remove(el) {
	    function remove(el) {
	      if (el.parentNode) el.parentNode.removeChild(el);
	    }
	    _.isArrayLike(el) ? _.each(el, remove) : remove(el);
	  },
	  before: function before(el, target) {
	    if (_.isArrayLike(target)) target = target[0];
	
	    var parent = target.parentNode;
	
	    function before(el) {
	      parent.insertBefore(el, target);
	    }
	    _.isArrayLike(el) ? _.each(el, before) : before(el);
	  },
	  after: function after(el, target) {
	    if (_.isArrayLike(target)) target = target[target.length - 1];
	
	    var parent = target.parentNode,
	        apply = parent.lastChild === target ? function (el) {
	      parent.appendChild(el);
	    } : function () {
	      var next = target.nextSibling;
	
	      return function (el) {
	        parent.insertBefore(el, next);
	      };
	    }();
	    _.isArrayLike(el) ? _.each(el, apply) : apply(el);
	  },
	  append: function append(target, el) {
	    function append(el) {
	      target.appendChild(el);
	    }
	    _.isArrayLike(el) ? _.each(el, append) : append(el);
	  },
	  prepend: function prepend(target, el) {
	    target.firstChild ? dom.before(el, el.firstChild) : dom.append(target, el);
	  },
	  html: function html(el, _html) {
	    return arguments.length > 1 ? el.innerHTML = _html : el.innerHTML;
	  },
	  outerHtml: function outerHtml(el) {
	    if (el.outerHTML) return el.outerHTML;
	
	    var container = document.createElement('div');
	    container.appendChild(el.cloneNode(true));
	    return container.innerHTML;
	  },
	  text: function text(el, _text) {
	    if (el.nodeType == 3) return arguments.length > 1 ? el.data = _text : el.data;
	    return arguments.length > 1 ? el[textContent] = _text : el[textContent];
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

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(17),
	    rfocusable = /^(?:input|select|textarea|button|object)$/i,
	    rclickable = /^(?:a|area)$/i;
	
	_.assign(dom, {
	  prop: function prop(el, name, value) {
	    name = dom.propFix[name] || name;
	    var hook = dom.propHooks[name];
	
	    if (arguments.length > 2) return hook && hook.set ? hook.set(el, name, value) : el[name] = value;
	    return hook && hook.get ? hook.get(el, name) : el[name];
	  },
	  attr: function attr(el, name, val) {
	    return arguments.length > 2 ? el.setAttribute(name, val) : el.getAttribute(name);
	  },
	  removeAttr: function removeAttr(el, name) {
	    return el.removeAttribute(name);
	  },
	  checked: function checked(el, check) {
	    return _prop(el, 'checked', arguments.length > 1, check);
	  },
	  'class': function _class(el, cls) {
	    return _prop(el, 'class', arguments.length > 1, cls);
	  },
	  addClass: function addClass(el, cls) {
	    if (el.classList) {
	      el.classList.add(cls);
	    } else {
	      var cur = ' ' + dom.prop(el, 'class') + ' ';
	      if (cur.indexOf(' ' + cls + ' ') === -1) dom['class'](el, _.trim(cur + cls));
	    }
	  },
	  removeClass: function removeClass(el, cls) {
	    el.classList ? el.classList.remove(cls) : dom['class'](el, _.trim((' ' + dom.prop(el, 'class') + ' ').replace(new RegExp(' ' + cls + ' ', 'g'), '')));
	  },
	  style: function style(el, _style) {
	    return _prop(el, 'style', arguments.length > 1, _style);
	  },
	
	  propHooks: {
	    tabIndex: {
	      get: function get(elem) {
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
	  return set ? dom.prop(el, name, val) : dom.prop(el, name);
	}
	
	module.exports = dom;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(17);
	
	_.assign(dom, {
	  css: function css(el, name, value) {
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(17);
	
	function stringValue(val) {
	  if (_.isNil(val) || val === NaN) return '';
	  if (!_.isString(val)) return val + '';
	  return val;
	}
	
	module.exports = _.assign(dom, {
	  val: function val(el, _val) {
	    var hook = dom.valHooks[el.type || el.tagName.toLowerCase()];
	
	    if (arguments.length == 1) return hook && hook.get ? hook.get(el) : el.value || '';
	
	    return hook && hook.set ? hook.set(el, _val) : el.value = stringValue(_val);
	  },
	
	  valHooks: {
	    option: {
	      get: function get(el) {
	        var val = el.attributes.value;
	
	        return !val || val.specified ? el.value : el.text;
	      }
	    },
	
	    select: {
	      get: function get(el) {
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
	      set: function set(el, value) {
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

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(17),
	    root = document.documentElement,
	    domReady = false;
	
	_.assign(dom, {
	  on: function on(el, type, cb, once) {
	    if (addListen(el, type, cb, once === true)) {
	      canBubbleUp[type] ? delegateEvent(type, cb) : bandEvent(el, type, cb);
	      return cb;
	    }
	    return false;
	  },
	  once: function once(el, type, cb) {
	    return dom.on(el, type, cb, true);
	  },
	  off: function off(el, type, cb) {
	    if (removeListen(el, type, cb)) {
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
	    for (var i = 0, l = handlers.length; i < l; i++) {
	      if (handlers[i].handler === handler) {
	        handlers.splice(i, 1);
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
	
	function hasListen(el, type) {
	  var listens = el[listenKey],
	      handlers = listens ? listens[type] : undefined;
	
	  return handlers ? !!handlers.length : false;
	}
	
	var bind = dom.W3C ? function (el, type, fn, capture) {
	  el.addEventListener(type, fn, capture);
	} : function (el, type, fn) {
	  el.attachEvent('on' + type, fn);
	},
	    unbind = dom.W3C ? function (el, type, fn) {
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
	  var handlers = getListens(el, event.type);
	
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
	if (!('onmouseenter' in root)) {
	  _.each({
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
	      fix: function fix(elem, event) {
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

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var dom = __webpack_require__(21),
	    readyList = [],
	    isReady = void 0,
	    root = document.documentElement;
	
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
	  if (root.doScroll && window.frameElement === null && window.external) {
	    (function () {
	      var doScrollCheck = function doScrollCheck() {
	        try {
	          root.doScroll('left');
	          fireReady();
	        } catch (e) {
	          setTimeout(doScrollCheck);
	        }
	      };
	
	      doScrollCheck();
	    })();
	  }
	}
	
	dom.on(window, 'load', fireReady);
	
	dom.ready = function (fn) {
	  !isReady ? readyList.push(fn) : fn();
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var observer = __webpack_require__(3);
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(16);
	
	var _require = __webpack_require__(24);
	
	var Text = _require.Text;
	var Directive = _require.Directive;
	var DirectiveGroup = _require.DirectiveGroup;
	
	
	function childNodes(el) {
	  return _.map(el.childNodes, function (n) {
	    return n;
	  });
	}
	
	var TemplateInstance = function () {
	  function TemplateInstance(el, scope, TextParser, directiveReg) {
	    _classCallCheck(this, TemplateInstance);
	
	    this.TextParser = TextParser;
	    this.directiveReg = directiveReg;
	    this._scopeProxyListen = this._scopeProxyListen.bind(this);
	    this.scope = observer.proxy.proxy(scope) || scope;
	    observer.proxy.on(this.scope, this._scopeProxyListen);
	    this.bindings = this.parse(el, this);
	    this.binded = false;
	    this.els = childNodes(el);
	    this.bind();
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
	    if (!this.binded) {
	      _.each(this.bindings, function (bind) {
	        bind.bind();
	      });
	      this.binded = true;
	    }
	    return this;
	  };
	
	  TemplateInstance.prototype.unbind = function unbind() {
	    if (this.binded) {
	      _.each(this.bindings, function (bind) {
	        bind.unbind();
	      });
	      this.binded = false;
	    }
	    return this;
	  };
	
	  TemplateInstance.prototype.destroy = function destroy() {
	    var _this = this;
	
	    observer.proxy.un(this.scope, this._scopeProxyListen);
	    _.each(this.bindings, function (bind) {
	      if (_this.binded) bind.unbind();
	      bind.destroy();
	    });
	    dom.remove(this.els);
	    this.bindings = undefined;
	    this.scope = undefined;
	  };
	
	  TemplateInstance.prototype._scopeProxyListen = function _scopeProxyListen(obj, proxy) {
	    this.scope = proxy || obj;
	  };
	
	  TemplateInstance.prototype.parse = function parse(els) {
	    var _this2 = this;
	
	    if (_.isArrayLike(els)) {
	      var _ret = function () {
	        var bindings = [];
	        _.each(els, function (el) {
	          bindings.push.apply(bindings, _this2.parseEl(el));
	        });
	        return {
	          v: bindings
	        };
	      }();
	
	      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	    }
	    return this.parseEl(els);
	  };
	
	  TemplateInstance.prototype.parseEl = function parseEl(el) {
	    switch (el.nodeType) {
	      case 1:
	        return this.parseElement(el);
	      case 3:
	        return this.parseText(el);
	      default:
	        return [];
	    }
	  };
	
	  TemplateInstance.prototype.parseText = function parseText(el) {
	    var text = el.data,
	        parser = new this.TextParser(text),
	        token = void 0,
	        index = 0,
	        bindings = [];
	
	    while (token = parser.token()) {
	      this.createTextNode2(text.substring(index, token.start), el);
	      bindings.push(new Text(this.createTextNode('binding', el), this, token.token));
	      index = token.end;
	    }
	    if (index) {
	      this.createTextNode2(text.substr(index), el);
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
	      if (directiveName) {
	        directiveConst = Directive.getDirective(directiveName);
	        if (directiveConst) {
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
	        } else {
	          console.warn('Directive is undefined ' + name);
	        }
	      }
	    }
	    if (directiveConsts.length == 1) {
	      var cfg = directiveConsts[0];
	      directives.push(new cfg['const'](el, this, cfg.expression, cfg.attr));
	    } else if (directiveConsts.length) {
	      directives.push(new DirectiveGroup(el, this, directiveConsts));
	    }
	    if (!block) directives.push.apply(directives, this.parseChildNodes(el));
	    return directives;
	  };
	
	  TemplateInstance.prototype.parseChildNodes = function parseChildNodes(el) {
	    return this.parse(childNodes(el));
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
	    if (content = _.trim(content)) return this.createTextNode(content, before);
	    return undefined;
	  };
	
	  return TemplateInstance;
	}();
	
	module.exports = TemplateInstance;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2);
	
	_.each(['abstractBinding', 'binding', 'text', 'directive', 'directiveGroup', 'text'], function (name) {
	  module.exports[_.upperFirst(name)] = __webpack_require__(25)("./" + name);
	});

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./abstractBinding": 26,
		"./abstractBinding.js": 26,
		"./binding": 27,
		"./binding.js": 27,
		"./directive": 29,
		"./directive.js": 29,
		"./directiveGroup": 31,
		"./directiveGroup.js": 31,
		"./index": 24,
		"./index.js": 24,
		"./text": 32,
		"./text.js": 32
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
	webpackContext.id = 25;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2),
	    proxy = _.proxy;
	
	var AbstractBinding = function () {
	  function AbstractBinding(tpl) {
	    _classCallCheck(this, AbstractBinding);
	
	    this.tpl = tpl;
	    this.binded = false;
	  }
	
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
	    return proxy.proxy(scope) || scope;
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
	    return proxy.proxy(scope) || scope;
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
	
	  AbstractBinding.prototype.destroy = function destroy() {};
	
	  return AbstractBinding;
	}();
	
	module.exports = AbstractBinding;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var AbstractBinding = __webpack_require__(26),
	    config = __webpack_require__(28);
	
	config.register('generateComments', true);
	
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
	
	module.exports = Binding;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _require = __webpack_require__(2);
	
	var Configuration = _require.Configuration;
	
	
	module.exports = new Configuration();

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(16),
	    Binding = __webpack_require__(27),
	    dynamicDirectiveOptions = {
	  extend: 'extend',
	  constructor: 'constructor'
	},
	    directives = {},
	    config = __webpack_require__(28),
	    log = __webpack_require__(30);
	
	var Directive = function (_Binding) {
	  _inherits(Directive, _Binding);
	
	  function Directive(el, tpl, expr, attr) {
	    _classCallCheck(this, Directive);
	
	    var _this = _possibleConstructorReturn(this, _Binding.call(this, tpl, expr));
	
	    _this.el = el;
	    _this.attr = attr;
	    dom.removeAttr(_this.el, _this.attr);
	    if (config.get('generateComments')) {
	      _this.comment = document.createComment(' Directive:' + _this.name + ' [' + _this.expr + '] ');
	      dom.before(_this.comment, _this.el);
	    }
	    return _this;
	  }
	
	  return Directive;
	}(Binding);
	
	Directive.prototype.abstract = false;
	Directive.prototype.block = false;
	Directive.prototype.priority = 5;
	
	_.assign(Directive, {
	  getDirective: function getDirective(name) {
	    return directives[name.toLowerCase()];
	  },
	  isDirective: function isDirective(object) {
	    return _.isExtendOf(object, Directive);
	  },
	  register: function register(name, option) {
	    var directive = void 0;
	
	    if (_.isFunc(option)) {
	      if (!_.isExtendOf(option, Directive)) throw TypeError('Invalid Class Constructor, ' + option.name + ' is not extend of Directive');
	      directive = option;
	    } else {
	      directive = _.dynamicClass(option, Directive, dynamicDirectiveOptions);
	    }
	    if (!directive.className) directive.prototype.className = directive.className = _.hump(name) + 'Directive';
	    name = name.toLowerCase();
	    if (name in directives) throw new Error('Directive[' + name + '] is existing');
	
	    directives[name] = directive;
	    log.debug('register Directive[%s]', name);
	    return directive;
	  }
	});
	module.exports = Directive;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _require = __webpack_require__(2);
	
	var Logger = _require.Logger;
	
	
	module.exports = new Logger('tpl', 'debug');

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var AbstractBinding = __webpack_require__(26);
	
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
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2),
	    dom = __webpack_require__(16),
	    expression = __webpack_require__(33),
	    Binding = __webpack_require__(27),
	    expressionArgs = ['$el'],
	    config = __webpack_require__(28);
	
	var Text = function (_Binding) {
	  _inherits(Text, _Binding);
	
	  function Text(el, tpl, expr) {
	    _classCallCheck(this, Text);
	
	    var _this = _possibleConstructorReturn(this, _Binding.call(this, tpl, expr));
	
	    _this.el = el;
	    _this.observeHandler = _this.observeHandler.bind(_this);
	    _this.expression = expression.parse(_this.expr, expressionArgs);
	
	    if (config.get('generateComments')) {
	      _this.comment = document.createComment('Text Binding ' + _this.expr);
	      dom.before(_this.comment, _this.el);
	    }
	    return _this;
	  }
	
	  Text.prototype.value = function value() {
	    return this.expression.executeAll.call(this, this.scope(), this.el);
	  };
	
	  Text.prototype.bind = function bind() {
	    var _this2 = this;
	
	    _Binding.prototype.bind.call(this);
	    _.each(this.expression.identities, function (ident) {
	      _this2.observe(ident, _this2.observeHandler);
	    });
	    this.update(this.value());
	  };
	
	  Text.prototype.unbind = function unbind() {
	    var _this3 = this;
	
	    _Binding.prototype.unbind.call(this);
	    _.each(this.expression.identities, function (ident) {
	      _this3.unobserve(ident, _this3.observeHandler);
	    });
	  };
	
	  Text.prototype.observeHandler = function observeHandler(attr, val) {
	    if (this.expression.simplePath) {
	      this.update(this.expression.applyFilter(val, this, [this.scope(), this.el]));
	    } else {
	      this.update(this.value());
	    }
	  };
	
	  Text.prototype.update = function update(val) {
	    if (_.isNil(val)) val = '';
	    if (val !== dom.text(this.el)) dom.text(this.el, val);
	  };
	
	  return Text;
	}(Binding);
	
	module.exports = Text;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.parse = parse;
	var _ = __webpack_require__(2),
	    filter = __webpack_require__(34),
	    defaultKeywords = _.reverseConvert('Math,Date,this,true,false,null,undefined,Infinity,NaN,isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,parseInt,parseFloat,$scope'.split(','), function () {
	  return true;
	}),
	    wsReg = /\s/g,
	    newlineReg = /\n/g,
	    translationReg = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void |(\|\|)/g,
	    translationRestoreReg = /"(\d+)"/g,
	    pathTestReg = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/,
	    booleanLiteralReg = /^(?:true|false)$/,
	    identityReg = /[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*[^\w$\.]/g,
	    propReg = /^[A-Za-z_$][\w$]*/;
	
	var translations = [];
	
	function translationProcessor(str, isString) {
	  var i = translations.length;
	  translations[i] = isString ? str.replace(newlineReg, '\\n') : str;
	  return '"' + i + '"';
	}
	
	function translationRestoreProcessor(str, i) {
	  return translations[i];
	}
	
	var currentIdentities = void 0,
	    currentKeywords = void 0,
	    prevPropScope = void 0;
	
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
	
	function parse(exp, args) {
	  exp = _.trim(exp);
	  var res = void 0;
	  if (res = cache[exp]) return res;
	  cache[exp] = res = compileExecuter(exp, args);
	  return res;
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	var _ = __webpack_require__(2),
	    slice = Array.prototype.slice,
	    filters = {},
	    log = __webpack_require__(30);
	
	function apply(name, data, args, apply) {
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
	  register: function register(name, filter) {
	    if (filters[name]) throw Error('Filter[' + name + '] is existing');
	    if (typeof filter == 'function') filter = {
	      apply: filter
	    };
	    filter.type = filter.type || 'normal';
	    filters[name] = filter;
	    log.debug('register Filter[%s:%s]', filter.type, name);
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
	    var which = e.which,
	        k = void 0;
	
	    for (var i = 1, l = arguments.length; i < l; i++) {
	      k = arguments[i];
	      if (which == (keyCodes[k] || k)) return true;
	    }
	    return false;
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
	
	_.each(eventFilters, function (fn, name) {
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
	_.each(nomalFilters, function (f, name) {
	  filter.register(name, f);
	});

/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var TextParser = function () {
	  function TextParser(text) {
	    _classCallCheck(this, TextParser);
	
	    this.text = text;
	  }
	
	  TextParser.prototype.token = function token() {
	    throw new Error('abstract method');
	  };
	
	  return TextParser;
	}();
	
	var NormalTextParser = function (_TextParser) {
	  _inherits(NormalTextParser, _TextParser);
	
	  function NormalTextParser(text) {
	    _classCallCheck(this, NormalTextParser);
	
	    var _this = _possibleConstructorReturn(this, _TextParser.call(this, text));
	
	    _this.index = 0;
	    _this.reg = /{([^{]+)}/g;
	    return _this;
	  }
	
	  NormalTextParser.prototype.token = function token() {
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
	  };
	
	  return NormalTextParser;
	}(TextParser);
	
	TextParser.NormalTextParser = NormalTextParser;
	module.exports = TextParser;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ = __webpack_require__(2);
	
	module.exports = _.assign({}, __webpack_require__(37), __webpack_require__(38), __webpack_require__(39));

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(16);
	
	var _require = __webpack_require__(24);
	
	var Directive = _require.Directive;
	var TemplateInstance = __webpack_require__(23);
	var eachReg = /^\s*([\s\S]+)\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/;
	var eachAliasReg = /^(\(\s*([^,\s]+)(\s*,\s*([\S]+))?\s*\))|([^,\s]+)(\s*,\s*([\S]+))?$/;
	
	var EachDirective = exports.EachDirective = function (_Directive) {
	  _inherits(EachDirective, _Directive);
	
	  function EachDirective(el, tpl, expr, attr) {
	    _classCallCheck(this, EachDirective);
	
	    var _this = _possibleConstructorReturn(this, _Directive.call(this, el, tpl, expr, attr));
	
	    _this.observeHandler = _this.observeHandler.bind(_this);
	    _this.lengthObserveHandler = _this.lengthObserveHandler.bind(_this);
	
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
	    var _this2 = this;
	
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
	        _this2.initScope(scope, item, idx, index);
	      } else {
	        // create scope
	        scope = cache[index] = _this2.createScope(parentScope, item, idx, index);
	        if (!init) added.push(scope);
	      }
	      sort[idx] = scope; // update sort
	      if (init) {
	        // init compontent
	        scope.$tpl = new TemplateInstance(dom.cloneNode(_this2.el), scope, _this2.tpl.TextParser, _this2.tpl.directiveReg);
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
	          _this2.initScope(scope2, scope);
	          cache[scope.$index] = scope2;
	          sort[scope.$sort] = scope2;
	          scope = scope2;
	        } else {
	          scope.$tpl = new TemplateInstance(dom.cloneNode(_this2.el), scope, _this2.tpl.TextParser, _this2.tpl.directiveReg);
	        }
	        data[scope.$sort] = scope[valueAlias];
	        scope.$tpl.after(scope.$sort ? sort[scope.$sort - 1].$tpl.els : begin);
	      });
	
	      _.each(removed, function (scope) {
	        scope.$tpl.destroy();
	      });
	    }
	  };
	
	  EachDirective.prototype.createScope = function createScope(parentScope, value, i, index) {
	    var scope = _.create(parentScope);
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
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(16);
	
	var _require = __webpack_require__(24);
	
	var Directive = _require.Directive;
	var expression = __webpack_require__(33);
	var expressionArgs = ['$el', '$event'];
	
	function registerDirective(name, opt) {
	  var cls = Directive.register(name, opt);
	  module.exports[cls.className] = cls;
	}
	
	var EventDirective = exports.EventDirective = function (_Directive) {
	  _inherits(EventDirective, _Directive);
	
	  function EventDirective(el, tpl, expr, attr) {
	    _classCallCheck(this, EventDirective);
	
	    var _this = _possibleConstructorReturn(this, _Directive.call(this, el, tpl, expr, attr));
	
	    _this.handler = _this.handler.bind(_this);
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
	  opt = _.isObject(opt) ? opt : {
	    eventType: opt
	  };
	  opt.name = opt.name || 'on' + opt.eventType;
	  opt.extend = EventDirective;
	  registerDirective(opt.name, opt);
	});

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var dom = __webpack_require__(16);
	
	var _require = __webpack_require__(24);
	
	var Directive = _require.Directive;
	var expression = __webpack_require__(33);
	var YieId = _.YieId;
	var expressionArgs = ['$el'];
	
	function registerDirective(name, opt) {
	  var cls = Directive.register(name, opt);
	  module.exports[cls.className] = cls;
	}
	
	var SimpleDirective = exports.SimpleDirective = function (_Directive) {
	  _inherits(SimpleDirective, _Directive);
	
	  function SimpleDirective(el, tpl, expr, attr) {
	    _classCallCheck(this, SimpleDirective);
	
	    var _this = _possibleConstructorReturn(this, _Directive.call(this, el, tpl, expr, attr));
	
	    _this.observeHandler = _this.observeHandler.bind(_this);
	    _this.expression = expression.parse(_this.expr, expressionArgs);
	    return _this;
	  }
	
	  SimpleDirective.prototype.realValue = function realValue() {
	    return this.expression.execute.call(this, this.scope(), this.el);
	  };
	
	  SimpleDirective.prototype.value = function value() {
	    return this.expression.executeAll.call(this, this.scope(), this.el);
	  };
	
	  SimpleDirective.prototype.bind = function bind() {
	    var _this2 = this;
	
	    _Directive.prototype.bind.call(this);
	    _.each(this.expression.identities, function (ident) {
	      _this2.observe(ident, _this2.observeHandler);
	    });
	    this.update(this.value());
	  };
	
	  SimpleDirective.prototype.unbind = function unbind() {
	    var _this3 = this;
	
	    _Directive.prototype.unbind.call(this);
	    _.each(this.expression.identities, function (ident) {
	      _this3.unobserve(ident, _this3.observeHandler);
	    });
	  };
	
	  SimpleDirective.prototype.blankValue = function blankValue(val) {
	    if (arguments.length == 0) val = this.value();
	    return _.isNil(val) ? '' : val;
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
	      _.each(value, function (val) {
	        if (val) {
	          keys.push(val);
	          dom.addClass(el, val);
	        }
	      });
	    },
	    cleanup: function cleanup(value, isArr) {
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
	    update: function update(value) {
	      if (value && _.isString(value)) {
	        dom.style(this.el, value);
	      } else if (value && _.isObject(value)) {
	        this.handleObject(value);
	      }
	    },
	    handleObject: function handleObject(value) {
	      this.cleanup(value);
	      var keys = this.prevKeys = [],
	          el = this.el;
	      _.each(value, function (val, key) {
	        dom.css(el, key, val);
	      });
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
	      if (!this.directives) return this.yieId = new YieId();
	    },
	    update: function update(val) {
	      if (!val) {
	        dom.css(this.el, 'display', 'none');
	      } else {
	        if (!this.directives) {
	          var _directives = this.directives = this.tpl.parseChildNodes(this.el);
	          _.each(_directives, function (dir) {
	            dir.bind();
	          });
	          if (this.yieId) {
	            this.yieId.done();
	            this.yieId = undefined;
	          }
	        }
	        dom.css(this.el, 'display', '');
	      }
	    },
	    unbind: function unbind() {
	      SimpleDirective.prototype.unbind.call(this);
	      if (this.directives) {
	        var _directives2 = this.directives;
	        _.each(_directives2, function (dir) {
	          dir.unbind();
	        });
	      }
	    },
	
	    priority: 9,
	    block: true
	  },
	  checked: {
	    update: function update(val) {
	      _.isArray(val) ? dom.checked(this.el, _.indexOf(val, dom.val(this.el))) : dom.checked(this.el, !!val);
	    }
	  },
	  selected: {
	    update: function update(val) {}
	  },
	  focus: {
	    update: function update(val) {
	      if (val) dom.focus(this.el);
	    }
	  },
	  input: {
	    constructor: function constructor(el) {
	      SimpleDirective.apply(this, arguments);
	
	      if (!this.expression.simplePath) throw TypeError('Invalid Expression[' + this.expression.expr + '] on InputDirective');
	
	      this.onChange = this.onChange.bind(this);
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
	    setRealValue: function setRealValue(val) {
	      this.set(this.expression.path, val);
	    },
	    setValue: function setValue(val) {
	      this.setRealValue(this.expression.applyFilter(val, this, [this.scope(), this.el], false));
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
	      if (_val != this.val) this.elVal(this.val = _val);
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
	
	_.each(directives, function (opt, name) {
	  opt.extend = SimpleDirective;
	  registerDirective(name, opt);
	});

/***/ }
/******/ ])
});
;
//# sourceMappingURL=tpl.all.js.map