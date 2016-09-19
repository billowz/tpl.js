/*
 * tpl.js v0.0.15 built in Mon, 12 Sep 2016 05:47:25 GMT
 * Copyright (c) 2016 Tao Zeng <tao.zeng.zt@gmail.com>
 * Released under the MIT license
 * support IE6+ and other browsers
 * https://github.com/tao-zeng/tpl.js
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('tpl', factory) :
  (global.tpl = factory());
}(this, function () {

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

  var timeoutframe = {
    request: request,
    cancel: cancel
  };

  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || timeoutframe.request;

  window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || timeoutframe.cancel;

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

  if (!Object.freeze) Object.freeze = function freeze(obj) {
    return obj;
  };

  var toStr = Object.prototype.toString;
  var hasOwn = Object.prototype.hasOwnProperty;

  function overrideHasOwnProlicy(fn) {
    if (isFunc(fn)) hasOwn = fn;
  }

  function hasOwnProlicy() {
    return hasOwn;
  }

  function hasOwnProp(obj, prop) {
    return hasOwn.call(obj, prop);
  }

  // ==============================================
  // type utils
  // ==============================================
  var argsType = '[object Arguments]';
  var arrayType = '[object Array]';
  var funcType = '[object Function]';
  var boolType = '[object Boolean]';
  var numberType = '[object Number]';
  var dateType = '[object Date]';
  var stringType = '[object String]';
  var objectType = '[object Object]';
  var regexpType = '[object RegExp]';
  var nodeListType = '[object NodeList]';
  function isDefine(obj) {
    return obj !== undefined;
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
          return isNumber(length) && (length ? length > 0 && length - 1 in obj : length === 0);
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
  var regFirstChar = /^[a-z]/;
  var regLeftTrim = /^\s+/;
  var regRightTrim = /\s+$/;
  var regTrim = /(^\s+)|(\s+$)/g;
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
  var exprCache = {};
  var regPropertyName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
  var regEscapeChar = /\\(\\)?/g;
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

      if (typeof _ret === "object") return _ret.v;
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
      if (isNil(_obj[prop])) {
        _obj = _obj[prop] = {};
      } else {
        _obj = _obj[prop];
      }
      prop = path[i + 1];
    }
    _obj[prop] = value;
    return obj;
  }

  function getOwnProp(obj, key) {
    return hasOwnProp(obj, key) ? obj[key] : undefined;
  }

  var prototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(obj) {
    return obj.__proto__;
  };

  var setPrototypeOf = Object.setPrototypeOf || function setPrototypeOf(obj, proto) {
    obj.__proto__ = proto;
  };

  var assign = Object.assign || function assign(target) {
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

  var create = Object.create || function (parent, props) {
    emptyFunc.prototype = parent;
    var obj = new emptyFunc();
    emptyFunc.prototype = undefined;
    if (props) each(props, function (prop, name) {
      obj[name] = prop.value;
    });
    return obj;
  };

  function isExtendOf(cls, parent) {
    if (!isFunc(cls)) return cls instanceof parent;

    var proto = cls;

    while ((proto = prototypeOf(proto)) && proto !== Object) {
      if (proto === parent) return true;
    }
    return parent === Object;
  }

  // ==============================================
  // dynamicClass
  // ==============================================
  var Base = function () {};
  assign(Base.prototype, {
    'super': function (args) {
      var method = arguments.callee.caller;
      method.$owner.superclass[method.$name].apply(this, args);
    },
    superclass: function () {
      var method = arguments.callee.caller;
      return method.$owner.superclass;
    }
  });
  assign(Base, {
    extend: function (overrides) {
      var _this = this;

      if (overrides) {
        (function () {
          var proto = _this.prototype;
          each(overrides, function (member, name) {
            if (isFunc(member)) {
              member.$owner = _this;
              member.$name = name;
            }
            proto[name] = member;
          });
          _this.assign(overrides.statics);
        })();
      }
      return this;
    },
    assign: function (statics) {
      if (statics) assign(this, statics);
      return this;
    }
  });

  function dynamicClass(overrides) {
    var cls = function DynamicClass() {
      this.constructor.apply(this, arguments);
    },
        superclass = overrides.extend,
        superproto = void 0,
        proto = void 0;

    assign(cls, Base);

    if (!isFunc(superclass) || superclass === Object) superclass = Base;

    superproto = superclass.prototype;

    proto = create(superproto);

    cls.superclass = superproto;
    cls.prototype = proto;
    setPrototypeOf(cls, superclass);

    delete overrides.extend;
    return cls.extend(overrides);
  }

var _$1 = Object.freeze({
    overrideHasOwnProlicy: overrideHasOwnProlicy,
    hasOwnProlicy: hasOwnProlicy,
    hasOwnProp: hasOwnProp,
    isDefine: isDefine,
    isNull: isNull,
    isNil: isNil,
    isArray: isArray,
    isFunc: isFunc,
    isNumber: isNumber,
    isBool: isBool,
    isDate: isDate,
    isString: isString,
    isObject: isObject,
    isRegExp: isRegExp,
    isArrayLike: isArrayLike,
    each: each,
    map: map,
    filter: filter,
    aggregate: aggregate,
    keys: keys,
    indexOf: indexOf,
    lastIndexOf: lastIndexOf,
    convert: convert,
    reverseConvert: reverseConvert,
    upperFirst: upperFirst,
    ltrim: ltrim,
    rtrim: rtrim,
    trim: trim,
    format: format,
    _format: _format,
    parseExpr: parseExpr,
    get: get,
    has: has,
    set: set,
    getOwnProp: getOwnProp,
    prototypeOf: prototypeOf,
    setPrototypeOf: setPrototypeOf,
    assign: assign,
    assignIf: assignIf,
    emptyFunc: emptyFunc,
    create: create,
    isExtendOf: isExtendOf,
    dynamicClass: dynamicClass
  });

  var Configuration = dynamicClass({
    constructor: function (def) {
      this.cfg = def || {};
    },
    register: function (name, defVal) {
      var _this = this;

      if (arguments.length == 1) {
        each(name, function (val, name) {
          _this.cfg[name] = val;
        });
      } else {
        this.cfg[name] = defVal;
      }
      return this;
    },
    config: function (cfg) {
      var _this2 = this;

      if (cfg) each(this.cfg, function (val, key) {
        if (hasOwnProp(cfg, key)) _this2.cfg[key] = cfg[key];
      });
      return this;
    },
    get: function (name) {
      return arguments.length ? this.cfg[name] : create(this.cfg);
    }
  });

  var logLevels = ['debug', 'info', 'warn', 'error'];
  var tmpEl = document.createElement('div');
  var slice = Array.prototype.slice;
  var SimulationConsole = dynamicClass({
    constructor: function () {
      tmpEl.innerHTML = '<div id="simulation_console"\n    style="position:absolute; top:0; right:0; font-family:courier,monospace; background:#eee; font-size:10px; padding:10px; width:200px; height:200px;">\n  <a style="float:right; padding-left:1em; padding-bottom:.5em; text-align:right;">Clear</a>\n  <div id="simulation_console_body"></div>\n</div>';
      this.el = tmpEl.childNodes[0];
      this.clearEl = this.el.childNodes[0];
      this.bodyEl = this.el.childNodes[1];
    },
    appendTo: function (el) {
      el.appendChild(this.el);
    },
    log: function (style, msg) {
      tmpEl.innerHTML = '<span style="' + style + '">' + msg + '</span>';
      this.bodyEl.appendChild(tmpEl.childNodes[0]);
    },
    parseMsg: function (args) {
      var msg = args[0];
      if (isString(msg)) {
        var f = _format.apply(null, args);
        return [f.format].concat(slice.call(args, f.formatArgCount)).join(' ');
      }
      return args.join(' ');
    },
    debug: function () {
      this.log('color: red;', this.parseMsg(arguments));
    },
    info: function () {
      this.log('color: red;', this.parseMsg(arguments));
    },
    warn: function () {
      this.log('color: red;', this.parseMsg(arguments));
    },
    error: function () {
      this.log('color: red;', this.parseMsg(arguments));
    },
    clear: function () {
      this.bodyEl.innerHTML = '';
    }
  });
  var console$1 = window.console;
  if (console$1 && !console$1.debug) console$1.debug = function () {
    Function.apply.call(console$1.log, console$1, arguments);
  };

  var Logger = dynamicClass({
    statics: {
      enableSimulationConsole: function () {
        if (!console$1) {
          console$1 = new SimulationConsole();
          console$1.appendTo(document.body);
        }
      }
    },
    constructor: function (_module, level) {
      this.module = _module;
      this.level = indexOf(logLevels, level || 'info');
    },
    setLevel: function (level) {
      this.level = indexOf(logLevels, level || 'info');
    },
    getLevel: function () {
      return logLevels[this.level];
    },
    _print: function (level, args, trace) {
      Function.apply.call(console$1[level], console$1, args);
      if (trace && console$1.trace) console$1.trace();
    },
    _log: function (level, args, trace) {
      if (level < this.level || !console$1) return;
      var msg = '[%s] %s -' + (isString(args[0]) ? ' ' + args.shift() : ''),
          errors = [];
      args = filter(args, function (arg) {
        if (arg instanceof Error) {
          errors.push(arg);
          return false;
        }
        return true;
      });
      each(errors, function (err) {
        args.push.call(args, err.message, '\n', err.stack);
      });
      level = logLevels[level];
      this._print(level, [msg, level, this.module].concat(args), trace);
    },
    debug: function () {
      this._log(0, slice.call(arguments, 0));
    },
    info: function () {
      this._log(1, slice.call(arguments, 0));
    },
    warn: function () {
      this._log(2, slice.call(arguments, 0));
    },
    error: function () {
      this._log(3, slice.call(arguments, 0));
    }
  });

  Logger.logger = new Logger('default', 'info');

  var IDGenerator = 1;

  var LinkedList = dynamicClass({
    statics: {
      ListKey: '__UTILITY_LIST__'
    },
    constructor: function () {
      this._id = IDGenerator++;
      this._size = 0;
      this._header = undefined;
      this._tail = undefined;
      this._version = 1;
    },
    _listObj: function (obj) {
      return hasOwnProp(obj, LinkedList.ListKey) && obj[LinkedList.ListKey];
    },
    _desc: function (obj) {
      var list = this._listObj(obj);

      return list && list[this._id];
    },
    _getOrCreateDesc: function (obj) {
      var list = this._listObj(obj) || (obj[LinkedList.ListKey] = {}),
          desc = list[this._id];

      return desc || (list[this._id] = {
        obj: obj,
        prev: undefined,
        next: undefined,
        version: this._version++
      });
    },
    _unlink: function (desc) {
      var prev = desc.prev,
          next = desc.next;

      if (prev) {
        prev.next = next;
      } else {
        this._header = next;
      }
      if (next) {
        next.prev = prev;
      } else {
        this._tail = prev;
      }
      this._size--;
    },
    _move: function (desc, prev, alwaysMove) {
      var header = this._header;

      if (header === desc || desc.prev) this._unlink(desc);

      desc.prev = prev;
      if (prev) {
        desc.next = prev.next;
        prev.next = desc;
      } else {
        desc.next = header;
        if (header) header.prev = desc;
        this._header = desc;
      }
      if (this._tail === prev) this._tail = desc;
      this._size++;
    },
    _remove: function (desc) {
      var obj = desc.obj,
          list = this._listObj(obj);

      this._unlink(desc);
      delete list[this._id];
    },
    push: function (obj) {
      return this.last(obj);
    },
    pop: function () {
      var desc = this._header;

      if (desc) {
        this._remove(desc);
        return desc.obj;
      }
      return undefined;
    },
    shift: function () {
      var desc = this._tail;

      if (desc) {
        this._remove(desc);
        return desc.obj;
      }
      return undefined;
    },
    first: function (obj) {
      if (arguments.length == 0) {
        var desc = this._header;
        return desc && desc.obj;
      }
      this._move(this._getOrCreateDesc(obj), undefined);
      return this;
    },
    last: function (obj) {
      if (arguments.length == 0) {
        var desc = this._tail;
        return desc && desc.obj;
      }
      this._move(this._getOrCreateDesc(obj), this._tail);
      return this;
    },
    before: function (obj, target) {
      if (arguments.length == 1) {
        var desc = this._desc(obj),
            prev = desc && desc.prev;

        return prev && prev.obj;
      }
      this._move(this._getOrCreateDesc(obj), this._desc(target).prev);
      return this;
    },
    after: function (obj, target) {
      if (arguments.length == 1) {
        var desc = this._desc(obj),
            next = desc && desc.next;

        return next && next.obj;
      }
      this._move(this._getOrCreateDesc(obj), this._desc(target));
      return this;
    },
    contains: function (obj) {
      return !!this._desc(obj);
    },
    remove: function (obj) {
      var list = this._listObj(obj),
          desc = void 0;

      if (!list) return;
      desc = list[this._id];
      if (!desc) return;

      this._unlink(desc);
      delete list[this._id];
      return this;
    },
    clean: function () {
      var desc = this._header;
      while (desc) {
        delete this._listObj(desc.obj)[this._id];
        desc = desc.next;
      }
      this._header = undefined;
      this._tail = undefined;
      this._size = 0;
      return this;
    },
    empty: function () {
      return this._size == 0;
    },
    size: function () {
      return this._size;
    },
    each: function (callback, scope) {
      var desc = this._header,
          ver = this._version;

      while (desc) {
        if (desc.version < ver) {
          if (callback.call(scope || this, desc.obj, this) === false) return false;
        }
        desc = desc.next;
      }
      return true;
    },
    map: function (callback, scope) {
      var _this = this;

      var rs = [];
      this.each(function (obj) {
        rs.push(callback.call(scope || _this, obj, _this));
      });
      return rs;
    },
    filter: function (callback, scope) {
      var _this2 = this;

      var rs = [];
      this.each(function (obj) {
        if (callback.call(scope || _this2, obj, _this2)) rs.push(obj);
      });
      return rs;
    },
    toArray: function () {
      var rs = [];
      this.each(function (obj) {
        rs.push(obj);
      });
      return rs;
    }
  });

  var _ = assignIf({
    timeoutframe: timeoutframe,
    Configuration: Configuration,
    Logger: Logger,
    LinkedList: LinkedList
  }, _$1);

  var configuration = new _.Configuration();

  var hasOwn$1 = Object.prototype.hasOwnProperty;
  var LISTEN_CONFIG = 'proxyListenKey';
  var LinkedList$2 = _.LinkedList;


  configuration.register(LISTEN_CONFIG, '__PROXY_LISTENERS__');

  var defaultPolicy = {
    eq: function (o1, o2) {
      return o1 === o2;
    },
    obj: function (o) {
      return o;
    },
    proxy: function (o) {
      return o;
    }
  };
  var apply = {
    change: function (obj, p) {
      var handlers = _.getOwnProp(obj, configuration.get(LISTEN_CONFIG));

      if (handlers) handlers.each(function (handler) {
        return handler(obj, p);
      });
    },
    on: function (obj, handler) {
      if (!_.isFunc(handler)) throw TypeError('Invalid Proxy Event Handler[' + handler);
      var key = configuration.get(LISTEN_CONFIG),
          handlers = _.getOwnProp(obj, key);

      if (!handlers) obj[key] = handlers = new LinkedList$2();
      handlers.push(handler);
    },
    un: function (obj, handler) {
      var handlers = _.getOwnProp(obj, configuration.get(LISTEN_CONFIG));

      if (handlers && _.isFunc(handler)) handlers.remove(handler);
      return false;
    },
    clean: function (obj) {
      if (obj[proxy$1.listenKey]) obj[proxy$1.listenKey] = undefined;
    }
  };
  function proxy$1(o) {
    return proxy$1.proxy(o);
  }

  var hasEnabled = false;
  _.assign(proxy$1, {
    isEnable: function () {
      return proxy$1.on !== _.emptyFunc;
    },
    enable: function (policy) {
      applyPolicy(policy);
      if (!hasEnabled) {
        _.overrideHasOwnProlicy(function (prop) {
          return hasOwn$1.call(proxy$1.obj(this), prop);
        });
        _.get = function (obj, expr, defVal, lastOwn, own) {
          var i = 0,
              path = _.parseExpr(expr, true),
              l = path.length - 1,
              prop = void 0;

          while (!_.isNil(obj) && i < l) {
            prop = path[i++];
            obj = proxy$1.obj(obj);
            if (own && !hasOwn$1.call(obj, prop)) return defVal;
            obj = obj[prop];
          }
          obj = proxy$1.obj(obj);
          prop = path[i];
          return i == l && !_.isNil(obj) && (own ? hasOwn$1.call(obj, prop) : prop in obj) ? obj[prop] : defVal;
        };
        hasEnabled = true;
      }
    },
    disable: function () {
      applyPolicy(defaultPolicy);
    }
  });

  function applyPolicy(policy) {
    var _apply = policy !== defaultPolicy ? function (fn, name) {
      proxy$1[name] = fn;
    } : function (fn, name) {
      proxy$1[name] = _.emptyFunc;
    };
    _.each(apply, _apply);
    _.each(policy, function (fn, name) {
      proxy$1[name] = fn;
    });
  }

  proxy$1.disable();

  var logger = new _.Logger('observer', 'info');

  var timeoutframe$1 = _.timeoutframe;
  var config = configuration.get();
  var LinkedList$1 = _.LinkedList;


  configuration.register({
    lazy: true,
    animationFrame: true,
    observerKey: '__OBSERVER__',
    expressionKey: '__EXPR_OBSERVER__'
  });

  var Observer = _.dynamicClass({
    constructor: function (target) {
      this.target = target;
      this.obj = target;
      this.listens = {};
      this.changeRecords = {};
      this._notify = this._notify.bind(this);
      this.watchPropNum = 0;
      this._init();
    },
    _fire: function (attr, val, oldVal) {
      var _this = this;

      var handlers = this.listens[attr];
      if (handlers && (!proxy$1.eq(val, oldVal) || _.isArray(val))) handlers.each(function (handler) {
        handler(attr, val, oldVal, _this.target);
      });
    },
    _notify: function () {
      var _this2 = this;

      var obj = this.obj,
          changeRecords = this.changeRecords;

      this.request_frame = undefined;
      this.changeRecords = {};

      _.each(changeRecords, function (val, attr) {
        _this2._fire(attr, obj[attr], val);
      });
    },
    _addChangeRecord: function (attr, oldVal) {
      if (!config.lazy) {
        this._fire(attr, this.obj[attr], oldVal);
      } else if (!(attr in this.changeRecords)) {
        this.changeRecords[attr] = oldVal;
        if (!this.request_frame) {
          this.request_frame = config.animationFrame ? window.requestAnimationFrame(this._notify) : timeoutframe$1.request(this._notify);
        }
      }
    },
    checkHandler: function (handler) {
      if (!_.isFunc(handler)) throw TypeError('Invalid Observe Handler');
      return handler;
    },
    hasListen: function (attr, handler) {
      switch (arguments.length) {
        case 0:
          return !!this.watchPropNum;
        case 1:
          if (_.isFunc(attr)) {
            return !_.each(this.listens, function (handlers) {
              return handlers.contains(attr);
            });
          }
          return !!this.listens[attr];
        default:
          this.checkHandler(handler);
          var handlers = this.listens[attr];
          return !!handlers && handlers.contains(handler);
      }
    },
    on: function (attr, handler) {
      var handlers = void 0;
      this.checkHandler(handler);

      if (!(handlers = this.listens[attr])) this.listens[attr] = handlers = new LinkedList$1();

      if (handlers.empty()) {
        this.watchPropNum++;
        this._watch(attr);
      }

      handlers.push(handler);
      return this.target;
    },
    un: function (attr, handler) {
      var handlers = this.listens[attr];

      if (handlers && !handlers.empty()) {
        if (arguments.length == 1) {
          handlers.clean();
          this.watchPropNum--;
          this._unwatch(attr);
        } else {
          this.checkHandler(handler);
          handlers.remove(handler);
          if (handlers.empty()) {
            this.watchPropNum--;
            this._unwatch(attr);
          }
        }
      }
      return this.target;
    },
    destroy: function () {
      if (this.request_frame) {
        config.animationFrame ? window.cancelAnimationFrame(this.request_frame) : timeoutframe$1.cancel(this.request_frame);
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

    _init: _.emptyFunc,
    _destroy: _.emptyFunc,
    _watch: _.emptyFunc,
    _unwatch: _.emptyFunc
  });

  function hasListen(obj, attr, handler) {
    var observer = _.getOwnProp(obj, config.observerKey);

    return observer ? arguments.length == 1 ? observer.hasListen() : arguments.length == 2 ? observer.hasListen(attr) : observer.hasListen(attr, handler) : false;
  }

  function on(obj, attr, handler) {
    var observer = _.getOwnProp(obj, config.observerKey);

    if (!observer) {
      obj = proxy$1.obj(obj);
      observer = new Observer(obj);
      obj[config.observerKey] = observer;
    }
    return observer.on(attr, handler);
  }

  function un(obj, attr, handler) {
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
    constructor: function (target, expr, path) {
      this.id = expressionIdGenerator++;
      this.expr = expr;
      this.handlers = new LinkedList$1();
      this.observers = [];
      this.path = path || _.parseExpr(expr);
      this.observeHandlers = this._initObserveHandlers();
      this.obj = proxy$1.obj(target);
      this.target = this._observe(this.obj, 0);
      if (proxy$1.isEnable()) {
        this._onTargetProxy = this._onTargetProxy.bind(this);
        proxy$1.on(target, this._onTargetProxy);
      }
    },
    _onTargetProxy: function (obj, proxy) {
      this.target = proxy;
    },
    _observe: function (obj, idx) {
      var prop = this.path[idx],
          o = void 0;

      if (idx + 1 < this.path.length && (o = obj[prop])) {
        o = this._observe(proxy$1.obj(o), idx + 1);
        if (proxy$1.isEnable()) obj[prop] = o;
      }
      return on(obj, prop, this.observeHandlers[idx]);
    },
    _unobserve: function (obj, idx) {
      var prop = this.path[idx],
          o = void 0,
          ret = void 0;

      ret = un(obj, prop, this.observeHandlers[idx]);
      if (idx + 1 < this.path.length && (o = obj[prop])) {
        o = this._unobserve(proxy$1.obj(o), idx + 1);
        if (proxy$1.isEnable()) obj[prop] = o;
      }
      return ret;
    },
    _initObserveHandlers: function () {
      return _.map(this.path, function (prop, i) {
        return this._createObserveHandler(i);
      }, this);
    },
    _createObserveHandler: function (idx) {
      var _this3 = this;

      var path = this.path.slice(0, idx + 1),
          rpath = this.path.slice(idx + 1),
          ridx = this.path.length - idx - 1;

      return function (prop, val, oldVal) {
        if (ridx) {
          if (val) {
            var mobj = proxy$1.obj(val),
                obj = _this3.obj;

            val = _.get(mobj, rpath);
            mobj = _this3._observe(mobj, idx + 1);
            if (proxy$1.isEnable()) {
              // update proxy val
              var i = 0;
              while (i < idx) {
                obj = proxy$1.obj(obj[path[i++]]);
                if (!obj) return;
              }
              obj[path[i]] = mobj;
            }
          } else {
            val = undefined;
          }

          if (oldVal) {
            oldVal = proxy$1.obj(oldVal);
            _this3._unobserve(oldVal, idx + 1);
            oldVal = _.get(oldVal, rpath);
          } else {
            oldVal = undefined;
          }

          if (proxy$1.eq(val, oldVal)) return;
        }
        _this3.handlers.each(function (handler) {
          return handler(_this3.expr, val, oldVal, _this3.target);
        });
      };
    },
    checkHandler: function (handler) {
      if (!_.isFunc(handler)) throw TypeError('Invalid Observe Handler');
      return handler;
    },
    on: function (handler) {
      this.handlers.push(this.checkHandler(handler));
      return this;
    },
    un: function (handler) {
      if (!arguments.length) {
        this.handlers.clean();
      } else {
        this.handlers.remove(this.checkHandler(handler));
      }
      return this;
    },
    hasListen: function (handler) {
      return arguments.length ? this.handlers.contains(this.checkHandler(handler)) : !this.handlers.empty();
    },
    destory: function () {
      proxy$1.un(this.target, this._onTargetProxy);
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

  var policies = [];
  var inited = false;

  var core = {
    registerPolicy: function (name, priority, checker, policy) {
      policies.push({
        name: name,
        priority: priority,
        policy: policy,
        checker: checker
      });
      policies.sort(function (p1, p2) {
        return p1.priority - p2.priority;
      });
      logger.info('register observe policy[%s], priority is %d', name, priority);
      return this;
    },
    init: function (cfg) {
      if (!inited) {
        configuration.config(cfg);
        if (_.each(policies, function (policy) {
          if (policy.checker(config)) {
            _.each(policy.policy(config), function (val, key) {
              Observer.prototype[key] = val;
            });
            config.policy = policy.name;
            logger.info('apply observe policy[%s], priority is %d', policy.name, policy.priority);
            return false;
          }
        }) !== false) throw Error('observer is not supported');
        inited = true;
      }
      return this;
    },
    on: function (obj, expr, handler) {
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
      return on(obj, expr, handler);
    },
    un: function (obj, expr, handler) {
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
        return proxy$1.proxy(obj) || obj;
      }
      return arguments.length == 2 ? un(obj, expr) : un(obj, expr, handler);
    },
    hasListen: function (obj, expr, handler) {
      var l = arguments.length;

      switch (l) {
        case 1:
          return hasListen(obj);
        case 2:
          if (_.isFunc(expr)) return hasListen(obj, expr);
      }

      var path = _.parseExpr(expr);

      if (path.length > 1) {
        var map = _.getOwnProp(obj, config.expressionKey),
            exp = map ? map[expr] : undefined;

        return exp ? l == 2 ? true : exp.hasListen(handler) : false;
      }
      return hasListen.apply(window, arguments);
    }
  };

  configuration.register({
    es6Proxy: true,
    es6SourceKey: '__ES6_PROXY_SOURCE__',
    es6ProxyKey: '__ES6_PROXY__'
  });

  var hasOwn$2 = Object.prototype.hasOwnProperty;

  core.registerPolicy('ES6Proxy', 1, function (config) {
    return window.Proxy && config.es6Proxy !== false;
  }, function (config) {
    var es6SourceKey = config.es6SourceKey;
    var es6ProxyKey = config.es6ProxyKey;


    proxy$1.enable({
      obj: function (obj) {
        if (obj && hasOwn$2.call(obj, es6SourceKey)) return obj[es6SourceKey];
        return obj;
      },
      eq: function (o1, o2) {
        return o1 === o2 || o1 && o2 && proxy$1.obj(o1) === proxy$1.obj(o2);
      },
      proxy: function (obj) {
        if (obj && hasOwn$2.call(obj, es6ProxyKey)) return obj[es6ProxyKey];
        return obj;
      }
    });

    return {
      _init: function () {
        this.obj = proxy$1.obj(this.target);
        this.es6proxy = false;
      },
      _destroy: function () {
        this.es6proxy = false;
        this.obj[es6ProxyKey] = undefined;
        proxy$1.change(this.obj, undefined);
      },
      _watch: function (attr) {
        if (!this.es6proxy) {
          var _proxy = this._objectProxy(),
              obj = this.obj;

          this.target = _proxy;
          obj[es6ProxyKey] = _proxy;
          obj[es6SourceKey] = obj;
          proxy$1.change(obj, _proxy);
          this.es6proxy = true;
        }
      },
      _unwatch: function (attr) {},
      _objectProxy: function () {
        var _this = this;

        return new Proxy(this.obj, {
          set: function (obj, prop, value) {
            if (_this.listens[prop]) {
              var oldVal = obj[prop];
              obj[prop] = value;
              _this._addChangeRecord(prop, oldVal);
            } else {
              obj[prop] = value;
            }
            return true;
          }
        });
      }
    };
  });

var   hasOwn$3 = Object.prototype.hasOwnProperty;
  var RESERVE_PROPS = 'hasOwnProperty,toString,toLocaleString,isPrototypeOf,propertyIsEnumerable,valueOf'.split(',');
  var RESERVE_ARRAY_PROPS = 'concat,copyWithin,entries,every,fill,filter,find,findIndex,forEach,indexOf,lastIndexOf,length,map,keys,join,pop,push,reverse,reverseRight,some,shift,slice,sort,splice,toSource,unshift'.split(',');
  var VBClassFactory = _.dynamicClass({
    constBind: '__VB_CONST__',
    descBind: '__VB_PROXY__',
    classNameGenerator: 0,
    constructor: function (defProps, onProxyChange) {
      this.classPool = {};
      this.defPropMap = {};
      this.onProxyChange = onProxyChange;
      this.addDefProps(defProps);
      this.initConstScript();
    },
    setConstBind: function (constBind) {
      this.constBind = constBind;
      this.initConstScript();
    },
    setDescBind: function (descBind) {
      this.descBind = descBind;
      this.initConstScript();
    },
    addDefProps: function (defProps) {
      var defPropMap = this.defPropMap,
          props = [];

      _.each(defProps || [], function (prop) {
        defPropMap[prop] = true;
      });
      for (var prop in defPropMap) {
        if (hasOwn$3.call(defPropMap, prop)) props.push(prop);
      }
      this.defProps = props;
      logger.info('VBProxy default props is: ', props.join(','));
      this.initReserveProps();
    },
    initReserveProps: function () {
      this.reserveProps = RESERVE_PROPS.concat(this.defProps);
      this.reserveArrayProps = this.reserveProps.concat(RESERVE_ARRAY_PROPS);
      this.reservePropMap = _.reverseConvert(this.reserveProps);
      this.reserveArrayPropMap = _.reverseConvert(this.reserveArrayProps);
    },
    initConstScript: function () {
      this.constScript = ['\tPublic [', this.descBind, ']\r\n', '\tPublic Default Function [', this.constBind, '](desc)\r\n', '\t\tset [', this.descBind, '] = desc\r\n', '\t\tSet [', this.constBind, '] = Me\r\n', '\tEnd Function\r\n'].join('');
    },
    generateClassName: function () {
      return 'VBClass' + this.classNameGenerator++;
    },
    parseClassConstructorName: function (className) {
      return className + 'Constructor';
    },
    generateSetter: function (attr) {
      var descBind = this.descBind;

      return ['\tPublic Property Get [', attr, ']\r\n', '\tOn Error Resume Next\r\n', '\t\tSet[', attr, '] = [', descBind, '].get("', attr, '")\r\n', '\tIf Err.Number <> 0 Then\r\n', '\t\t[', attr, '] = [', descBind, '].get("', attr, '")\r\n', '\tEnd If\r\n', '\tOn Error Goto 0\r\n', '\tEnd Property\r\n'];
    },
    generateGetter: function (attr) {
      var descBind = this.descBind;

      return ['\tPublic Property Let [', attr, '](val)\r\n', '\t\tCall [', descBind, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n', '\tPublic Property Set [', attr, '](val)\r\n', '\t\tCall [', descBind, '].set("', attr, '",val)\r\n', '\tEnd Property\r\n'];
    },
    generateClass: function (className, props, funcMap) {
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
    generateClassConstructor: function (props, funcMap, funcArray) {
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
    create: function (obj, desc) {
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
    funcProxy: function (fn, proxy) {
      return function () {
        fn.apply(!this || this == window ? proxy : this, arguments);
      };
    },
    eq: function (o1, o2) {
      var d1 = this.descriptor(o1),
          d2 = this.descriptor(o2);

      if (d1) o1 = d1.obj;
      if (d2) o2 = d2.obj;
      return o1 === o2;
    },
    obj: function (obj) {
      var desc = this.descriptor(obj);

      return desc ? desc.obj : obj;
    },
    proxy: function (obj) {
      var desc = this.descriptor(obj);

      return desc ? desc.proxy : undefined;
    },
    isProxy: function (obj) {
      return hasOwn$3.call(obj, this.constBind);
    },
    descriptor: function (obj) {
      var descBind = this.descBind;

      return hasOwn$3.call(obj, descBind) ? obj[descBind] : undefined;
    },
    destroy: function (obj) {
      var desc = this.descriptor(obj);

      if (desc) {
        obj = desc.obj;
        this.onProxyChange(obj, undefined);
      }
      return obj;
    }
  });

  var ObjectDescriptor = _.dynamicClass({
    constructor: function (obj, props, classGenerator) {
      this.classGenerator = classGenerator;
      this.obj = obj;
      this.defines = _.reverseConvert(props, function () {
        return false;
      });
      obj[classGenerator.descBind] = this;
      this.accessorNR = 0;
    },
    isAccessor: function (desc) {
      return desc && (desc.get || desc.set);
    },
    hasAccessor: function () {
      return !!this.accessorNR;
    },
    defineProperty: function (attr, desc) {
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
    getPropertyDefine: function (attr) {
      return this.defines[attr] || undefined;
    },
    get: function (attr) {
      var define = this.defines[attr];

      return define && define.get ? define.get.call(this.proxy) : this.obj[attr];
    },
    set: function (attr, value) {
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

  configuration.register({
    defaultProps: []
  });

  var policy = {
    _init: function () {
      this.watchers = {};
    },
    _destroy: function () {
      for (var attr in this.watchers) {
        if (this.watchers[attr]) this._unwatch(attr);
      }
      this.watchers = undefined;
    },
    _watch: function (attr) {
      if (!this.watchers[attr]) {
        this._defineProperty(attr, this.obj[attr]);
        this.watchers[attr] = true;
      }
    },
    _unwatch: function (attr) {
      if (this.watchers[attr]) {
        this._undefineProperty(attr, this.obj[attr]);
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
            get: function () {
              return val;
            },
            set: function (value) {
              val = value;
            }
          });
          obj.sentinel = 1;
          return {
            v: obj.sentinel === val
          };
        }();

        if (typeof _ret === "object") return _ret.v;
      } catch (e) {}
    }
    return false;
  }, function (config) {
    proxy$1.disable();
    return _.assignIf({
      _defineProperty: function (attr, value) {
        var _this = this;

        Object.defineProperty(this.target, attr, {
          enumerable: true,
          configurable: true,
          get: function () {
            return value;
          },
          set: function (val) {
            var oldVal = value;
            value = val;
            _this._addChangeRecord(attr, oldVal);
          }
        });
      },
      _undefineProperty: function (attr, value) {
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
    proxy$1.disable();
    return _.assignIf({
      _defineProperty: function (attr, value) {
        var _this2 = this;

        this.target.__defineGetter__(attr, function () {
          return value;
        });
        this.target.__defineSetter__(attr, function (val) {
          var oldVal = value;

          value = val;
          _this2._addChangeRecord(attr, oldVal);
        });
      },
      _undefineProperty: function (attr, value) {
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

    proxy$1.enable({
      obj: function (obj) {
        return obj ? factory.obj(obj) : obj;
      },
      eq: function (o1, o2) {
        return o1 === o2 || o1 && o2 && factory.obj(o1) === factory.obj(o2);
      },
      proxy: function (obj) {
        return obj ? factory.proxy(obj) : obj;
      }
    });
    factory = core.vbfactory = new VBClassFactory([config.proxyListenKey, config.observerKey, config.expressionKey].concat(config.defaultProps || []), proxy$1.change);

    return _.assignIf({
      _init: function () {
        init.call(this);
        this.obj = factory.obj(this.target);
      },
      _defineProperty: function (attr, value) {
        var _this3 = this;

        var obj = this.obj,
            desc = factory.descriptor(obj);

        if (!desc) desc = factory.descriptor(factory.create(obj));

        this.target = desc.defineProperty(attr, {
          set: function (val) {
            var oldVal = _this3.obj[attr];
            _this3.obj[attr] = val;
            _this3._addChangeRecord(attr, oldVal);
          }
        });
      },
      _undefineProperty: function (attr, value) {
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

  var observer = _.assign({
    eq: function (o1, o2) {
      return proxy$1.eq(o1, o2);
    },
    obj: function (o) {
      return proxy$1.obj(o);
    },
    onproxy: function (o, h) {
      return proxy$1.on(o, h);
    },
    unproxy: function (o, h) {
      return proxy$1.un(o, h);
    },

    proxy: proxy$1,
    config: configuration.get()
  }, _, core);

  var regHump = /(^[a-z])|([_-][a-zA-Z])/g;

  function _hump(k) {
    if (k[0] == '_' || k[0] == '-') k = k[1];
    return k.toUpperCase();
  }

  function assign$1(target, source, alias) {
    observer.each(source, function (v, k) {
      target[alias[k] || k] = v;
    });
    return target;
  }

  var _$2 = assign$1({
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
    return _$2.isArrayLike(el) ? el[0] : el;
  }

  function lastEl(el) {
    return _$2.isArrayLike(el) ? el[el.length - 1] : el;
  }

  function apply$1(coll, callback) {
    _$2.isArrayLike(coll) ? _$2.each(coll, callback) : callback(coll);
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
      if (_$2.isString(selectors)) return all ? document.querySelectorAll(selectors) : document.querySelector(selectors);
      return selectors;
    },
    cloneNode: function (el, deep) {
      function clone(el) {
        return el.cloneNode(deep !== false);
      }
      return _$2.isArrayLike(el) ? _$2.map(el, clone) : clone(el);
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
      apply$1(el, function (el) {
        var parent = el.parentNode;
        if (parent) parent.removeChild(el);
      });
      return dom;
    },
    before: function (el, target) {
      target = firstEl(target);
      var parent = target.parentNode;
      apply$1(el, function (el) {
        parent.insertBefore(el, target);
      });
      return dom;
    },
    after: function (el, target) {
      target = lastEl(target);
      var parent = target.parentNode;

      apply$1(el, parent.lastChild === target ? function (el) {
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
      apply$1(el, function (el) {
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
  _$2.assign(dom, {
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
        if (cur.indexOf(' ' + cls + ' ') === -1) dom['class'](el, _$2.trim(cur + cls));
      }
      return dom;
    },
    removeClass: function (el, cls) {
      el.classList ? el.classList.remove(cls) : dom['class'](el, _$2.trim((' ' + dom.prop(el, 'class') + ' ').replace(new RegExp(' ' + cls + ' ', 'g'), '')));
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

  _$2.assign(dom, {
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

  _$2.each(['top', 'left'], function (name) {
    cssHooks[name] = {
      get: function (el, name) {
        var val = cssDefaultGet(el, name);
        return (/px$/.test(val) ? val : dom.position(el)[name] + 'px'
        );
      }
    };
  });

  _$2.each(['Width', 'Height'], function (name) {
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
    if (_$2.isNil(val) || val === NaN) return '';
    if (!_$2.isString(val)) return val + '';
    return val;
  }

  _$2.assign(dom, {
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

          if (!_$2.isArray(value)) value = _$2.isNil(value) ? [] : [value];

          if (vl = value.length) {
            if (signle) vl = value.length = 1;

            var map = _$2.reverseConvert(value, function () {
              return false;
            }),
                nr = 0;

            for (i = 0, l = options.length; i < l; i++) {
              option = options[i];
              val = dom.val(option);
              if (_$2.isBoolean(map[val])) {
                map[val] = option.selected = true;
                if (++nr === vl) break;
              }
              value = _$2.keys(map, function (v) {
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

  var dom$1 = _$2.assign(dom, {
    hasListen: function (el, type, cb) {
      return hasListen$1(el, type, cb);
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
        _$2.assign(hackEvent, opts);
        el.dispatchEvent(hackEvent);
      } else if (dom.inDoc(el)) {
        //IE6-8触发事件必须保证在DOM树中,否则报'SCRIPT16389: 未指明的错误'
        hackEvent = document.createEventObject();
        _$2.assign(hackEvent, opts);
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
    if (!_$2.isFunc(handler)) throw TypeError('Invalid Event Handler');

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

  function hasListen$1(el, type, handler) {
    var listens = el[listenKey],
        handlers = listens ? listens[type] : undefined;

    return handlers ? handler ? _$2.indexOf(handlers, handler) != -1 : !!handlers.length : false;
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
  _$2.each(canBubbleUpArray, function (name) {
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
    _$2.each({
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
  _$2.each({
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
        if (hasListen$1(actEl, 'input')) {
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
  _$2.each(eventHooks, function (hook, type) {
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

  var config$1 = new _$2.Configuration();

  var Binding = _$2.dynamicClass({
    statics: {
      commentCfg: 'generateComments'
    },
    constructor: function (cfg) {
      this._scope = _$2.obj(cfg.scope);
      this.el = cfg.el;
    },
    scope: function () {
      var scope = this._scope;
      return _$2.proxy(scope) || scope;
    },
    realScope: function () {
      return this._scope;
    },
    propScope: function (prop) {
      var scope = this.realScope(),
          parent = void 0;

      while ((parent = scope.$parent) && !_$2.hasOwnProp(scope, prop)) {
        scope = parent;
      }
      return _$2.proxy(scope) || scope;
    },
    exprScope: function (expr) {
      return this.propScope(_$2.parseExpr(expr)[0]);
    },
    observe: function (expr, callback) {
      _$2.observe(this.exprScope(expr), expr, callback);
    },
    unobserve: function (expr, callback) {
      _$2.unobserve(this.exprScope(expr), expr, callback);
    },
    get: function (expr) {
      return _$2.get(this.realScope(), expr);
    },
    has: function (expr) {
      return _$2.has(this.realScope(), expr);
    },
    set: function (expr, value) {
      _$2.set(this.scope(), expr, value);
    },
    bind: function () {
      throw new Error('abstract method');
    },
    unbind: function () {
      throw new Error('abstract method');
    },
    destroy: function () {}
  });
  config$1.register(Binding.commentCfg, true);

  var log = new _$2.Logger('tpl', 'debug');

var   slice$1 = Array.prototype.slice;
  var filters = {};
  function apply$2(name, data, args, apply) {
    var f = filters[name],
        type = f ? f.type : undefined,
        fn = void 0;

    fn = f ? apply !== false ? f.apply : f.unapply : undefined;
    if (!fn) {
      log.warn('filter[' + name + '].' + (apply !== false ? 'apply' : 'unapply') + ' is undefined');
    } else {
      if (_$2.isFunc(args)) args = args();
      data = fn.apply(f, [data].concat(args));
    }
    return {
      stop: type == 'event' && data === false,
      data: data,
      replaceData: type !== 'event'
    };
  }
  var filter$1 = {
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


    apply: apply$2,

    unapply: function (name, data, args) {
      return apply$2(name, data, args, false);
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

  _$2.each(eventFilters, function (fn, name) {
    filter$1.register(name, {
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
      var args = slice$1.call(arguments, 1);
      return args.length > 1 ? args[value % 10 - 1] || args[args.length - 1] : args[0] + (value === 1 ? '' : 's');
    }
  };
  _$2.each(nomalFilters, function (f, name) {
    filter$1.register(name, f);
  });

  var defaultKeywords = _$2.reverseConvert('Math,Date,this,true,false,null,undefined,Infinity,NaN,isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,parseInt,parseFloat,$scope'.split(','), function () {
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
      if (filterExpr = _$2.trim(filterExprs[i])) {
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
    currentKeywords = keywords ? _$2.reverseConvert(keywords, function () {
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
        path: _$2.parseExpr(exp),
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
    ret.identities = _$2.keys(currentIdentities);

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
        rs = (apply !== false ? filter$1.apply : filter$1.unapply)(f.name, data, _args);
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
    return _$2.map(executors, function (executor) {
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

    exp = _$2.trim(exp);
    if (!(res = cache[exp])) cache[exp] = res = compileExecuter(exp, args);
    return res;
  }

  var expressionArgs = ['$el'];

  var Text = _$2.dynamicClass({
    extend: Binding,
    constructor: function (cfg) {
      this['super'](arguments);
      this.expr = expression(cfg.expression, expressionArgs);
      if (config$1.get(Binding.commentCfg)) {
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

      _$2.each(this.expr.identities, function (ident) {
        _this.observe(ident, _this.observeHandler);
      });
      this.update(this.value());
    },
    unbind: function () {
      var _this2 = this;

      _$2.each(this.expr.identities, function (ident) {
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
      if (_$2.isNil(val)) val = '';
      if (val !== dom.text(this.el)) dom.text(this.el, val);
    }
  });

  var directives = {};

  var Directive = _$2.dynamicClass({
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
      this.children = _$2.map(cfg.children, function (binding) {
        return _this.template.parser.createBinding(binding, {
          el: cfg.els[binding.index],
          template: _this.template,
          scope: _this.realScope()
        });
      });
      this.group = cfg.group;
      if (config$1.get(Binding.commentCfg)) {
        this.comment = document.createComment('Directive[' + this.attr + ']: ' + this.expr);
        dom.before(this.comment, this.el);
      }
    },
    bindChildren: function () {
      _$2.each(this.children, function (directive) {
        directive.bind();
      });
    },
    unbindChildren: function () {
      _$2.each(this.children, function (directive) {
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
        return _$2.isExtendOf(obj, Directive);
      },
      register: function (name, option) {
        var directive = void 0;

        name = name.toLowerCase();

        if (_$2.isObject(option)) {
          option.extend = option.extend || Directive;
          directive = _$2.dynamicClass(option);
        } else if (_$2.isFunc(option) && _$2.isExtendOf(option, Directive)) {
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

  var DirectiveGroup = _$2.dynamicClass({
    extend: Binding,
    constructor: function (cfg) {
      var _this = this;

      this['super'](arguments);
      this.template = cfg.template;
      this.directives = _$2.map(cfg.directives, function (directive) {
        return _this.createDirective(directive);
      });
      this.bindedCount = 0;
      this.bindedChildren = false;
      this.parse = this.parse.bind(this);
      this.children = _$2.map(cfg.children, function (directive) {
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
        ret && ret instanceof _$2.YieId ? ret.then(this.parse) : this.parse();
      } else {
        _$2.each(this.children, function (directive) {
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
        _$2.each(this.children, function (directive) {
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

  var TextParser = _$2.dynamicClass({
    constructor: function (text) {
      this.text = text;
    },
    token: function () {
      throw new Error('abstract method');
    }
  });

  TextParser.NormalTextParser = _$2.dynamicClass({
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

  var TemplateParser = _$2.dynamicClass({
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
      cfg = _$2.assign(cfg, binding);
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

      if (_$2.isArrayLike(el)) {
        _$2.each(el, function (el) {
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
      if (el.nodeType === 1 && this.els[els.length - 1].parsed) _$2.each(el.childNodes, function (el) {
        _this2.parseElsNode(el, els);
      });
    },
    parse: function () {
      var _this3 = this;

      this.els = [];
      this.bindings = [];
      if (_$2.isArrayLike(this.el)) {
        _$2.each(this.el, function (el) {
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

      _$2.each(el.attributes, function (attr) {
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
      if (!block) _$2.each(_$2.map(el.childNodes, function (n) {
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
      if (content = _$2.trim(content)) return this.insertText(content, before);
    }
  });

  var TemplateInstance = _$2.dynamicClass({
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
        _$2.each(this.bindings, function (bind) {
          bind.bind();
        });
        this.binded = true;
      }
      return this;
    },
    unbind: function () {
      if (this.binded) {
        _$2.each(this.bindings, function (bind) {
          bind.unbind();
        });
        this.binded = false;
      }
      return this;
    },
    destroy: function () {
      if (this.binded) _$2.each(this.bindings, function (bind) {
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
  config$1.register(directiveRegCfg, /^tpl-/);
  config$1.register(textParserCfg, TextParser.NormalTextParser);

  function parseEl(templ, clone) {
    if (_$2.isString(templ)) {
      templ = _$2.trim(templ);
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
    return cfg[name] || config$1.get(name);
  }

  var templateId = 0;
  var templateCache = {};
  var Template = _$2.dynamicClass({
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
      bindings = _$2.map(templ.bindings, function (binding) {
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
  config$1.register(directiveRegCfg$1, /^tpl-/);
  config$1.register(textParserCfg$1, TextParser.NormalTextParser);

  function parseEl$1(templ, clone) {
    if (_$2.isString(templ)) {
      templ = _$2.trim(templ);
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
    return cfg[name] || config$1.get(name);
  }

  var templateId$1 = 0;
  var templateCache$1 = {};
  var Template$1 = _$2.dynamicClass({
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
      bindings = _$2.map(templ.bindings, function (binding) {
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
  var EachDirective = Directive.register('each', _$2.dynamicClass({
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

      _$2.each(data, function (item, idx) {
        var index = indexExpr ? _$2.get(item, indexExpr) : idx,
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
        _$2.each(oldSort, function (oldScope) {
          var scope = cache[oldScope.$index];
          if (scope && scope !== sort[oldScope.$sort]) {
            removed.push(oldScope);
            cache[oldScope.$index] = undefined;
          }
        });

        _$2.each(added, function (scope) {
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

        _$2.each(removed, function (scope) {
          scope.$tpl.destroy();
        });
      }
    },
    createScope: function (parentScope, value, i, index) {
      var scope = _$2.create(parentScope);
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

  var EventDirective = _$2.dynamicClass({
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
          if (_$2.isFunc(fn)) {
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

  var event = _$2.assign(_$2.convert(events, function (opt) {
    var name = _$2.isObject(opt) ? opt.name : opt;
    return _$2.hump(name + 'Directive');
  }, function (opt) {
    if (!_$2.isObject(opt)) opt = {
      eventType: opt
    };
    var name = opt.name || 'on' + opt.eventType;
    opt.extend = EventDirective;
    return Directive.register(name, opt);
  }), {
    EventDirective: EventDirective
  });

  var expressionArgs$2 = ['$el'];

  var SimpleDirective = _$2.dynamicClass({
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

      _$2.each(this.expression.identities, function (ident) {
        _this.observe(ident, _this.observeHandler);
      });
      this.update(this.value());
    },
    bind: function () {
      this.listen();
    },
    unlisten: function () {
      var _this2 = this;

      _$2.each(this.expression.identities, function (ident) {
        _this2.unobserve(ident, _this2.observeHandler);
      });
    },
    unbind: function () {
      this.unlisten();
    },
    blankValue: function (val) {
      if (arguments.length == 0) val = this.value();
      return _$2.isNil(val) ? '' : val;
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
          this.handleArray(_$2.trim(value).split(/\s+/));
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
        _$2.each(value, function (val) {
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
            if (!value || (isArr ? _$2.indexOf(value, key) == -1 : !_$2.hasOwnProp(value, key))) {
              dom.removeClass(el, key);
            }
          }
        }
      }
    },
    'style': {
      update: function (value) {
        if (value && _$2.isString(value)) {
          dom.style(this.el, value);
        } else if (value && _$2.isObject(value)) {
          this.handleObject(value);
        }
      },
      handleObject: function (value) {
        this.cleanup(value);
        var keys = this.prevKeys = [],
            el = this.el;
        _$2.each(value, function (val, key) {
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
        this.yieId = new _$2.YieId();
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
        _$2.isArray(val) ? dom.checked(this.el, _$2.indexOf(val, dom.val(this.el))) : dom.checked(this.el, !!val);
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
  var simple = _$2.assign(_$2.convert(directives$2, function (opt, name) {
    console.log('name', name);
    return _$2.hump(name + 'Directive');
  }, function (opt, name) {
    console.log('name2', name);
    opt.extend = SimpleDirective;
    return Directive.register(name, opt);
  }), {
    SimpleDirective: SimpleDirective
  });

  var directives$1 = _$2.assign({
    EachDirective: EachDirective
  }, event, simple);

  var index = _$2.assign(Template, _$2, dom, {
    filter: filter$1,
    expression: expression,
    Directive: Directive,
    directives: directives$1,
    TextParser: TextParser,
    config: config$1,
    TemplateParser: TemplateParser,
    init: function (cfg) {
      observer.init(cfg);
      config$1.config(cfg);
    }
  });

  return index;

}));
//# sourceMappingURL=tpl.all.js.map