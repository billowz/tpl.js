const AbstractBinding = require('./abstractBinding'),
  exprReg = /((?:'[^']*')*(?:(?:[^\|']+(?:'[^']*')*[^\|']*)+|[^\|]+))|^$/g,
  filterReg = /^$/g

class Binding extends AbstractBinding {
  constructor(tpl, expr) {
    super(tpl);
    this.expr = expr;
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

module.exports = Binding;
