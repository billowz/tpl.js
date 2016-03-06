const _ = require('lodash');

export class AbstractExpression {
  constructor(bind, expr) {
    this.bind = bind;
    this.expr = expr;
  }
  getValue() {
    throw 'Abstract Method[' + this.constructor.name + '.getValue]';
  }
}

export class EventExpression extends AbstractExpression {
  getValue() {
    return _.get(this.bind, this.expr);
  }
}

export class AbstractObserveExpression extends AbstractExpression {
  observe(callback) {
    throw 'Abstract Method[' + this.constructor.name + '.observe]';
  }
  unobserve(callback) {
    throw 'Abstract Method[' + this.constructor.name + '.unobserve]';
  }
}

export class ObserveExpression extends AbstractObserveExpression {
  getValue() {
    return _.get(this.bind, this.expr);
  }
  setValue(val) {
    _.set(this.bind, this.expr, val);
  }
  observe(callback) {
    this.bind = observer.on(this.bind, this.expr, callback);
    return this.bind;
  }
  unobserve(callback) {
    this.bind = observer.un(this.bind, this.expr, callback);
    return this.bind;
  }
}

export class EachExpression extends AbstractObserveExpression {
  constructor(bind, expr) {
    super(bind, expr)
  }
  getValue() {
    return _.get(this.bind, this.expr);
  }
  observe(callback) {
    this.bind = observer.on(this.bind, this.expr, callback);
    return this.bind;
  }
  unobserve(callback) {
    this.bind = observer.un(this.bind, this.expr, callback);
    return this.bind;
  }
}
