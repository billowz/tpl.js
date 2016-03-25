let observer = require('observer')

class YieId {
  constructor() {
    this.doned = false;
    this.thens = [];
  }
  then(callback) {
    if (this.doned)
      callback();
    else
      this.thens.push(callback);
  }
  done() {
    if (!this.doned) {
      let thens = this.thens;
      for (let i = 0, l = thens.length; i < l; i++) {
        thens[i]();
      }
      this.doned = true;
    }
  }
  isDone() {
    return this.doned;
  }
}

let hasOwn = Object.prototype.hasOwnProperty,
  trimReg = /^\s+|\s+$/g,
  strFirstLetterReg = /^[a-zA-Z]/,
  strHumpReg = /(^[a-zA-Z])|(_[a-zA-Z])/g;

let util = {
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
      let to = Object(target),
        nextSource, key;
      for (let i = 1, l = arguments.length; i < l; i++) {
        nextSource = Object(arguments[i]);
        for (key in nextSource) {
          if (hasOwn.call(nextSource, key))
            to[key] = nextSource[key];
        }
      }
      return to;
  },
  assignIf(target) {
    let to = Object(target),
      nextSource, key;
    for (let i = 1, l = arguments.length; i < l; i++) {
      nextSource = Object(arguments[i]);
      for (key in nextSource) {
        if (hasOwn.call(nextSource, key) && !hasOwn.call(to, key))
          to[key] = nextSource[key];
      }
    }
    return to;
  },
  create: Object.create || (function create() {
      function Temp() {
      }
      return function(O, props) {
        if (typeof O != 'object')
          throw TypeError('Object prototype may only be an Object or null');

        Temp.prototype = O;
        var obj = new Temp();
        Temp.prototype = undefined;
        if (props) {
          for (let prop in props) {
            if (hasOwn.call(props, prop))
              obj[prop] = props[prop];
          }
        }
        return obj;
      };
    })(),
  requestAnimationFrame: observer.util.requestAnimationFrame,
  cancelAnimationFrame: observer.util.cancelAnimationFrame,
  requestTimeoutFrame: observer.util.requestTimeoutFrame,
  cancelTimeoutFrame: observer.util.cancelTimeoutFrame,
  parseExpr: observer.util.parseExpr,
  get: observer.util.get,
  has(object, path) {
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
  set(object, path, value) {
    if (object) {
      path = util.parseExpr(path);
      let obj = object,
        attr = path[0];
      for (let i = 0, l = path.length - 1; i < l; i++) {
        if (!obj[attr])
          obj = obj[attr] = {};
        attr = path[i + 1];
      }
      obj[attr] = value;
    }
    return object;
  },
  hasOwnProp(obj, prop) {
    return hasOwn.call(observer.obj(obj), prop);
  },
  keys: Object.keys || function keys(obj, own) {
      let arr = [];
      for (let key in obj) {
        if (own === false || hasOwn.call(obj, key))
          arr.push(key);
      }
      return arr;
  },
  eachKeys(obj, callback, own) {
    obj = observer.obj(obj);
    for (let key in obj) {
      if (own === false || hasOwn.call(obj, key))
        if (callback(key) === false)
          return false;
    }
    return true;
  },
  eachObj(obj, callback, own) {
    obj = observer.obj(obj);
    for (let key in obj) {
      if (own === false || hasOwn.call(obj, key))
        if (callback(obj[key], key) === false)
          return false;
    }
    return true;
  },
  each(arr, callback) {
    for (let i = 0, l = arr.length; i < l; i++) {
      callback(arr[i], i);
    }
  },
  trim: ''.trim ? function trim(str) {
    return str.trim();
  } : function trim(str) {
    return str.replace(trimReg, '');
  },
  capitalize(str) {
    return str;
  },
  upperFirst(str) {
    return str.replace(strFirstLetterReg, strUpperFirstProcessor);
  },
  hump(str) {
    return str.replace(strHumpReg, strHumpProcessor);
  },
  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
}
function strUpperFirstProcessor(k) {
  return k.toUpperCase();
}
function strHumpProcessor(k) {
  if (k[0] == '_')
    return k[1].toUpperCase();
  return k.toUpperCase();
}
module.exports = util;

if (!Object.create)
  Object.create = util.create
