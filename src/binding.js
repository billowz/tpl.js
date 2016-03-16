const _ = require('./util'),
  observer = require('observer');

export class AbstractBinding {
  constructor(tpl) {
    this.tpl = tpl;
    this.scope = tpl.scope;
    this.binded = false;
  }

  update() {}

  destroy() {}

  observe(expr, callback) {
    observer.on(this.scope, expr, callback);
  }

  unobserve(expr, callback) {
    observer.un(this.scope, expr, callback);
  }

  get(expr) {
    return _.get(this.scope, expr);
  }

  has(scope, expr) {
    return _.has(this.scope, expr);
  }

  set(expr, value) {
    _.set(this.scope, expr, value);
  }

  bind() {
    if (this.binded)
      return false;
    this.binded = true;
    return true;
  }

  unbind() {
    if (!this.binded)
      return false;
    this.binded = false;
    return true;
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

