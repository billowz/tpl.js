(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"), require("jquery"), require("observer"));
	else if(typeof define === 'function' && define.amd)
		define(["_", "jquery", "observer"], factory);
	else if(typeof exports === 'object')
		exports["tpl"] = factory(require("_"), require("jquery"), require("observer"));
	else
		root["tpl"] = factory(root["_"], root["jQuery"], root["observer"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
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
	
	var tpl = __webpack_require__(1).Template;
	tpl.Directive = __webpack_require__(10);
	tpl.Directives = __webpack_require__(11);
	tpl.expression = __webpack_require__(8);
	tpl.util = __webpack_require__(7);
	module.exports = tpl;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2);
	var $ = __webpack_require__(3);
	var observer = __webpack_require__(4);
	var Text = __webpack_require__(5);
	
	var _require = __webpack_require__(9);
	
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
	
	var Template = exports.Template = function () {
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
	
	var TemplateInstance = exports.TemplateInstance = function () {
	  function TemplateInstance(tpl, scope, parent) {
	    _classCallCheck(this, TemplateInstance);
	
	    this.tpl = tpl;
	    this.scope = observer.proxy.proxy(scope);
	    this.el = this.tpl.template.clone();
	    this.parent = parent;
	    this._onProxyChange = this._onProxyChange.bind(this);
	    observer.proxy.on(this.scope, this._onProxyChange);
	    this.__id__ = tpl.__id__ + '-' + tpl.__instance_nr__++;
	    this.init();
	  }
	
	  TemplateInstance.prototype.updateScope = function updateScope(scope) {
	    if (!observer.eq(scope, this.scope)) {
	      observer.proxy.un(this.scope, this._onProxyChange);
	      this.scope = observer.proxy.proxy(scope);
	      observer.proxy.on(this.scope, this._onProxyChange);
	      this.bindings.forEach(function (binding) {
	        binding.updateScope();
	      });
	    }
	  };
	
	  TemplateInstance.prototype.destroy = function destroy() {
	    this.bindings.forEach(function (binding) {
	      binding.unbind();
	      binding.destroy();
	    });
	    this.el.remove();
	  };
	
	  TemplateInstance.prototype._onProxyChange = function _onProxyChange(obj, proxy) {
	    this.scope = proxy;
	  };
	
	  TemplateInstance.prototype.renderTo = function renderTo(el) {
	    $(el).append(this.el);
	    return this;
	  };
	
	  TemplateInstance.prototype.init = function init() {
	    this.bindings = this.parse(this.el);
	    this.bindings.forEach(function (binding) {
	      binding.bind();
	    });
	  };
	
	  TemplateInstance.prototype.parse = function parse(els) {
	    var _this = this;
	
	    if (!els.jquery && !(els instanceof Array)) {
	      return this.parseEl(els);
	    } else {
	      var _ret = function () {
	        var bindings = [];
	        _.each(els, function (el) {
	          bindings.push.apply(bindings, _this.parseEl(el));
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
	    var _this2 = this;
	
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
	
	        if ((name = _this2.parseDirectiveName(name)) && (dc = Directive.getDirective(name))) {
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
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var $ = __webpack_require__(3);
	
	var _require = __webpack_require__(6);
	
	var Binding = _require.Binding;
	
	var _require2 = __webpack_require__(7);
	
	var ScopeData = _require2.ScopeData;
	var expression = __webpack_require__(8);
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
	    var ret = this.expression.execute.call(this.scope, this, this.scope, this.el);
	    if (ret instanceof ScopeData) return ret.data;
	    return this.applyFilter(ret);
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2);
	var observer = __webpack_require__(4);
	
	var _require = __webpack_require__(7);
	
	var ScopeData = _require.ScopeData;
	
	var AbstractBinding = exports.AbstractBinding = function () {
	  function AbstractBinding(tpl) {
	    _classCallCheck(this, AbstractBinding);
	
	    this.tpl = tpl;
	    this.scope = tpl.scope;
	    this.ancestorObservers = {};
	    this._ancestorObserveHandler = this._ancestorObserveHandler.bind(this);
	    this._scopeObserveHandler = this._scopeObserveHandler.bind(this);
	    this._onProxyChange = this._onProxyChange.bind(this);
	    observer.proxy.on(this.scope, this._onProxyChange);
	  }
	
	  AbstractBinding.prototype.updateScope = function updateScope() {
	    if (!observer.eq(this.tpl.scope, this.scope)) {
	      observer.proxy.un(this.scope, this._onProxyChange);
	      this.unbind();
	      this.scope = this.tpl.scope;
	      observer.proxy.on(this.scope, this._onProxyChange);
	      this.bind();
	    }
	  };
	
	  AbstractBinding.prototype._onProxyChange = function _onProxyChange(obj, proxy) {
	    this.scope = proxy;
	  };
	
	  AbstractBinding.prototype.destroy = function destroy() {
	    observer.proxy.un(this.scope, this._onProxyChange);
	  };
	
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
	        observer.on(this.scope, expr, this._scopeObserveHandler);
	      } else {
	        aos.callbacks.push(callback);
	      }
	      for (i = 0; i < l; i++) {
	        observer.on(ancestors[i], expr, callback);
	      }
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
	          observer.un(this.scope, expr, this._scopeObserveHandler);
	          this.ancestorObservers[expr] = undefined;
	        }
	      }
	    }
	  };
	
	  AbstractBinding.prototype._has = function _has(scope, path) {
	    var aos = this.ancestorObservers[path];
	    if (aos) {
	      if (observer.eq(scope, this.scope)) return false;
	      return observer.eq(scope, aos.ancestors[aos.ancestors.length - 1]);
	    } else return _.has(scope, path);
	  };
	
	  AbstractBinding.prototype.get2 = function get2(path) {
	    var tpl = this.tpl,
	        scope = this.scope,
	        ret = void 0;
	
	    while (!this._has(scope, path)) {
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
	
	    while (!this._has(scope, path)) {
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
	
	  AbstractBinding.prototype._scopeObserveHandler = function _scopeObserveHandler(expr) {
	    var aos = this.ancestorObservers[expr],
	        ancestors = aos.ancestors,
	        callbacks = aos.callbacks,
	        i = void 0,
	        j = void 0;
	    observer.un(this.scope, expr, this._scopeObserveHandler);
	    this.ancestorObservers[expr] = undefined;
	    for (i = ancestors.length - 1; i >= 0; i--) {
	      observer.un(ancestors[i], expr, this._ancestorObserveHandler);
	      for (j = callbacks.length - 1; j >= 0; j--) {
	        observer.un(ancestors[i], expr, callbacks[j]);
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
	      observer.un(this.scope, expr, this._scopeObserveHandler);
	      this.ancestorObservers[expr] = undefined;
	    }
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _ = __webpack_require__(2);
	
	var ScopeData = exports.ScopeData = function ScopeData(scope, data) {
	  _classCallCheck(this, ScopeData);
	
	  this.scope = scope;
	  this.data = data;
	};
	
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
/* 8 */
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
	
	var cache = {};
	
	function parse(exp, args) {
	  exp = exp.trim();
	  var res = void 0;
	  if (res = cache[exp]) {
	    return res;
	  }
	  res = {
	    exp: exp
	  };
	  if (isSimplePath(exp)) {
	    res.simplePath = true;
	    res.identities = [exp];
	    res.execute = function (binding) {
	      var ret = binding.get2(exp);
	      return ret;
	    };
	  } else {
	    res.simplePath = false;
	    identities = {};
	    res.execute = compileExecuter(exp, args);
	    res.identities = Object.keys(identities);
	    identities = undefined;
	  }
	  cache[exp] = res;
	  return res;
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var $ = __webpack_require__(3);
	
	var _require = __webpack_require__(6);
	
	var Binding = _require.Binding;
	var AbstractBinding = _require.AbstractBinding;
	
	var _require2 = __webpack_require__(7);
	
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
	        if (iter.hasNext() && ret && ret instanceof YieId) {
	          _self.waitDirective = directive;
	          ret.then(parse);
	          return;
	        }
	      }
	      _self.waitDirective = undefined;
	    }
	    parse();
	  };
	
	  DirectiveGroup.prototype.unbind = function unbind() {
	    var ds = this.directives,
	        wd = this.waitDirective;
	    for (var i = 0, l = ds.length; i < l; i++) {
	      ds[i].unbind();
	      if (this.wd == ds[i]) return;
	    }
	  };
	
	  return DirectiveGroup;
	}(AbstractBinding);
	
	var Directive = exports.Directive = function (_Binding) {
	  _inherits(Directive, _Binding);
	
	  function Directive(el, tpl, expr) {
	    _classCallCheck(this, Directive);
	
	    var _this2 = _possibleConstructorReturn(this, _Binding.call(this, tpl, expr));
	
	    _this2.el = el;
	    _this2.$el = $(el);
	    _this2.attr = tpl.tpl.directivePrefix + _this2.name;
	    return _this2;
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
	        throw TypeError('Invalid Directive SuperClass ' + userSuperClass);
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	var $ = __webpack_require__(3);
	
	var _require = __webpack_require__(6);
	
	var Binding = _require.Binding;
	var AbstractBinding = _require.AbstractBinding;
	
	var _require2 = __webpack_require__(7);
	
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
	        if (iter.hasNext() && ret && ret instanceof YieId) {
	          _self.waitDirective = directive;
	          ret.then(parse);
	          return;
	        }
	      }
	      _self.waitDirective = undefined;
	    }
	    parse();
	  };
	
	  DirectiveGroup.prototype.unbind = function unbind() {
	    var ds = this.directives,
	        wd = this.waitDirective;
	    for (var i = 0, l = ds.length; i < l; i++) {
	      ds[i].unbind();
	      if (this.wd == ds[i]) return;
	    }
	  };
	
	  return DirectiveGroup;
	}(AbstractBinding);
	
	var Directive = exports.Directive = function (_Binding) {
	  _inherits(Directive, _Binding);
	
	  function Directive(el, tpl, expr) {
	    _classCallCheck(this, Directive);
	
	    var _this2 = _possibleConstructorReturn(this, _Binding.call(this, tpl, expr));
	
	    _this2.el = el;
	    _this2.$el = $(el);
	    _this2.attr = tpl.tpl.directivePrefix + _this2.name;
	    return _this2;
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
	        throw TypeError('Invalid Directive SuperClass ' + userSuperClass);
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _ = __webpack_require__(2);
	
	var _require = __webpack_require__(9);
	
	var Directive = _require.Directive;
	
	var _require2 = __webpack_require__(7);
	
	var YieId = _require2.YieId;
	var ScopeData = _require2.ScopeData;
	
	var _require3 = __webpack_require__(1);
	
	var Template = _require3.Template;
	var expression = __webpack_require__(8);
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
	    this.$el.off(this.eventType, this.handler);
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
	    _this2.$el.removeAttr(_this2.attr);
	    return _this2;
	  }
	
	  AbstractExpressionDirective.prototype.setRealValue = function setRealValue(val) {
	    this.set(this.expr, val);
	  };
	
	  AbstractExpressionDirective.prototype.realValue = function realValue() {
	    var ret = this.expression.execute.call(this.scope, this, this.scope, this.el);
	    if (ret instanceof ScopeData) return ret.data;
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
	          this.$el.addClass(value[i]);
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
	  'style': {
	    update: function update(value) {
	      if (value && typeof value == 'string') {
	        this.el.style.cssText = value;
	      } else if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
	        this.handleObject(value);
	      }
	    },
	    handleObject: function handleObject(value) {
	      this.cleanup(value);
	      var keys = this.prevKeys = [];
	      for (var key in value) {
	        this.$el.css(key, value[key]);
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
	  'if': {
	    bind: function bind() {
	      AbstractExpressionDirective.prototype.bind.call(this);
	      if (!this.directives) {
	        this.yieId = new YieId();
	        return this.yieId;
	      }
	    },
	    update: function update(val) {
	      if (!val) {
	        this.$el.css('display', 'none');
	      } else {
	        if (!this.directives) {
	          this.directives = this.tpl.parseChildNodes(this.el);
	          this.directives.forEach(function (directive) {
	            directive.bind();
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
	      AbstractExpressionDirective.prototype.unbind.call(this);
	      if (this.directives) {
	        this.directives.forEach(function (directive) {
	          directive.unbind();
	        });
	      }
	    },
	
	    priority: 9,
	    block: true
	  },
	  checked: {
	    update: function update(val) {
	      if (val instanceof Array) this.$el.prop('checked', _.indexOf(val, this.$el.val()));else this.$el.prop('checked', !!val);
	    }
	  },
	  selected: {
	    update: function update(val) {}
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
	          this.event = type == RADIO || type == CHECKBOX ? EVENT_CHANGE : EVENT_INPUT;
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
	      this.$el.off(this.event, this.onChange);
	    },
	    onChange: function onChange() {
	      var val = this.elVal(),
	          idx = void 0;
	      if (this.val instanceof Array) {
	        if (val) {
	          this.val = this.val.concat(val);
	        } else if ((idx = _.indexOf(this.$el.val())) != -1) {
	          this.val = this.val.slice().splice(idx, 1);
	        }
	        this.setValue(this.val);
	      } else if (val != this.val) this.setValue(val);
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
	              var checked = void 0;
	              if (val instanceof Array) checked = _.indexOf(this.$el.val()) != -1;else checked = val == this.$el.val();
	
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
	
	var eachReg = /^\s*([\s\S]+)\s+in\s+([\S]+)(\s+track\s+by\s+([\S]+))?\s*$/,
	    eachAliasReg = /^(\(\s*([^,\s]+)(\s*,\s*([\S]+))?\s*\))|([^,\s]+)(\s*,\s*([\S]+))?$/;
	
	var EachDirective = exports.EachDirective = function (_Directive3) {
	  _inherits(EachDirective, _Directive3);
	
	  function EachDirective(el, tpl, expr) {
	    _classCallCheck(this, EachDirective);
	
	    var _this5 = _possibleConstructorReturn(this, _Directive3.call(this, el, tpl, expr));
	
	    _this5.observeHandler = _this5.observeHandler.bind(_this5);
	    _this5.lengthObserveHandler = _this5.lengthObserveHandler.bind(_this5);
	
	    var token = expr.match(eachReg);
	    if (!token) throw Error('Invalid Expression[' + expr + '] on Each Directive');
	
	    _this5.scopeExpr = token[2];
	    _this5.indexExpr = token[4];
	
	    var aliasToken = token[1].match(eachAliasReg);
	    if (!aliasToken) throw Error('Invalid Expression[' + token[1] + '] on Each Directive');
	
	    _this5.valueAlias = aliasToken[2] || aliasToken[5];
	    _this5.keyAlias = aliasToken[4] || aliasToken[7];
	
	    _this5.comment = $(document.createComment(' Directive:' + _this5.name + ' [' + _this5.expr + '] '));
	    _this5.comment.insertBefore(_this5.el);
	
	    _this5.$el.remove().removeAttr(_this5.attr);
	    _this5.childTpl = new Template(_this5.$el);
	    return _this5;
	  }
	
	  EachDirective.prototype.createChildScope = function createChildScope(key, data, idx) {
	    var scope = {
	      __index__: idx
	    };
	
	    if (this.keyAlias) scope[this.keyAlias] = key;
	    scope[this.valueAlias] = data;
	    return scope;
	  };
	
	  EachDirective.prototype.createChild = function createChild(key, data, idx) {
	    return this.childTpl.complie(this.createChildScope(key, data, idx), this.tpl);
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
	
	  EachDirective.prototype.update = function update(value) {
	    if (value instanceof Array) {
	      var childrenIdx = this.childrenIdx,
	          childrenSortedIdx = this.childrenSortedIdx,
	          data = void 0,
	          idx = void 0,
	          i = void 0,
	          l = void 0;
	
	      if (!childrenIdx) {
	        var tpl = void 0,
	            before = this.comment,
	            el = void 0;
	
	        childrenIdx = this.childrenIdx = {};
	        childrenSortedIdx = this.childrenSortedIdx = [];
	
	        for (i = 0, l = value.length; i < l; i++) {
	          data = value[i];
	          idx = this.indexExpr ? _.get(data, this.indexExpr) : i;
	          tpl = this.createChild(i, data, idx);
	          el = tpl.el;
	          el.insertAfter(before);
	          before = el;
	
	          childrenSortedIdx[i] = childrenIdx[idx] = {
	            idx: idx,
	            scope: data,
	            tpl: tpl,
	            index: i
	          };
	        }
	      } else {
	        var child = void 0,
	            child2 = void 0,
	            _tpl = void 0,
	            added = [],
	            removed = [],
	            currentSortedIdx = [];
	
	        for (i = 0, l = value.length; i < l; i++) {
	          data = value[i];
	          idx = this.indexExpr ? _.get(data, this.indexExpr) : i;
	
	          if (!(child = childrenIdx[idx])) {
	            child = childrenIdx[idx] = {
	              idx: idx,
	              scope: data,
	              tpl: undefined,
	              index: i
	            };
	            added.push(child);
	            childrenIdx[idx] = child;
	          } else {
	            if (child.scope != data) {
	              if (child.tpl) child.tpl.updateScope(this.createChildScope(i, data, idx));else throw Error('index for each is not uk');
	              // todo update: child.tpl.updateScope(child.scope)
	            }
	            child.index = i;
	          }
	          currentSortedIdx[i] = child;
	        }
	
	        for (i = 0, l = childrenSortedIdx.length; i < l; i++) {
	          child = childrenSortedIdx[i];
	          child2 = childrenIdx[child.idx];
	          if (child2 && child !== currentSortedIdx[child2.index]) {
	            removed.push(child);
	            childrenIdx[child.idx] = undefined;
	          }
	        }
	
	        for (i = 0, l = added.length; i < l; i++) {
	          child = added[i];
	          if (child2 = removed.pop()) {
	            child.tpl = child2.tpl;
	            child.tpl.updateScope(this.createChildScope(child.index, child.scope, child.idx));
	            // todo update: child.tpl.updateScope(child.scope)
	          } else {
	              _tpl = this.createChild(child.index, child.scope, idx);
	              child.tpl = _tpl;
	            }
	          if (child.index) {
	            child.tpl.el.insertAfter(currentSortedIdx[child.index - 1].tpl.el);
	          } else {
	            child.tpl.el.insertAfter(this.comment);
	          }
	        }
	
	        while (child = removed.pop()) {
	          child.tpl.destroy();
	        }this.childrenSortedIdx = currentSortedIdx;
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

/***/ }
/******/ ])
});
;
//# sourceMappingURL=tpl.js.map