const _ = require('../util'),
  dom = require('../dom'),
  expression = require('../expression'),
  Binding = require('./binding'),
  expressionArgs = ['$el'];

export class Text extends Binding {
  constructor(el, tpl, expr) {
    super(tpl, expr);
    this.el = el;
    this.observeHandler = _.bind.call(this.observeHandler, this);
    this.expression = expression.parse(this.expr, expressionArgs);

    if (Binding.generateComments) {
      this.comment = document.createComment('Text Binding ' + this.expr);
      dom.before(this.comment, this.el);
    }
  }

  value() {
    let scope = this.scope();

    return this.filter(this.expression.execute.call(this, scope, this.el));
  }

  bind() {
    super.bind();
    let identities = this.expression.identities;
    for (let i = 0, l = identities.length; i < l; i++)
      this.observe(identities[i], this.observeHandler);

    this.update(this.value());
  }

  unbind() {
    super.unbind();
    let identities = this.expression.identities;
    for (let i = 0, l = identities.length; i < l; i++)
      this.unobserve(identities[i], this.observeHandler);
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
    if (val !== dom.text(this.el))
      dom.text(this.el, val)
  }
}
