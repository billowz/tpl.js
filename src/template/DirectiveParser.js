import {
  Directive
} from '../binding'
import _ from '../util'
import config from '../config'

config.register('directiveReg', /^tpl-/, [RegExp])

export default _.dynamicClass({
  constructor() {
    this.reg = config.get('directiveReg')
  },
  isDirective(attr) {
    return this.reg.test(attr)
  },
  getDirective(attr) {
    return Directive.getDirective(attr.replace(this.reg, ''))
  }
})
