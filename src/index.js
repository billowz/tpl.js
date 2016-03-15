let tpl = require('./template').Template;
tpl.expression = require('./expression');
tpl.util = require('./util');
tpl.Directive = require('./Directive').Directive;
tpl.Directives = require('./directives');
tpl.EventDirectives = require('./eventDirective');
tpl.EachDirective = require('./eachDirective');

module.exports = tpl;
