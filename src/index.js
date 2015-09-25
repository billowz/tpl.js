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
    this.el = this.template.template.clone();
    this.init();
  }

  init() {
    this.directives = this.parse(this.el);
    this.directives.forEach(directive => {
      this.bind = directive.bind();
    });
  }

  parse(els) {
    if (!els.jquery && !(els instanceof Array)) {
      return this.parseEl(els);
    } else {
      let directives = [];
      _.each(els, el => {
        directives.push.apply(directives, this.parseEl(el));
      });
      return directives;
    }
  }

  parseEl(el) {
    switch (el.nodeType) {
      case 1: // Element
        return this.parseElement(el);
      case 3: // Text
        return this.parseText(el);
    }
  }

  parseChildNodes(el) {
    return this.parse(_.slice(el.childNodes, 0));
  }

  parseDirectiveName(name) {
    let reg = this.template.attrDirectiveTestReg;
    if (reg.test(name)) {
      return name.replace(reg, '');
    }
    return undefined;
  }

  parseElement(el) {
    let block = false,
      $el = $(el),
      directives = [];
    if (el.attributes) {
      _.each(el.attributes, attr => {
        let name = attr.name,
          val = attr.value, directiveConst, directive;
        if ((name = this.parseDirectiveName(name)) && (directiveConst = Directive.getDirective(name))) {
          directive = new directiveConst(el, this, val);
          directives.push(directive);
          if (directive.isBlock()) {
            block = true;
          }
        } else if (name) {
          console.warn('Directive is undefined ' + attr.name);
        }
      });
    }
    if (!block) {
      directives.push.apply(directives, this.parseChildNodes(el));
    }
    return directives;
  }

  parseText(el) {
    let text = el.data,
      token,
      lastIndex = 0,
      reg = this.template.delimiterReg,
      directives = [];
    while ((token = reg.exec(text))) {
      this.createTextNode(text.substr(lastIndex, reg.lastIndex - token[0].length), el);
      directives.push(new TextNodeDirective(this.createTextNode('binding', el), this, token[1]));
      lastIndex = reg.lastIndex;
    }
    this.createTextNode(text.substr(lastIndex), el);
    $(el).remove();
    return directives;
  }

  createComment(content, before) {
    let el = document.createComment(content);
    $(el).insertBefore(before);
    return el;
  }

  createTextNode(content, before) {
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
