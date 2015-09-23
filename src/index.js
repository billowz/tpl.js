const _ = require('lodash'),
  $ = require('jquery'),
  Directives = require('./directives'),
  Directive = require('./directive'),
  Expression = require('./expression'),
  {TextNodeDirective} = Directives,
  PRIMITIVE = 0,
  KEYPATH = 1,
  TEXT = 0,
  BINDING = 1,
  templateContentReg = /^[\s\t\r\n]*</,
  defaultCfg = {
    delimiter: ['{', '}'],
    directivePrefix: 'tpl-'
  };

class Template {
  constructor(templ, cfg) {
    this.template = $(templ);
    this.cfg = _.assign(_.clone(defaultCfg), cfg || {});

    let s = this.cfg.delimiter[0],
      e = this.cfg.delimiter[1];
    this.delimiterReg = new RegExp(s + '([^' + s + e + ']*)' + e, 'g');
    this.attrDirectiveTestReg = new RegExp('^' + this.cfg.directivePrefix);
  }

  complie(bind) {
    return new TemplateInstance(this, bind);
  }

}

class TemplateInstance {
  constructor(template, bind) {
    if (!(template instanceof Template)) {
      throw TypeError('Invalid Template ' + template);
    }
    this.template = template;
    this.bind = bind;
    this.directives = [];
    this.el = this.template.template.clone();
    this.init();
  }

  init() {
    _.each(this.el, el => {
      this._parse(el);
    });
    this.directives.forEach(directive => {
      this.bind = directive.bind();
    });
  }

  _parse(el) {
    switch (el.nodeType) {
      case 1: // Element
        this._parseElement(el);
        break;
      case 3: // Text
        this._parseText(el);
        break;
    }
  }

  _parseDirectiveName(name) {
    let reg = this.template.attrDirectiveTestReg;
    if (reg.test(name)) {
      return name.replace(reg, '');
    }
    return undefined;
  }

  _parseElement(el) {
    let block = false,
      $el = $(el);
    if (el.attributes) {
      _.each(el.attributes, attr => {
        let name = attr.name,
          val = attr.value, directiveConst, directive;
        if ((name = this._parseDirectiveName(name)) && (directiveConst = Directive.getDirective(name))) {
          directive = new directiveConst(el, this.bind, val);
          this.directives.push(directive);
          if (directive.isBlock()) {
            block = true;
          }
        } else if (name) {
          console.warn('Directive is undefined ' + attr.name);
        }
      });
    }
    if (!block) {
      _.each(el.childNodes, el => {
        this._parse(el);
      });
    }
  }

  _parseText(el) {
    let text = el.data,
      token,
      lastIndex = 0,
      reg = this.template.delimiterReg;
    while ((token = reg.exec(text))) {
      this._createTextNode(text.substr(lastIndex, reg.lastIndex - token[0].length), el);
      this._createComment(token[0], el);
      this.directives.push(new TextNodeDirective(this._createTextNode('binding', el), this.bind, token[1]));
      lastIndex = reg.lastIndex;
    }
    this._createTextNode(text.substr(lastIndex), el);
    $(el).remove();
  }

  _createComment(content, before) {
    let el = document.createComment(content);
    $(el).insertBefore(before);
    return el;
  }

  _createTextNode(content, before) {
    if (content) {
      let el = document.createTextNode(content);
      $(el).insertBefore(before);
      return el;
    }
    return undefined;
  }
}

Template.Directive = Directive;
Template.Directives = Directives;
Template.Expression = Expression;

module.exports = Template;
