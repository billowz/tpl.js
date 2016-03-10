const _ = require('lodash'),
  observer = require('observer');

export function ScopeData(scope, data) {
  this.scope = scope;
  this.data = data;
}

export class AbstractBinding {
  constructor(tpl) {
    this.tpl = tpl;
    this.scope = tpl.scope;
    this.ancestorObservers = {};
    this._ancestorObserveHandler = this._ancestorObserveHandler.bind(this);
  }

  destroy() {}


  observe(expr, callback) {
    let tpl = this.tpl,
      ancestors,
      aos = this.ancestorObservers[expr],
      l, i;

    observer.on(this.scope, expr, callback);

    if (aos) {
      ancestors = aos.ancestors;
    } else {
      ancestors = [];
      while (!_.has(tpl.scope, expr)) {
        tpl = tpl.parent;
        if (!tpl) {
          break;
        }
        ancestors.push(observer.obj(tpl.scope));
      }
    }

    if ( (l = ancestors.length) ) {
      if (!aos) {
        aos = this.ancestorObservers[expr] = {
          ancestors: ancestors,
          callbacks: [callback]
        };
        for (i = 0; i < l; i++) {
          observer.on(ancestors[i], expr, this._ancestorObserveHandler);
        }
      } else {
        aos.callbacks.push(callback);
      }
      for (i = 0; i < l; i++) {
        observer.on(ancestors[i], expr, function() {
          callback.apply(this, arguments);
        });
      }
    }
  }

  _ancestorObserveHandler(expr, val, oldVal, scope) {
    scope = observer.obj(scope);

    let aos = this.ancestorObservers[expr],
      ancestors = aos.ancestors,
      callbacks = aos.callbacks,
      idx = aos.ancestors.indexOf(scope),
      i, j;

    for (i = ancestors.length - 1; i > idx; i--) {
      scope = ancestors.pop();
      observer.un(scope, expr, this._ancestorObserveHandler);
      for (j = callbacks.length - 1; j >= 0; j--) {
        observer.un(scope, expr, callbacks[j]);
      }
    }
    if (!ancestors.length) {
      this.ancestorObservers[expr] = undefined;
    }
  }

  unobserve(expr, callback) {

    observer.un(this.scope, expr, callback);

    let aos = this.ancestorObservers[expr];

    if (aos) {
      let ancestors = aos.ancestors,
        callbacks = aos.callbacks,
        idx = callbacks.indexOf(callback), l;

      if (idx) {
        callbacks.splice(idx, 1);
        l = callbacks.length;
        for (let i = ancestors.length - 1; i >= idx; i--) {
          observer.un(scope, expr, callback);

          if (!l) {
            observer.un(scope, expr, this._ancestorObserveHandler);
          }
        }
        if (!l) {
          this.ancestorObservers[expr] = undefined;
        }
      }
    }
  }

  get2(path) {
    let tpl = this.tpl,
      scope = this.scope, ret;

    while (!_.has(scope, path)) {
      tpl = tpl.parent;
      if (!tpl) {
        ret = new ScopeData(scope, undefined);
        return ret;
      }
      scope = tpl.scope;
    }
    ret = new ScopeData(scope, _.get(scope, path));
    return ret;
  }

  get(path) {
    let tpl = this.tpl,
      scope = this.scope;

    while (!_.has(scope, path)) {
      tpl = tpl.parent;
      if (!tpl)
        return undefined;
      scope = tpl.scope;
    }
    return _.get(scope, path);
  }

  set(path, value) {
    _.set(this.scope, path, value);
  }

  bind() {
    throw 'Abstract Method [' + this.constructor.name + '.bind]';
  }

  unbind() {
    throw 'Abstract Method [' + this.constructor.name + '.unbind]';
  }
}

const exprReg = /((?:'[^']*')*(?:(?:[^\|']+(?:'[^']*')*[^\|']*)+|[^\|]+))|^$/g;
const filterReg = /^$/g

export class Binding extends AbstractBinding {
  constructor(tpl, expr) {
    super(tpl);

    this.fullExpr = expr;
    let pipes = expr.match(exprReg);
    this.expr = pipes.shift();

    this.filterExprs = pipes;
    this.filters = [];
  }

  applyFilter(val) {
    for (let i = 0; i < this.filters.length; i++) {
      val = this.filters[i].apply(val);
    }
    return val;
  }

  unapplyFilter(val) {
    for (let i = 0; i < this.filters.length; i++) {
      val = this.filters[i].unapply(val);
    }
    return val;
  }

}
Binding.generateComments = true;

