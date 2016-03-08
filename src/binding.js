const _ = require('lodash'),
  observer = require('observer');

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

    this.fullExpr = expr;
    let pipes = expr.match(exprReg);
    this.expr = pipes.shift();
    this.filterExprs = pipes;
    console.log(this.expr, this.filterExprs);
    this.filters = this.filterExprs.map(exp => {
      let pp = exp.match(filterReg);
      if (!pp) {
        return null;
      }
      return {
        name: pp.shift(),
        args: pp
      }
    }).filter(f => {
      return f
      });
    }

    realValue(expr, val) {
      if (arguments.length == 2) {
        return _.set(this.scope, expr, val);
      } else {
        return _.get(this.scope, expr);
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

    value(expr, val) {
      if (arguments.length == 2) {
        return _.set(this.scope, this.expr, this.unapplyFilter(val));
      } else {
        return this.applyFilter(_.get(this.scope, this.expr));
      }
    }

    observe(expr, callback) {
      return (this.scope = observer.on(this.scope, expr, callback));
    }

    unobserve(expr, callback) {
      return (this.scope = observer.un(this.scope, expr, callback));
    }

  }

  Binding.generateComments = true;

