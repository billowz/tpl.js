const _ = require('../util'),
  dom = require('../dom'),
  Binding = require('./binding'),
  config = require('../config'),
  log = require('../log'),
  directives = {}

const Directive = _.dynamicClass({
  extend: Binding,
  abstract: false,
  block: false,
  priority: 5,
  constructor(el, scope, expr, attr) {
    this.super.constructor.call(this, el, scope)
    this.expr = expr
    this.attr = attr
    dom.removeAttr(this.el, this.attr)
    if (config.get(Binding.commentCfg)) {
      this.comment = document.createComment(`Directive[${this.attr}]: ${this.expr}`)
      dom.before(this.comment, this.el)
    }
  },
  statics: {
    getPriority(directive) {
      return directive.prototype.priority
    },
    isBlock(directive) {
      return directive.prototype.block
    },
    isAbstract(directive) {
      return directive.prototype.abstract
    },
    getDirective(name) {
      return directives[name.toLowerCase()]
    },
    isDirective(obj) {
      return _.isExtendOf(obj, Directive)
    },
    register(name, option) {
      let directive

      name = name.toLowerCase()

      if (_.isObject(option)) {
        directive = _.dynamicClass(option, Directive)
      } else if (_.isFunc(option) && _.isExtendOf(option, Directive)) {
        directive = option
      } else {
        throw TypeError(`Invalid Directive[${name}] ${option}`)
      }

      if (name in directives)
        throw new Error(`Directive[${name}] is existing`)

      directives[name] = directive
      log.debug('register Directive[%s]', name)
      return directive
    }
  }
})
module.exports = Directive
