const _ = require('../util'),
  dom = require('../dom'),
  {
    Directive
  } = require('../binding'),
  Template = require('../template'),
  eachReg = /^\s*([\s\S]+)\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/,
  eachAliasReg = /^(\(\s*([^,\s]+)(\s*,\s*([\S]+))?\s*\))|([^,\s]+)(\s*,\s*([\S]+))?$/

export const EachDirective = _.dynamicClass({
  extend: Directive,
  abstract: true,
  block: true,
  priority: 10,
  constructor() {
    this.super(arguments)
    this.observeHandler = this.observeHandler.bind(this)
    let token = this.expr.match(eachReg)
    if (!token)
      throw Error(`Invalid Expression[${this.expr}] on Each Directive`)

    this.scopeExpr = token[2]
    this.indexExpr = token[4]

    let aliasToken = token[1].match(eachAliasReg)
    if (!aliasToken)
      throw Error(`Invalid Expression[${token[1]}] on Each Directive`)

    this.valueAlias = aliasToken[2] || aliasToken[5]
    this.keyAlias = aliasToken[4] || aliasToken[7]

    dom.removeAttr(this.el, this.attr)
    this.begin = document.createComment('each begin')
    this.end = document.createComment('each end')
    dom.replace(this.el, this.begin)
    dom.after(this.end, this.begin)

    let eachTemplateId = this.template.id + '-' + this.templateIndex
    if(!(this.eachTemplate = Template.get(eachTemplateId)))
      this.eachTemplate = new Template(this.el, {
        id: eachTemplateId,
        directiveReg: this.template.directiveReg,
        TextParser: this.template.TextParser,
        clone: false
      })
    this.el = null
  },
  update(data) {
    let parentScope = this.realScope(),
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
      added = []

    _.each(data, (item, idx) => {
      let index = indexExpr ? _.get(item, indexExpr) : idx, // read index of data item
        scope = !init && cache[index] // find scope in cache

      if (scope) { // update scope
        this.initScope(scope, item, idx, index)
      } else { // create scope
        scope = cache[index] = this.createScope(parentScope, item, idx, index)
        if (!init)
          added.push(scope)
      }
      sort[idx] = scope // update sort
      if (init) { // init compontent
        scope.$tpl = this.eachTemplate.complie(scope)
        data[idx] = scope[valueAlias]
        scope.$tpl.before(end)
      }
    })
    if (!init) {
      _.each(oldSort, (oldScope) => {
        let scope = cache[oldScope.$index]
        if (scope && scope !== sort[oldScope.$sort]) {
          removed.push(oldScope)
          cache[oldScope.$index] = undefined
        }
      })

      _.each(added, (scope) => {
        let scope2 = removed.pop()
        if (scope2) {
          this.initScope(scope2, scope)
          cache[scope.$index] = scope2
          sort[scope.$sort] = scope2
          scope = scope2
        } else {
          scope.$tpl = this.eachTemplate.complie(scope)
        }
        data[scope.$sort] = scope[valueAlias]
        scope.$tpl.after(scope.$sort ? sort[scope.$sort - 1].$tpl.els : begin)
      })

      _.each(removed, (scope) => {
        scope.$tpl.destroy()
      })
    }
  },
  createScope(parentScope, value, i, index) {
    let scope = _.create(parentScope)
    scope.$parent = parentScope
    scope.$eachContext = this
    scope.$tpl = null
    this.initScope(scope, value, i, index, true)
    return scope
  },
  initScope(scope, value, i, index, isCreate) {
    if (!isCreate)
      scope = scope.$tpl.scope
    scope.$sort = i
    scope[this.valueAlias] = value
    if (this.keyAlias)
      scope[this.keyAlias] = i
    scope.$index = index
  },
  bind() {
    this.observe(this.scopeExpr, this.observeHandler)
    this.update(this.target())
  },
  unbind() {
    this.unobserve(this.scopeExpr, this.observeHandler)
  },
  target() {
    return this.get(this.scopeExpr)
  },
  observeHandler(expr, target) {
    this.update(target)
  }
})

Directive.register('each', EachDirective)
