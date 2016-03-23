const _ = require('./util'),
  observer = require('observer');

export class AbstractBinding {
  constructor(tpl) {
    this.tpl = tpl;
    this.binded = false;
  }

  update() {}

  destroy() {}

  scope() {
    return this.tpl.scope;
  }

  realScope() {
    return observer.obj(this.tpl.scope);
  }

  propScope(prop) {
    let scope = this.tpl.scope,
      parent = scope.$parent;

    if (!parent)
      return scope;

    while (parent && !_.hasOwnProp(scope, prop)) {
      scope = parent;
      parent = scope.$parent;
    }
    return observer.proxy.proxy(scope) || scope;
  }

  exprScope(expr) {
    let scope = this.tpl.scope,
      parent = scope.$parent,
      prop;

    if (!parent)
      return scope;

    prop = _.parseExpr(expr)[0];
    while (parent && !_.hasOwnProp(scope, prop)) {
      scope = parent;
      parent = scope.$parent;
    }
    return observer.proxy.proxy(scope) || scope;
  }

  observe(expr, callback) {
    observer.on(this.exprScope(expr), expr, callback);
  }

  unobserve(expr, callback) {
    observer.un(this.exprScope(expr), expr, callback);
  }

  get(expr) {
    return _.get(this.tpl.scope, expr);
  }

  has(expr) {
    return _.has(this.tpl.scope, expr);
  }

  set(expr, value) {
    _.set(this.tpl.scope, expr, value);
  }

  bind() {}

  unbind() {}
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

  filter(val) {
    for (let i = 0; i < this.filters.length; i++) {
      val = this.filters[i].apply(val);
    }
    return val;
  }

  unfilter(val) {
    for (let i = 0; i < this.filters.length; i++) {
      val = this.filters[i].unapply(val);
    }
    return val;
  }
}
Binding.generateComments = true;

