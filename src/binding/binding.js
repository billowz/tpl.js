const AbstractBinding = require('./abstractBinding'),
  exprReg = /((?:'[^']*')*(?:(?:[^\|']+(?:'[^']*')*[^\|']*)+|[^\|]+))|^$/g,
  filterReg = /^$/g

class Binding extends AbstractBinding {
  constructor(tpl, expr) {
    super(tpl);
    this.expr = expr;
  }
}
Binding.generateComments = true;

module.exports = Binding;
