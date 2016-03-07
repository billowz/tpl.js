const _ = require('lodash'),
  $ = require('jquery'),
  Binding = require('./binding'),
  {Expression} = require('./expression');

class Text extends Binding {
  constructor(el, tpl, expr) {
    super(tpl);
    this.el = el;
    this.expr = expr;
    this.update = this.update.bind(this);
    this.expression = new Expression(this.scope, expr, this.update);
  }

  bind() {
    if (Binding.genComment && !this.comment) {
      this.comment = $(document.createComment('Text Binding ' + this.expr));
      this.comment.insertBefore(this.el);
    }
    this.scope = this.expression.observe(this.update);
    this.update(this.expression.value());
  }

  unbind() {
    this.scope = this.expression.unobserve();
  }

  update(val) {
    if (val === undefined || val === null) {
      val = '';
    }
    this.el.data = val;
  }
}
module.exports = Text;
