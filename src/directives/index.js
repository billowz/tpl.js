const _ = require('../util'),
  directives = {};
_.assign(directives, require('./each'), require('./event'), require('./expression'))
module.exports = directives;
