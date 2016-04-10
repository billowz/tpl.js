let tpl = require('./template'),
  _ = require('./util');

_.assign(tpl, _, require('./dom'));
tpl.filter = require('./filter');
tpl.expression = require('./expression');
tpl.Directive = require('./binding').Directive;
tpl.Directives = require('./directives');
module.exports = tpl;
