const _ = require('lodash'),
  $ = require('jquery'),
  Text = require('./text'),
  Directive = require('./directive'),
  DirectiveGroup = require('./directive-group');


const PRIMITIVE = 0,
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
    console.log(this.delimiterReg)
    this.attrDirectiveTestReg = new RegExp('^' + this.cfg.directivePrefix);
    console.log(this.attrDirectiveTestReg)
  }

  complie(bind) {
    return new TemplateInstance(this, bind);
  }
}

class TemplateInstance {
  constructor(tpl, bind) {
    this.tpl = tpl;
    this.bind = bind;
    this.el = this.tpl.template.clone();
    this.init();
  }

  init() {
    this.bindings = this.parse(this.el);
    this.bindings.forEach(directive => {
      directive.bind();
      this.bind = directive.getScope();
    });
  }

  parse(els) {
    if (!els.jquery && !(els instanceof Array)) {
      return this.parseEl(els);
    } else {
      let bindings = [];
      _.each(els, el => {
        bindings.push.apply(bindings, this.parseEl(el));
      });
      return bindings;
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

  parseText(el) {
    let text = el.data,
      token,
      lastIndex = 0,
      reg = this.tpl.delimiterReg,
      bindings = [];

    while ((token = reg.exec(text))) {

      this.createTextNode(text.substring(lastIndex, reg.lastIndex - token[0].length), el);

      if (token[1]) {
        bindings.push(new Text(this.createTextNode('binding', el), this, token[1]));
      }

      lastIndex = reg.lastIndex;
    }

    this.createTextNode(text.substr(lastIndex), el);

    $(el).remove();

    return bindings;
  }

  createTextNode(content, before) {
    content = _.trim(content);
    if (content) {
      let el = document.createTextNode(content);
      $(el).insertBefore(before);
      return el;
    }
    return undefined;
  }


  parseElement(el) {
    let block = false,
      $el = $(el),
      directives = [],
      directiveItems = [];
    if (el.attributes) {
      _.each(el.attributes, attr => {
        let name = attr.name,
          val = attr.value, directiveConst, directive;
        if ((name = this.parseDirectiveName(name)) && (directiveConst = Directive.getDirective(name))) {
          directive = new directiveConst(el, this, val);
          directiveItems.push(directive);
          if (directive.isBlock()) {
            block = true;
          }
        } else if (name) {
          console.warn('Directive is undefined ' + attr.name);
        }
      });
      if (directiveItems.length > 1) {
        directives.push(new DirectiveGroup(el, this, directiveItems));
      } else if (directiveItems.length == 1) {
        directives.push(directiveItems[0]);
      }
    }
    if (!block) {
      directives.push.apply(directives, this.parseChildNodes(el));
    }
    return directives;
  }

  parseChildNodes(el) {
    return this.parse(_.slice(el.childNodes, 0));
  }

  parseDirectiveName(name) {
    let reg = this.tpl.attrDirectiveTestReg;
    if (reg.test(name)) {
      return name.replace(reg, '');
    }
    return undefined;
  }
}
module.exports = Template;
