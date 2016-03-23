let tpl = require('./template').Template,
  util = require('./util'),
  observer = require('observer');

util.assign(tpl, util, require('./dom'));
tpl.observe = observer.on;
tpl.unobserve = observer.un;
tpl.obj = observer.obj;
tpl.proxy = observer.proxy.proxy;
tpl.proxyChange = observer.proxy.on;
tpl.unProxyChange = observer.proxy.un;
tpl.expression = require('./expression');
tpl.Directive = require('./directive').Directive;
tpl.Directives = require('./directives');
tpl.EventDirectives = require('./eventDirective');
tpl.EachDirective = require('./eachDirective');
module.exports = tpl;
