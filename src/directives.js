const _ = require('lodash'),
  Directive = require('./directive'),
  Expression = require('./expression'),
  {AbstractDirective} = Directive;

export class ExprDirective extends AbstractDirective {
  constructor(el, templateInst, expression) {
    super(el, templateInst, expression);
    this.expression = new Expression(this.target, expression);
    this.update = this.update.bind(this);
    this.$el = $(el);
  }

  bind() {
    this.template.createComment(' Directive:' + this.directiveName + ' [' + this.expr + '] ', this.$el);
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
  setValue(val) {
    this.expression.setValue(val);
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
    this.$el.text(this.getValue() || '');
  }
}

export class HtmlDirective extends ExprDirective {
  update() {
    this.$el.html(this.getValue() || '');
  }
}

export class ClassDirective extends ExprDirective {
  update() {
    let cls = this.getValue();
    this.$el.addClass(cls);
  }
}

export class ShowDirective extends ExprDirective {
  update() {
    this.$el.css('display', this.getValue() ? '' : 'none');
  }
}

export class HideDirective extends ExprDirective {
  update() {
    this.$el.css('display', this.getValue() ? 'none' : '');
  }
}

export class ValueDirective extends ExprDirective {
  update() {
    this.$el.val(this.getValue());
  }
}

const EVENT_CHANGE = 'change',
  EVENT_INPUT = 'input propertychange',
  EVENT_CLICK = 'click',
  TAG_SELECT = 'SELECT',
  TAG_INPUT = 'INPUT',
  TAG_TEXTAREA = 'TEXTAREA',
  RADIO = 'radio',
  CHECKBOX = 'checkbox';

export class InputDirective extends ValueDirective {
  constructor(el, templateInst, expression) {
    super(el, templateInst, expression);

    this.onChange = this.onChange.bind(this);

    this.event = EVENT_INPUT;
    let tag = this.tag = el.tagName, type;
    if (this.isSelect()) {
      this.event = EVENT_CHANGE;
    } else if (this.isInput()) {
      type = this.type = el.type;
      if (this.isRadio() || this.isCheckBox()) {
        this.event = EVENT_CLICK;
      }
    } else if (!this.isTextArea()) {
      throw TypeError('Directive[input] not support ' + el.tagName);
    }
    this.$el.on(this.event, this.onChange);
  }

  onChange() {
    let val = this.elVal();
    if (val != this.val) {
      this.setValue(val);
    }
  }

  update() {
    this.val = this.getValue();
    if (this.val != this.elVal())
      this.elVal(this.val);
  }

  elVal(val) {
    let isGet = arguments.length == 0;
    if (this.isSelect()) {

    } else if (this.isInput()) {
      if (this.isRadio() || this.isCheckBox()) {
        if (isGet) {
          return this.$el.prop('checked') ? this.$el.val() : undefined;
        } else {
          this.$el.prop('checked', _.isString(val) ? val == this.$el.val() : !!val);
        }
      } else {
        return this.$el.val.apply(this.$el, arguments);
      }
    } else if (this.isTextArea()) {
    }
  }

  isInput() {
    return this.tag == TAG_INPUT;
  }

  isSelect() {
    return this.tag == TAG_SELECT;
  }

  isTextArea() {
    return this.tag == TAG_TEXTAREA;
  }

  isRadio() {
    return this.type == RADIO;
  }

  isCheckBox() {
    return this.type == CHECKBOX;
  }
}

export class IfDirective extends ExprDirective {
  update() {
    if (!this.getValue()) {
      this.$el.css('display', 'none');
    } else {
      if (!this.directives) {
        this.directives = []
        _.each(this.el.childNodes, el => {
          this.template.parse(el).forEach(directive => {
            directive.bind();
            this.directives.push(directive);
          });
        });
      }
      this.$el.css('display', '');
    }
  }
  isBlock() {
    return true;
  }
}
_.each(module.exports, (cls, name) => {
  if (Directive.isDirective(cls) && cls !== ExprDirective && cls !== TextNodeDirective) {
    Directive.register(_.kebabCase(name.replace(/Directive$/, '')), cls);
  }
})
