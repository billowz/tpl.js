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
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _ = __webpack_require__(1),
	    $ = __webpack_require__(2),
	    Text = __webpack_require__(3),
	    Directive = __webpack_require__(5),
	    DirectiveGroup = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./directive-group\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())),
	    Directives = __webpack_require__(7),
	    Expression = __webpack_require__(8),
	    PRIMITIVE = 0,
	    KEYPATH = 1,
	    TEXT = 0,
	    BINDING = 1,
	    templateContentReg = /^[\s\t\r\n]*</,
	    defaultCfg = {
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
	      _this.bind = directive.bind();
	    });
	  };
	
	  TemplateInstance.prototype.parse = function parse(els) {
	    var _this2 = this;
	
	    if (!els.jquery && !(els instanceof Array)) {
	      return this.parseEl(els);
	    } else {
	      var _ret = (function () {
	        var bindings = [];
	        _.each(els, function (el) {
	          bindings.push.apply(bindings, _this2.parseEl(el));
	        });
	        return {
	          v: bindings
	        };
	      })();
	
	      if (typeof _ret === 'object') return _ret.v;
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
	        token = undefined,
	        lastIndex = 0,
	        reg = this.tpl.delimiterReg,
	        bindings = [];
	
	    while (token = reg.exec(text)) {
	
	      this.createTextNode(text.substr(lastIndex, reg.lastIndex - token[0].length), el);
	
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
	        directives = [];
	    if (el.attributes) {
	      _.each(el.attributes, function (attr) {
	        var name = attr.name,
	            val = attr.value,
	            directiveConst = undefined,
	            directive = undefined;
	        if ((name = _this3.parseDirectiveName(name)) && (directiveConst = Directive.getDirective(name))) {
	          directive = new directiveConst(el, _this3, val);
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
	
	var _ = __webpack_require__(1),
	    $ = __webpack_require__(2),
	    Binding = __webpack_require__(4);
	
	var Text = (function (_Binding) {
	  _inherits(Text, _Binding);
	
	  function Text(el, tpl, expr) {
	    _classCallCheck(this, Text);
	
	    _Binding.call(this, el, tpl, expr);
	    this.expression = new Expression(this.target, expression);
	    this.$el = $(el);
	    this.update = this.update.bind(this);
	  }
	
	  Text.prototype.bind = function bind() {
	    if (!this.comment) {
	      this.comment = $(document.createComment('Text Binding ' + this.expr));
	      this.comment.insertBefore(this.el);
	    }
	    var ret = this.expression.observe(this.update);
	    this.update();
	    return ret;
	  };
	
	  Text.prototype.unbind = function unbind() {
	    return this.expression.unobserve(this.update);
	  };
	
	  Text.prototype.update = function update() {
	    this.el.data = this.expression.getValue();
	  };
	
	  return Text;
	})(Binding);
	
	exports.Text = Text;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _ = __webpack_require__(1);
	
	var Binding = (function () {
	  function Binding(el, tpl, expr) {
	    _classCallCheck(this, Binding);
	
	    this.el = el;
	    this.tpl = tpl;
	    this.target = tpl.bind;
	    this.expr = expr;
	  }
	
	  Binding.prototype.bind = function bind() {
	    throw 'Abstract Method [' + this.getDirectiveClassName() + '.bind]';
	  };
	
	  Binding.prototype.unbind = function unbind() {
	    throw 'Abstract Method [' + this.getDirectiveClassName() + '.unbind]';
	  };
	
	  return Binding;
	})();

	exports.Binding = Binding;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(1),
	    Binding = __webpack_require__(4);
	
	var Directive = (function (_Binding) {
	  _inherits(Directive, _Binding);
	
	  function Directive(el, tpl, expr) {
	    _classCallCheck(this, Directive);
	
	    _Binding.call(this, el, tpl, expr);
	  }
	
	  Directive.prototype.getPriority = function getPriority() {
	    return this.priority;
	  };
	
	  Directive.prototype.isBlock = function isBlock() {
	    return this.block;
	  };
	
	  Directive.prototype.bind = function bind() {
	    throw 'Abstract Method [' + this.name + '.bind]';
	  };
	
	  Directive.prototype.unbind = function unbind() {
	    throw 'Abstract Method [' + this.className + '.unbind]';
	  };
	
	  return Directive;
	})(Binding);
	
	Directive.prototype.name = null;
	Directive.prototype.priority = 0;
	Directive.prototype.block = false;
	
	var directives = {};
	
	Directive.isDirective = function isDirective(object) {
	  var type = typeof object;
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
	};
	
	Directive.register = function register(name, option) {
	  if (name in directives) {
	    console.warn('Directive[' + name + '] is defined');
	  }
	  var directive = undefined;
	  if (_.isPlainObject(option)) {
	
	    directive = (function (opt, SuperClass) {
	      if (opt.extend && !isDirective(opt.extend)) {
	        throw 'Invalid Directive SuperClass ' + opt.extend;
	      }
	      SuperClass = opt.extend || SuperClass;
	      var constructor = _.isFunction(opt.constructor) ? opt.constructor : undefined,
	          Directive = (function () {
	        return function () {
	          if (!(this instanceof SuperClass)) {
	            throw new TypeError('Cannot call a class as a function');
	          }
	          SuperClass.apply(this, arguments);
	          if (constructor) {
	            constructor.apply(this, arguments);
	          }
	        };
	      })();
	
	      Directive.prototype = Object.create(SuperClass.prototype, {
	        constructor: {
	          value: Directive,
	          enumerable: false,
	          writable: true,
	          configurable: true
	        }
	      });
	
	      delete opt.constructor;
	      delete opt.extend;
	      _.each(opt, function (val, key) {
	        Directive.prototype[key] = val;
	      });
	
	      Object.setPrototypeOf(Directive, SuperClass);
	      return Directive;
	    })(option, Directive);
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
	};
	
	Directive.getDirective = function getDirective(name) {
	  return directives[name];
	};
	
	module.exports = Directive;

/***/ },
/* 6 */,
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(1),
	    Directive = __webpack_require__(5),
	    Expression = __webpack_require__(8);
	
	var ExprDirective = (function (_Directive) {
	  _inherits(ExprDirective, _Directive);
	
	  function ExprDirective(el, templateInst, expression) {
	    _classCallCheck(this, ExprDirective);
	
	    _Directive.call(this, el, templateInst, expression);
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
	})(Directive);
	
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
	
	  TextNodeDirective.prototype.isBlock = function isBlock() {
	    return true;
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
	
	  TextDirective.prototype.isBlock = function isBlock() {
	    return true;
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
	
	  HtmlDirective.prototype.isBlock = function isBlock() {
	    return true;
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
	
	var RadioGroupDirective = (function (_ExprDirective8) {
	  _inherits(RadioGroupDirective, _ExprDirective8);
	
	  function RadioGroupDirective() {
	    _classCallCheck(this, RadioGroupDirective);
	
	    _ExprDirective8.apply(this, arguments);
	  }
	
	  RadioGroupDirective.prototype.bind = function bind() {
	    _ExprDirective8.prototype.bind.call(this);
	  };
	
	  RadioGroupDirective.prototype.isBlock = function isBlock() {
	    return true;
	  };
	
	  return RadioGroupDirective;
	})(ExprDirective);
	
	exports.RadioGroupDirective = RadioGroupDirective;
	
	var IfDirective = (function (_ExprDirective9) {
	  _inherits(IfDirective, _ExprDirective9);
	
	  function IfDirective() {
	    _classCallCheck(this, IfDirective);
	
	    _ExprDirective9.apply(this, arguments);
	  }
	
	  IfDirective.prototype.update = function update() {
	    if (!this.getValue()) {
	      this.$el.css('display', 'none');
	    } else {
	      if (!this.directives) {
	        this.directives = this.template.parseChildNodes(this.el);
	        this.directives.forEach(function (directive) {
	          directive.bind();
	        });
	      }
	      this.$el.css('display', '');
	    }
	  };
	
	  IfDirective.prototype.unbind = function unbind() {
	    _ExprDirective9.prototype.unbind.call(this);
	    if (this.directives) {
	      this.directives.forEach(function (directive) {
	        directive.unbind();
	      });
	    }
	  };
	
	  IfDirective.prototype.isBlock = function isBlock() {
	    return true;
	  };
	
	  return IfDirective;
	})(ExprDirective);
	
	exports.IfDirective = IfDirective;
	
	var EventDirective = (function (_Directive2) {
	  _inherits(EventDirective, _Directive2);
	
	  function EventDirective(el, templateInst, expression) {
	    _classCallCheck(this, EventDirective);
	
	    _Directive2.call(this, el, templateInst, expression);
	    this.$el = $(el);
	  }
	
	  EventDirective.prototype.getEventType = function getEventType() {
	    throw 'Abstract Method [getEventType]';
	  };
	
	  EventDirective.prototype.getHandler = function getHandler() {
	    if (!this.handler) {
	      var handler = _.get(this.template.bind, this.expr);
	      if (!_.isFunction(handler)) {
	        throw TypeError('Invalid Event Handler ' + handler);
	      }
	      this.handler = handler.bind(this.template.bind);
	    }
	    return this.handler;
	  };
	
	  EventDirective.prototype.bind = function bind() {
	    this.$el.on(this.getEventType(), this.getHandler());
	  };
	
	  EventDirective.prototype.unbind = function unbind() {
	    this.$el.un(this.getEventType(), this.getHandler());
	  };
	
	  return EventDirective;
	})(Directive);
	
	exports.EventDirective = EventDirective;
	
	var OnclickDirective = (function (_EventDirective) {
	  _inherits(OnclickDirective, _EventDirective);
	
	  function OnclickDirective() {
	    _classCallCheck(this, OnclickDirective);
	
	    _EventDirective.apply(this, arguments);
	  }
	
	  OnclickDirective.prototype.getEventType = function getEventType() {
	    return 'click';
	  };
	
	  return OnclickDirective;
	})(EventDirective);
	
	exports.OnclickDirective = OnclickDirective;
	
	var OndbclickDirective = (function (_EventDirective2) {
	  _inherits(OndbclickDirective, _EventDirective2);
	
	  function OndbclickDirective() {
	    _classCallCheck(this, OndbclickDirective);
	
	    _EventDirective2.apply(this, arguments);
	  }
	
	  OndbclickDirective.prototype.getEventType = function getEventType() {
	    return 'ondblclick';
	  };
	
	  return OndbclickDirective;
	})(EventDirective);
	
	exports.OndbclickDirective = OndbclickDirective;
	
	var OnchangeDirective = (function (_EventDirective3) {
	  _inherits(OnchangeDirective, _EventDirective3);
	
	  function OnchangeDirective() {
	    _classCallCheck(this, OnchangeDirective);
	
	    _EventDirective3.apply(this, arguments);
	  }
	
	  OnchangeDirective.prototype.getEventType = function getEventType() {
	    return 'onchange';
	  };
	
	  return OnchangeDirective;
	})(EventDirective);
	
	exports.OnchangeDirective = OnchangeDirective;
	
	var OnkeyupDirective = (function (_EventDirective4) {
	  _inherits(OnkeyupDirective, _EventDirective4);
	
	  function OnkeyupDirective() {
	    _classCallCheck(this, OnkeyupDirective);
	
	    _EventDirective4.apply(this, arguments);
	  }
	
	  OnkeyupDirective.prototype.getEventType = function getEventType() {
	    return 'keyup';
	  };
	
	  return OnkeyupDirective;
	})(EventDirective);
	
	exports.OnkeyupDirective = OnkeyupDirective;
	
	var OnKeydownDirective = (function (_EventDirective5) {
	  _inherits(OnKeydownDirective, _EventDirective5);
	
	  function OnKeydownDirective() {
	    _classCallCheck(this, OnKeydownDirective);
	
	    _EventDirective5.apply(this, arguments);
	  }
	
	  OnKeydownDirective.prototype.getEventType = function getEventType() {
	    return 'onkeydown';
	  };
	
	  return OnKeydownDirective;
	})(EventDirective);
	
	exports.OnKeydownDirective = OnKeydownDirective;
	
	var OnKeypressDirective = (function (_EventDirective6) {
	  _inherits(OnKeypressDirective, _EventDirective6);
	
	  function OnKeypressDirective() {
	    _classCallCheck(this, OnKeypressDirective);
	
	    _EventDirective6.apply(this, arguments);
	  }
	
	  OnKeypressDirective.prototype.getEventType = function getEventType() {
	    return 'onkeypress';
	  };
	
	  return OnKeypressDirective;
	})(EventDirective);
	
	exports.OnKeypressDirective = OnKeypressDirective;
	
	var OnmousedownDirective = (function (_EventDirective7) {
	  _inherits(OnmousedownDirective, _EventDirective7);
	
	  function OnmousedownDirective() {
	    _classCallCheck(this, OnmousedownDirective);
	
	    _EventDirective7.apply(this, arguments);
	  }
	
	  OnmousedownDirective.prototype.getEventType = function getEventType() {
	    return 'onmousedown';
	  };
	
	  return OnmousedownDirective;
	})(EventDirective);
	
	exports.OnmousedownDirective = OnmousedownDirective;
	
	var OnmousemoveDirective = (function (_EventDirective8) {
	  _inherits(OnmousemoveDirective, _EventDirective8);
	
	  function OnmousemoveDirective() {
	    _classCallCheck(this, OnmousemoveDirective);
	
	    _EventDirective8.apply(this, arguments);
	  }
	
	  OnmousemoveDirective.prototype.getEventType = function getEventType() {
	    return 'onmousemove';
	  };
	
	  return OnmousemoveDirective;
	})(EventDirective);
	
	exports.OnmousemoveDirective = OnmousemoveDirective;
	
	_.each(module.exports, function (cls, name) {
	  if (Directive.isDirective(cls) && cls !== ExprDirective && cls !== TextNodeDirective) {
	    Directive.register(_.kebabCase(name.replace(/Directive$/, '')), cls);
	  }
	});

/***/ },
/* 8 */
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