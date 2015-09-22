(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"), require("jquery"), require("observer"));
	else if(typeof define === 'function' && define.amd)
		define(["_", "jquery", "observer"], factory);
	else if(typeof exports === 'object')
		exports["datTempl"] = factory(require("_"), require("jquery"), require("observer"));
	else
		root["datTempl"] = factory(root["_"], root["jQuery"], root["observer"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_4__) {
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
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _ = __webpack_require__(1);
	var $ = __webpack_require__(2);
	var Directive = __webpack_require__(3);
	var TextDirective = Directive.TextDirective;
	var PRIMITIVE = 0;
	var KEYPATH = 1;
	var TEXT = 0;
	var BINDING = 1;
	var templateContentReg = /^[\s\t\r\n]*</;
	var defaultCfg = {
	  delimiter: ['{', '}']
	};
	var Template = (function () {
	  function Template(templ, cfg) {
	    _classCallCheck(this, Template);
	
	    this.template = $(templ);
	    this.cfg = _.assign(_.clone(defaultCfg), cfg || {});
	
	    var s = this.cfg.delimiter[0],
	        e = this.cfg.delimiter[1];
	    this.delimiterReg = new RegExp(s + '([^' + s + e + ']*)' + e, 'g');
	  }
	
	  Template.prototype.complie = function complie(bind) {
	    return new TemplateInstance(this, bind);
	  };
	
	  return Template;
	})();
	
	var TemplateInstance = (function () {
	  function TemplateInstance(template, bind) {
	    _classCallCheck(this, TemplateInstance);
	
	    if (!(template instanceof Template)) {
	      throw TypeError('Invalid Template ' + template);
	    }
	    this.template = template;
	    this.bind = bind;
	    this.directives = [];
	    this.el = this.template.template.clone();
	    this.init();
	  }
	
	  TemplateInstance.prototype.init = function init() {
	    var _this = this;
	
	    _.each(this.el, function (el) {
	      _this._parse(el);
	    });
	    this.directives.forEach(function (directive) {
	      _this.bind = directive.bind();
	    });
	  };
	
	  TemplateInstance.prototype._parse = function _parse(el) {
	    switch (el.nodeType) {
	      case 1:
	        // Element
	        this._parseElement(el);
	        break;
	      case 3:
	        // Text
	        this._parseText(el);
	        break;
	    }
	  };
	
	  TemplateInstance.prototype._parseElement = function _parseElement(el) {
	    var _this2 = this;
	
	    var block = false,
	        $el = $(el);
	    if (el.attributes) {
	      _.each(el.attributes, function (attr) {
	        var name = attr.name,
	            val = attr.value;
	      });
	    }
	    if (!block) {
	      _.each(el.childNodes, function (el) {
	        _this2._parse(el);
	      });
	    }
	  };
	
	  TemplateInstance.prototype._parseText = function _parseText(el) {
	    var text = el.data,
	        token = undefined,
	        lastIndex = 0,
	        reg = this.template.delimiterReg;
	    while (token = reg.exec(text)) {
	      this._createTextNode(text.substr(lastIndex, reg.lastIndex - token[0].length), el);
	      this._createComment(token[0], el);
	      this.directives.push(new TextDirective(this._createTextNode('binding', el), this.bind, token[1]));
	      lastIndex = reg.lastIndex;
	    }
	    this._createTextNode(text.substr(lastIndex), el);
	    $(el).remove();
	  };
	
	  TemplateInstance.prototype._createComment = function _createComment(content, before) {
	    var el = document.createComment(content);
	    $(el).insertBefore(before);
	    return el;
	  };
	
	  TemplateInstance.prototype._createTextNode = function _createTextNode(content, before) {
	    if (content) {
	      var el = document.createTextNode(content);
	      $(el).insertBefore(before);
	      return el;
	    }
	    return undefined;
	  };
	
	  return TemplateInstance;
	})();
	
	Template.registerDirective = Directive.registerDirective;
	Template.getDirective = Directive.getDirective;
	
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
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _ = __webpack_require__(1),
	    $ = __webpack_require__(2),
	    observer = __webpack_require__(4),
	    ExpressionReg = /[\+\-\*/\(\)]/g;
	
	var Expression = (function () {
	  function Expression(bind, expression) {
	    _classCallCheck(this, Expression);
	
	    this.bind = bind;
	    this.expression = expression;
	  }
	
	  Expression.prototype.getValue = function getValue() {
	    return _.get(this.bind, this.expression);
	  };
	
	  Expression.prototype.observe = function observe(callback) {
	    return observer.observe(this.bind, this.expression, callback);
	  };
	
	  Expression.prototype.unobserve = function unobserve(callback) {
	    return observer.unobserve(this.bind, this.expression, callback);
	  };
	
	  return Expression;
	})();
	
	var AbstractDirective = (function () {
	  function AbstractDirective(el, bind, expr) {
	    _classCallCheck(this, AbstractDirective);
	
	    this.el = el;
	    this.nodeType = el.nodeType;
	    this.target = bind;
	    this.expr = expr;
	  }
	
	  AbstractDirective.prototype.bind = function bind() {
	    throw 'Abstract Method [bind]';
	  };
	
	  AbstractDirective.prototype.unbind = function unbind() {
	    throw 'Abstract Method [unbind]';
	  };
	
	  AbstractDirective.prototype.isBlock = function isBlock() {
	    throw 'Abstract Method [unbind]';
	  };
	
	  return AbstractDirective;
	})();
	
	var TextDirective = (function (_AbstractDirective) {
	  _inherits(TextDirective, _AbstractDirective);
	
	  function TextDirective(el, bind, expression) {
	    _classCallCheck(this, TextDirective);
	
	    _AbstractDirective.call(this, el, bind, expression);
	    this.expression = new Expression(bind, expression);
	    this.update = this.update.bind(this);
	  }
	
	  TextDirective.prototype.bind = function bind() {
	    var ret = this.expression.observe(this.update);
	    this.update();
	    return ret;
	  };
	
	  TextDirective.prototype.unbind = function unbind() {
	    return this.expression.unobserve(this.update);
	  };
	
	  TextDirective.prototype.isBlock = function isBlock() {
	    return true;
	  };
	
	  TextDirective.prototype.update = function update() {
	    this.el.data = this.expression.getValue();
	  };
	
	  return TextDirective;
	})(AbstractDirective);
	
	var directives = {},
	    defaultDirectiveOpt = {
	  block: false,
	  bind: function bind() {},
	  unbind: function unbind() {}
	};
	function registerDirective(name, directive) {
	  if (name in directives) {
	    console.warn('Directive[' + name + '] is defined');
	  }
	  directive = (function (opt) {
	    var constructor = _.isFunction(opt.constructor) ? opt.constructor : undefined;
	    delete opt.constructor;
	
	    function Directive() {
	      this.prototype = Object.create(AbstractDirective.prototype, {
	        constructor: {
	          value: this,
	          enumerable: false,
	          writable: true,
	          configurable: true
	        }
	      });
	      Object.setPrototypeOf ? Object.setPrototypeOf(this, AbstractDirective) : this.__proto__ = AbstractDirective;
	
	      AbstractDirective.apply(this, arguments);
	      if (constructor) {
	        constructor.apply(this, arguments);
	      }
	    }
	    _.assign(TextDirective.prototype, opt);
	    return Directive;
	  })(directive);
	  directives[name] = directive;
	  return directive;
	}
	
	function getDirective(name) {
	  return directives[name];
	}
	
	module.exports = {
	  AbstractDirective: AbstractDirective,
	  TextDirective: TextDirective,
	  registerDirective: registerDirective,
	  getDirective: getDirective
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=template.js.map