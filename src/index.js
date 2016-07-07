let tpl = require('./template'),
  observer = require('observer'),
  _ = require('./util'),
  config = require('./config')

_.assign(tpl, _, require('./dom'), {
  filter: require('./filter'),
  expression: require('./expression'),
  Directive: require('./binding').Directive,
  directives: require('./directives'),
  config: config.get(),
  init(cfg) {
    observer.init(cfg)
    config.config(cfg)
  }
})
module.exports = tpl;
