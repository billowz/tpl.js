const AbstractBinding = require('./abstractBinding'),
  config = require('../config')

config.register('generateComments', true)

class Binding extends AbstractBinding {
  constructor(tpl, expr) {
    super(tpl)
    this.expr = expr
  }
}

module.exports = Binding
