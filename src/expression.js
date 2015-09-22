const _ = require('lodash');

class Expression {
  constructor(bind, expression) {
    this.bind = bind;
    this.expression = expression;
  }
  getValue() {
    return _.get(this.bind, this.expression);
  }
  observe(callback) {
    return observer.observe(this.bind, this.expression, callback);
  }
  unobserve(callback) {
    return observer.unobserve(this.bind, this.expression, callback);
  }
}
module.exports = Expression;
