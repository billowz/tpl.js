const _ = require('../util')

_.each(['binding', 'text', 'directive', 'directiveGroup', 'text'], (name) => {
  module.exports[_.upperFirst(name)] = require('./' + name)
})
