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
	    this.el = this.template.template.clone();
	    this.init();
	  }
	
	  TemplateInstance.prototype.init = function init() {
	    var _this = this;
	
	    this.directives = [];
	    _.each(this.el, function (el) {
	      _this.directives.push.apply(_this.directives, _this.parse(el));
	    });
	    this.directives.forEach(function (directive) {
	      _this.bind = directive.bind();
	    });
	  };
	
	  TemplateInstance.prototype.parse = function parse(el) {
	    switch (el.nodeType) {
	      case 1:
	        // Element
	        return this.parseElement(el);
	      case 3:
	        // Text
	        return this.parseText(el);
	    }
	    return [];
	  };
	
	  TemplateInstance.prototype.parseDirectiveName = function parseDirectiveName(name) {
	    var reg = this.template.attrDirectiveTestReg;
	    if (reg.test(name)) {
	      return name.replace(reg, '');
	    }
	    return undefined;
	  };
	
	  TemplateInstance.prototype.parseElement = function parseElement(el) {
	    var _this2 = this;
	
	    var block = false,
	        $el = $(el),
	        directives = [];
	    if (el.attributes) {
	      _.each(el.attributes, function (attr) {
	        var name = attr.name,
	            val = attr.value,
	            directiveConst = undefined,
	            directive = undefined;
	        if ((name = _this2.parseDirectiveName(name)) && (directiveConst = Directive.getDirective(name))) {
	          directive = new directiveConst(el, _this2, val);
	          directives.push(directive);
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
	        directives.push.apply(directives, _this2.parse(el));
	      });
	    }
	    return directives;
	  };
	
	  TemplateInstance.prototype.parseText = function parseText(el) {
	    var text = el.data,
	        token = undefined,
	        lastIndex = 0,
	        reg = this.template.delimiterReg,
	        directives = [];
	    while (token = reg.exec(text)) {
	      this.createTextNode(text.substr(lastIndex, reg.lastIndex - token[0].length), el);
	      directives.push(new TextNodeDirective(this.createTextNode('binding', el), this, token[1]));
	      lastIndex = reg.lastIndex;
	    }
	    this.createTextNode(text.substr(lastIndex), el);
	    $(el).remove();
	    return directives;
	  };
	
	  TemplateInstance.prototype.createComment = function createComment(content, before) {
	    var el = document.createComment(content);
	    $(el).insertBefore(before);
	    return el;
	  };
	
	  TemplateInstance.prototype.createTextNode = function createTextNode(content, before) {
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
	
	var _ = __webpack_require__(1);
	var Directive = __webpack_require__(4);
	var Expression = __webpack_require__(6);
	var AbstractDirective = Directive.AbstractDirective;
	
	var ExprDirective = (function (_AbstractDirective) {
	  _inherits(ExprDirective, _AbstractDirective);
	
	  function ExprDirective(el, templateInst, expression) {
	    _classCallCheck(this, ExprDirective);
	
	    _AbstractDirective.call(this, el, templateInst, expression);
	    this.expression = new Expression(this.target, expression);
	    this.update = this.update.bind(this);
	    this.$el = $(el);
	  }
	
	  ExprDirective.prototype.bind = function bind() {
	    this.template.createComment(' Directive:' + this.directiveName + ' [' + this.expr + '] ', this.$el);
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
	
	  ExprDirective.prototype.setValue = function setValue(val) {
	    this.expression.setValue(val);
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
	    this.$el.text(this.getValue() || '');
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
	    this.$el.html(this.getValue() || '');
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
	    this.$el.addClass(cls);
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
	    this.$el.css('display', this.getValue() ? '' : 'none');
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
	    this.$el.css('display', this.getValue() ? 'none' : '');
	  };
	
	  return HideDirective;
	})(ExprDirective);
	
	exports.HideDirective = HideDirective;
	
	var ValueDirective = (function (_ExprDirective7) {
	  _inherits(ValueDirective, _ExprDirective7);
	
	  function ValueDirective() {
	    _classCallCheck(this, ValueDirective);
	
	    _ExprDirective7.apply(this, arguments);
	  }
	
	  ValueDirective.prototype.update = function update() {
	    this.$el.val(this.getValue());
	  };
	
	  return ValueDirective;
	})(ExprDirective);
	
	exports.ValueDirective = ValueDirective;
	
	var EVENT_CHANGE = 'change',
	    EVENT_INPUT = 'input propertychange',
	    EVENT_CLICK = 'click',
	    TAG_SELECT = 'SELECT',
	    TAG_INPUT = 'INPUT',
	    TAG_TEXTAREA = 'TEXTAREA',
	    RADIO = 'radio',
	    CHECKBOX = 'checkbox';
	
	var InputDirective = (function (_ValueDirective) {
	  _inherits(InputDirective, _ValueDirective);
	
	  function InputDirective(el, templateInst, expression) {
	    _classCallCheck(this, InputDirective);
	
	    _ValueDirective.call(this, el, templateInst, expression);
	
	    this.onChange = this.onChange.bind(this);
	
	    this.event = EVENT_INPUT;
	    var tag = this.tag = el.tagName,
	        type = undefined;
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
	    this.$el.on(this.event, this.onChange);
	  }
	
	  InputDirective.prototype.onChange = function onChange() {
	    var val = this.elVal();
	    if (val != this.val) {
	      this.setValue(val);
	    }
	  };
	
	  InputDirective.prototype.update = function update() {
	    this.val = this.getValue();
	    if (this.val != this.elVal()) this.elVal(this.val);
	  };
	
	  InputDirective.prototype.elVal = function elVal(val) {
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
	  };
	
	  InputDirective.prototype.isInput = function isInput() {
	    return this.tag == TAG_INPUT;
	  };
	
	  InputDirective.prototype.isSelect = function isSelect() {
	    return this.tag == TAG_SELECT;
	  };
	
	  InputDirective.prototype.isTextArea = function isTextArea() {
	    return this.tag == TAG_TEXTAREA;
	  };
	
	  InputDirective.prototype.isRadio = function isRadio() {
	    return this.type == RADIO;
	  };
	
	  InputDirective.prototype.isCheckBox = function isCheckBox() {
	    return this.type == CHECKBOX;
	  };
	
	  return InputDirective;
	})(ValueDirective);
	
	exports.InputDirective = InputDirective;
	
	var IfDirective = (function (_ExprDirective8) {
	  _inherits(IfDirective, _ExprDirective8);
	
	  function IfDirective() {
	    _classCallCheck(this, IfDirective);
	
	    _ExprDirective8.apply(this, arguments);
	  }
	
	  IfDirective.prototype.update = function update() {
	    var _this = this;
	
	    if (!this.getValue()) {
	      this.$el.css('display', 'none');
	    } else {
	      if (!this.directives) {
	        this.directives = [];
	        _.each(this.el.childNodes, function (el) {
	          _this.template.parse(el).forEach(function (directive) {
	            directive.bind();
	            _this.directives.push(directive);
	          });
	        });
	      }
	      this.$el.css('display', '');
	    }
	  };
	
	  IfDirective.prototype.isBlock = function isBlock() {
	    return true;
	  };
	
	  return IfDirective;
	})(ExprDirective);
	
	exports.IfDirective = IfDirective;
	
	_.each(module.exports, function (cls, name) {
	  if (Directive.isDirective(cls) && cls !== ExprDirective && cls !== TextNodeDirective) {
	    Directive.register(_.kebabCase(name.replace(/Directive$/, '')), cls);
	  }
	});

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
	  function AbstractDirective(el, templateInst, expr) {
	    _classCallCheck(this, AbstractDirective);
	
	    this.el = el;
	    this.nodeType = el.nodeType;
	    this.template = templateInst;
	    this.target = templateInst.bind;
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
	  var type = typeof object;
	  if (!object || type != 'function' && type != 'object') {
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
	    if (!directive.prototype.directiveName) {
	      directive.prototype.directiveName = name;
	    }
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
	  getDirective: getDirective,
	  isDirective: isDirective
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
	
	  Expression.prototype.setValue = function setValue(val) {
	    _.set(this.bind, this.expression, val);
	  };
	
	  Expression.prototype.observe = function observe(callback) {
	    this.bind = observer.observe(this.bind, this.expression, callback);
	    return this.bind;
	  };
	
	  Expression.prototype.unobserve = function unobserve(callback) {
	    this.bind = observer.unobserve(this.bind, this.expression, callback);
	    return this.bind;
	  };
	
	  return Expression;
	})();
	
	module.exports = Expression;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=tpl.js.map