
const eachReg = /^\s*([\s\S]+)\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/,
  eachAliasReg = /^(\(\s*([^,\s]+)(\s*,\s*([\S]+))?\s*\))|([^,\s]+)(\s*,\s*([\S]+))?$/;

export class EachDirective extends Directive {
  constructor(el, tpl, expr, attr) {
    super(el, tpl, expr, attr);
    this.observeHandler = this.observeHandler.bind(this);
    this.lengthObserveHandler = this.lengthObserveHandler.bind(this);

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

    this.comment = $(document.createComment(' Directive:' + this.name + ' [' + this.expr + '] '));
    this.comment.insertBefore(this.el);

    this.$el.remove().removeAttr(this.attr);
    this.childTpl = new Template(this.$el);
  }

  createChildScope(key, data, idx) {
    let scope = {
      __index__: idx
    };

    if (this.keyAlias)
      scope[this.keyAlias] = key;
    scope[this.valueAlias] = data;
    return scope;
  }

  createChild(key, data, idx) {
    return this.childTpl.complie(this.createChildScope(key, data, idx), this.tpl);
  }

  bind() {
    super.bind();
    this.observe(this.scopeExpr, this.observeHandler);
    this.observe(this.scopeExpr + '.length', this.lengthObserveHandler);
    this.update(this.target());
  }

  unbind() {
    super.unbind();
    this.unobserve(this.scopeExpr, this.observeHandler);
    this.unobserve(this.scopeExpr + '.length', this.lengthObserveHandler);
  }

  update(value) {
    if (value instanceof Array) {
      let childrenIdx = this.childrenIdx,
        childrenSortedIdx = this.childrenSortedIdx,
        data, idx,
        i, l;

      if (!childrenIdx) {
        let tpl,
          before = this.comment, el;

        childrenIdx = this.childrenIdx = {};
        childrenSortedIdx = this.childrenSortedIdx = [];

        for (i = 0, l = value.length; i < l; i++) {
          data = value[i];
          idx = this.indexExpr ? _.get(data, this.indexExpr) : i;
          tpl = this.createChild(i, data, idx);
          el = tpl.el;
          el.insertAfter(before);
          before = el;

          childrenSortedIdx[i] = childrenIdx[idx] = {
            idx: idx,
            scope: data,
            tpl: tpl,
            index: i
          }
        }
      } else {
        let child, child2, tpl,
          added = [],
          removed = [],
          currentSortedIdx = [];

        for (i = 0, l = value.length; i < l; i++) {
          data = value[i];
          idx = this.indexExpr ? _.get(data, this.indexExpr) : i;

          if (!(child = childrenIdx[idx])) {
            child = childrenIdx[idx] = {
              idx: idx,
              scope: data,
              tpl: undefined,
              index: i
            }
            added.push(child);
            childrenIdx[idx] = child;
          } else {
            if (child.scope != data) {
              if (child.tpl)
                child.tpl.updateScope(this.createChildScope(i, data, idx));
              else
                throw Error('index for each is not uk')
            // todo update: child.tpl.updateScope(child.scope)
            }
            child.index = i;
          }
          currentSortedIdx[i] = child;
        }

        for (i = 0, l = childrenSortedIdx.length; i < l; i++) {
          child = childrenSortedIdx[i];
          child2 = childrenIdx[child.idx];
          if (child2 && child !== currentSortedIdx[child2.index]) {
            removed.push(child);
            childrenIdx[child.idx] = undefined;
          }
        }

        for (i = 0, l = added.length; i < l; i++) {
          child = added[i];
          if( (child2 = removed.pop()) ) {
            child.tpl = child2.tpl;
            child.tpl.updateScope(this.createChildScope(child.index, child.scope, child.idx));
          // todo update: child.tpl.updateScope(child.scope)
          } else {
            tpl = this.createChild(child.index, child.scope, idx);
            child.tpl = tpl;
          }
          if (child.index) {
            child.tpl.el.insertAfter(currentSortedIdx[child.index - 1].tpl.el);
          } else {
            child.tpl.el.insertAfter(this.comment);
          }
        }

        while ((child = removed.pop()))
        child.tpl.destroy();

        this.childrenSortedIdx = currentSortedIdx;
      }
    } else {
      console.warn(`Invalid Each Scope[${this.scopeExpr}] ${scope}`);
    }
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
