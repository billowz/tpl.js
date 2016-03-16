let observer = require('observer')

export class ScopeData {
  constructor(scope, data) {
    this.scope = scope;
    this.data = data;
  }
}

class YieId {
  constructor() {
    this._doned = false;
    this._thens = [];
  }
  then(callback) {
    this._thens.push(callback);
  }
  done() {
    if (!this._doned) {
      let thens = this._thens;
      for (let i = 0, l = thens.length; i < l; i++) {
        thens[i]();
      }
      this._doned = true;
    }
  }
  isDone() {
    return this._doned;
  }
}

class ArrayIterator {
  constructor(array, point) {
    this.array = array;
    this.index = point || 0;
  }
  hasNext() {
    return this.index < this.array.length;
  }
  next() {
    return this.array[this.index++];
  }
}

let hasOwn = Object.prototype.hasOwnProperty,
  trimReg = /^\s+|\s+$/g,
  strFirstLetterReg = /^[a-zA-Z]/,
  strHumpReg = /(^[a-zA-Z])|(_[a-zA-Z])/g;

let util = {
  ScopeData: ScopeData,
  ArrayIterator: ArrayIterator,
  YieId: YieId,
  Map: observer.Map,
  bind: observer.util.bind,
  indexOf: observer.util.indexOf,
  prototypeOf: Object.getPrototypeOf,
  setPrototypeOf: Object.setPrototypeOf,
  create: Object.create,
  requestAnimationFrame: observer.util.requestAnimationFrame,
  cancelAnimationFrame: observer.util.cancelAnimationFrame,
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
  hasProp(obj, prop) {
    return hasOwn.call(observer.obj(obj), prop);
  },
  keys: Object.keys || function keys(obj) {
      let arr = [];
      for (let key in obj) {
        arr.push(key);
      }
      return arr;
  },
  eachKeys(obj, callback) {
    obj = observer.obj(obj);
    for (let key in obj) {
      if (hasOwn.call(obj, key))
        if (callback(key) === false)
          return false;
    }
    return true;
  },
  eachObj(obj, callback) {
    obj = observer.obj(obj);
    for (let key in obj) {
      if (hasOwn.call(obj, key))
        if (callback(obj[key], key) === false)
          return false;
    }
    return true;
  },
  trim(str) {
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
