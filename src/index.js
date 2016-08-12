import observer from 'observer'
import Template from './Template'
import TemplateParser from './TemplateParser'
import TextParser from './TextParser'
import expression from './expression'
import filter from './filter'
import {
  Directive
} from './binding'
import directives from './directives'
import config from './config'
import _ from './util'
import dom from './dom'

export default _.assign(Template, _, dom, {
  filter,
  expression,
  Directive,
  directives,
  TextParser,
  config,
  TemplateParser,
  init(cfg) {
    observer.init(cfg)
    config.config(cfg)
  }
})
