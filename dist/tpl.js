(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"), require("jquery"), require("observer"));
	else if(typeof define === 'function' && define.amd)
		define(["_", "jquery", "observer"], factory);
	else if(typeof exports === 'object')
		exports["tpl"] = factory(require("_"), require("jquery"), require("observer"));
	else
		root["tpl"] = factory(root["_"], root["jQuery"], root["observer"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_6__) {
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
	tpl.Directives = __webpack_require__(10);
	tpl.expression = __webpack_require__(7);
	module.exports = tpl;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2);
	var $ = __webpack_require__(3);
	var Text = __webpack_require__(4);
	
	var _require = __webpack_require__(8);
	
	var Directive = _require.Directive;
	var DirectiveGroup = _require.DirectiveGroup;
	
	
	var PRIMITIVE = 0,
	    KEYPATH = 1,
	    TEXT = 0,
	    BINDING = 1,
	    templateContentReg = /^[\s\t\r\n]*</,
	    parseDelimiterReg = function parseDelimiterReg(delimiter) {
	  return new RegExp([delimiter[0], '([^', delimiter[0], delimiter[0], ']*)', delimiter[1]].join(''), 'g');
	},
	    parseDirectiveReg = function parseDirectiveReg(prefix) {
	  return new RegExp('^' + prefix);
	},
	    defaultCfg = {
	  delimiter: ['{', '}'],
	  directivePrefix: 'tpl-'
	};
	
	var __tmp_id__ = 0;
	
	var Template = function () {
	  function Template(templ, cfg) {
	    _classCallCheck(this, Template);
	
	    this.template = $(templ);
	    cfg = cfg || {};
	
	    this.directivePrefix = cfg.directivePrefix || defaultCfg.directivePrefix;
	    this.delimiter = cfg.delimiter || defaultCfg.delimiter;
	    this.directiveReg = parseDirectiveReg(this.directivePrefix);
	    this.delimiterReg = parseDelimiterReg(this.delimiter);
	
	    this.__instance_nr__ = 0;
	    this.__id__ = __tmp_id__++;
	  }
	
	  Template.prototype.complie = function complie(scope, parent) {
	    return new TemplateInstance(this, scope, parent);
	  };
	
	  return Template;
	}();
	
	var TemplateInstance = function () {
	  function TemplateInstance(tpl, scope, parent) {
	    _classCallCheck(this, TemplateInstance);
	
	    this.tpl = tpl;
	    this.scope = scope;
	    this.el = this.tpl.template.clone();
	    this.parent = parent;
	    this.__id__ = tpl.__id__ + '-' + tpl.__instance_nr__++;
	    this.init();
	  }
	
	  TemplateInstance.prototype.renderTo = function renderTo(el) {
	    $(el).append(this.el);
	    return this;
	  };
	
	  TemplateInstance.prototype.init = function init() {
	    var _this = this;
	
	    this.bindings = this.parse(this.el);
	    this.bindings.forEach(function (directive) {
	      directive.bind();
	      _this.scope = directive.scope;
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
	        consts = [];
	    if (el.attributes) {
	      _.each(el.attributes, function (attr) {
	        var name = attr.name,
	            val = attr.value,
	            dc = void 0,
	            directive = void 0;
	
	        if ((name = _this3.parseDirectiveName(name)) && (dc = Directive.getDirective(name))) {
	          if (dc.prototype.abstract) {
	            consts = [{
	              'const': dc,
	              val: val
	            }];
	            block = true;
	            return false;
	          }
	          consts.push({
	            'const': dc,
	            val: val
	          });
	          if (dc.prototype.block) block = true;
	        } else if (name) {
	          console.warn('Directive is undefined ' + attr.name);
	        }
	      });
	
	      if (consts.length > 1) {
	        directives.push(new DirectiveGroup(el, this, consts));
	      } else if (consts.length == 1) {
	        directives.push(new consts[0]['const'](el, this, consts[0].val));
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
	    var reg = this.tpl.directiveReg;
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
	
	var _require = __webpack_require__(5);
	
	var Binding = _require.Binding;
	var expression = __webpack_require__(7);
	var expressionArgs = ['$scope', '$el'];
	var Text = function (_Binding) {
	  _inherits(Text, _Binding);
	
	  function Text(el, tpl, expr) {
	    _classCallCheck(this, Text);
	
	    var _this = _possibleConstructorReturn(this, _Binding.call(this, tpl, expr));
	
	    _this.el = el;
	    _this.observeHandler = _this.observeHandler.bind(_this);
	    _this.expression = expression.parse(_this.expr, expressionArgs);
	    return _this;
	  }
	
	  Text.prototype.value = function value() {
	    return this.applyFilter(this.expression.execute.call(this.scope, this, this.scope, this.el));
	  };
	
	  Text.prototype.bind = function bind() {
	    var _this2 = this;
	
	    if (Binding.generateComments && !this.comment) {
	      this.comment = $(document.createComment('Text Binding ' + this.expr));
	      this.comment.insertBefore(this.el);
	    }
	    this.expression.identities.forEach(function (ident) {
	      _this2.observe(ident, _this2.observeHandler);
	    });
	    this.update(this.value());
	  };
	
	  Text.prototype.unbind = function unbind() {
	    var _this3 = this;
	
	    this.expression.identities.forEach(function (ident) {
	      _this3.unobserve(ident, _this3.observeHandler);
	    });
	  };
	
	  Text.prototype.observeHandler = function observeHandler(attr, val) {
	    if (this.expression.simplePath) {
	      this.update(this.applyFilter(val));
	    } else {
	      this.update(this.value());
	    }
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
	
	exports.__esModule = true;
	exports.ScopeData = ScopeData;
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2),
	    observer = __webpack_require__(6);
	
	function ScopeData(scope, data) {
	  this.scope = scope;
	  this.data = data;
	}
	
	var AbstractBinding = exports.AbstractBinding = function () {
	  function AbstractBinding(tpl) {
	    _classCallCheck(this, AbstractBinding);
	
	    this.tpl = tpl;
	    this.scope = tpl.scope;
	    this.ancestorObservers = {};
	    this._ancestorObserveHandler = this._ancestorObserveHandler.bind(this);
	  }
	
	  AbstractBinding.prototype.destroy = function destroy() {};
	
	  AbstractBinding.prototype.observe = function observe(expr, callback) {
	    var tpl = this.tpl,
	        ancestors = void 0,
	        aos = this.ancestorObservers[expr],
	        l = void 0,
	        i = void 0;
	
	    observer.on(this.scope, expr, callback);
	
	    if (aos) {
	      ancestors = aos.ancestors;
	    } else {
	      ancestors = [];
	      while (!_.has(tpl.scope, expr)) {
	        tpl = tpl.parent;
	        if (!tpl) {
	          break;
	        }
	        ancestors.push(observer.obj(tpl.scope));
	      }
	    }
	
	    if (l = ancestors.length) {
	      if (!aos) {
	        aos = this.ancestorObservers[expr] = {
	          ancestors: ancestors,
	          callbacks: [callback]
	        };
	        for (i = 0; i < l; i++) {
	          observer.on(ancestors[i], expr, this._ancestorObserveHandler);
	        }
	      } else {
	        aos.callbacks.push(callback);
	      }
	      for (i = 0; i < l; i++) {
	        observer.on(ancestors[i], expr, function () {
	          callback.apply(this, arguments);
	        });
	      }
	    }
	  };
	
	  AbstractBinding.prototype._ancestorObserveHandler = function _ancestorObserveHandler(expr, val, oldVal, scope) {
	    scope = observer.obj(scope);
	
	    var aos = this.ancestorObservers[expr],
	        ancestors = aos.ancestors,
	        callbacks = aos.callbacks,
	        idx = aos.ancestors.indexOf(scope),
	        i = void 0,
	        j = void 0;
	
	    for (i = ancestors.length - 1; i > idx; i--) {
	      scope = ancestors.pop();
	      observer.un(scope, expr, this._ancestorObserveHandler);
	      for (j = callbacks.length - 1; j >= 0; j--) {
	        observer.un(scope, expr, callbacks[j]);
	      }
	    }
	    if (!ancestors.length) {
	      this.ancestorObservers[expr] = undefined;
	    }
	  };
	
	  AbstractBinding.prototype.unobserve = function unobserve(expr, callback) {
	
	    observer.un(this.scope, expr, callback);
	
	    var aos = this.ancestorObservers[expr];
	
	    if (aos) {
	      var ancestors = aos.ancestors,
	          callbacks = aos.callbacks,
	          idx = callbacks.indexOf(callback),
	          l = void 0;
	
	      if (idx) {
	        callbacks.splice(idx, 1);
	        l = callbacks.length;
	        for (var i = ancestors.length - 1; i >= idx; i--) {
	          observer.un(scope, expr, callback);
	
	          if (!l) {
	            observer.un(scope, expr, this._ancestorObserveHandler);
	          }
	        }
	        if (!l) {
	          this.ancestorObservers[expr] = undefined;
	        }
	      }
	    }
	  };
	
	  AbstractBinding.prototype.get2 = function get2(path) {
	    var tpl = this.tpl,
	        scope = this.scope,
	        ret = void 0;
	
	    while (!_.has(scope, path)) {
	      tpl = tpl.parent;
	      if (!tpl) {
	        ret = new ScopeData(scope, undefined);
	        return ret;
	      }
	      scope = tpl.scope;
	    }
	    ret = new ScopeData(scope, _.get(scope, path));
	    return ret;
	  };
	
	  AbstractBinding.prototype.get = function get(path) {
	    var tpl = this.tpl,
	        scope = this.scope;
	
	    while (!_.has(scope, path)) {
	      tpl = tpl.parent;
	      if (!tpl) return undefined;
	      scope = tpl.scope;
	    }
	    return _.get(scope, path);
	  };
	
	  AbstractBinding.prototype.set = function set(path, value) {
	    _.set(this.scope, path, value);
	  };
	
	  AbstractBinding.prototype.bind = function bind() {
	    throw 'Abstract Method [' + this.constructor.name + '.bind]';
	  };
	
	  AbstractBinding.prototype.unbind = function unbind() {
	    throw 'Abstract Method [' + this.constructor.name + '.unbind]';
	  };
	
	  return AbstractBinding;
	}();
	
	var exprReg = /((?:'[^']*')*(?:(?:[^\|']+(?:'[^']*')*[^\|']*)+|[^\|]+))|^$/g;
	var filterReg = /^$/g;
	
	var Binding = exports.Binding = function (_AbstractBinding) {
	  _inherits(Binding, _AbstractBinding);
	
	  function Binding(tpl, expr) {
	    _classCallCheck(this, Binding);
	
	    var _this = _possibleConstructorReturn(this, _AbstractBinding.call(this, tpl));
	
	    _this.fullExpr = expr;
	    var pipes = expr.match(exprReg);
	    _this.expr = pipes.shift();
	
	    _this.filterExprs = pipes;
	    _this.filters = [];
	    return _this;
	  }
	
	  Binding.prototype.applyFilter = function applyFilter(val) {
	    for (var i = 0; i < this.filters.length; i++) {
	      val = this.filters[i].apply(val);
	    }
	    return val;
	  };
	
	  Binding.prototype.unapplyFilter = function unapplyFilter(val) {
	    for (var i = 0; i < this.filters.length; i++) {
	      val = this.filters[i].unapply(val);
	    }
	    return val;
	  };
	
	  return Binding;
	}(AbstractBinding);
	
	Binding.generateComments = true;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.isSimplePath = isSimplePath;
	exports.parse = parse;
	var _ = __webpack_require__(2);
	
	var allowedKeywords = 'Math,Date,this,true,false,null,undefined,Infinity,NaN,' + 'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' + 'encodeURIComponent,parseInt,parseFloat';
	var allowedKeywordsReg = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)');
	
	// keywords that don't make sense inside expressions
	var improperKeywords = 'break,case,class,catch,const,continue,debugger,default,' + 'delete,do,else,export,extends,finally,for,function,if,' + 'import,in,instanceof,let,return,super,switch,throw,try,' + 'var,while,with,yield,enum,await,implements,package,' + 'proctected,static,interface,private,public';
	var improperKeywordsReg = new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)');
	
	var wsReg = /\s/g;
	var newlineReg = /\n/g;
	var translationReg = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g;
	var translationRestoreReg = /"(\d+)"/g;
	var pathTestReg = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
	var identityReg = /[^\w$\.:][A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*/g;
	var booleanLiteralReg = /^(?:true|false)$/;
	var varReg = /^[A-Za-z_$][\w$]*/;
	var functionReg = /__\$[\d]+__\.data\(./g;
	
	var translations = [];
	function translationProcessor(str, isString) {
	  var i = translations.length;
	  translations[i] = isString ? str.replace(newlineReg, '\\n') : str;
	  return '"' + i + '"';
	}
	
	function translationRestoreProcessor(str, i) {
	  return translations[i];
	}
	
	var identities;
	var currentArgs;
	var currentVars;
	var currentVarNR;
	function identityProcessor(raw) {
	  var c = raw.charAt(0);
	  raw = raw.slice(1);
	
	  if (allowedKeywordsReg.test(raw)) {
	    return raw;
	  } else if (currentArgs) {
	    var f = raw.match(varReg);
	    if (f && currentArgs.indexOf(f) != -1) {
	      return raw;
	    }
	  }
	  raw = raw.replace(translationRestoreReg, translationRestoreProcessor);
	  identities[raw] = 1;
	
	  var _var = 'binding.get2(\'' + raw + '\')',
	      varNR = void 0;
	  if (!(varNR = currentVars[_var])) {
	    varNR = currentVars[_var] = currentVarNR++;
	  }
	  return c + '__$' + varNR + '__.data';
	}
	
	function functionProcessor(raw) {
	  var c = raw.charAt(raw.length - 1);
	  c = c == ')' ? c : ',' + c;
	  raw = raw.slice(0, raw.indexOf('.'));
	  raw = raw + '.data.call(' + raw + '.scope' + c;
	  return raw;
	}
	
	function compileExecuter(exp, args) {
	  if (improperKeywordsReg.test(exp)) {
	    throw Error('Invalid expression. Generated function body: ' + exp);
	  }
	  currentArgs = args;
	  currentVars = {};
	  currentVarNR = 0;
	
	  var body = exp.replace(translationReg, translationProcessor).replace(wsReg, '');
	  body = (' ' + body).replace(identityReg, identityProcessor).replace(functionReg, functionProcessor).replace(translationRestoreReg, translationRestoreProcessor);
	
	  var vars = [];
	  _.each(currentVars, function (nr, exp) {
	    vars.push('  var __$' + nr + '__ = ' + exp + ';\n');
	  });
	
	  translations.length = 0;
	  currentArgs = undefined;
	  currentVars = undefined;
	
	  body = vars.join('') + '  return ' + body + ';';
	
	  var _args = ['binding'];
	  if (args) _args.push.apply(_args, args);
	  _args.push(body);
	  try {
	    return Function.apply(Function, _args);
	  } catch (e) {
	    throw Error('Invalid expression. Generated function body: ' + body);
	  }
	}
	
	function isSimplePath(exp) {
	  return pathTestReg.test(exp) && !booleanLiteralReg.test(exp);
	}
	
	function parse(exp, args) {
	  exp = exp.trim();
	  var res = {
	    exp: exp
	  };
	  if (isSimplePath(exp)) {
	    res.simplePath = true;
	    res.identities = [exp];
	    res.execute = function (binding) {
	      return binding.get2(exp);
	    };
	  } else {
	    res.simplePath = false;
	    identities = {};
	    res.execute = compileExecuter(exp, args);
	    res.identities = Object.keys(identities);
	    identities = undefined;
	  }
	  return res;
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var $ = __webpack_require__(3);
	
	var _require = __webpack_require__(5);
	
	var Binding = _require.Binding;
	var AbstractBinding = _require.AbstractBinding;
	
	var _require2 = __webpack_require__(9);
	
	var ArrayIterator = _require2.ArrayIterator;
	var YieId = _require2.YieId;
	var SUPER_CLASS_OPTION = 'extend';
	var DirectiveGroup = exports.DirectiveGroup = function (_AbstractBinding) {
	  _inherits(DirectiveGroup, _AbstractBinding);
	
	  function DirectiveGroup(el, tpl, directiveConsts) {
	    _classCallCheck(this, DirectiveGroup);
	
	    var _this = _possibleConstructorReturn(this, _AbstractBinding.call(this, tpl));
	
	    _this.el = el;
	    directiveConsts.sort(function (a, b) {
	      return b['const'].prototype.priority - a['const'].prototype.priority || 0;
	    });
	    _this.directives = directiveConsts.map(function (dir) {
	      return new dir['const'](el, tpl, dir.val);
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
	        _self.scope = directive.scope;
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
	      _this2.scope = directive.scope;
	    });
	  };
	
	  return DirectiveGroup;
	}(AbstractBinding);
	
	var Directive = exports.Directive = function (_Binding) {
	  _inherits(Directive, _Binding);
	
	  function Directive(el, tpl, expr) {
	    _classCallCheck(this, Directive);
	
	    var _this3 = _possibleConstructorReturn(this, _Binding.call(this, tpl, expr));
	
	    _this3.el = el;
	    _this3.$el = $(el);
	    _this3.attr = tpl.tpl.directivePrefix + _this3.name;
	    return _this3;
	  }
	
	  Directive.prototype.bind = function bind() {
	    if (Binding.generateComments && !this.comment) {
	      this.comment = $(document.createComment(' Directive:' + this.name + ' [' + this.expr + '] '));
	      this.comment.insertBefore(this.el);
	    }
	  };
	
	  Directive.prototype.unbind = function unbind() {};
	
	  return Directive;
	}(Binding);
	
	Directive.prototype.abstract = false;
	Directive.prototype.name = 'Unkown';
	Directive.prototype.block = false;
	Directive.prototype.priority = 0;
	
	var directives = {};
	
	var isDirective = Directive.isDirective = function isDirective(object) {
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
	};
	
	Directive.getDirective = function getDirective(name) {
	  return directives[name];
	};
	
	Directive.register = function register(name, option) {
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
	
	    directive.prototype.className = _.capitalize(name) + 'Directive';
	  } else if (isDirective(option)) {
	    directive = option;
	    directive.prototype.className = directive.prototype.constructor.name;
	  } else {
	    throw TypeError('Invalid Directive Object ' + option);
	  }
	
	  directive.prototype.name = name;
	
	  directives[name] = directive;
	  return directive;
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2);
	
	var YieId = exports.YieId = function () {
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
	
	var ArrayIterator = exports.ArrayIterator = function () {
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

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	
	var _require = __webpack_require__(11);
	
	var ScopeData = _require.ScopeData;
	
	var _require2 = __webpack_require__(8);
	
	var Directive = _require2.Directive;
	var Template = __webpack_require__(1);
	var expression = __webpack_require__(7);
	
	var _require3 = __webpack_require__(9);
	
	var YieId = _require3.YieId;
	var expressionArgs = ['$scope', '$el'];
	var eventExpressionArgs = ['$scope', '$el', '$event'];
	
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
	    _this.expression = expression.parse(_this.expr, eventExpressionArgs);
	    console.log(_this.className + ': [' + _this.expr + '] ', _this.expression.identities);
	    return _this;
	  }
	
	  AbstractEventDirective.prototype.handler = function handler(e) {
	    var ret = this.expression.execute.call(this.scope, this, this.scope, this.el, e);
	    if (ret && ret instanceof ScopeData && typeof ret.data == 'function') {
	      ret.data.call(ret.scope, ret.scope, this.el, e);
	    }
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
	
	    _this2.observeHandler = _this2.observeHandler.bind(_this2);
	    _this2.expression = expression.parse(_this2.expr, expressionArgs);
	    console.log(_this2.className + ': [' + _this2.expr + '] ', _this2.expression.identities);
	    return _this2;
	  }
	
	  AbstractExpressionDirective.prototype.setRealValue = function setRealValue(val) {
	    this.set(this.expr, val);
	  };
	
	  AbstractExpressionDirective.prototype.realValue = function realValue() {
	    var ret = this.expression.execute.call(this.scope, this, this.scope, this.el);
	    if (ret instanceof ScopeData) {
	      return ret.data;
	    }
	    return ret;
	  };
	
	  AbstractExpressionDirective.prototype.setValue = function setValue(val) {
	    return this.setRealValue(this.unapplyFilter(val));
	  };
	
	  AbstractExpressionDirective.prototype.value = function value() {
	    return this.applyFilter(this.realValue());
	  };
	
	  AbstractExpressionDirective.prototype.bind = function bind() {
	    var _this3 = this;
	
	    _Directive2.prototype.bind.call(this);
	    this.expression.identities.forEach(function (ident) {
	      _this3.observe(ident, _this3.observeHandler);
	    });
	    this.update(this.value());
	  };
	
	  AbstractExpressionDirective.prototype.unbind = function unbind() {
	    var _this4 = this;
	
	    _Directive2.prototype.unbind.call(this);
	    this.expression.identities.forEach(function (ident) {
	      _this4.unobserve(ident, _this4.observeHandler);
	    });
	  };
	
	  AbstractExpressionDirective.prototype.blankValue = function blankValue(val) {
	    if (arguments.length == 0) {
	      val = this.value();
	    }
	    if (val === undefined || val == null) {
	      return '';
	    }
	    return val;
	  };
	
	  AbstractExpressionDirective.prototype.observeHandler = function observeHandler(expr, val) {
	    if (this.expression.simplePath) {
	      this.update(this.applyFilter(val));
	    } else {
	      this.update(this.value());
	    }
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
	    update: function update(value) {
	      if (value && typeof value == 'string') {
	        this.handleArray(value.trim().split(/\s+/));
	      } else if (value instanceof Array) {
	        this.handleArray(value);
	      } else if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
	        this.handleObject(value);
	      } else {
	        this.cleanup();
	      }
	    },
	    handleObject: function handleObject(value) {
	      this.cleanup(value);
	      var keys = this.prevKeys = [];
	      for (var key in value) {
	        if (value[key]) {
	          this.$el.addClass(key);
	          keys.push(key);
	        } else {
	          this.$el.removeClass(key);
	        }
	      }
	    },
	    handleArray: function handleArray(value) {
	      this.cleanup(value);
	      var keys = this.prevKeys = [];
	      for (var i = 0, l = value.length; i < l; i++) {
	        if (value[i]) {
	          keys.push(value[i]);
	          this.$el.addClass(this.el, value[i]);
	        }
	      }
	    },
	    cleanup: function cleanup(value) {
	      if (this.prevKeys) {
	        var i = this.prevKeys.length,
	            isArr = value instanceof Array;
	        while (i--) {
	          var key = this.prevKeys[i];
	          if (!value || (isArr ? value.indexOf(key) != -1 : value.hasOwnProperty(key))) {
	            this.$el.removeClass(key);
	          }
	        }
	      }
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
	  checked: {
	    update: function update(val) {
	      this.$el.prop('checked', !!val);
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
	      var _this5 = this;
	
	      if (!val) {
	        this.$el.css('display', 'none');
	      } else {
	        if (!this.directives) {
	          this.directives = this.tpl.parseChildNodes(this.el);
	          this.directives.forEach(function (directive) {
	            directive.bind();
	            _this5.scope = directive.scope;
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
	      var _this6 = this;
	
	      AbstractExpressionDirective.prototype.unbind.call(this);
	      if (this.directives) {
	        this.directives.forEach(function (directive) {
	          directive.unbind();
	          _this6.scope = directive.scope;
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
	
	var eachReg = /^\s*([\S][\s\S]+[\S])\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/,
	    eachAliasReg = /^(\(\s*([\S]+)(\s*,\s*([\S]+))?\s*\))|([\S]+)(\s*,\s*([\S]+))$/;
	
	var EachDirective = exports.EachDirective = function (_Directive3) {
	  _inherits(EachDirective, _Directive3);
	
	  function EachDirective(el, tpl, expr) {
	    _classCallCheck(this, EachDirective);
	
	    var _this7 = _possibleConstructorReturn(this, _Directive3.call(this, el, tpl, expr));
	
	    _this7.observeHandler = _this7.observeHandler.bind(_this7);
	    _this7.lengthObserveHandler = _this7.lengthObserveHandler.bind(_this7);
	
	    var token = expr.match(eachReg);
	    if (!token) throw Error('Invalid Expression[' + expr + '] on Each Directive');
	
	    _this7.scopeExpr = token[2];
	    _this7.indexExpr = token[4];
	
	    var aliasToken = token[1].match(eachAliasReg);
	    if (!aliasToken) throw Error('Invalid Expression[' + token[1] + '] on Each Directive');
	
	    _this7.valueAlias = aliasToken[2] || aliasToken[5];
	    _this7.keyAlias = aliasToken[4] || aliasToken[7];
	
	    _this7.$parentEl = _this7.$el.parent();
	    _this7.$el.remove().removeAttr(_this7.attr);
	    _this7.childTpl = new Template(_this7.$el);
	    return _this7;
	  }
	
	  EachDirective.prototype.bindChild = function bindChild(key, data) {
	    var scope = {
	      __index__: this.indexExpr ? _.get(data, this.indexExpr) : key
	    };
	
	    if (this.keyAlias) scope[this.keyAlias] = key;
	    scope[this.valueAlias] = data;
	
	    var tpl = this.childTpl.complie(scope, this.tpl).renderTo(this.$parentEl);
	  };
	
	  EachDirective.prototype.bind = function bind() {
	    _Directive3.prototype.bind.call(this);
	    this.observe(this.scopeExpr, this.observeHandler);
	    this.observe(this.scopeExpr + '.length', this.lengthObserveHandler);
	    this.update(this.target());
	  };
	
	  EachDirective.prototype.unbind = function unbind() {
	    _Directive3.prototype.unbind.call(this);
	    this.unobserve(this.scopeExpr, this.observeHandler);
	    this.unobserve(this.scopeExpr + '.length', this.lengthObserveHandler);
	  };
	
	  EachDirective.prototype.update = function update(scope) {
	    if (scope instanceof Array) {
	      for (var i = 0; i < scope.length; i++) {
	        this.bindChild(i, scope[i]);
	      }
	    } else {
	      console.warn('Invalid Each Scope[' + this.scopeExpr + '] ' + scope);
	    }
	  };
	
	  EachDirective.prototype.target = function target() {
	    return this.get(this.scopeExpr);
	  };
	
	  EachDirective.prototype.observeHandler = function observeHandler(expr, target) {
	    this.update(target);
	  };
	
	  EachDirective.prototype.lengthObserveHandler = function lengthObserveHandler() {
	    this.update(this.target());
	  };
	
	  return EachDirective;
	}(Directive);
	
	EachDirective.prototype.abstract = true;
	EachDirective.prototype.block = true;
	EachDirective.prototype.priority = 10;
	
	Directive.register('each', EachDirective);

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.ScopeData = ScopeData;
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2),
	    observer = __webpack_require__(6);
	
	function ScopeData(scope, data) {
	  this.scope = scope;
	  this.data = data;
	}
	
	var AbstractBinding = exports.AbstractBinding = function () {
	  function AbstractBinding(tpl) {
	    _classCallCheck(this, AbstractBinding);
	
	    this.tpl = tpl;
	    this.scope = tpl.scope;
	    this.ancestorObservers = {};
	    this._ancestorObserveHandler = this._ancestorObserveHandler.bind(this);
	  }
	
	  AbstractBinding.prototype.destroy = function destroy() {};
	
	  AbstractBinding.prototype.observe = function observe(expr, callback) {
	    var tpl = this.tpl,
	        ancestors = void 0,
	        aos = this.ancestorObservers[expr],
	        l = void 0,
	        i = void 0;
	
	    observer.on(this.scope, expr, callback);
	
	    if (aos) {
	      ancestors = aos.ancestors;
	    } else {
	      ancestors = [];
	      while (!_.has(tpl.scope, expr)) {
	        tpl = tpl.parent;
	        if (!tpl) {
	          break;
	        }
	        ancestors.push(observer.obj(tpl.scope));
	      }
	    }
	
	    if (l = ancestors.length) {
	      if (!aos) {
	        aos = this.ancestorObservers[expr] = {
	          ancestors: ancestors,
	          callbacks: [callback]
	        };
	        for (i = 0; i < l; i++) {
	          observer.on(ancestors[i], expr, this._ancestorObserveHandler);
	        }
	      } else {
	        aos.callbacks.push(callback);
	      }
	      for (i = 0; i < l; i++) {
	        observer.on(ancestors[i], expr, function () {
	          callback.apply(this, arguments);
	        });
	      }
	    }
	  };
	
	  AbstractBinding.prototype._ancestorObserveHandler = function _ancestorObserveHandler(expr, val, oldVal, scope) {
	    scope = observer.obj(scope);
	
	    var aos = this.ancestorObservers[expr],
	        ancestors = aos.ancestors,
	        callbacks = aos.callbacks,
	        idx = aos.ancestors.indexOf(scope),
	        i = void 0,
	        j = void 0;
	
	    for (i = ancestors.length - 1; i > idx; i--) {
	      scope = ancestors.pop();
	      observer.un(scope, expr, this._ancestorObserveHandler);
	      for (j = callbacks.length - 1; j >= 0; j--) {
	        observer.un(scope, expr, callbacks[j]);
	      }
	    }
	    if (!ancestors.length) {
	      this.ancestorObservers[expr] = undefined;
	    }
	  };
	
	  AbstractBinding.prototype.unobserve = function unobserve(expr, callback) {
	
	    observer.un(this.scope, expr, callback);
	
	    var aos = this.ancestorObservers[expr];
	
	    if (aos) {
	      var ancestors = aos.ancestors,
	          callbacks = aos.callbacks,
	          idx = callbacks.indexOf(callback),
	          l = void 0;
	
	      if (idx) {
	        callbacks.splice(idx, 1);
	        l = callbacks.length;
	        for (var i = ancestors.length - 1; i >= idx; i--) {
	          observer.un(scope, expr, callback);
	
	          if (!l) {
	            observer.un(scope, expr, this._ancestorObserveHandler);
	          }
	        }
	        if (!l) {
	          this.ancestorObservers[expr] = undefined;
	        }
	      }
	    }
	  };
	
	  AbstractBinding.prototype.get2 = function get2(path) {
	    var tpl = this.tpl,
	        scope = this.scope,
	        ret = void 0;
	
	    while (!_.has(scope, path)) {
	      tpl = tpl.parent;
	      if (!tpl) {
	        ret = new ScopeData(scope, undefined);
	        return ret;
	      }
	      scope = tpl.scope;
	    }
	    ret = new ScopeData(scope, _.get(scope, path));
	    return ret;
	  };
	
	  AbstractBinding.prototype.get = function get(path) {
	    var tpl = this.tpl,
	        scope = this.scope;
	
	    while (!_.has(scope, path)) {
	      tpl = tpl.parent;
	      if (!tpl) return undefined;
	      scope = tpl.scope;
	    }
	    return _.get(scope, path);
	  };
	
	  AbstractBinding.prototype.set = function set(path, value) {
	    _.set(this.scope, path, value);
	  };
	
	  AbstractBinding.prototype.bind = function bind() {
	    throw 'Abstract Method [' + this.constructor.name + '.bind]';
	  };
	
	  AbstractBinding.prototype.unbind = function unbind() {
	    throw 'Abstract Method [' + this.constructor.name + '.unbind]';
	  };
	
	  return AbstractBinding;
	}();
	
	var exprReg = /((?:'[^']*')*(?:(?:[^\|']+(?:'[^']*')*[^\|']*)+|[^\|]+))|^$/g;
	var filterReg = /^$/g;
	
	var Binding = exports.Binding = function (_AbstractBinding) {
	  _inherits(Binding, _AbstractBinding);
	
	  function Binding(tpl, expr) {
	    _classCallCheck(this, Binding);
	
	    var _this = _possibleConstructorReturn(this, _AbstractBinding.call(this, tpl));
	
	    _this.fullExpr = expr;
	    var pipes = expr.match(exprReg);
	    _this.expr = pipes.shift();
	
	    _this.filterExprs = pipes;
	    _this.filters = [];
	    return _this;
	  }
	
	  Binding.prototype.applyFilter = function applyFilter(val) {
	    for (var i = 0; i < this.filters.length; i++) {
	      val = this.filters[i].apply(val);
	    }
	    return val;
	  };
	
	  Binding.prototype.unapplyFilter = function unapplyFilter(val) {
	    for (var i = 0; i < this.filters.length; i++) {
	      val = this.filters[i].unapply(val);
	    }
	    return val;
	  };
	
	  return Binding;
	}(AbstractBinding);
	
	Binding.generateComments = true;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=tpl.js.map