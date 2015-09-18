const _ = require('lodash'),
  $ = require('jquery'),
  observer = require('observer'),
  PRIMITIVE = 0,
  KEYPATH = 1,
  TEXT = 0,
  BINDING = 1,
  templateContentReg = /^[\s\t\r\n]*</,
  defaultCfg = {
    delimiter: ['{', '}']
  };

class Template {
  constructor(templ, cfg) {
    this.template = $(templ);
    this.cfg = _.assign(_.clone(defaultCfg), cfg || {});
    this.parse = this.parse.bind(this);
    let s = this.cfg.delimiter[0],
      e = this.cfg.delimiter[1];
    this.delimiterReg = new RegExp(s + '([^' + s + e + ']*)' + e, 'g');
  }

  complie(bind) {
    let el = this.template.clone();
    _.each(el, this.parse);
    return el;
  }

  parseText(node) {
    let $el = $(node),
      content = $el.text(), token,
      lastIdx = 0,
      expressions = [],
      directives = [],
      reg = this.delimiterReg;
    while ((token = reg.exec(content))) {

      this.createTextNodeBefore(content.substr(lastIdx, reg.lastIndex - token[0].length), $el);

      this.createCommentBefore(token[0], $el);

      directives.push(new Directive(this.createTextNodeBefore(token[1], $el), token[1]));

      lastIdx = reg.lastIndex;
    }
    this.createTextNodeBefore(content.substr(lastIdx), $el);
    $el.remove();
    return directives;
  }

  getDirective(attr) {}

  parseElement(node) {
    _.each(node.attributes, attr => {
      let directive = this.getDirective(attr);
      if (directive) {

      }
    })
  }
  parse(node) {
    let block = false;
    switch (node.nodeType) {
      case 1: // Element
        this.parseElement(node);
        break;
      case 3: // Text
        this.parseText(node);
        break;
      case 8: // Comments
    }
    _.each($(node).contents(), this.parse);
  }


  createCommentBefore(content, before) {
    let el = document.createComment(content);
    $(el).insertBefore(before);
    return el;
  }

  createTextNodeBefore(content, before) {
    if (content) {
      let el = document.createTextNode(content);
      $(el).insertBefore(before);
      return el;
    }
  }
}

let ExpressionReg = /[\+\-\*/\(\)]/g;
class Expression {
  constructor(data, expression) {
    this.expression = expression;
  }
  getValue() {
    return _.get(this.data, this.expression);
  }
  observe(callback) {}
}

Template.Expression = Expression;

class Directive {
  constructor(node, data, expression) {
    this.node = node;
    this.nodeType = node.nodeType;
    this.expression = new Expression(data, expression);

    switch (this.nodeType) {
      case 2:
        break;
      case 3:
        $(node).text(this.expression.getValue());
        break;
    }

  }
  bind() {}
}
Template.Directive = Directive

module.exports = Template;
