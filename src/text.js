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

    return this.filter(this.expression.execute.call(this, scope, this.el));
  }

  bind() {
    if (!super.bind())
      return false;

    if (Binding.generateComments && !this.comment) {
      this.comment = document.createComment('Text Binding ' + this.expr);
      dom.before(this.comment, this.el);
    }

    let identities = this.expression.identities;
    for (let i = 0, l = identities.length; i < l; i++)
      this.observe(identities[i], this.observeHandler);

    return true;
  }

  unbind() {
    if (!super.unbind())
      return false;

    let identities = this.expression.identities;
    for (let i = 0, l = identities.length; i < l; i++)
      this.unobserve(identities[i], this.observeHandler);

    return true;
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
