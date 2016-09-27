/*
 * tpl.js v0.0.16 built in Tue, 27 Sep 2016 06:50:46 GMT
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
  function isPrimitive(obj) {
    if (obj === null || obj === undefined) return true;
    var type = toStr.call(obj);
    switch (type) {
      case boolType:
      case numberType:
      case stringType:
      case funcType:
        return true;
    }
    return false;
  }

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

  var thousandSeparationReg = /(\d)(?=(\d{3})+(?!\d))/g;

  function thousandSeparate(number) {
    var split = (number + '').split('.');
    split[0] = split[0].replace(thousandSeparationReg, '$1,');
    return split.join('.');
  }

  var plurals = [{
    reg: /([a-zA-Z]+[^aeiou])y$/,
    rep: '$1ies'
  }, {
    reg: /([a-zA-Z]+[aeiou]y)$/,
    rep: '$1s'
  }, {
    reg: /([a-zA-Z]+[sxzh])$/,
    rep: '$1es'
  }, {
    reg: /([a-zA-Z]+[^sxzhy])$/,
    rep: '$1s'
  }];
  function plural(str) {
    var plural = void 0,
        rep = void 0;
    for (var i = 0; i < 4; i++) {
      plural = plurals[i];
      if (plural.reg.test(str)) return str.replace(plural.reg, plural.rep);
    }
    return str;
  }
  function singular(str) {
    var singulars = void 0,
        rep = void 0;
    for (var i = 0; i < 4; i++) {
      singular = plurals[i];
      if (singular.reg.test(str)) return str.replace(singular.reg, singular.rep);
    }
    return str;
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

  var assign$1 = Object.assign || function assign(target) {
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
  var emptyArray = [];
  assign$1(Base.prototype, {
    'super': function (args) {
      var method = arguments.callee.caller;
      method.$owner.superclass[method.$name].apply(this, args || emptyArray);
    },
    superclass: function () {
      var method = arguments.callee.caller;
      return method.$owner.superclass;
    }
  });
  assign$1(Base, {
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
      if (statics) assign$1(this, statics);
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

    assign$1(cls, Base);

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
    isPrimitive: isPrimitive,
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
    thousandSeparate: thousandSeparate,
    plural: plural,
    get singular () { return singular; },
    parseExpr: parseExpr,
    get: get,
    has: has,
    set: set,
    getOwnProp: getOwnProp,
    prototypeOf: prototypeOf,
    setPrototypeOf: setPrototypeOf,
    assign: assign$1,
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

  var reg = /%(\d+\$|\*|\$)?([-+#0, ]*)?(\d+\$?|\*|\$)?(\.\d+\$?|\.\*|\.\$)?([%sfducboxXeEgGpP])/g;
var   thousandSeparationReg$1 = /(\d)(?=(\d{3})+(?!\d))/g;
  function pad(str, len, chr, leftJustify) {
    var l = str.length,
        padding = l >= len ? '' : Array(1 + len - l >>> 0).join(chr);

    return leftJustify ? str + padding : padding + str;
  }

  function format(str, args) {
    var index = 0;

    function parseWidth(width) {
      if (!width) {
        width = 0;
      } else if (width == '*') {
        width = +args[index++];
      } else if (width == '$') {
        width = +args[index];
      } else if (width.charAt(width.length - 1) == '$') {
        width = +args[width.slice(0, -1) - 1];
      } else {
        width = +width;
      }
      return isFinite(width) ? width < 0 ? 0 : width : 0;
    }

    function parseArg(i) {
      if (!i || i == '*') return args[index++];
      if (i == '$') return args[index];
      return args[i.slice(0, -1) - 1];
    }

    str = str.replace(reg, function (match, i, flags, minWidth, precision, type) {
      if (type === '%') return '%';

      var value = parseArg(i);
      minWidth = parseWidth(minWidth);
      precision = precision && parseWidth(precision.slice(1));
      if (!precision && precision !== 0) precision = 'fFeE'.indexOf(type) == -1 ? type == 'd' ? 0 : void 0 : 6;

      console.log('match:' + match + ', index:' + i + '/' + value + ', flags:' + flags + ', width:' + minWidth + ', prec:' + precision + ', type:' + type);

      var leftJustify = false,
          positivePrefix = '',
          zeroPad = false,
          prefixBaseX = false,
          thousandSeparation = false,
          prefix = void 0,
          base = void 0;

      if (flags) each(flags, function (c) {
        switch (c) {
          case ' ':
          case '+':
            positivePrefix = c;
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
          case ',':
            thousandSeparation = true;
            break;
        }
      });
      switch (type) {
        case 'c':
          return String.fromCharCode(+value);
        case 's':
          if (isNil(value) && !isNaN(value)) return '';
          value += '';
          if (precision && value.length > precision) value = value.slice(0, precision);
          if (value.length < minWidth) value = pad(value, minWidth, zeroPad ? '0' : ' ', false);
          return value;
        case 'd':
          value = parseInt(value);
          if (isNaN(value)) return '';
          if (value < 0) {
            prefix = '-';
            value = -value;
          } else {
            prefix = positivePrefix;
          }
          value += '';

          if (value.length < minWidth) value = pad(value, minWidth, '0', false);

          if (thousandSeparation) value = value.replace(thousandSeparationReg$1, '$1,');
          return prefix + value;
        case 'e':
        case 'E':
        case 'f':
        case 'g':
        case 'G':
        case 'p':
        case 'P':
          {
            var _number = +value;
            if (isNaN(_number)) return '';
            if (_number < 0) {
              prefix = '-';
              _number = -_number;
            } else {
              prefix = positivePrefix;
            }

            var method = void 0,
                ltype = type.toLowerCase();

            if ('p' != ltype) {
              method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(ltype)];
            } else {
              var sf = String(value).replace(/[eE].*|[^\d]/g, '');
              sf = (_number ? sf.replace(/^0+/, '') : sf).length;
              if (precision) precision = Math.min(precision, sf);
              method = !precision || precision <= sf ? 'toPrecision' : 'toExponential';
            }
            _number = _number[method](precision);

            if (_number.length < minWidth) _number = pad(_number, minWidth, '0', false);
            if (thousandSeparation) {
              var split = _number.split('.');
              split[0] = split[0].replace(thousandSeparationReg$1, '$1,');
              _number = split.join('.');
            }
            value = prefix + _number;
            if ('EGP'.indexOf(type) != -1) return value.toUpperCase();
            return value;
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
        case 'n':
          return '';
        default:
          return match;
      }
      var number = value >>> 0;
      prefix = prefixBaseX && base != 10 && number && ['0b', '0', '0x'][base >> 3] || '';
      number = number.toString(base);
      if (number.length < minWidth) number = pad(number, minWidth, '0', false);
      value = prefix + number;
      if (type == 'X') return value.toUpperCase();
      return value;
    });

    return {
      format: str,
      count: index
    };
  }

  function index(str) {
    return format(str, Array.prototype.slice.call(arguments, 1)).format;
  }
  index.format = format;

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
        var f = index.format.apply(null, args);
        return [f.format].concat(slice.call(args, f.count)).join(' ');
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
      this.length = 0;
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
      this.length--;
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
      this.length++;
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

      if (list && (desc = list[this._id])) {
        this._unlink(desc);
        delete list[this._id];
        return true;
      }
      return false;
    },
    clean: function () {
      var desc = this._header;
      while (desc) {
        delete this._listObj(desc.obj)[this._id];
        desc = desc.next;
      }
      this._header = undefined;
      this._tail = undefined;
      this.length = 0;
      return this;
    },
    empty: function () {
      return this.length == 0;
    },
    size: function () {
      return this.length;
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
    format: index,
    timeoutframe: timeoutframe,
    Configuration: Configuration,
    Logger: Logger,
    LinkedList: LinkedList
  }, _$1);

  var reg$1 = /{([^{]+)}/g;
  var TextParser = _.dynamicClass({
    constructor: function (text) {
      this.text = text;
      this.index = 0;
    },
    nextToken: function () {
      var token = reg$1.exec(this.text);

      if (token) {
        var index = this.index = reg$1.lastIndex;

        return {
          token: token[1],
          start: index - token[0].length,
          end: index
        };
      }
      this.index = 0;
    }
  });

  var lastTime$1 = void 0;

  function request$1(callback) {
    var currTime = new Date().getTime(),
        timeToCall = Math.max(0, 16 - (currTime - lastTime$1)),
        reqId = setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime$1 = currTime + timeToCall;
    return reqId;
  }

  function cancel$1(reqId) {
    clearTimeout(reqId);
  }

  var timeoutframe$1 = {
    request: request$1,
    cancel: cancel$1
  };

  window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || timeoutframe$1.request;

  window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || timeoutframe$1.cancel;

  function fixProto$1(Type, prop, val) {
    if (!Type.prototype[prop]) Type.prototype[prop] = val;
  }

  fixProto$1(Function, 'bind', function bind(scope) {
    var fn = this,
        args = Array.prototype.slice.call(arguments, 1);
    return function () {
      return fn.apply(scope, args.concat(Array.prototype.slice.call(arguments)));
    };
  });

  if (!Object.freeze) Object.freeze = function freeze(obj) {
    return obj;
  };

  var toStr$1 = Object.prototype.toString;
  var hasOwn$1 = Object.prototype.hasOwnProperty;

  function overrideHasOwnProlicy$1(fn) {
    if (isFunc$1(fn)) hasOwn$1 = fn;
  }

  function hasOwnProlicy$1() {
    return hasOwn$1;
  }

  function hasOwnProp$1(obj, prop) {
    return hasOwn$1.call(obj, prop);
  }

  // ==============================================
  // type utils
  // ==============================================
var   argsType$1 = '[object Arguments]';
var   arrayType$1 = '[object Array]';
var   funcType$1 = '[object Function]';
var   boolType$1 = '[object Boolean]';
var   numberType$1 = '[object Number]';
var   dateType$1 = '[object Date]';
var   stringType$1 = '[object String]';
var   objectType$1 = '[object Object]';
var   regexpType$1 = '[object RegExp]';
var   nodeListType$1 = '[object NodeList]';
  function isPrimitive$1(obj) {
    if (obj === null || obj === undefined) return true;
    var type = toStr$1.call(obj);
    switch (type) {
      case boolType$1:
      case numberType$1:
      case stringType$1:
      case funcType$1:
        return true;
    }
    return false;
  }

  function isDefine$1(obj) {
    return obj !== undefined;
  }

  function isNull$1(obj) {
    return obj === null;
  }

  function isNil$1(obj) {
    return obj === undefined || obj === null;
  }

  function isArray$1(obj) {
    return toStr$1.call(obj) === arrayType$1;
  }

  function isFunc$1(obj) {
    return toStr$1.call(obj) === funcType$1;
  }

  function isNumber$1(obj) {
    return toStr$1.call(obj) === numberType$1;
  }

  function isBool$1(obj) {
    return toStr$1.call(obj) === boolType$1;
  }

  function isDate$1(obj) {
    return toStr$1.call(obj) === dateType$1;
  }

  function isString$1(obj) {
    return toStr$1.call(obj) === stringType$1;
  }

  function isObject$1(obj) {
    return toStr$1.call(obj) === objectType$1;
  }

  function isRegExp$1(obj) {
    return toStr$1.call(obj) === regexpType$1;
  }

  function isArrayLike$1(obj) {
    var type = toStr$1.call(obj);
    switch (type) {
      case argsType$1:
      case arrayType$1:
      case stringType$1:
      case nodeListType$1:
        return true;
      default:
        if (obj) {
          var length = obj.length;
          return isNumber$1(length) && (length ? length > 0 && length - 1 in obj : length === 0);
        }
        return false;
    }
  }

  // ==============================================
  // array utils
  // ==============================================
  function _eachObj$1(obj, callback, scope, own) {
    var key = void 0,
        isOwn = void 0;

    scope = scope || obj;
    for (key in obj) {
      isOwn = hasOwnProp$1(obj, key);
      if (own === false || isOwn) {
        if (callback.call(scope, obj[key], key, obj, isOwn) === false) return false;
      }
    }
    return true;
  }

  function _eachArray$1(obj, callback, scope) {
    var i = 0,
        j = obj.length;

    scope = scope || obj;
    for (; i < j; i++) {
      if (callback.call(scope, obj[i], i, obj, true) === false) return false;
    }
    return true;
  }

  function each$1(obj, callback, scope, own) {
    if (isArrayLike$1(obj)) {
      return _eachArray$1(obj, callback, scope);
    } else if (!isNil$1(obj)) {
      return _eachObj$1(obj, callback, scope, own);
    }
    return true;
  }

  function map$1(obj, callback, scope, own) {
    var ret = void 0;

    function cb(val, key) {
      ret[key] = callback.apply(this, arguments);
    }

    if (isArrayLike$1(obj)) {
      ret = [];
      _eachArray$1(obj, cb, scope);
    } else {
      ret = {};
      if (!isNil$1(obj)) _eachObj$1(obj, cb, scope, own);
    }
    return ret;
  }

  function filter$1(obj, callback, scope, own) {
    var ret = void 0;

    if (isArrayLike$1(obj)) {
      ret = [];
      _eachArray$1(obj, function (val) {
        if (callback.apply(this, arguments)) ret.push(val);
      }, scope);
    } else {
      ret = {};
      if (!isNil$1(obj)) _eachObj$1(obj, function (val, key) {
        if (callback.apply(this, arguments)) ret[key] = val;
      }, scope, own);
    }
    return ret;
  }

  function aggregate$1(obj, callback, defVal, scope, own) {
    var rs = defVal;

    each$1(obj, function (val, key, obj, isOwn) {
      rs = callback.call(this, rs, val, key, obj, isOwn);
    }, scope, own);
    return rs;
  }

  function keys$1(obj, filter, scope, own) {
    var keys = [];

    each$1(obj, function (val, key) {
      if (!filter || filter.apply(this, arguments)) keys.push(key);
    }, scope, own);
    return keys;
  }

  function _indexOfArray$1(array, val) {
    var i = 0,
        l = array.length;

    for (; i < l; i++) {
      if (array[i] === val) return i;
    }
    return -1;
  }

  function _lastIndexOfArray$1(array, val) {
    var i = array.length;

    while (i-- > 0) {
      if (array[i] === val) return i;
    }
  }

  function _indexOfObj$1(obj, val, own) {
    for (key in obj) {
      if (own === false || hasOwnProp$1(obj, key)) {
        if (obj[key] === val) return key;
      }
    }
    return undefined;
  }

  function indexOf$1(obj, val, own) {
    if (isArrayLike$1(obj)) {
      return _indexOfArray$1(obj, val);
    } else {
      return _indexOfObj$1(obj, val, own);
    }
  }

  function lastIndexOf$1(obj, val, own) {
    if (isArrayLike$1(obj)) {
      return _lastIndexOfArray$1(obj, val);
    } else {
      return _indexOfObj$1(obj, val, own);
    }
  }

  function convert$1(obj, keyGen, valGen, scope, own) {
    var o = {};

    each$1(obj, function (val, key) {
      o[keyGen ? keyGen.apply(this, arguments) : key] = valGen ? valGen.apply(this, arguments) : val;
    }, scope, own);
    return o;
  }

  function reverseConvert$1(obj, valGen, scope, own) {
    var o = {};

    each$1(obj, function (val, key) {
      o[val] = valGen ? valGen.apply(this, arguments) : key;
    }, scope, own);
    return o;
  }

  // ==============================================
  // string utils
  // ==============================================
var   regFirstChar$1 = /^[a-z]/;
var   regLeftTrim$1 = /^\s+/;
var   regRightTrim$1 = /\s+$/;
var   regTrim$1 = /(^\s+)|(\s+$)/g;
  function _uppercase$1(k) {
    return k.toUpperCase();
  }

  function upperFirst$1(str) {
    return str.replace(regFirstChar$1, _uppercase$1);
  }

  function ltrim$1(str) {
    return str.replace(regLeftTrim$1, '');
  }

  function rtrim$1(str) {
    return str.replace(regRightTrim$1, '');
  }

  function trim$1(str) {
    return str.replace(regTrim$1, '');
  }

  var thousandSeparationReg$2 = /(\d)(?=(\d{3})+(?!\d))/g;

  function thousandSeparate$1(number) {
    var split = (number + '').split('.');
    split[0] = split[0].replace(thousandSeparationReg$2, '$1,');
    return split.join('.');
  }

var   plurals$1 = [{
    reg: /([a-zA-Z]+[^aeiou])y$/,
    rep: '$1ies'
  }, {
    reg: /([a-zA-Z]+[aeiou]y)$/,
    rep: '$1s'
  }, {
    reg: /([a-zA-Z]+[sxzh])$/,
    rep: '$1es'
  }, {
    reg: /([a-zA-Z]+[^sxzhy])$/,
    rep: '$1s'
  }];
  function plural$1(str) {
    var plural = void 0,
        rep = void 0;
    for (var i = 0; i < 4; i++) {
      plural = plurals$1[i];
      if (plural.reg.test(str)) return str.replace(plural.reg, plural.rep);
    }
    return str;
  }
  function singular$1(str) {
    var singulars = void 0,
        rep = void 0;
    for (var i = 0; i < 4; i++) {
      singular$1 = plurals$1[i];
      if (singular$1.reg.test(str)) return str.replace(singular$1.reg, singular$1.rep);
    }
    return str;
  }
  // ==============================================
  // object utils
  // ==============================================
var   exprCache$1 = {};
var   regPropertyName$1 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
var   regEscapeChar$1 = /\\(\\)?/g;
  function parseExpr$1(expr, autoCache) {
    if (isArray$1(expr)) {
      return expr;
    } else if (isString$1(expr)) {
      var _ret = function () {
        var rs = exprCache$1[expr];

        if (rs) return {
            v: rs
          };
        rs = autoCache ? exprCache$1[expr] = [] : [];
        expr.replace(regPropertyName$1, function (match, number, quote, string) {
          rs.push(quote ? string.replace(regEscapeChar$1, '$1') : number || match);
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

  function get$1(obj, expr, defVal, lastOwn, own) {
    var i = 0,
        path = parseExpr$1(expr, true),
        l = path.length - 1,
        prop = void 0;

    while (!isNil$1(obj) && i < l) {
      prop = path[i++];
      if (own && !hasOwnProp$1(obj, prop)) return defVal;
      obj = obj[prop];
    }
    prop = path[i];
    return i == l && !isNil$1(obj) && (own ? hasOwnProp$1(obj, prop) : prop in obj) ? obj[prop] : defVal;
  }

  function has$1(obj, expr, lastOwn, own) {
    var i = 0,
        path = parseExpr$1(expr, true),
        l = path.length - 1,
        prop = void 0;

    while (!isNil$1(obj) && i < l) {
      prop = path[i++];
      if (own && !hasOwnProp$1(obj, prop)) return false;
      obj = obj[prop];
    }
    prop = path[i];
    return i == l && !isNil$1(obj) && (own ? hasOwnProp$1(obj, prop) : prop in obj);
  }

  function set$1(obj, expr, value) {
    var i = 0,
        path = parseExpr$1(expr, true),
        l = path.length - 1,
        prop = path[0],
        _obj = obj;

    for (; i < l; i++) {
      if (isNil$1(_obj[prop])) {
        _obj = _obj[prop] = {};
      } else {
        _obj = _obj[prop];
      }
      prop = path[i + 1];
    }
    _obj[prop] = value;
    return obj;
  }

  function getOwnProp$1(obj, key) {
    return hasOwnProp$1(obj, key) ? obj[key] : undefined;
  }

  var prototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(obj) {
    return obj.__proto__;
  };

  var setPrototypeOf$1 = Object.setPrototypeOf || function setPrototypeOf(obj, proto) {
    obj.__proto__ = proto;
  };

  var assign$2 = Object.assign || function assign(target) {
    var source = void 0,
        key = void 0,
        i = 1,
        l = arguments.length;

    for (; i < l; i++) {
      source = arguments[i];
      for (key in source) {
        if (hasOwnProp$1(source, key)) target[key] = source[key];
      }
    }
    return target;
  };

  function assignIf$1(target) {
    var source = void 0,
        key = void 0,
        i = 1,
        l = arguments.length;

    for (; i < l; i++) {
      source = arguments[i];
      for (key in source) {
        if (hasOwnProp$1(source, key) && !hasOwnProp$1(target, key)) target[key] = source[key];
      }
    }
    return target;
  }

  function emptyFunc$1() {}

  var create$1 = Object.create || function (parent, props) {
    emptyFunc$1.prototype = parent;
    var obj = new emptyFunc$1();
    emptyFunc$1.prototype = undefined;
    if (props) each$1(props, function (prop, name) {
      obj[name] = prop.value;
    });
    return obj;
  };

  function isExtendOf$1(cls, parent) {
    if (!isFunc$1(cls)) return cls instanceof parent;

    var proto = cls;

    while ((proto = prototypeOf$1(proto)) && proto !== Object) {
      if (proto === parent) return true;
    }
    return parent === Object;
  }

  // ==============================================
  // dynamicClass
  // ==============================================
var   Base$1 = function () {};
var   emptyArray$1 = [];
  assign$2(Base$1.prototype, {
    'super': function (args) {
      var method = arguments.callee.caller;
      method.$owner.superclass[method.$name].apply(this, args || emptyArray$1);
    },
    superclass: function () {
      var method = arguments.callee.caller;
      return method.$owner.superclass;
    }
  });
  assign$2(Base$1, {
    extend: function (overrides) {
      var _this = this;

      if (overrides) {
        (function () {
          var proto = _this.prototype;
          each$1(overrides, function (member, name) {
            if (isFunc$1(member)) {
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
      if (statics) assign$2(this, statics);
      return this;
    }
  });

  function dynamicClass$1(overrides) {
    var cls = function DynamicClass() {
      this.constructor.apply(this, arguments);
    },
        superclass = overrides.extend,
        superproto = void 0,
        proto = void 0;

    assign$2(cls, Base$1);

    if (!isFunc$1(superclass) || superclass === Object) superclass = Base$1;

    superproto = superclass.prototype;

    proto = create$1(superproto);

    cls.superclass = superproto;
    cls.prototype = proto;
    setPrototypeOf$1(cls, superclass);

    delete overrides.extend;
    return cls.extend(overrides);
  }

var _$3 = Object.freeze({
    overrideHasOwnProlicy: overrideHasOwnProlicy$1,
    hasOwnProlicy: hasOwnProlicy$1,
    hasOwnProp: hasOwnProp$1,
    isPrimitive: isPrimitive$1,
    isDefine: isDefine$1,
    isNull: isNull$1,
    isNil: isNil$1,
    isArray: isArray$1,
    isFunc: isFunc$1,
    isNumber: isNumber$1,
    isBool: isBool$1,
    isDate: isDate$1,
    isString: isString$1,
    isObject: isObject$1,
    isRegExp: isRegExp$1,
    isArrayLike: isArrayLike$1,
    each: each$1,
    map: map$1,
    filter: filter$1,
    aggregate: aggregate$1,
    keys: keys$1,
    indexOf: indexOf$1,
    lastIndexOf: lastIndexOf$1,
    convert: convert$1,
    reverseConvert: reverseConvert$1,
    upperFirst: upperFirst$1,
    ltrim: ltrim$1,
    rtrim: rtrim$1,
    trim: trim$1,
    thousandSeparate: thousandSeparate$1,
    plural: plural$1,
    get singular () { return singular$1; },
    parseExpr: parseExpr$1,
    get: get$1,
    has: has$1,
    set: set$1,
    getOwnProp: getOwnProp$1,
    prototypeOf: prototypeOf$1,
    setPrototypeOf: setPrototypeOf$1,
    assign: assign$2,
    assignIf: assignIf$1,
    emptyFunc: emptyFunc$1,
    create: create$1,
    isExtendOf: isExtendOf$1,
    dynamicClass: dynamicClass$1
  });

  var Configuration$1 = dynamicClass$1({
    constructor: function (def) {
      this.cfg = def || {};
    },
    register: function (name, defVal) {
      var _this = this;

      if (arguments.length == 1) {
        each$1(name, function (val, name) {
          _this.cfg[name] = val;
        });
      } else {
        this.cfg[name] = defVal;
      }
      return this;
    },
    config: function (cfg) {
      var _this2 = this;

      if (cfg) each$1(this.cfg, function (val, key) {
        if (hasOwnProp$1(cfg, key)) _this2.cfg[key] = cfg[key];
      });
      return this;
    },
    get: function (name) {
      return arguments.length ? this.cfg[name] : create$1(this.cfg);
    }
  });

var   reg$2 = /%(\d+\$|\*|\$)?([-+#0, ]*)?(\d+\$?|\*|\$)?(\.\d+\$?|\.\*|\.\$)?([%sfducboxXeEgGpP])/g;
var   thousandSeparationReg$3 = /(\d)(?=(\d{3})+(?!\d))/g;
  function pad$1(str, len, chr, leftJustify) {
    var l = str.length,
        padding = l >= len ? '' : Array(1 + len - l >>> 0).join(chr);

    return leftJustify ? str + padding : padding + str;
  }

  function format$1(str, args) {
    var index = 0;

    function parseWidth(width) {
      if (!width) {
        width = 0;
      } else if (width == '*') {
        width = +args[index++];
      } else if (width == '$') {
        width = +args[index];
      } else if (width.charAt(width.length - 1) == '$') {
        width = +args[width.slice(0, -1) - 1];
      } else {
        width = +width;
      }
      return isFinite(width) ? width < 0 ? 0 : width : 0;
    }

    function parseArg(i) {
      if (!i || i == '*') return args[index++];
      if (i == '$') return args[index];
      return args[i.slice(0, -1) - 1];
    }

    str = str.replace(reg$2, function (match, i, flags, minWidth, precision, type) {
      if (type === '%') return '%';

      var value = parseArg(i);
      minWidth = parseWidth(minWidth);
      precision = precision && parseWidth(precision.slice(1));
      if (!precision && precision !== 0) precision = 'fFeE'.indexOf(type) == -1 ? type == 'd' ? 0 : void 0 : 6;

      console.log('match:' + match + ', index:' + i + '/' + value + ', flags:' + flags + ', width:' + minWidth + ', prec:' + precision + ', type:' + type);

      var leftJustify = false,
          positivePrefix = '',
          zeroPad = false,
          prefixBaseX = false,
          thousandSeparation = false,
          prefix = void 0,
          base = void 0;

      if (flags) each$1(flags, function (c) {
        switch (c) {
          case ' ':
          case '+':
            positivePrefix = c;
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
          case ',':
            thousandSeparation = true;
            break;
        }
      });
      switch (type) {
        case 'c':
          return String.fromCharCode(+value);
        case 's':
          if (isNil$1(value) && !isNaN(value)) return '';
          value += '';
          if (precision && value.length > precision) value = value.slice(0, precision);
          if (value.length < minWidth) value = pad$1(value, minWidth, zeroPad ? '0' : ' ', false);
          return value;
        case 'd':
          value = parseInt(value);
          if (isNaN(value)) return '';
          if (value < 0) {
            prefix = '-';
            value = -value;
          } else {
            prefix = positivePrefix;
          }
          value += '';

          if (value.length < minWidth) value = pad$1(value, minWidth, '0', false);

          if (thousandSeparation) value = value.replace(thousandSeparationReg$3, '$1,');
          return prefix + value;
        case 'e':
        case 'E':
        case 'f':
        case 'g':
        case 'G':
        case 'p':
        case 'P':
          {
            var _number = +value;
            if (isNaN(_number)) return '';
            if (_number < 0) {
              prefix = '-';
              _number = -_number;
            } else {
              prefix = positivePrefix;
            }

            var method = void 0,
                ltype = type.toLowerCase();

            if ('p' != ltype) {
              method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(ltype)];
            } else {
              var sf = String(value).replace(/[eE].*|[^\d]/g, '');
              sf = (_number ? sf.replace(/^0+/, '') : sf).length;
              if (precision) precision = Math.min(precision, sf);
              method = !precision || precision <= sf ? 'toPrecision' : 'toExponential';
            }
            _number = _number[method](precision);

            if (_number.length < minWidth) _number = pad$1(_number, minWidth, '0', false);
            if (thousandSeparation) {
              var split = _number.split('.');
              split[0] = split[0].replace(thousandSeparationReg$3, '$1,');
              _number = split.join('.');
            }
            value = prefix + _number;
            if ('EGP'.indexOf(type) != -1) return value.toUpperCase();
            return value;
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
        case 'n':
          return '';
        default:
          return match;
      }
      var number = value >>> 0;
      prefix = prefixBaseX && base != 10 && number && ['0b', '0', '0x'][base >> 3] || '';
      number = number.toString(base);
      if (number.length < minWidth) number = pad$1(number, minWidth, '0', false);
      value = prefix + number;
      if (type == 'X') return value.toUpperCase();
      return value;
    });

    return {
      format: str,
      count: index
    };
  }

  function index$1(str) {
    return format$1(str, Array.prototype.slice.call(arguments, 1)).format;
  }
  index$1.format = format$1;

var   logLevels$1 = ['debug', 'info', 'warn', 'error'];
var   tmpEl$1 = document.createElement('div');
var   slice$1 = Array.prototype.slice;
var   SimulationConsole$1 = dynamicClass$1({
    constructor: function () {
      tmpEl$1.innerHTML = '<div id="simulation_console"\n    style="position:absolute; top:0; right:0; font-family:courier,monospace; background:#eee; font-size:10px; padding:10px; width:200px; height:200px;">\n  <a style="float:right; padding-left:1em; padding-bottom:.5em; text-align:right;">Clear</a>\n  <div id="simulation_console_body"></div>\n</div>';
      this.el = tmpEl$1.childNodes[0];
      this.clearEl = this.el.childNodes[0];
      this.bodyEl = this.el.childNodes[1];
    },
    appendTo: function (el) {
      el.appendChild(this.el);
    },
    log: function (style, msg) {
      tmpEl$1.innerHTML = '<span style="' + style + '">' + msg + '</span>';
      this.bodyEl.appendChild(tmpEl$1.childNodes[0]);
    },
    parseMsg: function (args) {
      var msg = args[0];
      if (isString$1(msg)) {
        var f = index$1.format.apply(null, args);
        return [f.format].concat(slice$1.call(args, f.count)).join(' ');
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
  var console$2 = window.console;
  if (console$2 && !console$2.debug) console$2.debug = function () {
    Function.apply.call(console$2.log, console$2, arguments);
  };

  var Logger$1 = dynamicClass$1({
    statics: {
      enableSimulationConsole: function () {
        if (!console$2) {
          console$2 = new SimulationConsole$1();
          console$2.appendTo(document.body);
        }
      }
    },
    constructor: function (_module, level) {
      this.module = _module;
      this.level = indexOf$1(logLevels$1, level || 'info');
    },
    setLevel: function (level) {
      this.level = indexOf$1(logLevels$1, level || 'info');
    },
    getLevel: function () {
      return logLevels$1[this.level];
    },
    _print: function (level, args, trace) {
      Function.apply.call(console$2[level], console$2, args);
      if (trace && console$2.trace) console$2.trace();
    },
    _log: function (level, args, trace) {
      if (level < this.level || !console$2) return;
      var msg = '[%s] %s -' + (isString$1(args[0]) ? ' ' + args.shift() : ''),
          errors = [];
      args = filter$1(args, function (arg) {
        if (arg instanceof Error) {
          errors.push(arg);
          return false;
        }
        return true;
      });
      each$1(errors, function (err) {
        args.push.call(args, err.message, '\n', err.stack);
      });
      level = logLevels$1[level];
      this._print(level, [msg, level, this.module].concat(args), trace);
    },
    debug: function () {
      this._log(0, slice$1.call(arguments, 0));
    },
    info: function () {
      this._log(1, slice$1.call(arguments, 0));
    },
    warn: function () {
      this._log(2, slice$1.call(arguments, 0));
    },
    error: function () {
      this._log(3, slice$1.call(arguments, 0));
    }
  });

  Logger$1.logger = new Logger$1('default', 'info');

  var IDGenerator$1 = 1;

  var LinkedList$1 = dynamicClass$1({
    statics: {
      ListKey: '__UTILITY_LIST__'
    },
    constructor: function () {
      this._id = IDGenerator$1++;
      this.length = 0;
      this._header = undefined;
      this._tail = undefined;
      this._version = 1;
    },
    _listObj: function (obj) {
      return hasOwnProp$1(obj, LinkedList$1.ListKey) && obj[LinkedList$1.ListKey];
    },
    _desc: function (obj) {
      var list = this._listObj(obj);

      return list && list[this._id];
    },
    _getOrCreateDesc: function (obj) {
      var list = this._listObj(obj) || (obj[LinkedList$1.ListKey] = {}),
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
      this.length--;
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
      this.length++;
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

      if (list && (desc = list[this._id])) {
        this._unlink(desc);
        delete list[this._id];
        return true;
      }
      return false;
    },
    clean: function () {
      var desc = this._header;
      while (desc) {
        delete this._listObj(desc.obj)[this._id];
        desc = desc.next;
      }
      this._header = undefined;
      this._tail = undefined;
      this.length = 0;
      return this;
    },
    empty: function () {
      return this.length == 0;
    },
    size: function () {
      return this.length;
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

  var _$2 = assignIf$1({
    format: index$1,
    timeoutframe: timeoutframe$1,
    Configuration: Configuration$1,
    Logger: Logger$1,
    LinkedList: LinkedList$1
  }, _$3);

  var configuration = new _$2.Configuration();

  var hasOwn$2 = Object.prototype.hasOwnProperty;
  var LISTEN_CONFIG = 'proxyListenKey';
  var LinkedList$3 = _$2.LinkedList;


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
      var handlers = _$2.getOwnProp(obj, configuration.get(LISTEN_CONFIG));

      if (handlers) handlers.each(function (handler) {
        return handler(obj, p);
      });
    },
    on: function (obj, handler) {
      if (!_$2.isFunc(handler)) throw TypeError('Invalid Proxy Event Handler[' + handler);
      var key = configuration.get(LISTEN_CONFIG),
          handlers = _$2.getOwnProp(obj, key);

      if (!handlers) obj[key] = handlers = new LinkedList$3();
      handlers.push(handler);
    },
    un: function (obj, handler) {
      var handlers = _$2.getOwnProp(obj, configuration.get(LISTEN_CONFIG));

      if (handlers && _$2.isFunc(handler)) handlers.remove(handler);
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
  _$2.assign(proxy$1, {
    isEnable: function () {
      return proxy$1.on !== _$2.emptyFunc;
    },
    enable: function (policy) {
      applyPolicy(policy);
      if (!hasEnabled) {
        _$2.overrideHasOwnProlicy(function (prop) {
          return hasOwn$2.call(proxy$1.obj(this), prop);
        });
        _$2.get = function (obj, expr, defVal, lastOwn, own) {
          var i = 0,
              path = _$2.parseExpr(expr, true),
              l = path.length - 1,
              prop = void 0;

          while (!_$2.isNil(obj) && i < l) {
            prop = path[i++];
            obj = proxy$1.obj(obj);
            if (own && !hasOwn$2.call(obj, prop)) return defVal;
            obj = obj[prop];
          }
          obj = proxy$1.obj(obj);
          prop = path[i];
          return i == l && !_$2.isNil(obj) && (own ? hasOwn$2.call(obj, prop) : prop in obj) ? obj[prop] : defVal;
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
      proxy$1[name] = _$2.emptyFunc;
    };
    _$2.each(apply, _apply);
    _$2.each(policy, function (fn, name) {
      proxy$1[name] = fn;
    });
  }

  proxy$1.disable();

  var logger = new _$2.Logger('observer', 'info');

  var timeoutframe$2 = _$2.timeoutframe;
  var config = configuration.get();
  var LinkedList$2 = _$2.LinkedList;


  configuration.register({
    lazy: true,
    animationFrame: true,
    observerKey: '__OBSERVER__',
    expressionKey: '__EXPR_OBSERVER__'
  });

  var Observer = _$2.dynamicClass({
    constructor: function (target) {
      this.obj = target;
      this.target = target;
      this.listens = {};
      this.changeRecords = {};
      this.notify = this.notify.bind(this);
      this.watchPropNum = 0;
      this.init();
    },
    fire: function (attr, val, oldVal) {
      var _this = this;

      var handlers = this.listens[attr];

      if (handlers) {
        (function () {
          var primitive = _$2.isPrimitive(val),
              eq = proxy$1.eq(val, oldVal);
          if (!primitive || !eq) handlers.each(function (handler) {
            handler(attr, val, oldVal, _this.target, eq);
          });
        })();
      }
    },
    notify: function () {
      var _this2 = this;

      var obj = this.obj,
          changeRecords = this.changeRecords;

      this.request_frame = undefined;
      this.changeRecords = {};

      _$2.each(changeRecords, function (val, attr) {
        _this2.fire(attr, obj[attr], val);
      });
    },
    addChangeRecord: function (attr, oldVal) {
      if (!config.lazy) {
        this.fire(attr, this.obj[attr], oldVal);
      } else if (!(attr in this.changeRecords) && this.listens[attr]) {
        this.changeRecords[attr] = oldVal;
        if (!this.request_frame) this.request_frame = config.animationFrame ? window.requestAnimationFrame(this.notify) : timeoutframe$2.request(this.notify);
      }
    },
    hasListen: function (attr, handler) {
      switch (arguments.length) {
        case 0:
          return !!this.watchPropNum;
        case 1:
          if (_$2.isFunc(attr)) {
            return !_$2.each(this.listens, function (handlers) {
              return handlers.contains(attr);
            });
          }
          return !!this.listens[attr];
        default:
          var handlers = this.listens[attr];
          return !!handlers && handlers.contains(handler);
      }
    },
    on: function (attr, handler) {
      var handlers = void 0;

      if (!(handlers = this.listens[attr])) this.listens[attr] = handlers = new LinkedList$2();

      if (handlers.empty()) {
        this.watchPropNum++;
        this.watch(attr);
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
          this.unwatch(attr);
        } else {
          handlers.remove(handler);
          if (handlers.empty()) {
            this.watchPropNum--;
            this.unwatch(attr);
          }
        }
      }
      return this.watchPropNum ? this.target : this.obj;
    },

    init: _$2.emptyFunc,
    watch: _$2.emptyFunc,
    unwatch: _$2.emptyFunc
  });

  function hasListen(obj, attr, handler) {
    var observer = _$2.getOwnProp(obj, config.observerKey);

    return observer ? arguments.length == 1 ? observer.hasListen() : arguments.length == 2 ? observer.hasListen(attr) : observer.hasListen(attr, handler) : false;
  }

  function on(obj, attr, handler) {
    var observer = _$2.getOwnProp(obj, config.observerKey);

    if (!observer) {
      observer = new Observer(obj);
      obj[config.observerKey] = observer;
    }
    return observer.on(attr, handler);
  }

  function un(obj, attr, handler) {
    var observer = _$2.getOwnProp(obj, config.observerKey);

    if (observer) return arguments.length == 2 ? observer.un(attr) : observer.un(attr, handler);
    return obj;
  }

  var expressionIdGenerator = 0;

  var Expression = _$2.dynamicClass({
    constructor: function (target, expr, path) {
      this.id = expressionIdGenerator++;
      this.expr = expr;
      this.handlers = new LinkedList$2();
      this.observers = [];
      this.path = path || _$2.parseExpr(expr);
      this.observeHandlers = this._initObserveHandlers();
      this.obj = target;
      this.target = this._observe(target, 0);
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
      return _$2.map(this.path, function (prop, i) {
        return this._createObserveHandler(i);
      }, this);
    },
    _createObserveHandler: function (idx) {
      var _this3 = this;

      var path = this.path.slice(0, idx + 1),
          rpath = this.path.slice(idx + 1),
          ridx = this.path.length - idx - 1;

      return function (prop, val, oldVal, t, eq) {
        if (ridx) {
          if (eq) return;

          if (val) {
            var mobj = proxy$1.obj(val);

            val = _$2.get(mobj, rpath);
            mobj = _this3._observe(mobj, idx + 1);
            if (proxy$1.isEnable()) {
              // update proxy val
              var i = 0,
                  obj = _this3.obj;

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
            oldVal = _$2.get(oldVal, rpath);
          } else {
            oldVal = undefined;
          }

          var primitive = _$2.isPrimitive(val);
          eq = proxy$1.eq(val, oldVal);

          if (primitive && eq) return;
        }
        _this3.handlers.each(function (handler) {
          return handler(_this3.expr, val, oldVal, _this3.target, eq);
        });
      };
    },
    on: function (handler) {
      this.handlers.push(handler);
      return this;
    },
    un: function (handler) {
      if (!arguments.length) {
        this.handlers.clean();
      } else {
        this.handlers.remove(handler);
      }
      return this;
    },
    hasListen: function (handler) {
      return arguments.length ? this.handlers.contains(handler) : !this.handlers.empty();
    }
  });

  var policies = [];
  var inited = false;

  var core = {
    on: function (obj, expr, handler) {
      var path = _$2.parseExpr(expr);

      obj = proxy$1.obj(obj);
      if (path.length > 1) {
        var map = _$2.getOwnProp(obj, config.expressionKey),
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
      var path = _$2.parseExpr(expr);

      obj = proxy$1.obj(obj);
      if (path.length > 1) {
        var map = _$2.getOwnProp(obj, config.expressionKey),
            exp = map ? map[expr] : undefined;

        if (exp) {
          arguments.length == 2 ? exp.un() : exp.un(handler);
          return exp.hasListen() ? exp.target : exp.obj;
        }
        return obj;
      }
      return arguments.length == 2 ? un(obj, expr) : un(obj, expr, handler);
    },
    hasListen: function (obj, expr, handler) {
      var l = arguments.length;

      obj = proxy$1.obj(obj);
      switch (l) {
        case 1:
          return hasListen(obj);
        case 2:
          if (_$2.isFunc(expr)) return hasListen(obj, expr);
      }

      var path = _$2.parseExpr(expr);

      if (path.length > 1) {
        var map = _$2.getOwnProp(obj, config.expressionKey),
            exp = map ? map[expr] : undefined;

        return exp ? l == 2 ? true : exp.hasListen(handler) : false;
      }
      return hasListen.apply(null, arguments);
    },
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
        if (_$2.each(policies, function (policy) {
          if (policy.checker(config)) {
            _$2.each(policy.policy(config), function (val, key) {
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
    }
  };

  configuration.register({
    es6Proxy: true,
    es6SourceKey: '__ES6_PROXY_SOURCE__',
    es6ProxyKey: '__ES6_PROXY__'
  });

  var hasOwn$3 = Object.prototype.hasOwnProperty;

  core.registerPolicy('ES6Proxy', 1, function (config) {
    return window.Proxy && config.es6Proxy !== false;
  }, function (config) {
    var es6SourceKey = config.es6SourceKey;
    var es6ProxyKey = config.es6ProxyKey;


    proxy$1.enable({
      obj: function (obj) {
        if (obj && hasOwn$3.call(obj, es6SourceKey)) return obj[es6SourceKey];
        return obj;
      },
      eq: function (o1, o2) {
        return o1 === o2 || proxy$1.obj(o1) === proxy$1.obj(o2);
      },
      proxy: function (obj) {
        if (obj && hasOwn$3.call(obj, es6ProxyKey)) return obj[es6ProxyKey] || obj;
        return obj;
      }
    });

    return {
      init: function () {
        this.es6proxy = false;
      },
      watch: function (attr) {
        if (!this.es6proxy) {
          var _proxy = this.objectProxy(),
              obj = this.obj;

          this.target = _proxy;
          obj[es6ProxyKey] = _proxy;
          obj[es6SourceKey] = obj;
          proxy$1.change(obj, _proxy);
          this.es6proxy = true;
        }
      },
      unwatch: function (attr) {},
      objectProxy: function () {
        var _this = this;

        return new Proxy(this.obj, {
          set: function (obj, prop, value) {
            if (_this.listens[prop]) {
              var oldVal = obj[prop];
              obj[prop] = value;
              _this.addChangeRecord(prop, oldVal);
            } else {
              obj[prop] = value;
            }
            return true;
          }
        });
      }
    };
  });

var   hasOwn$4 = Object.prototype.hasOwnProperty;
  var RESERVE_PROPS = 'hasOwnProperty,toString,toLocaleString,isPrototypeOf,propertyIsEnumerable,valueOf'.split(',');
  var RESERVE_ARRAY_PROPS = 'concat,copyWithin,entries,every,fill,filter,find,findIndex,forEach,indexOf,lastIndexOf,length,map,keys,join,pop,push,reverse,reverseRight,some,shift,slice,sort,splice,toSource,unshift'.split(',');
  var VBClassFactory = _$2.dynamicClass({
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

      _$2.each(defProps || [], function (prop) {
        defPropMap[prop] = true;
      });
      for (var prop in defPropMap) {
        if (hasOwn$4.call(defPropMap, prop)) props.push(prop);
      }
      this.defProps = props;
      logger.info('VBProxy default props is: ', props.join(','));
      this.initReserveProps();
    },
    initReserveProps: function () {
      this.reserveProps = RESERVE_PROPS.concat(this.defProps);
      this.reserveArrayProps = this.reserveProps.concat(RESERVE_ARRAY_PROPS);
      this.reservePropMap = _$2.reverseConvert(this.reserveProps);
      this.reserveArrayPropMap = _$2.reverseConvert(this.reserveArrayProps);
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

      _$2.each(props, function (attr) {
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
        if (_$2.isFunc(obj[prop])) {
          funcMap[prop] = true;
          funcs.push(prop);
        }
        props.push(prop);
      }

      if (_$2.isArray(obj)) {
        protoProps = this.reserveArrayProps;
        protoPropMap = this.reserveArrayPropMap;
      } else {
        protoProps = this.reserveProps;
        protoPropMap = this.reservePropMap;
      }
      _$2.each(protoProps, addProp);
      _$2.each(obj, function (val, prop) {
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
      _$2.each(funcs, function (prop) {
        proxy[prop] = _this2.funcProxy(obj[prop], proxy);
      });
      desc.proxy = proxy;

      this.onProxyChange(obj, proxy);
      return desc;
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
      return hasOwn$4.call(obj, this.constBind);
    },
    descriptor: function (obj) {
      var descBind = this.descBind;

      return hasOwn$4.call(obj, descBind) ? obj[descBind] : undefined;
    },
    destroy: function (desc) {
      this.onProxyChange(obj, undefined);
    }
  });

  var ObjectDescriptor = _$2.dynamicClass({
    constructor: function (obj, props, classGenerator) {
      this.classGenerator = classGenerator;
      this.obj = obj;
      this.defines = _$2.reverseConvert(props, function () {
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
        } else if (_$2.isFunc(obj[attr])) {
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

      if (define && define.set) {
        define.set.call(this.proxy, value);
      } else {
        this.obj[attr] = value;
      }
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
    init: function () {
      this.watchers = {};
    },
    watch: function (attr) {
      var watchers = this.watchers;
      if (!watchers[attr]) {
        this.defineProperty(attr, this.obj[attr]);
        watchers[attr] = true;
      }
    },
    unwatch: function (attr) {
      var watchers = this.watchers;
      if (watchers[attr]) {
        this.undefineProperty(attr, this.obj[attr]);
        watchers[attr] = false;
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
    return _$2.assignIf({
      defineProperty: function (attr, value) {
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
            _this.addChangeRecord(attr, oldVal);
          }
        });
      },
      undefineProperty: function (attr, value) {
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
    return _$2.assignIf({
      defineProperty: function (attr, value) {
        var _this2 = this;

        this.target.__defineGetter__(attr, function () {
          return value;
        });
        this.target.__defineSetter__(attr, function (val) {
          var oldVal = value;

          value = val;
          _this2.addChangeRecord(attr, oldVal);
        });
      },
      undefineProperty: function (attr, value) {
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

    var factory = void 0;

    proxy$1.enable({
      obj: function (obj) {
        return obj && factory.obj(obj);
      },
      eq: function (o1, o2) {
        return o1 === o2 || proxy$1.obj(o1) === proxy$1.obj(o2);
      },
      proxy: function (obj) {
        return obj && (factory.proxy(obj) || obj);
      }
    });
    factory = core.vbfactory = new VBClassFactory([config.proxyListenKey, config.observerKey, config.expressionKey, _$2.LinkedList.ListKey].concat(config.defaultProps || []), proxy$1.change);

    return _$2.assignIf({
      defineProperty: function (attr, value) {
        var _this3 = this;

        var obj = this.obj;

        this.target = (factory.descriptor(obj) || factory.create(obj)).defineProperty(attr, {
          set: function (val) {
            var oldVal = obj[attr];
            obj[attr] = val;
            _this3.addChangeRecord(attr, oldVal);
          }
        });
      },
      undefineProperty: function (attr, value) {
        var obj = this.obj,
            desc = factory.descriptor(obj);

        if (desc) desc.defineProperty(attr, {
          value: value
        });
      }
    }, policy);
  });

  var observer = _$2.assign({
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
  }, core);

  var observer$1 = _$2.assignIf(_$2.create(observer), {
    observer: observer
  }, _$2);

  var config$1 = new _.Configuration();

  var Binding = _.dynamicClass({
    statics: {
      commentCfg: 'generateComments'
    },
    constructor: function (cfg) {
      this._scope = observer$1.obj(cfg.scope);
      this.el = cfg.el;
    },
    scope: function () {
      var scope = this._scope;
      return observer$1.proxy(scope) || scope;
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
      return observer$1.proxy(scope) || scope;
    },
    exprScope: function (expr) {
      return this.propScope(_.parseExpr(expr)[0]);
    },
    observe: function (expr, callback) {
      observer$1.on(this.exprScope(expr), expr, callback);
    },
    unobserve: function (expr, callback) {
      observer$1.un(this.exprScope(expr), expr, callback);
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
  config$1.register(Binding.commentCfg, true);

  var log = new _.Logger('tpl', 'debug');

  var translates = {};
  var translate = {
    register: function (name, desc) {
      if (translates[name]) throw Error('Translate[' + name + '] is existing');
      if (_.isFunc(desc)) desc = {
        transform: desc
      };
      desc.type = desc.type || 'normal';
      translates[name] = desc;
      log.debug('register Translate[' + desc.type + ':' + name + ']');
    },
    get: function (name) {
      return translates[name];
    },
    apply: function (name, data, args, restore) {
      var f = translates[name],
          type = f && f.type,
          fn = f && (restore ? f.restore : f.transform);

      if (!fn) {
        log.warn('Translate[' + name + '].' + (restore ? 'Restore' : 'Transform') + ' is undefined');
      } else {
        if (_.isFunc(args)) args = args();
        data = fn.apply(f, [data].concat(args));
      }
      return {
        stop: type == 'event' && data === false,
        data: data,
        replaceData: type !== 'event'
      };
    },
    unapply: function (name, data, args) {
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
      transform: function (value, plural) {
        if (plural && _.isString(value)) return _.plural(value);
        return value;
      },
      restore: function (value) {
        return _.singular(value);
      }
    },
    singular: {
      transform: function (value, plural) {
        if (plural && _.isString(value)) return _.singular(value);
        return value;
      },
      restore: function (value) {
        return _.plural(value);
      }
    },
    unit: {
      transform: function (value, unit, format, plural) {
        if (plural !== false && value != 1 && value != 0) {
          unit = _.plural(unit);
        }
        if (format) return format ? _.format(format, value, unit) : value + unit;
      },
      restore: function (value, unit, format) {
        var reg = new RegExp('(' + unit + '|' + _.plural(unit));
        return _.trim(value.replace(reg, ''));
      }
    },
    format: {
      transform: function (value, format) {
        return _.format(format, value);
      }
    }
  };
  _.each(nomalTranslates, function (f, name) {
    translate.register(name, f);
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
        rs = (apply !== false ? translate.apply : translate.unapply)(f.name, data, _args);
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

  var textContent = typeof document.createElement('div').textContent == 'string' ? 'textContent' : 'innerText';

  function firstEl(el) {
    return _.isArrayLike(el) ? el[0] : el;
  }

  function lastEl(el) {
    return _.isArrayLike(el) ? el[el.length - 1] : el;
  }

  function apply$1(coll, callback) {
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

  function hasListen$1(el, type, handler) {
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

  var expressionArgs = ['$el'];

  var Text = _.dynamicClass({
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
    independent: false,
    block: false,
    priority: 5,
    constructor: function (cfg) {
      this['super'](arguments);
      this.expr = cfg.expression;
      this.attr = cfg.attr;
      this.children = cfg.children;
      this.domParser = cfg.domParser;
      if (config$1.get(Binding.commentCfg)) {
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
      this.directives = cfg.directives;
      this.children = cfg.children;
      this.directiveCount = cfg.directives.length;
      this.bindedCount = 0;
      this.bindedChildren = false;
      this._bind = this._bind.bind(this);
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

  config$1.register('directiveReg', /^tpl-/, [RegExp]);

  var DirectiveParser = _.dynamicClass({
    constructor: function () {
      this.reg = config$1.get('directiveReg');
    },
    isDirective: function (attr) {
      return this.reg.test(attr);
    },
    getDirective: function (attr) {
      return Directive.getDirective(attr.replace(this.reg, ''));
    }
  });

  var Template$1 = _.dynamicClass({
    constructor: function (el, bindings) {
      this.el = el;
      this.bindings = bindings;
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
      if (this.binded) _.each(this.bindings, function (bind) {
        bind.unbind();
        bind.destroy();
      });
      dom.remove(this.el);
      this.bindings = undefined;
      this.el = undefined;
    }
  });

  config$1.register('directiveParser', new DirectiveParser(), [DirectiveParser]);
  config$1.register('TextParser', TextParser, TextParser, true);

  var TEXT = 1;
  var DIRECTIVE = 2;
  var DIRECTIVE_GROUP = 3;
  var DomParser = _.dynamicClass({
    constructor: function (el, clone) {
      this.el = this.parseEl(el, clone);
      this.directiveParser = config$1.get('directiveParser');
      this.TextParser = config$1.get('TextParser');
      this.parse();
    },
    complie: function (scope) {
      var el = dom.cloneNode(this.el),
          df = document.createDocumentFragment();
      dom.append(df, el);
      return new Template$1(_.map(df.childNodes, function (n) {
        return n;
      }), this.parseBindings(this.bindings, scope, this.parseEls(el)));
    },
    parseBindings: function (descs, scope, els) {
      var _this = this;

      return _.map(descs, function (desc) {
        var type = desc.type,
            cfg = {
          el: els[desc.index],
          scope: scope
        };

        if (type === TEXT) {
          cfg.expression = desc.expression;
          return new Text(cfg);
        }

        var Const = void 0;
        if (type === DIRECTIVE) {
          Const = desc.directive;
          cfg.expression = desc.expression;
          cfg.attr = desc.attr;
          cfg.domParser = desc.domParser;
          cfg.independent = desc.independent;
        } else {
          Const = DirectiveGroup;
          cfg.directives = _.map(desc.directives, function (desc) {
            return new desc.directive({
              el: cfg.el,
              scope: scope,
              expression: desc.expression,
              attr: desc.attr
            });
          });
        }
        cfg.block = desc.block;
        cfg.children = desc.children ? _this.parseBindings(desc.children || [], scope, els) : undefined;
        return new Const(cfg);
      });
    },
    parseEls: function (el) {
      var index = 0,
          elStatus = this.elStatus;
      return this.eachDom(el, [], function (el, els) {
        els.push(el);
        return elStatus[index++] && els;
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
          elStatus.push(marked);
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
      return content ? this.insertText(content, before) : undefined;
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
        desc.data = observer$1.proxy(item);
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
        if (!desc.scope) {
          var idle = idles.pop();

          if (!idle) {
            desc.scope = _this.createScope(parentScope, desc.data, desc.index);
            desc.tpl = domParser.complie(desc.scope);
          } else {
            desc.scope = idle.scope;
            desc.tpl = idle.tpl;
            _this.initScope(desc.scope, desc.data, desc.index);
          }
        }
        dom.append(fragment, desc.tpl.el);
      });
      tpl.before(fragment, end);
      tpl.each(descs, function (desc) {
        return desc.tpl.bind();
      });
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
      if (!isCreate) scope = observer$1.proxy(scope);
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

  var regHump = /(^[a-z])|([_-][a-zA-Z])/g;

  function _hump(k) {
    if (k[0] == '_' || k[0] == '-') k = k[1];
    return k.toUpperCase();
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
  });

var util = Object.freeze({
    hump: hump,
    YieId: YieId
  });

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
        dom.on(this.el, this.event, this.onChange);
        this['super']();
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
    config: config$1,
    init: function (cfg) {
      observer$1.init(cfg);
      config$1.config(cfg);
    }
  }, dom, util);

  function assign(target, source, alias) {
    observer$1.each(source, function (v, k) {
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
    observer: observer$1
  });
  assign(_.assign(tpl$1, _), observer$1.observer, {
    on: 'observe',
    un: 'unobserve',
    hasListen: 'isObserved'
  });

  return tpl$1;

}));
//# sourceMappingURL=tpl.all.js.map