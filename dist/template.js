(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"), require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["_", "jquery"], factory);
	else if(typeof exports === 'object')
		exports["datTempl"] = factory(require("_"), require("jquery"));
	else
		root["datTempl"] = factory(root["_"], root["jQuery"]);
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
	    PRIMITIVE = 0,
	    KEYPATH = 1,
	    TEXT = 0,
	    BINDING = 1,
	    templateContentReg = /^[\s\t\r\n]*</,
	    defaultCfg = {
	  delimiters: ['{', '}']
	};
	
	var Template = (function () {
	  function Template(templ, cfg) {
	    _classCallCheck(this, Template);
	
	    this.template = $(templ);
	    this.cfg = _.assign(_.clone(defaultCfg), cfg || {});
	    this.parse = this.parse.bind(this);
	  }
	
	  Template.prototype.complie = function complie(bind) {
	    var el = this.template.clone();
	    _.each(el, this.parse);
	    return el;
	  };
	
	  Template.prototype.parseText = function parseText($el) {
	    var text = $el.text(),
	        tokens = parseTemplate(text, this.cfg.delimiters),
	        comment = undefined,
	        parent = $el.parent();
	    _.each(tokens, function (token) {
	      var text = document.createTextNode(token.value);
	      $(text).insertBefore($el);
	      if (token.type === BINDING) {}
	    });
	    comment = document.createComment(text);
	    $(comment).insertBefore($el);
	    $el.remove();
	  };
	
	  Template.prototype.parse = function parse(node) {
	    var block = false,
	        $el = $(node);
	    switch (node.nodeType) {
	      case 1:
	        // Element
	
	        break;
	      case 3:
	        // Text
	        this.parseText($el);
	        break;
	      case 8: // Comments
	    }
	    _.each($el.contents(), this.parse);
	  };
	
	  Template.prototype.buildBinding = function buildBinding(binding, node, type, declaration) {
	    var pipes = declaration.split('|').map(function (pipe) {
	      return pipe.trim();
	    });
	
	    var context = pipes.shift().split('<').map(function (ctx) {
	      return ctx.trim();
	    });
	
	    var keypath = context.shift();
	    var dependencies = context.shift();
	    var options = {
	      formatters: pipes
	    };
	
	    if (dependencies) {
	      options.dependencies = dependencies.split(/\s+/);
	    }
	
	    this.bindings.push(new binding(this, node, type, keypath, options));
	  };
	
	  return Template;
	})();
	
	function parseType(string) {
	  var type = PRIMITIVE;
	  var value = string;
	
	  if (/^'.*'$|^".*"$/.test(string)) {
	    value = string.slice(1, -1);
	  } else if (string === 'true') {
	    value = true;
	  } else if (string === 'false') {
	    value = false;
	  } else if (string === 'null') {
	    value = null;
	  } else if (string === 'undefined') {
	    value = undefined;
	  } else if (isNaN(Number(string)) === false) {
	    value = Number(string);
	  } else {
	    type = KEYPATH;
	  }
	
	  return {
	    type: type,
	    value: value
	  };
	}
	
	function parseTemplate(template, delimiters) {
	  var tokens = [];
	  var length = template.length;
	  var index = 0;
	  var lastIndex = 0;
	
	  while (lastIndex < length) {
	    index = template.indexOf(delimiters[0], lastIndex);
	
	    if (index < 0) {
	      tokens.push({
	        type: TEXT,
	        value: template.slice(lastIndex)
	      });
	
	      break;
	    } else {
	      if (index > 0 && lastIndex < index) {
	        tokens.push({
	          type: TEXT,
	          value: template.slice(lastIndex, index)
	        });
	      }
	
	      lastIndex = index + delimiters[0].length;
	      index = template.indexOf(delimiters[1], lastIndex);
	
	      if (index < 0) {
	        var substring = template.slice(lastIndex - delimiters[1].length);
	        lastToken = tokens[tokens.length - 1];
	
	        if (lastToken && lastToken.type === TEXT) {
	          lastToken.value += substring;
	        } else {
	          tokens.push({
	            type: TEXT,
	            value: substring
	          });
	        }
	
	        break;
	      }
	
	      var value = template.slice(lastIndex, index).trim();
	
	      tokens.push({
	        type: BINDING,
	        value: value
	      });
	
	      lastIndex = index + delimiters[1].length;
	    }
	  }
	
	  return tokens;
	}
	module.exports = Template;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=template.js.map