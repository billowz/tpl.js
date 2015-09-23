(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"), require("jquery"), require("observer"));
	else if(typeof define === 'function' && define.amd)
		define(["_", "jquery", "observer"], factory);
	else if(typeof exports === 'object')
		exports["tpl"] = factory(require("_"), require("jquery"), require("observer"));
	else
		root["tpl"] = factory(root["_"], root["jQuery"], root["observer"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_5__) {
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
	var Directives = __webpack_require__(3);
	var Directive = __webpack_require__(4);
	var Expression = __webpack_require__(6);
	var TextNodeDirective = Directives.TextNodeDirective;
	var PRIMITIVE = 0;
	var KEYPATH = 1;
	var TEXT = 0;
	var BINDING = 1;
	var templateContentReg = /^[\s\t\r\n]*</;
	var defaultCfg = {
	  delimiter: ['{', '}'],
	  directivePrefix: 'tpl-'
	};
	var Template = (function () {
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
	
	  TemplateInstance.prototype._parseDirectiveName = function _parseDirectiveName(name) {
	    var reg = this.template.attrDirectiveTestReg;
	    if (reg.test(name)) {
	      return name.replace(reg, '');
	    }
	    return undefined;
	  };
	
	  TemplateInstance.prototype._parseElement = function _parseElement(el) {
	    var _this2 = this;
	
	    var block = false,
	        $el = $(el);
	    if (el.attributes) {
	      _.each(el.attributes, function (attr) {
	        var name = attr.name,
	            val = attr.value,
	            directiveConst = undefined,
	            directive = undefined;
	        if ((name = _this2._parseDirectiveName(name)) && (directiveConst = Directive.getDirective(name))) {
	          directive = new directiveConst(el, _this2.bind, val);
	          _this2.directives.push(directive);
	          if (directive.isBlock()) {
	            block = true;
	          }
	        } else if (name) {
	          console.warn('Directive is undefined ' + attr.name);
	        }
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
	      this.directives.push(new TextNodeDirective(this._createTextNode('binding', el), this.bind, token[1]));
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
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Directive = __webpack_require__(4);
	var Expression = __webpack_require__(6);
	var AbstractDirective = Directive.AbstractDirective;
	
	var ExprDirective = (function (_AbstractDirective) {
	  _inherits(ExprDirective, _AbstractDirective);
	
	  function ExprDirective(el, bind, expression) {
	    _classCallCheck(this, ExprDirective);
	
	    _AbstractDirective.call(this, el, bind, expression);
	    this.expression = new Expression(bind, expression);
	    this.update = this.update.bind(this);
	  }
	
	  ExprDirective.prototype.bind = function bind() {
	    var ret = this.expression.observe(this.update);
	    this.update();
	    return ret;
	  };
	
	  ExprDirective.prototype.unbind = function unbind() {
	    return this.expression.unobserve(this.update);
	  };
	
	  ExprDirective.prototype.getValue = function getValue() {
	    return this.expression.getValue();
	  };
	
	  ExprDirective.prototype.update = function update() {
	    throw 'Abstract Method [' + this.getDirectiveClassName() + '.unbind]';
	  };
	
	  return ExprDirective;
	})(AbstractDirective);
	
	exports.ExprDirective = ExprDirective;
	
	var TextNodeDirective = (function (_ExprDirective) {
	  _inherits(TextNodeDirective, _ExprDirective);
	
	  function TextNodeDirective() {
	    _classCallCheck(this, TextNodeDirective);
	
	    _ExprDirective.apply(this, arguments);
	  }
	
	  TextNodeDirective.prototype.update = function update() {
	    this.el.data = this.getValue();
	  };
	
	  return TextNodeDirective;
	})(ExprDirective);
	
	exports.TextNodeDirective = TextNodeDirective;
	
	var TextDirective = (function (_ExprDirective2) {
	  _inherits(TextDirective, _ExprDirective2);
	
	  function TextDirective() {
	    _classCallCheck(this, TextDirective);
	
	    _ExprDirective2.apply(this, arguments);
	  }
	
	  TextDirective.prototype.update = function update() {
	    $(this.el).text(this.getValue() || '');
	  };
	
	  return TextDirective;
	})(ExprDirective);
	
	exports.TextDirective = TextDirective;
	
	var HtmlDirective = (function (_ExprDirective3) {
	  _inherits(HtmlDirective, _ExprDirective3);
	
	  function HtmlDirective() {
	    _classCallCheck(this, HtmlDirective);
	
	    _ExprDirective3.apply(this, arguments);
	  }
	
	  HtmlDirective.prototype.update = function update() {
	    $(this.el).html(this.getValue() || '');
	  };
	
	  return HtmlDirective;
	})(ExprDirective);
	
	exports.HtmlDirective = HtmlDirective;
	
	var ClassDirective = (function (_ExprDirective4) {
	  _inherits(ClassDirective, _ExprDirective4);
	
	  function ClassDirective() {
	    _classCallCheck(this, ClassDirective);
	
	    _ExprDirective4.apply(this, arguments);
	  }
	
	  ClassDirective.prototype.update = function update() {
	    var cls = this.getValue();
	    $(this.el).addClass(cls);
	  };
	
	  return ClassDirective;
	})(ExprDirective);
	
	exports.ClassDirective = ClassDirective;
	
	var ShowDirective = (function (_ExprDirective5) {
	  _inherits(ShowDirective, _ExprDirective5);
	
	  function ShowDirective() {
	    _classCallCheck(this, ShowDirective);
	
	    _ExprDirective5.apply(this, arguments);
	  }
	
	  ShowDirective.prototype.update = function update() {
	    $(this.el).css('display', this.getValue() ? '' : 'none');
	  };
	
	  return ShowDirective;
	})(ExprDirective);
	
	exports.ShowDirective = ShowDirective;
	
	var HideDirective = (function (_ExprDirective6) {
	  _inherits(HideDirective, _ExprDirective6);
	
	  function HideDirective() {
	    _classCallCheck(this, HideDirective);
	
	    _ExprDirective6.apply(this, arguments);
	  }
	
	  HideDirective.prototype.update = function update() {
	    $(this.el).css('display', this.getValue() ? 'none' : '');
	  };
	
	  return HideDirective;
	})(ExprDirective);
	
	exports.HideDirective = HideDirective;
	
	var IfDirective = (function (_AbstractDirective2) {
	  _inherits(IfDirective, _AbstractDirective2);
	
	  function IfDirective() {
	    _classCallCheck(this, IfDirective);
	
	    _AbstractDirective2.apply(this, arguments);
	  }
	
	  IfDirective.prototype.isBlock = function isBlock() {
	    return true;
	  };
	
	  return IfDirective;
	})(AbstractDirective);
	
	exports.IfDirective = IfDirective;
	
	Directive.register('class', ClassDirective);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _ = __webpack_require__(1),
	    $ = __webpack_require__(2),
	    observer = __webpack_require__(5),
	    ExpressionReg = /[\+\-\*/\(\)]/g;
	
	var AbstractDirective = (function () {
	  function AbstractDirective(el, bind, expr) {
	    _classCallCheck(this, AbstractDirective);
	
	    this.el = el;
	    this.nodeType = el.nodeType;
	    this.target = bind;
	    this.expr = expr;
	    if (!this.directiveName) {
	      this.directiveName = this.constructor.name;
	    }
	  }
	
	  AbstractDirective.prototype.getDirectiveClassName = function getDirectiveClassName() {
	    return this.constructor.name ? this.constructor.name : _.capitalize(this.directiveName) + 'Directive';
	  };
	
	  AbstractDirective.prototype.bind = function bind() {
	    throw 'Abstract Method [' + this.getDirectiveClassName() + '.bind]';
	  };
	
	  AbstractDirective.prototype.unbind = function unbind() {
	    throw 'Abstract Method [' + this.getDirectiveClassName() + '.unbind]';
	  };
	
	  AbstractDirective.prototype.isBlock = function isBlock() {
	    return false;
	  };
	
	  return AbstractDirective;
	})();
	
	var directives = {},
	    defaultDirectiveOpt = {
	  block: false,
	  bind: function bind() {},
	  unbind: function unbind() {}
	};
	function isDirective(object) {
	  if (!object) {
	    return false;
	  }
	  var proto = object;
	  while (proto = Object.getPrototypeOf(proto)) {
	    if (proto === AbstractDirective) {
	      return true;
	    }
	  }
	  return false;
	}
	function register(name, option) {
	  if (name in directives) {
	    console.warn('Directive[' + name + '] is defined');
	  }
	  var directive = undefined;
	  if (_.isPlainObject(option)) {
	    directive = (function (opt) {
	      var constructor = _.isFunction(opt.constructor) ? opt.constructor : undefined;
	      delete opt.constructor;
	
	      var Directive = (function () {
	        return function () {
	          if (!(this instanceof AbstractDirective)) {
	            throw new TypeError('Cannot call a class as a function');
	          }
	          AbstractDirective.apply(this, arguments);
	          if (constructor) {
	            constructor.apply(this, arguments);
	          }
	        };
	      })();
	      Directive.prototype = Object.create(AbstractDirective.prototype, {
	        constructor: {
	          value: Directive,
	          enumerable: false,
	          writable: true,
	          configurable: true
	        },
	        directiveName: {
	          value: name,
	          enumerable: false,
	          writable: false,
	          configurable: false
	        }
	      });
	      Object.setPrototypeOf(Directive, AbstractDirective);
	      return Directive;
	    })(option);
	  } else if (!isDirective(option)) {
	    throw TypeError('Invalid Directive Object ' + option);
	  } else {
	    directive = option;
	  }
	  directives[name] = directive;
	  return directive;
	}
	
	function getDirective(name) {
	  return directives[name];
	}
	module.exports = {
	  AbstractDirective: AbstractDirective,
	  register: register,
	  getDirective: getDirective
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _ = __webpack_require__(1);
	
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
	
	module.exports = Expression;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=tpl.js.map