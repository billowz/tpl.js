const _ = require('lodash'),
  observer = require('observer');

export class AbstractBinding {
  constructor(tpl) {
    this.tpl = tpl;
    this.scope = tpl.scope;
    this.ancestorObservers = {};
  }

  destroy() {}


  _createObserveAncestorHandler(ancestors, idx, expr, callback) {
    let fn = () => {
      callback.apply(this, arguments);

      for (let i = ancestors.length - 1; i >= idx; i--) {
        observer.un(ancestors[i], fn);
        ancestors.pop();
      }
    }
    return fn;
  }

  _has(scope, path) {}

  observe(expr, callback) {
    let tpl = this.tpl,
      hierarchy = [this.scope], l;

    while (!_.has(tpl.scope, expr)) {
      tpl = tpl.parent;
      if (!tpl) {
        break;
      }
      hierarchy.push(tpl.scope);
    }
    observer.on(hierarchy.shift(), expr, callback);

    if ( (l = hierarchy.length) ) {
      let aos = this.ancestorObservers[expr],
        fns = [];
      if (!aos) {
        aos = this.ancestorObservers[expr] = {
          ancestors: hierarchy.map((h) => {
            return observer.obj(h);
          }),
          callbacks: [],
          fns: []
        };
      }
      aos.callbacks.push(callback);
      aos.fns.push(fns);
      for (let i = 0; i < l; i++) {
        observer.on(hierarchy[i], expr,
          (fns[i] = this._createObserveAncestorHandler(hierarchy, i, expr, callback)));
      }
    }
  }

  unobserve(expr, callback) {
    observer.un(this.scope, expr, callback);
    let aos = this.ancestorObservers[expr];
    if (aos) {
      let i = aos.callbacks.indexOf(callback),
        fns;
      if (i != -1) {
        let tpl = this.tpl;
        fns = aos.fns[i];
        for (i = 0; i < fns.length; i++) {
          tpl = tpl.parent;
          observer.un(tpl.scope, fns[i]);
        }
      }
    }
  }

  get2(path) {
    let tpl = this.tpl,
      scope = this.scope;

    while (!_.has(scope, path)) {
      tpl = tpl.parent;
      if (!tpl)
        return {
          scope: undefined,
          data: undefined
        }
      scope = tpl.scope;
    }
    return {
      scope: scope,
      data: _.get(scope, path)
    }
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

