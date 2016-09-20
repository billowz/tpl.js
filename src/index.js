import observer from 'observer'
import Template from './template'
import expression from './expression'
import filter from './filter'
import {
  Directive
} from './binding'

import directives from './directives'
import _ from './util'
import dom from './dom'
import config from './config'

export default _.assign(Template, _, dom, {
  filter,
  expression,
  Directive,
  directives,
  config,
  init(cfg) {
    observer.init(cfg)
    config.config(cfg)
  }
})
