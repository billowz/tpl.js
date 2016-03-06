(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"), require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["_", "jquery"], factory);
	else if(typeof exports === 'object')
		exports["tpl"] = factory(require("_"), require("jquery"));
	else
		root["tpl"] = factory(root["_"], root["jQuery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
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
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(1),
	    $ = __webpack_require__(2),
	    Text = __webpack_require__(3),
	    Directive = __webpack_require__(6),
	    DirectiveGroup = __webpack_require__(7),
	    Directives = __webpack_require__(9),
	    Expression = __webpack_require__(5);
	
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
	    this.attrDirectiveTestReg = new RegExp('^' + this.cfg.directivePrefix);
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
	
	Template.Directive = Directive;
	Template.Directives = Directives;
	Template.Expression = Expression;
	
	module.exports = Template;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(1);
	var $ = __webpack_require__(2);
	var Binding = __webpack_require__(4);
	
	var _require = __webpack_require__(5);
	
	var ObserveExpression = _require.ObserveExpression;
	
	var Text = function (_Binding) {
	  _inherits(Text, _Binding);
	
	  function Text(el, tpl, expr) {
	    _classCallCheck(this, Text);
	
	    var _this = _possibleConstructorReturn(this, _Binding.call(this, tpl));
	
	    _this.el = el;
	    _this.expr = expr;
	    _this.expression = new ObserveExpression(_this.scope, expr);
	    _this.update = _this.update.bind(_this);
	    return _this;
	  }
	
	  Text.prototype.bind = function bind() {
	    if (Binding.genComment && !this.comment) {
	      this.comment = $(document.createComment('Text Binding ' + this.expr));
	      this.comment.insertBefore(this.el);
	    }
	    this.scope = this.expression.observe(this.update);
	    this.update();
	  };
	
	  Text.prototype.unbind = function unbind() {
	    this.scope = this.expression.unobserve(this.update);
	  };
	
	  Text.prototype.update = function update() {
	    var val = this.expression.getValue();
	    if (val === undefined || val === null) {
	      val = '';
	    }
	    this.el.data = val;
	  };
	
	  return Text;
	}(Binding);
	
	module.exports = Text;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(1);
	
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(1);
	
	var AbstractExpression = exports.AbstractExpression = function () {
	  function AbstractExpression(bind, expr) {
	    _classCallCheck(this, AbstractExpression);
	
	    this.bind = bind;
	    this.expr = expr;
	  }
	
	  AbstractExpression.prototype.getValue = function getValue() {
	    throw 'Abstract Method[' + this.constructor.name + '.getValue]';
	  };
	
	  return AbstractExpression;
	}();
	
	var EventExpression = exports.EventExpression = function (_AbstractExpression) {
	  _inherits(EventExpression, _AbstractExpression);
	
	  function EventExpression() {
	    _classCallCheck(this, EventExpression);
	
	    return _possibleConstructorReturn(this, _AbstractExpression.apply(this, arguments));
	  }
	
	  EventExpression.prototype.getValue = function getValue() {
	    return _.get(this.bind, this.expr).bind(this.bind);
	  };
	
	  return EventExpression;
	}(AbstractExpression);
	
	var AbstractObserveExpression = exports.AbstractObserveExpression = function (_AbstractExpression2) {
	  _inherits(AbstractObserveExpression, _AbstractExpression2);
	
	  function AbstractObserveExpression() {
	    _classCallCheck(this, AbstractObserveExpression);
	
	    return _possibleConstructorReturn(this, _AbstractExpression2.apply(this, arguments));
	  }
	
	  AbstractObserveExpression.prototype.observe = function observe(callback) {
	    throw 'Abstract Method[' + this.constructor.name + '.observe]';
	  };
	
	  AbstractObserveExpression.prototype.unobserve = function unobserve(callback) {
	    throw 'Abstract Method[' + this.constructor.name + '.unobserve]';
	  };
	
	  return AbstractObserveExpression;
	}(AbstractExpression);
	
	var SimpleObserveExpression = exports.SimpleObserveExpression = function (_AbstractObserveExpre) {
	  _inherits(SimpleObserveExpression, _AbstractObserveExpre);
	
	  function SimpleObserveExpression() {
	    _classCallCheck(this, SimpleObserveExpression);
	
	    return _possibleConstructorReturn(this, _AbstractObserveExpre.apply(this, arguments));
	  }
	
	  SimpleObserveExpression.prototype.getValue = function getValue() {
	    return _.get(this.bind, this.expr);
	  };
	
	  SimpleObserveExpression.prototype.setValue = function setValue(val) {
	    _.set(this.bind, this.expr, val);
	  };
	
	  SimpleObserveExpression.prototype.observe = function observe(callback) {
	    this.bind = observer.observe(this.bind, this.expr, callback);
	    return this.bind;
	  };
	
	  SimpleObserveExpression.prototype.unobserve = function unobserve(callback) {
	    this.bind = observer.unobserve(this.bind, this.expr, callback);
	    return this.bind;
	  };
	
	  return SimpleObserveExpression;
	}(AbstractObserveExpression);
	
	var ObserveExpression = exports.ObserveExpression = function (_AbstractObserveExpre2) {
	  _inherits(ObserveExpression, _AbstractObserveExpre2);
	
	  function ObserveExpression() {
	    _classCallCheck(this, ObserveExpression);
	
	    return _possibleConstructorReturn(this, _AbstractObserveExpre2.apply(this, arguments));
	  }
	
	  ObserveExpression.prototype.getValue = function getValue() {
	    return _.get(this.bind, this.expr);
	  };
	
	  ObserveExpression.prototype.observe = function observe(callback) {
	    this.bind = observer.observe(this.bind, this.expr, callback);
	    return this.bind;
	  };
	
	  ObserveExpression.prototype.unobserve = function unobserve(callback) {
	    this.bind = observer.unobserve(this.bind, this.expr, callback);
	    return this.bind;
	  };
	
	  return ObserveExpression;
	}(AbstractObserveExpression);
	
	var EachExpression = exports.EachExpression = function (_AbstractObserveExpre3) {
	  _inherits(EachExpression, _AbstractObserveExpre3);
	
	  function EachExpression(bind, expr) {
	    _classCallCheck(this, EachExpression);
	
	    return _possibleConstructorReturn(this, _AbstractObserveExpre3.call(this, bind, expr));
	  }
	
	  EachExpression.prototype.getValue = function getValue() {
	    return _.get(this.bind, this.expr);
	  };
	
	  EachExpression.prototype.observe = function observe(callback) {
	    this.bind = observer.observe(this.bind, this.expr, callback);
	    return this.bind;
	  };
	
	  EachExpression.prototype.unobserve = function unobserve(callback) {
	    this.bind = observer.unobserve(this.bind, this.expr, callback);
	    return this.bind;
	  };
	
	  return EachExpression;
	}(AbstractObserveExpression);

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(1),
	    $ = __webpack_require__(2),
	    Binding = __webpack_require__(4),
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
	        return function () {
	          if (!(this instanceof SuperClass)) {
	            throw new TypeError('Cannot call a class as a function');
	          }
	          SuperClass.apply(this, arguments);
	          if (constructor) {
	            constructor.apply(this, arguments);
	          }
	        };
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Binding = __webpack_require__(4);
	
	var _require = __webpack_require__(8);
	
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(1);
	
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(1);
	var Directive = __webpack_require__(6);
	
	var _require = __webpack_require__(5);
	
	var SimpleObserveExpression = _require.SimpleObserveExpression;
	var ObserveExpression = _require.ObserveExpression;
	var EventExpression = _require.EventExpression;
	var EachExpression = _require.EachExpression;
	
	var _require2 = __webpack_require__(8);
	
	var YieId = _require2.YieId;
	
	var AbstractExpressionDirective = exports.AbstractExpressionDirective = function (_Directive) {
	  _inherits(AbstractExpressionDirective, _Directive);
	
	  function AbstractExpressionDirective(el, tpl, expr) {
	    _classCallCheck(this, AbstractExpressionDirective);
	
	    var _this = _possibleConstructorReturn(this, _Directive.call(this, el, tpl, expr));
	
	    _this.expression = _this.buildExpression();
	    return _this;
	  }
	
	  AbstractExpressionDirective.prototype.buildExpression = function buildExpression() {
	    throw 'Abstract Method [' + this.className + '.buildExpression]';
	  };
	
	  AbstractExpressionDirective.prototype.getValue = function getValue() {
	    return this.expression.getValue();
	  };
	
	  AbstractExpressionDirective.prototype.getBlankValue = function getBlankValue() {
	    var val = this.getValue();
	    if (val === undefined || val == null) {
	      return '';
	    }
	    return val;
	  };
	
	  return AbstractExpressionDirective;
	}(Directive);
	
	var EventDirective = exports.EventDirective = function (_AbstractExpressionDi) {
	  _inherits(EventDirective, _AbstractExpressionDi);
	
	  function EventDirective() {
	    _classCallCheck(this, EventDirective);
	
	    return _possibleConstructorReturn(this, _AbstractExpressionDi.apply(this, arguments));
	  }
	
	  EventDirective.prototype.buildExpression = function buildExpression() {
	    return new EventExpression(this.scope, this.expr);
	  };
	
	  EventDirective.prototype.getEventType = function getEventType() {
	    if (!this.eventType) {
	      throw TypeError('EventType[' + this.className + '] is undefined');
	    }
	    return this.eventType;
	  };
	
	  EventDirective.prototype.bind = function bind() {
	    //super();
	    if (!this.handler) {
	      this.handler = this.getValue();
	    }
	    this.$el.on(this.getEventType(), this.handler);
	  };
	
	  EventDirective.prototype.unbind = function unbind() {
	    //super();
	    if (this.handler) {
	      this.$el.un(this.getEventType(), this.handler);
	    }
	  };
	
	  return EventDirective;
	}(AbstractExpressionDirective);
	
	var AbstractObserveExpressionDirective = exports.AbstractObserveExpressionDirective = function (_AbstractExpressionDi2) {
	  _inherits(AbstractObserveExpressionDirective, _AbstractExpressionDi2);
	
	  function AbstractObserveExpressionDirective(el, tpl, expr) {
	    _classCallCheck(this, AbstractObserveExpressionDirective);
	
	    var _this3 = _possibleConstructorReturn(this, _AbstractExpressionDi2.call(this, el, tpl, expr));
	
	    _this3.update = _this3.update.bind(_this3);
	    return _this3;
	  }
	
	  AbstractObserveExpressionDirective.prototype.bind = function bind() {
	    //super();
	    this.scope = this.expression.observe(this.update);
	    this.update();
	  };
	
	  AbstractObserveExpressionDirective.prototype.unbind = function unbind() {
	    this.scope = this.expression.unobserve(this.update);
	  };
	
	  AbstractObserveExpressionDirective.prototype.update = function update() {
	    throw 'Abstract Method [' + this.className + '.update]';
	  };
	
	  return AbstractObserveExpressionDirective;
	}(AbstractExpressionDirective);
	
	var SimpleObserveExpressionDirective = exports.SimpleObserveExpressionDirective = function (_AbstractObserveExpre) {
	  _inherits(SimpleObserveExpressionDirective, _AbstractObserveExpre);
	
	  function SimpleObserveExpressionDirective() {
	    _classCallCheck(this, SimpleObserveExpressionDirective);
	
	    return _possibleConstructorReturn(this, _AbstractObserveExpre.apply(this, arguments));
	  }
	
	  SimpleObserveExpressionDirective.prototype.buildExpression = function buildExpression() {
	    return new SimpleObserveExpression(this.scope, this.expr);
	  };
	
	  SimpleObserveExpressionDirective.prototype.setValue = function setValue(val) {
	    this.expression.setValue(val);
	  };
	
	  return SimpleObserveExpressionDirective;
	}(AbstractObserveExpressionDirective);
	
	var ObserveExpressionDirective = exports.ObserveExpressionDirective = function (_AbstractObserveExpre2) {
	  _inherits(ObserveExpressionDirective, _AbstractObserveExpre2);
	
	  function ObserveExpressionDirective() {
	    _classCallCheck(this, ObserveExpressionDirective);
	
	    return _possibleConstructorReturn(this, _AbstractObserveExpre2.apply(this, arguments));
	  }
	
	  ObserveExpressionDirective.prototype.buildExpression = function buildExpression() {
	    return new ObserveExpression(this.scope, this.expr);
	  };
	
	  return ObserveExpressionDirective;
	}(AbstractObserveExpressionDirective);
	
	var EachDirective = exports.EachDirective = function (_AbstractObserveExpre3) {
	  _inherits(EachDirective, _AbstractObserveExpre3);
	
	  function EachDirective() {
	    _classCallCheck(this, EachDirective);
	
	    return _possibleConstructorReturn(this, _AbstractObserveExpre3.apply(this, arguments));
	  }
	
	  EachDirective.prototype.buildExpression = function buildExpression() {
	    return new EachExpression(this.scope, this.expr);
	  };
	
	  EachDirective.prototype.bind = function bind() {};
	
	  return EachDirective;
	}(AbstractObserveExpressionDirective);
	
	EachDirective.prototype.priority = 10;
	
	Directive.register('each', EachDirective);
	
	var EVENT_CHANGE = 'change',
	    EVENT_INPUT = 'input propertychange',
	    EVENT_CLICK = 'click',
	    TAG_SELECT = 'SELECT',
	    TAG_INPUT = 'INPUT',
	    TAG_TEXTAREA = 'TEXTAREA',
	    RADIO = 'radio',
	    CHECKBOX = 'checkbox',
	    simpleExprDirectives = {
	  input: {
	    constructor: function constructor(el, tpl, expr) {
	      SimpleObserveExpressionDirective.call(this, el, tpl, expr);
	
	      this.onChange = this.onChange.bind(this);
	
	      this.event = EVENT_INPUT;
	      var tag = this.tag = el.tagName,
	          type = void 0;
	      if (this.isSelect()) {
	        this.event = EVENT_CHANGE;
	      } else if (this.isInput()) {
	        type = this.type = el.type;
	        if (this.isRadio() || this.isCheckBox()) {
	          this.event = EVENT_CLICK;
	        }
	      } else if (!this.isTextArea()) {
	        throw TypeError('Directive[input] not support ' + el.tagName);
	      }
	    },
	    bind: function bind() {
	      SimpleObserveExpressionDirective.prototype.bind.call(this);
	      this.$el.on(this.event, this.onChange);
	    },
	    unbind: function unbind() {
	      SimpleObserveExpressionDirective.prototype.unbind.call(this);
	      this.$el.un(this.event, this.onChange);
	    },
	    onChange: function onChange() {
	      var val = this.elVal();
	      if (val != this.val) {
	        this.setValue(val);
	      }
	    },
	    update: function update() {
	      this.val = this.getBlankValue();
	      if (this.val != this.elVal()) this.elVal(this.val);
	    },
	    elVal: function elVal(val) {
	      var isGet = arguments.length == 0;
	      if (this.isSelect()) {} else if (this.isInput()) {
	        if (this.isRadio() || this.isCheckBox()) {
	          if (isGet) {
	            return this.$el.prop('checked') ? this.$el.val() : undefined;
	          } else {
	            this.$el.prop('checked', _.isString(val) ? val == this.$el.val() : !!val);
	          }
	        } else {
	          return this.$el.val.apply(this.$el, arguments);
	        }
	      } else if (this.isTextArea()) {}
	    },
	    isInput: function isInput() {
	      return this.tag == TAG_INPUT;
	    },
	    isSelect: function isSelect() {
	      return this.tag == TAG_SELECT;
	    },
	    isTextArea: function isTextArea() {
	      return this.tag == TAG_TEXTAREA;
	    },
	    isRadio: function isRadio() {
	      return this.type == RADIO;
	    },
	    isCheckBox: function isCheckBox() {
	      return this.type == CHECKBOX;
	    }
	  }
	},
	    exprDirectives = {
	  text: {
	    update: function update() {
	      this.$el.text(this.getBlankValue());
	    },
	
	    block: true
	  },
	  html: {
	    update: function update() {
	      this.$el.html(this.getBlankValue());
	    },
	
	    block: true
	  },
	  'class': {
	    update: function update() {
	      var cls = this.getBlankValue();
	      if (this.oldCls) {
	        this.$el.removeClass(this.oldCls);
	      }
	      this.$el.addClass(cls);
	      this.oldCls = cls;
	    }
	  },
	  show: {
	    update: function update() {
	      this.$el.css('display', this.getValue() ? '' : 'none');
	    }
	  },
	  hide: {
	    update: function update() {
	      this.$el.css('display', this.getValue() ? 'none' : '');
	    }
	  },
	  value: {
	    update: function update() {
	      this.$el.val(this.getBlankValue());
	    }
	  },
	  'if': {
	    bind: function bind() {
	      ObserveExpressionDirective.prototype.bind.call(this);
	      if (!this.directives) {
	        this.yieId = new YieId();
	        return this.yieId;
	      }
	    },
	    update: function update() {
	      var _this7 = this;
	
	      if (!this.getValue()) {
	        this.$el.css('display', 'none');
	      } else {
	        if (!this.directives) {
	          this.directives = this.tpl.parseChildNodes(this.el);
	          this.directives.forEach(function (directive) {
	            directive.bind();
	            _this7.scope = directive.getScope();
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
	      var _this8 = this;
	
	      ObserveExpressionDirective.prototype.unbind.call(this);
	      if (this.directives) {
	        this.directives.forEach(function (directive) {
	          directive.unbind();
	          _this8.scope = directive.getScope();
	        });
	      }
	    },
	
	    priority: 9,
	    block: true
	  }
	},
	    eventDirectives = ['blur', 'change', 'click', 'dblclick', 'error', 'focus', 'keydown', 'keypress', 'keyup', 'load', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'select', 'submit', 'unload', {
	  name: 'oninput',
	  eventType: 'input propertychange'
	}];
	
	function registerDirective(name, opt) {
	  var cls = Directive.register(name, opt);;
	  module.exports[cls.prototype.className] = cls;
	}
	
	// register Simple Expression Directive
	_.each(simpleExprDirectives, function (opt, name) {
	  opt.extend = SimpleObserveExpressionDirective;
	  registerDirective(name, opt);
	});
	
	// register Expression Directive
	_.each(exprDirectives, function (opt, name) {
	  opt.extend = ObserveExpressionDirective;
	  registerDirective(name, opt);
	});
	
	// register eventDirectives
	_.each(eventDirectives, function (opt) {
	  var name = void 0;
	  if (_.isString(opt)) {
	    name = 'on' + opt;
	    opt = {
	      eventType: opt
	    };
	  } else {
	    name = opt.name;
	  }
	  opt.extend = EventDirective;
	  registerDirective(name, opt);
	});

/***/ }
/******/ ])
});
;
//# sourceMappingURL=tpl.js.map