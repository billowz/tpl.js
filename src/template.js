const _ = require('lodash'),
  $ = require('jquery'),
  Text = require('./text'),
  {Directive, DirectiveGroup} = require('./directive');


const PRIMITIVE = 0,
  KEYPATH = 1,
  TEXT = 0,
  BINDING = 1,
  templateContentReg = /^[\s\t\r\n]*</,
  parseDelimiterReg = function(delimiter) {
    return new RegExp([delimiter[0], '([^', delimiter[0], delimiter[0], ']*)', delimiter[1]].join(''), 'g')
  },
  parseDirectiveReg = function(prefix) {
    return new RegExp('^' + prefix);
  },
  defaultCfg = {
    delimiter: ['{', '}'],
    directivePrefix: 'tpl-'
  };


let __tmp_id__ = 0;
class Template {
  constructor(templ, cfg) {
    this.template = $(templ);
    cfg = cfg || {};

    this.directivePrefix = cfg.directivePrefix || defaultCfg.directivePrefix;
    this.delimiter = cfg.delimiter || defaultCfg.delimiter;
    this.directiveReg = parseDirectiveReg(this.directivePrefix);
    this.delimiterReg = parseDelimiterReg(this.delimiter);

    this.__instance_nr__ = 0;
    this.__id__ = __tmp_id__++;
  }

  complie(scope, parent) {
    return new TemplateInstance(this, scope, parent);
  }
}

class TemplateInstance {
  constructor(tpl, scope, parent) {
    this.tpl = tpl;
    this.scope = scope;
    this.el = this.tpl.template.clone();
    this.parent = parent;
    this.__id__ = tpl.__id__ + '-' + tpl.__instance_nr__++;
    this.init();
  }

  renderTo(el) {
    $(el).append(this.el);
    return this;
  }

  init() {
    this.bindings = this.parse(this.el);
    this.bindings.forEach(directive => {
      directive.bind();
      this.scope = directive.scope;
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
      consts = [];
    if (el.attributes) {
      _.each(el.attributes, attr => {
        let name = attr.name,
          val = attr.value,
          dc, directive;

        if ((name = this.parseDirectiveName(name)) && (dc = Directive.getDirective(name))) {
          if (dc.prototype.abstract) {
            consts = [{
              const: dc,
              val: val
            }];
            block = true;
            return false;
          }
          consts.push({
            const: dc,
            val: val
          });
          if (dc.prototype.block)
            block = true;
        } else if (name) {
          console.warn('Directive is undefined ' + attr.name);
        }
      });

      if (consts.length > 1) {
        directives.push(new DirectiveGroup(el, this, consts));
      } else if (consts.length == 1) {
        directives.push(new consts[0].const(el, this, consts[0].val));
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
    let reg = this.tpl.directiveReg;
    if (reg.test(name)) {
      return name.replace(reg, '');
    }
    return undefined;
  }
}
module.exports = Template;
