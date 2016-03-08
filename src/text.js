const _ = require('lodash'),
  $ = require('jquery'),
  {Binding} = require('./binding');

class Text extends Binding {
  constructor(el, tpl, expr) {
    super(tpl, expr);
    this.el = el;
    this.observeHandler = this.observeHandler.bind(this);
  }

  bind() {
    if (Binding.generateComments && !this.comment) {
      this.comment = $(document.createComment('Text Binding ' + this.expr));
      this.comment.insertBefore(this.el);
    }
    this.observe(this.expr, this.observeHandler);
    this.update(this.value(this.expr));
  }

  unbind() {
    this.unobserve(this.expr, this.observeHandler);
  }

  observeHandler(attr, val) {
    this.update(val);
  }

  update(val) {
    if (val === undefined || val === null) {
      val = '';
    }
    this.el.data = val;
  }
}
module.exports = Text;
