const Directive = require('./directive'),
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
  update() {}
}

export class ShowDirective extends ExprDirective {
  update() {
    let val = this.getValue();

  }
}

export class HideDirective extends ExprDirective {
  update() {}
}

export class IfDirective extends AbstractDirective {
  isBlock() {
    return true;
  }
}
Directive.register('class', ClassDirective);
