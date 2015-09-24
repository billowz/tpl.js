const _ = require('lodash');

class Expression {
  constructor(bind, expression) {
    this.bind = bind;
    this.expression = expression;
  }
  getValue() {
    return _.get(this.bind, this.expression);
  }
  setValue(val) {
    _.set(this.bind, this.expression, val);
  }
  observe(callback) {
    this.bind = observer.observe(this.bind, this.expression, callback);
    return this.bind;
  }
  unobserve(callback) {
    this.bind = observer.unobserve(this.bind, this.expression, callback);
    return this.bind;
  }
}
module.exports = Expression;
