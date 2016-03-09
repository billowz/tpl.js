const _ = require('lodash'),
  $ = require('jquery'),
  {Binding} = require('./binding'),
  expression = require('./expression'),
  expressionArgs = ['$scope', '$el'];

class Text extends Binding {
  constructor(el, tpl, expr) {
    super(tpl, expr);
    this.el = el;
    this.observeHandler = this.observeHandler.bind(this);
    this.expression = expression.parse(this.expr, expressionArgs);
  }

  value() {
    return this.applyFilter(this.expression.execute.call(this.scope, this.scope, this.el));
  }

  bind() {
    if (Binding.generateComments && !this.comment) {
      this.comment = $(document.createComment('Text Binding ' + this.expr));
      this.comment.insertBefore(this.el);
    }
    this.expression.identities.forEach((ident) => {
      this.observe(ident, this.observeHandler);
    });
    this.update(this.value());
  }

  unbind() {
    this.expression.identities.forEach((ident) => {
      this.unobserve(ident, this.observeHandler);
    });
  }

  observeHandler(attr, val) {
    if (this.expression.simplePath) {
      this.update(this.applyFilter(val));
    } else {
      this.update(this.value());
    }
  }

  update(val) {
    if (val === undefined || val === null) {
      val = '';
    }
    this.el.data = val;
  }
}
module.exports = Text;
