const _ = require('./util'),
  dom = require('./dom'),
  {Binding} = require('./binding'),
  expression = require('./expression'),
  expressionArgs = ['$el'];

class Text extends Binding {
  constructor(el, tpl, expr) {
    super(tpl, expr);
    this.el = el;
    this.observeHandler = _.bind.call(this.observeHandler, this);
    this.expression = expression.parse(this.expr, expressionArgs);
  }

  value() {
    let scope = this.scope();

    return this.filter(this.expression.execute.call(scope, scope, this.el));
  }

  bind() {
    if (Binding.generateComments && !this.comment) {
      this.comment = document.createComment('Text Binding ' + this.expr);
      dom.before(this.comment, this.el);
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
      this.update(this.filter(val));
    } else {
      this.update(this.value());
    }
  }

  update(val) {
    if (val === undefined || val === null) {
      val = '';
    }
    dom.text(this.el, val)
    this.el.data = val;
  }
}
module.exports = Text;
