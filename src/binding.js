const _ = require('lodash'),
  observer = require('observer'),
  expression = require('./expression');

export class AbstractBinding {
  constructor(tpl) {
    this.tpl = tpl;
    this.scope = tpl.scope;
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

    this.expr = expr;
    let pipes = expr.match(exprReg);
    this.expression = expression.parse(pipes.shift());

    this.filterExprs = pipes;
    console.log(`${this.className}: "${this.expr}" | ${pipes.join(' & ')}`, this.expression);
    this.filters = [];
  }

  realValue(expr, val) {
    if (arguments.length == 2) {
      return _.set(this.scope, expr, val);
    } else {
      let scope = this.scope,
        tpl = this.tpl;
      while (!_.has(scope, expr)) {
        tpl = tpl.parent;
        if (!tpl) return undefined;
        scope = tpl.scope;
      }
      return _.get(scope, expr);
    }
  }

  value(expr, val) {
    if (arguments.length == 2) {
      return this.realValue(expr, this.unapplyFilter(val));
    } else {
      return this.applyFilter(this.realValue(expr));
    }
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

  observe(expr, callback) {
    return (this.scope = observer.on(this.scope, expr, callback));
  }

  unobserve(expr, callback) {
    return (this.scope = observer.un(this.scope, expr, callback));
  }

}
Binding.generateComments = true;

