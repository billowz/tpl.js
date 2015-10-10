const _ = require('lodash'),
  $ = require('jquery'),
  Binding = require('./binding'),
  {ObserveExpression} = require('./expression');

class Text extends Binding {
  constructor(el, tpl, expr) {
    super(tpl);
    this.el = el;
    this.expr = expr;
    this.expression = new ObserveExpression(this.scope, expr);
    this.update = this.update.bind(this);
  }

  bind() {
    if (Binding.genComment && !this.comment) {
      this.comment = $(document.createComment('Text Binding ' + this.expr));
      this.comment.insertBefore(this.el);
    }
    this.scope = this.expression.observe(this.update);
    this.update();
  }

  unbind() {
    this.scope = this.expression.unobserve(this.update);
  }

  update() {
    let val = this.expression.getValue();
    if (val === undefined || val === null) {
      val = '';
    }
    this.el.data = val;
  }
}
module.exports = Text;
