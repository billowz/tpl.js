import Binding from './Binding'
import _ from '../util'
import dom from '../dom'
import config from '../config'
import log from '../log'

const directives = {}

const Directive = _.dynamicClass({
  extend: Binding,
  abstract: false,
  block: false,
  priority: 5,
  constructor(cfg) {
    this.super(arguments)
    this.expr = cfg.expression
    this.attr = cfg.attr
    this.template = cfg.template
    this.templateIndex = cfg.index
    this.children = _.map(cfg.children, (binding) => {
      return this.template.parser.createDirective(binding, {
        el: this.el,
        template: this.template,
        scope: this.realScope()
      })
    })
    this.group = cfg.group
    if (config.get(Binding.commentCfg)) {
      this.comment = document.createComment(`Directive[${this.attr}]: ${this.expr}`)
      dom.before(this.comment, this.el)
    }
  },
  bindChildren() {
    _.each(this.children, (directive) => {
      directive.bind()
    })
  },
  unbindChildren() {
    _.each(this.children, (directive) => {
      directive.unbind()
    })
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
        option.extend = option.extend || Directive
        directive = _.dynamicClass(option)
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
export default Directive
