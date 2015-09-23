const _ = require('lodash'),
  Directive = require('./directive'),
  Expression = require('./expression'),
  {AbstractDirective} = Directive;

export class ExprDirective extends AbstractDirective {
  constructor(el, bind, expression) {
    super(el, bind, expression);
    this.expression = new Expression(bind, expression);
    this.update = this.update.bind(this);
  }

  bind() {
    let ret = this.expression.observe(this.update);
    this.update();
    return ret;
  }

  unbind() {
    return this.expression.unobserve(this.update);
  }

  getValue() {
    return this.expression.getValue();
  }
  update() {
    throw 'Abstract Method [' + this.getDirectiveClassName() + '.unbind]';
  }
}

export class TextNodeDirective extends ExprDirective {
  update() {
    this.el.data = this.getValue();
  }
}

export class TextDirective extends ExprDirective {
  update() {
    $(this.el).text(this.getValue() || '');
  }
}

export class HtmlDirective extends ExprDirective {
  update() {
    $(this.el).html(this.getValue() || '');
  }
}

export class ClassDirective extends ExprDirective {
  update() {
    let cls = this.getValue();
    $(this.el).addClass(cls);
  }
}

export class ShowDirective extends ExprDirective {
  update() {
    $(this.el).css('display', this.getValue() ? '' : 'none');
  }
}

export class HideDirective extends ExprDirective {
  update() {
    $(this.el).css('display', this.getValue() ? 'none' : '');
  }
}

export class ValueDirective extends ExprDirective {
  update() {
    $(this.el).value(this.getValue());
  }
}

export class checkedDirective extends ExprDirective {
  update() {
    $(this.el).attr('checked', !!this.getValue());
  }
}

export class IfDirective extends AbstractDirective {
  isBlock() {
    return true;
  }
}
_.each(module.exports, (cls, name) => {
  if (Directive.isDirective(cls)) {
    Directive.register(_.kebabCase(name.replace(/Directive$/, '')), cls);
  }
})
