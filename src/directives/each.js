import {
  Directive
} from '../binding'
import Template from '../template'
import _ from 'utility'
import observer from 'observer'
import dom from '../dom'
import log from '../log'

const eachReg = /^\s*([\s\S]+)\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/,
  eachAliasReg = /^(\(\s*([^,\s]+)(\s*,\s*([\S]+))?\s*\))|([^,\s]+)(\s*,\s*([\S]+))?$/

export default Directive.register('each', _.dynamicClass({
  extend: Directive,
  independent: true,
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

    this.begin = document.createComment('each begin')
    this.end = document.createComment('each end')
    dom.replace(this.el, this.begin)
    dom.after(this.end, this.begin)
    this.el = undefined
    this.version = 1
  },
  update(data) {
    let domParser = this.domParser,
      parentScope = this.realScope(),
      begin = this.begin,
      end = this.end,
      indexExpr = this.indexExpr,
      used = this.used,
      version = this.version++,
      indexMap = this.used = {},
      descs = _.map(data, (item, idx) => {
        let index = indexExpr ? _.get(item, indexExpr) : idx, // read index of data item
          reuse = used && used[index],
          desc

        if (reuse && reuse.version === version)
          reuse = undefined

        desc = reuse || {
          index: index
        }
        desc.version = version
        desc.data = observer.proxy(item)
        indexMap[index] = desc
        return desc
      }),
      idles = [],
      fragment = document.createDocumentFragment()

    if (used)
      tpl.each(used, (desc) => {
        if (desc.version != version)
          idles.push(desc)
        desc.tpl.remove(false)
      })

    tpl.each(descs, (desc) => {
      if (!desc.scope) {
        let idle = idles.pop()

        if (!idle) {
          desc.scope = this.createScope(parentScope, desc.data, desc.index)
          desc.tpl = domParser.complie(desc.scope)
        } else {
          desc.scope = idle.scope
          desc.tpl = idle.tpl
          this.initScope(desc.scope, desc.data, desc.index)
        }
      }
      dom.append(fragment, desc.tpl.el)
    })
    tpl.before(fragment, end)
    tpl.each(descs, (desc) => desc.tpl.bind())
    tpl.each(idles, (idle) => idle.tpl.destroy())
  },
  createScope(parentScope, value, index) {
    let scope = _.create(parentScope)
    scope.$parent = parentScope
    scope.$eachContext = this
    this.initScope(scope, value, index, true)
    return scope
  },
  initScope(scope, value, index, isCreate) {
    if (!isCreate)
      scope = observer.proxy(scope)
    scope[this.valueAlias] = value
    if (this.keyAlias)
      scope[this.keyAlias] = index
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
}))
