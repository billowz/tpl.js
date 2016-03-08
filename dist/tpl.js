(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"), require("jquery"), require("observer"));
	else if(typeof define === 'function' && define.amd)
		define(["_", "jquery", "observer"], factory);
	else if(typeof exports === 'object')
		exports["tpl"] = factory(require("_"), require("jquery"), require("observer"));
	else
		root["tpl"] = factory(root["_"], root["jQuery"], root["observer"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_7__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var tpl = __webpack_require__(1);
	tpl.Directives = __webpack_require__(11);
	module.exports = tpl;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2),
	    $ = __webpack_require__(3),
	    Text = __webpack_require__(4),
	    Directive = __webpack_require__(8),
	    DirectiveGroup = __webpack_require__(9);
	
	var PRIMITIVE = 0,
	    KEYPATH = 1,
	    TEXT = 0,
	    BINDING = 1,
	    templateContentReg = /^[\s\t\r\n]*</,
	    defaultCfg = {
	  delimiter: ['{', '}'],
	  directivePrefix: 'tpl-'
	};
	
	var Template = function () {
	  function Template(templ, cfg) {
	    _classCallCheck(this, Template);
	
	    this.template = $(templ);
	    this.cfg = _.assign(_.clone(defaultCfg), cfg || {});
	
	    var s = this.cfg.delimiter[0],
	        e = this.cfg.delimiter[1];
	    this.delimiterReg = new RegExp(s + '([^' + s + e + ']*)' + e, 'g');
	    console.log(this.delimiterReg);
	    this.attrDirectiveTestReg = new RegExp('^' + this.cfg.directivePrefix);
	    console.log(this.attrDirectiveTestReg);
	  }
	
	  Template.prototype.complie = function complie(bind) {
	    return new TemplateInstance(this, bind);
	  };
	
	  return Template;
	}();
	
	var TemplateInstance = function () {
	  function TemplateInstance(tpl, bind) {
	    _classCallCheck(this, TemplateInstance);
	
	    this.tpl = tpl;
	    this.bind = bind;
	    this.el = this.tpl.template.clone();
	    this.init();
	  }
	
	  TemplateInstance.prototype.init = function init() {
	    var _this = this;
	
	    this.bindings = this.parse(this.el);
	    this.bindings.forEach(function (directive) {
	      directive.bind();
	      _this.bind = directive.getScope();
	    });
	  };
	
	  TemplateInstance.prototype.parse = function parse(els) {
	    var _this2 = this;
	
	    if (!els.jquery && !(els instanceof Array)) {
	      return this.parseEl(els);
	    } else {
	      var _ret = function () {
	        var bindings = [];
	        _.each(els, function (el) {
	          bindings.push.apply(bindings, _this2.parseEl(el));
	        });
	        return {
	          v: bindings
	        };
	      }();
	
	      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	    }
	  };
	
	  TemplateInstance.prototype.parseEl = function parseEl(el) {
	    switch (el.nodeType) {
	      case 1:
	        // Element
	        return this.parseElement(el);
	      case 3:
	        // Text
	        return this.parseText(el);
	    }
	  };
	
	  TemplateInstance.prototype.parseText = function parseText(el) {
	    var text = el.data,
	        token = void 0,
	        lastIndex = 0,
	        reg = this.tpl.delimiterReg,
	        bindings = [];
	
	    while (token = reg.exec(text)) {
	
	      this.createTextNode(text.substring(lastIndex, reg.lastIndex - token[0].length), el);
	
	      if (token[1]) {
	        bindings.push(new Text(this.createTextNode('binding', el), this, token[1]));
	      }
	
	      lastIndex = reg.lastIndex;
	    }
	
	    this.createTextNode(text.substr(lastIndex), el);
	
	    $(el).remove();
	
	    return bindings;
	  };
	
	  TemplateInstance.prototype.createTextNode = function createTextNode(content, before) {
	    content = _.trim(content);
	    if (content) {
	      var el = document.createTextNode(content);
	      $(el).insertBefore(before);
	      return el;
	    }
	    return undefined;
	  };
	
	  TemplateInstance.prototype.parseElement = function parseElement(el) {
	    var _this3 = this;
	
	    var block = false,
	        $el = $(el),
	        directives = [],
	        directiveItems = [];
	    if (el.attributes) {
	      _.each(el.attributes, function (attr) {
	        var name = attr.name,
	            val = attr.value,
	            directiveConst = void 0,
	            directive = void 0;
	        if ((name = _this3.parseDirectiveName(name)) && (directiveConst = Directive.getDirective(name))) {
	          directive = new directiveConst(el, _this3, val);
	          directiveItems.push(directive);
	          if (directive.isBlock()) {
	            block = true;
	          }
	        } else if (name) {
	          console.warn('Directive is undefined ' + attr.name);
	        }
	      });
	      if (directiveItems.length > 1) {
	        directives.push(new DirectiveGroup(el, this, directiveItems));
	      } else if (directiveItems.length == 1) {
	        directives.push(directiveItems[0]);
	      }
	    }
	    if (!block) {
	      directives.push.apply(directives, this.parseChildNodes(el));
	    }
	    return directives;
	  };
	
	  TemplateInstance.prototype.parseChildNodes = function parseChildNodes(el) {
	    return this.parse(_.slice(el.childNodes, 0));
	  };
	
	  TemplateInstance.prototype.parseDirectiveName = function parseDirectiveName(name) {
	    var reg = this.tpl.attrDirectiveTestReg;
	    if (reg.test(name)) {
	      return name.replace(reg, '');
	    }
	    return undefined;
	  };
	
	  return TemplateInstance;
	}();
	
	module.exports = Template;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var $ = __webpack_require__(3);
	var Binding = __webpack_require__(5);
	
	var _require = __webpack_require__(6);
	
	var Expression = _require.Expression;
	
	var Text = function (_Binding) {
	  _inherits(Text, _Binding);
	
	  function Text(el, tpl, expr) {
	    _classCallCheck(this, Text);
	
	    var _this = _possibleConstructorReturn(this, _Binding.call(this, tpl));
	
	    _this.el = el;
	    _this.expr = expr;
	    _this.update = _this.update.bind(_this);
	    _this.expression = new Expression(_this.scope, expr, _this.update);
	    return _this;
	  }
	
	  Text.prototype.bind = function bind() {
	    if (Binding.genComment && !this.comment) {
	      this.comment = $(document.createComment('Text Binding ' + this.expr));
	      this.comment.insertBefore(this.el);
	    }
	    this.scope = this.expression.observe(this.update);
	    this.update(this.expression.value());
	  };
	
	  Text.prototype.unbind = function unbind() {
	    this.scope = this.expression.unobserve();
	  };
	
	  Text.prototype.update = function update(val) {
	    if (val === undefined || val === null) {
	      val = '';
	    }
	    this.el.data = val;
	  };
	
	  return Text;
	}(Binding);
	
	module.exports = Text;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2);
	
	var Binding = function () {
	  function Binding(tpl) {
	    _classCallCheck(this, Binding);
	
	    this.tpl = tpl;
	    this.scope = tpl.bind;
	  }
	
	  Binding.prototype.bind = function bind() {
	    throw 'Abstract Method [' + this.constructor.name + '.bind]';
	  };
	
	  Binding.prototype.unbind = function unbind() {
	    throw 'Abstract Method [' + this.constructor.name + '.unbind]';
	  };
	
	  Binding.prototype.getScope = function getScope() {
	    return this.scope;
	  };
	
	  return Binding;
	}();
	
	Binding.genComment = true;
	
	module.exports = Binding;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2),
	    observer = __webpack_require__(7);
	
	var Expression = exports.Expression = function () {
	  function Expression(scope, expr, handler) {
	    _classCallCheck(this, Expression);
	
	    this.scope = scope;
	    this.expr = expr;
	    this.filters = [];
	    this.handler = handler;
	    this.__listen = this.__listen.bind(this);
	  }
	
	  Expression.prototype.realValue = function realValue() {
	    return _.get(this.scope, this.expr);
	  };
	
	  Expression.prototype.setRealValue = function setRealValue(val) {
	    _.set(this.scope, this.expr, val);
	  };
	
	  Expression.prototype.value = function value() {
	    var val = _.get(this.scope, this.expr);
	    for (var i = 0; i < this.filters.length; i++) {
	      val = this.filters[i].apply(val);
	    }
	    return val;
	  };
	
	  Expression.prototype.setValue = function setValue(val) {
	    for (var i = 0; i < this.filters.length; i++) {
	      val = this.filters[i].unapply(val);
	    }
	    _.set(this.scope, this.expr, val);
	  };
	
	  Expression.prototype.observe = function observe() {
	    this.scope = observer.on(this.scope, this.expr, this.__listen);
	    return this.scope;
	  };
	
	  Expression.prototype.unobserve = function unobserve() {
	    this.scope = observer.un(this.scope, this.expr, this.__listen);
	    return this.scope;
	  };
	
	  Expression.prototype.__listen = function __listen(expr, val) {
	    for (var i = 0; i < this.filters.length; i++) {
	      val = this.filters[i].apply(val);
	    }
	    this.handler(val);
	  };
	
	  return Expression;
	}();

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2),
	    $ = __webpack_require__(3),
	    Binding = __webpack_require__(5),
	    SUPER_CLASS_OPTION = 'extend';
	
	var Directive = function (_Binding) {
	  _inherits(Directive, _Binding);
	
	  function Directive(el, tpl, expr) {
	    _classCallCheck(this, Directive);
	
	    var _this = _possibleConstructorReturn(this, _Binding.call(this, tpl));
	
	    _this.el = el;
	    _this.$el = $(el);
	    _this.expr = expr;
	    return _this;
	  }
	
	  Directive.prototype.getPriority = function getPriority() {
	    return this.priority;
	  };
	
	  Directive.prototype.isBlock = function isBlock() {
	    return this.block;
	  };
	
	  Directive.prototype.bind = function bind() {
	    if (Binding.genComment && !this.comment) {
	      this.comment = $(document.createComment(' Directive:' + this.name + ' [' + this.expr + '] '));
	      this.comment.insertBefore(this.el);
	    }
	  };
	
	  Directive.prototype.unbind = function unbind() {};
	
	  return Directive;
	}(Binding);
	
	Directive.prototype.name = null;
	Directive.prototype.priority = 0;
	Directive.prototype.block = false;
	
	var directives = {},
	    isDirective = Directive.isDirective = function isDirective(object) {
	  var type = typeof object === 'undefined' ? 'undefined' : _typeof(object);
	  if (!object || type != 'function' && type != 'object') {
	    return false;
	  } else {
	    var proto = object;
	    while (proto = Object.getPrototypeOf(proto)) {
	      if (proto === Directive) {
	        return true;
	      }
	    }
	    return false;
	  }
	},
	    register = Directive.register = function register(name, option) {
	  if (name in directives) {
	    console.warn('Directive[' + name + '] is defined');
	  }
	  var directive = void 0;
	  if (_.isPlainObject(option)) {
	
	    directive = function (opt, SuperClass) {
	      var userSuperClass = opt[SUPER_CLASS_OPTION];
	      if (userSuperClass && !isDirective(userSuperClass)) {
	        throw 'Invalid Directive SuperClass ' + userSuperClass;
	      }
	      SuperClass = userSuperClass || SuperClass;
	
	      var constructor = _.isFunction(opt.constructor) ? opt.constructor : undefined,
	          Directive = function () {
	        var fn = function fn() {
	          if (!(this instanceof SuperClass)) {
	            throw new TypeError('Cannot call a class as a function');
	          }
	          SuperClass.apply(this, arguments);
	          if (constructor) {
	            constructor.apply(this, arguments);
	          }
	        };
	        return fn;
	      }();
	
	      Directive.prototype = Object.create(SuperClass.prototype, {
	        constructor: {
	          value: Directive,
	          enumerable: false,
	          writable: true,
	          configurable: true
	        }
	      });
	
	      delete opt.constructor;
	      delete opt[SUPER_CLASS_OPTION];
	
	      _.each(opt, function (val, key) {
	        Directive.prototype[key] = val;
	      });
	
	      Object.setPrototypeOf(Directive, SuperClass);
	      return Directive;
	    }(option, Directive);
	  } else if (isDirective(option)) {
	    directive = option;
	  } else {
	    throw TypeError('Invalid Directive Object ' + option);
	  }
	
	  directive.prototype.name = name;
	  var clsName = directive.prototype.constructor.name;
	  directive.prototype.className = clsName ? clsName : _.capitalize(name) + 'Directive';
	
	  directives[name] = directive;
	  return directive;
	},
	    getDirective = Directive.getDirective = function getDirective(name) {
	  return directives[name];
	};
	
	module.exports = Directive;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Binding = __webpack_require__(5);
	
	var _require = __webpack_require__(10);
	
	var ArrayIterator = _require.ArrayIterator;
	var YieId = _require.YieId;
	
	var DirectiveGroup = function (_Binding) {
	  _inherits(DirectiveGroup, _Binding);
	
	  function DirectiveGroup(el, tpl, directives) {
	    _classCallCheck(this, DirectiveGroup);
	
	    var _this = _possibleConstructorReturn(this, _Binding.call(this, tpl));
	
	    _this.el = el;
	    _this.directives = directives;
	    _this.directives.sort(function (a, b) {
	      return b.priority - a.priority || 0;
	    });
	    return _this;
	  }
	
	  DirectiveGroup.prototype.bind = function bind() {
	    var iter = new ArrayIterator(this.directives),
	        _self = this;
	    function parse() {
	      var directive = void 0,
	          ret = void 0;
	      while (iter.hasNext()) {
	        directive = iter.next();
	        ret = directive.bind();
	        _self.scope = directive.getScope();
	        if (iter.hasNext() && ret && ret instanceof YieId) {
	          ret.then(parse);
	          break;
	        }
	      }
	    }
	    parse();
	  };
	
	  DirectiveGroup.prototype.unbind = function unbind() {
	    var _this2 = this;
	
	    this.directives.forEach(function (directive) {
	      directive.unbind();
	      _this2.scope = directive.getScope();
	    });
	  };
	
	  return DirectiveGroup;
	}(Binding);
	
	module.exports = DirectiveGroup;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2);
	
	var YieId = function () {
	  function YieId() {
	    _classCallCheck(this, YieId);
	
	    this._doned = false;
	    this._thens = [];
	  }
	
	  YieId.prototype.then = function then(callback) {
	    if (!_.include(this._thens, callback)) {
	      this._thens.push(callback);
	    }
	  };
	
	  YieId.prototype.done = function done() {
	    if (!this._doned) {
	      _.each(this._thens, function (callback) {
	        return callback();
	      });
	      this._doned = true;
	    }
	  };
	
	  YieId.prototype.isDone = function isDone() {
	    return this._doned;
	  };
	
	  return YieId;
	}();
	
	var ArrayIterator = function () {
	  function ArrayIterator(array, point) {
	    _classCallCheck(this, ArrayIterator);
	
	    this.array = array;
	    this.index = point || 0;
	  }
	
	  ArrayIterator.prototype.hasNext = function hasNext() {
	    return this.index < this.array.length;
	  };
	
	  ArrayIterator.prototype.next = function next() {
	    return this.array[this.index++];
	  };
	
	  return ArrayIterator;
	}();
	
	module.exports = {
	  YieId: YieId,
	  ArrayIterator: ArrayIterator
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var Directive = __webpack_require__(8);
	
	var _require = __webpack_require__(6);
	
	var Expression = _require.Expression;
	
	var _require2 = __webpack_require__(10);
	
	var YieId = _require2.YieId;
	
	
	function registerDirective(name, opt) {
	  var cls = Directive.register(name, opt);;
	  module.exports[cls.prototype.className] = cls;
	}
	
	var AbstractEventDirective = exports.AbstractEventDirective = function (_Directive) {
	  _inherits(AbstractEventDirective, _Directive);
	
	  function AbstractEventDirective(el, tpl, expr) {
	    _classCallCheck(this, AbstractEventDirective);
	
	    var _this = _possibleConstructorReturn(this, _Directive.call(this, el, tpl, expr));
	
	    _this.handler = _this.handler.bind(_this);
	    return _this;
	  }
	
	  AbstractEventDirective.prototype.handler = function handler(e) {
	    _.get(this.scope, this.expr).call(this.scope, e, e.target, this.scope);
	  };
	
	  AbstractEventDirective.prototype.bind = function bind() {
	    _Directive.prototype.bind.call(this);
	    this.$el.on(this.eventType, this.handler);
	  };
	
	  AbstractEventDirective.prototype.unbind = function unbind() {
	    _Directive.prototype.unbind.call(this);
	    this.$el.un(this.eventType, this.handler);
	  };
	
	  return AbstractEventDirective;
	}(Directive);
	
	var events = ['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'keydown', 'keypress', 'keyup', 'load', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload', {
	  name: 'oninput',
	  eventType: 'input propertychange'
	}];
	
	// register events
	_.each(events, function (opt) {
	  var name = void 0;
	  if (_.isString(opt)) {
	    name = 'on' + opt;
	    opt = {
	      eventType: opt
	    };
	  } else {
	    name = opt.name;
	  }
	  opt.extend = AbstractEventDirective;
	  registerDirective(name, opt);
	});
	
	var AbstractExpressionDirective = exports.AbstractExpressionDirective = function (_Directive2) {
	  _inherits(AbstractExpressionDirective, _Directive2);
	
	  function AbstractExpressionDirective(el, tpl, expr) {
	    _classCallCheck(this, AbstractExpressionDirective);
	
	    var _this2 = _possibleConstructorReturn(this, _Directive2.call(this, el, tpl, expr));
	
	    _this2.update = _this2.update.bind(_this2);
	    _this2.expression = new Expression(_this2.scope, _this2.expr, _this2.update);
	    return _this2;
	  }
	
	  AbstractExpressionDirective.prototype.bind = function bind() {
	    _Directive2.prototype.bind.call(this);
	    this.scope = this.expression.observe();
	    this.update(this.value());
	  };
	
	  AbstractExpressionDirective.prototype.unbind = function unbind() {
	    this.scope = this.expression.unobserve();
	  };
	
	  AbstractExpressionDirective.prototype.setRealValue = function setRealValue(val) {
	    return this.expression.setRealValue(val);
	  };
	
	  AbstractExpressionDirective.prototype.setValue = function setValue(val) {
	    return this.expression.setValue(val);
	  };
	
	  AbstractExpressionDirective.prototype.realValue = function realValue() {
	    return this.expression.realValue();
	  };
	
	  AbstractExpressionDirective.prototype.value = function value() {
	    return this.expression.value();
	  };
	
	  AbstractExpressionDirective.prototype.blankValue = function blankValue(val) {
	    if (arguments.length == 0) {
	      val = this.expression.value();
	    }
	    if (val === undefined || val == null) {
	      return '';
	    }
	    return val;
	  };
	
	  AbstractExpressionDirective.prototype.update = function update(val) {
	    throw 'Abstract Method [' + this.className + '.update]';
	  };
	
	  return AbstractExpressionDirective;
	}(Directive);
	
	var EVENT_CHANGE = 'change',
	    EVENT_INPUT = 'input propertychange',
	    EVENT_CLICK = 'click',
	    TAG_SELECT = 'SELECT',
	    TAG_INPUT = 'INPUT',
	    TAG_TEXTAREA = 'TEXTAREA',
	    RADIO = 'radio',
	    CHECKBOX = 'checkbox',
	    expressions = {
	  text: {
	    update: function update(val) {
	      this.$el.text(this.blankValue(val));
	    },
	
	    block: true
	  },
	  html: {
	    update: function update(val) {
	      this.$el.html(this.blankValue(val));
	    },
	
	    block: true
	  },
	  'class': {
	    update: function update(val) {
	      var cls = this.blankValue(val);
	      console.log('class', cls);
	      if (this.oldCls) {
	        this.$el.removeClass(this.oldCls);
	      }
	      this.$el.addClass(cls);
	      this.oldCls = cls;
	    }
	  },
	  show: {
	    update: function update(val) {
	      this.$el.css('display', val ? '' : 'none');
	    }
	  },
	  hide: {
	    update: function update(val) {
	      this.$el.css('display', val ? 'none' : '');
	    }
	  },
	  value: {
	    update: function update(val) {
	      this.$el.val(this.blankValue(val));
	    }
	  },
	  'if': {
	    bind: function bind() {
	      AbstractExpressionDirective.prototype.bind.call(this);
	      if (!this.directives) {
	        this.yieId = new YieId();
	        return this.yieId;
	      }
	    },
	    update: function update(val) {
	      var _this3 = this;
	
	      if (!val) {
	        this.$el.css('display', 'none');
	      } else {
	        if (!this.directives) {
	          this.directives = this.tpl.parseChildNodes(this.el);
	          this.directives.forEach(function (directive) {
	            directive.bind();
	            _this3.scope = directive.getScope();
	          });
	          if (this.yieId) {
	            this.yieId.done();
	            delete this.yieId;
	          }
	        }
	        this.$el.css('display', '');
	      }
	    },
	    unbind: function unbind() {
	      var _this4 = this;
	
	      AbstractExpressionDirective.prototype.unbind.call(this);
	      if (this.directives) {
	        this.directives.forEach(function (directive) {
	          directive.unbind();
	          _this4.scope = directive.getScope();
	        });
	      }
	    },
	
	    priority: 9,
	    block: true
	  },
	  input: {
	    constructor: function constructor(el, tpl, expr) {
	      AbstractExpressionDirective.call(this, el, tpl, expr);
	
	      this.onChange = this.onChange.bind(this);
	
	      var tag = this.tag = el.tagName;
	      switch (tag) {
	        case TAG_SELECT:
	          this.event = EVENT_CHANGE;
	          break;
	        case TAG_INPUT:
	          var type = this.type = el.type;
	          this.event = type == RADIO || type == CHECKBOX ? EVENT_CLICK : EVENT_INPUT;
	          break;
	        case TAG_TEXTAREA:
	          throw TypeError('Directive[input] not support ' + tag);
	          break;
	        default:
	          throw TypeError('Directive[input] not support ' + tag);
	      }
	      console.log('input', tag, el);
	    },
	    bind: function bind() {
	      AbstractExpressionDirective.prototype.bind.call(this);
	      this.$el.on(this.event, this.onChange);
	    },
	    unbind: function unbind() {
	      AbstractExpressionDirective.prototype.unbind.call(this);
	      this.$el.un(this.event, this.onChange);
	    },
	    onChange: function onChange() {
	      var val = this.elVal();
	
	      if (val != this.val) this.setValue(val);
	    },
	    update: function update(val) {
	      this.val = this.blankValue(val);
	
	      this.elVal(this.val);
	    },
	    elVal: function elVal(val) {
	      var tag = this.tag;
	
	      switch (tag) {
	        case TAG_SELECT:
	          break;
	        case TAG_INPUT:
	          var type = this.type;
	
	          if (type == RADIO || type == CHECKBOX) {
	            if (arguments.length == 0) {
	              return this.$el.prop('checked') ? this.$el.val() : undefined;
	            } else {
	              var checked = _.isString(val) ? val == this.$el.val() : !!val;
	              if (this.$el.prop('checked') != checked) this.$el.prop('checked', checked);
	            }
	          } else {
	            if (arguments.length == 0) {
	              return this.$el.val();
	            } else if (val != this.$el.val()) {
	              this.$el.val(val);
	            }
	          }
	          break;
	        case TAG_TEXTAREA:
	          throw TypeError('Directive[input] not support ' + tag);
	          break;
	        default:
	          throw TypeError('Directive[input] not support ' + tag);
	      }
	    }
	  }
	};
	
	// register Expression Directive
	_.each(expressions, function (opt, name) {
	  opt.extend = AbstractExpressionDirective;
	  registerDirective(name, opt);
	});
	
	/*
	  start = whitespace* a:alias in v:variable idx:(by identifier)? whitespace*{
	    return {
	        key: a[0],
	          value: a[1],
	          scope: v,
	          idx: idx ? idx[1]:undefined
	      }
	  }
	
	  alias = '(' a:_alias ')'{ return a; } / _alias
	
	  _alias = whitespace* key:identifier val:(whitespace* ',' whitespace* identifier)? whitespace*{
	    return [key, val[3]];
	  }
	
	  in = whitespace+ [iI][nN] whitespace+
	
	  by = whitespace+ [bB][yY] whitespace+
	
	  variable = $(identifier ('.' identifier / '[' ([\"] (identifier / [0-9]+) [\"] / [\'] (identifier / [0-9]+) [\'] / [0-9]+) ']')*)
	
	  identifier = $([a-zA-Z_][a-zA-Z0-9_]*)
	
	  whitespace = [ \t\n\r]
	*/
	
	var eachReg = /^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/;
	
	var EachDirective = exports.EachDirective = function (_Directive3) {
	  _inherits(EachDirective, _Directive3);
	
	  function EachDirective(el, tpl, expr) {
	    _classCallCheck(this, EachDirective);
	
	    var _this5 = _possibleConstructorReturn(this, _Directive3.call(this, el, tpl, expr));
	
	    var token = expr.match(eachReg);
	    if (!token) throw Error('Invalid Expression on Each Directive');
	    var alias = token[1],
	        scope = token[2],
	        index = token[3];
	
	    console.log('each directive: alias = ' + alias + ', obj = ' + scope + ', index = ' + index);
	    return _this5;
	  }
	
	  EachDirective.prototype.bind = function bind() {
	    _Directive3.prototype.bind.call(this);
	  };
	
	  EachDirective.prototype.unbind = function unbind() {
	    _Directive3.prototype.unbind.call(this);
	  };
	
	  return EachDirective;
	}(Directive);
	
	EachDirective.prototype.priority = 10;
	Directive.register('each', EachDirective);

/***/ }
/******/ ])
});
;
//# sourceMappingURL=tpl.js.map