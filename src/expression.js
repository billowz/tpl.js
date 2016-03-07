const _ = require('lodash'),
  observer = require('observer');

export class Expression {
  constructor(scope, expr, handler) {
    this.scope = scope;
    this.expr = expr;
    this.filters = [];
    this.handler = handler;
    this.__listen = this.__listen.bind(this);
  }

  realValue() {
    return _.get(this.scope, this.expr);
  }

  setRealValue(val) {
    _.set(this.scope, this.expr, val);
  }

  value() {
    let val = _.get(this.scope, this.expr);
    for (let i = 0; i < this.filters.length; i++) {
      val = this.filters[i].apply(val);
    }
    return val;
  }

  setValue(val) {
    for (let i = 0; i < this.filters.length; i++) {
      val = this.filters[i].unapply(val);
    }
    _.set(this.scope, this.expr, val);
  }

  observe() {
    this.scope = observer.on(this.scope, this.expr, this.__listen);
    return this.scope;
  }

  unobserve() {
    this.scope = observer.un(this.scope, this.expr, this.__listen);
    return this.scope;
  }

  __listen(expr, val) {
    for (let i = 0; i < this.filters.length; i++) {
      val = this.filters[i].apply(val);
    }
    this.handler(val);
  }
}
