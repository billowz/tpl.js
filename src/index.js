import Template from './template'
import expression from './expression'
import translate from './translate'
import {
  Directive
} from './binding'

import directives from './directives'
import _ from 'utility'
import observer from 'observer'
import * as util from './util'
import dom from './dom'
import config from './config'

_.assign(Template, {
  translate,
  expression,
  Directive,
  directives,
  config,
  init(cfg) {
    observer.init(cfg)
    config.config(cfg)
  }
}, dom, util)

function assign(target, source, alias) {
  observer.each(source, (v, k) => {
    target[alias[k] || k] = v
  })
  return target
}
let tpl = function(el, cfg) {
  return new Template(el, cfg)
}
_.assign(tpl, Template, {
  Template: Template,
  utility: _,
  observer: observer
})
assign(_.assign(tpl, _), observer.observer, {
  on: 'observe',
  un: 'unobserve',
  hasListen: 'isObserved'
})
export default tpl
