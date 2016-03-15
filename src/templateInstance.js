const observer = require('observer'),
  _ = require('./util'),
  dom = require('./dom'),
  Text = require('./text'),
  {Directive, DirectiveGroup} = require('./directive');


export class TemplateInstance {
  constructor(el, scope, delimiterReg, directiveReg) {
    this.el = el;
    this.delimiterReg = delimiterReg;
    this.directiveReg = directiveReg;
    this.scope = observer.proxy.proxy(scope);
    this._scopeProxyListen = _.bind.call(this._scopeProxyListen, this);
    observer.proxy.on(this.scope, this._scopeProxyListen);
    this.bindings = this.parse(el, this);
    this.binded = false;
    this.bind();
  }

  renderTo(target) {
    debugger;
    $(target).append(this.el)
  }

  updateScope(scope) {
    if (!observer.eq(scope, this.scope)) {
      observer.proxy.un(this.scope, this._scopeProxyListen);
      this.scope = observer.proxy.proxy(scope);
      observer.proxy.on(this.scope, this._scopeProxyListen);
      let bindings = this.bindings;
      for (let i = 0, l = bindings.length; i < l; i++) {
        bindings[i].updateScope();
      }
    }
  }
  bind() {
    if (this.binded)
      return;
    let bindings = this.bindings;
    for (let i = 0, l = bindings.length; i < l; i++) {
      bindings[i].bind();
    }
    this.binded = true;
  }
  unbind() {
    if (!this.binded)
      return;
    let bindings = this.bindings;
    for (let i = 0, l = bindings.length; i < l; i++) {
      bindings[i].unbind();
    }
    this.binded = false;
  }
  destroy() {
    observer.proxy.un(this.scope, this._scopeProxyListen);
    let bindings = this.bindings;
    for (let i = 0, l = bindings.length; i < l; i++) {
      if (this.binded)
        bindings[i].unbind();
      bindings[i].destroy();
    }
    dom.remove(this.el);
    this.bindings = undefined;
    this.scope = undefined;
  }
  _scopeProxyListen(obj, proxy) {
    this.scope = proxy || obj;
  }

  parse(els) {
    if (els.jquery || els instanceof Array) {
      let bindings = [];
      for (let i = 0, l = els.length; i < l; i++) {
        bindings.push.apply(bindings, this.parseEl(els[i]));
      }
      return bindings;
    }
    return this.parseEl(els);
  }

  parseEl(el) {
    switch (el.nodeType) {
      case 1:
        return this.parseElement(el);
      case 3:
        return this.parseText(el);
    }
  }

  parseText(el) {
    let text = el.data,
      delimiterReg = this.delimiterReg,
      token,
      lastIndex = 0,
      bindings = [];

    while ((token = delimiterReg.exec(text))) {

      this.createTextNode2(text.substring(lastIndex, delimiterReg.lastIndex - token[0].length), el);

      bindings.push(new Text(this.createTextNode('', el), this, token[1]));

      lastIndex = delimiterReg.lastIndex;
    }

    if (bindings.length) {

      this.createTextNode2(text.substr(lastIndex), el);

      dom.remove(el);
    }

    return bindings;
  }

  parseElement(el) {
    let block = false,
      directives = [],
      attributes = el.attributes,
      attribute,
      name,
      directiveName,
      directiveConst,
      directiveConsts = [];

    for (let i = 0, l = attributes.length; i < l; i++) {
      attribute = attributes[i];
      name = attribute.name;
      directiveName = this.parseDirectiveName(name);
      if (!directiveName)
        continue;

      directiveConst = Directive.getDirective(directiveName)
      if (!directiveConst) {
        console.warn('Directive is undefined ' + name);
        continue;
      }

      if (directiveConst.prototype.abstract) {
        block = true;
        directiveConsts = [{
          const: directiveConst,
          expression: attribute.value,
          attr: name
        }];
        break;
      } else {
        directiveConsts.push({
          const: directiveConst,
          expression: attribute.value,
          attr: name
        });
        if (directiveConst.prototype.block)
          block = true;
      }
    }
    if (directiveConsts.length)
      directives.push(new DirectiveGroup(el, this, directiveConsts));
    if (!block)
      directives.push.apply(directives, this.parseChildNodes(el));
    return directives;
  }

  parseChildNodes(el) {
    let els = [],
      childNodes = el.childNodes;
    for (let i = 0, l = childNodes.length; i < l; i++) {
      els[i] = childNodes[i];
    }
    return this.parse(els)
  }

  parseDirectiveName(name) {
    let directiveName = name.replace(this.directiveReg, '');
    return directiveName == name ? undefined : directiveName;
  }

  createTextNode(content, before) {
    let el = document.createTextNode(content);
    dom.before(el, before);
    return el;
  }

  createTextNode2(content, before) {
    if ( (content = _.trim(content)) ) {
      return this.createTextNode(content, before);
    }
    return undefined;
  }
}

