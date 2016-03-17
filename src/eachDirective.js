const _ = require('./util'),
  dom = require('./dom'),
  {Directive} = require('./directive'),
  {TemplateInstance} = require('./templateInstance');

const eachReg = /^\s*([\s\S]+)\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/,
  eachAliasReg = /^(\(\s*([^,\s]+)(\s*,\s*([\S]+))?\s*\))|([^,\s]+)(\s*,\s*([\S]+))?$/;

export class EachDirective extends Directive {
  constructor(el, tpl, expr, attr) {
    super(el, tpl, expr, attr);
    this.observeHandler = _.bind.call(this.observeHandler, this);
    this.lengthObserveHandler = _.bind.call(this.lengthObserveHandler, this);

    let token = expr.match(eachReg);
    if (!token)
      throw Error(`Invalid Expression[${expr}] on Each Directive`);

    this.scopeExpr = token[2];
    this.indexExpr = token[4];

    let aliasToken = token[1].match(eachAliasReg);
    if (!aliasToken)
      throw Error(`Invalid Expression[${token[1]}] on Each Directive`);

    this.valueAlias = aliasToken[2] || aliasToken[5];
    this.keyAlias = aliasToken[4] || aliasToken[7];

    this.comment = document.createComment(' Directive:' + this.name + ' [' + this.expr + '] ');
    dom.before(this.comment, this.el);
    dom.removeAttr(this.el, this.attr);

    this.begin = document.createComment('each begin');
    dom.after(this.begin, this.comment);
    this.end = document.createComment('each end');
    dom.after(this.end, this.begin);

    dom.remove(this.el);
  }

  update(data) {
    let parentScope = this.realScope(),
      item, scope, oldScope, i, l, index,
      begin = this.begin,
      end = this.end,
      indexExpr = this.indexExpr,
      valueAlias = this.valueAlias,
      keyAlias = this.keyAlias,
      init = !this.cache,
      oldSort = this.sort,
      sort = this.sort = new Array(data.length),
      cache = init ? (this.cache = {}) : this.cache,
      removed = [],
      added = [];

    for (i = 0, l = data.length; i < l; i++) {
      item = data[i];
      index = indexExpr ? _.get(item, indexExpr) : i;
      scope = !init && cache[index];
      if (scope) {
        this.initScope(scope, item, i, index);
      } else {
        scope = cache[index] = this.createScope(parentScope, item, i, index);
        if (!init)
          added.push(scope);
      }
      sort[i] = scope;
      if (init) {
        scope.$tpl = new TemplateInstance(dom.clone(this.el), scope, this.tpl.delimiterReg, this.tpl.directiveReg);
        scope.$tpl.before(end);
      }
    }

    if (init)
      return;

    for (i = 0, l = oldSort.length; i < l; i++) {
      oldScope = oldSort[i];
      scope = cache[oldScope.$index];
      if (scope && scope !== sort[oldScope.$sort]) {
        removed.push(oldScope);
        cache[oldScope.$index] = undefined;
      }
    }
    for (i = 0, l = added.length; i < l; i++) {
      scope = added[i];
      if( (oldScope = removed.pop()) ) {
        this.initScope(oldScope, scope);
        cache[scope.$index] = oldScope;
        sort[scope.$sort] = oldScope;
        scope = oldScope;
      } else {
        scope.$tpl = new TemplateInstance(dom.clone(this.el), scope, this.tpl.delimiterReg, this.tpl.directiveReg);
      }
      scope.$tpl.after(scope.$sort ? sort[scope.$sort - 1].$tpl.el : begin);
    }
    while ((scope = removed.pop())) {
      scope.$tpl.destroy();
    }
  }

  createScope(parentScope, value, i, index) {
    let scope = _.create(parentScope, {});
    scope.$parent = parentScope;
    scope.$context = this;
    scope.$tpl = null;
    this.initScope(scope, value, i, index, true);
    return scope;
  }

  initScope(scope, value, i, index, isCreate) {
    if (!isCreate)
      scope = scope.$tpl.scope;
    scope.$sort = i;
    scope[this.valueAlias] = value;
    if (this.keyAlias)
      scope[this.keyAlias] = i;
    scope.$index = index;
  }

  bind() {
    if (!super.bind())
      return false;
    this.observe(this.scopeExpr, this.observeHandler);
    this.observe(this.scopeExpr + '.length', this.lengthObserveHandler);
    this.update(this.target());
    return true;
  }

  unbind() {
    if (!super.unbind())
      return false;
    this.unobserve(this.scopeExpr, this.observeHandler);
    this.unobserve(this.scopeExpr + '.length', this.lengthObserveHandler);
    return true;
  }

  target() {
    return this.get(this.scopeExpr);
  }

  observeHandler(expr, target) {
    this.update(target);
  }

  lengthObserveHandler() {
    this.update(this.target());
  }
}
EachDirective.prototype.abstract = true;
EachDirective.prototype.block = true;
EachDirective.prototype.priority = 10;

Directive.register('each', EachDirective);
