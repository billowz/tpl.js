const _ = require('./util'),
  tmpDiv = document.createElement('div'),
  hasOwn = Object.prototype.hasOwnProperty,
  W3C = window.dispatchEvent;

let dom = {
  W3C: W3C,
  prop: function(elem, name, value) {
    name = propFix[name] || name;
    let hook = propHooks[name];
    if (arguments.length > 2) {
      if (hook && hook.set)
        return hook.set(elem, name, value);
      return (elem[name] = value);
    } else {
      if (hook && hook.get)
        return hook.get(elem, name);
      return elem[name];
    }
  },
  query(selectors, all) {
    if (typeof selectors == 'string')
      return all ? document.querySelectorAll(selectors) : document.querySelector(selectors);
    return selectors;
  },
  inDoc(el, root) {
    root = root || document.documentElement;
    if (root.contains)
      return root.contains(el);

    try {
      while ((el = el.parentNode)) {
        if (el === root)
          return true
        return false
      }
    } catch (e) {
      return false;
    }
  },
  cloneNode(el, deep) {
    if (el instanceof Array) {
      let els = [];
      for (let i = 0, l = el.length; i < l; i++)
        els[i] = el.cloneNode(deep !== false);
      return els;
    } else
      return el.cloneNode(deep !== false);
  },
  remove(el) {
    if (el instanceof Array) {
      let _el;
      for (let i = 0, l = el.length; i < l; i++) {
        _el = el[i];
        _el.parentNode.removeChild(_el);
      }
    } else
      el.parentNode.removeChild(el);
  },
  before(el, target) {
    if (target instanceof Array)
      target = target[0];

    let parent = target.parentNode;

    if (el instanceof Array) {
      for (let i = 0, l = el.length; i < l; i++) {
        parent.insertBefore(el[i], target);
      }
    } else
      parent.insertBefore(el, target);
  },
  after(el, target) {
    if (target instanceof Array)
      target = target[target.length - 1];

    let parent = target.parentNode;

    if (el instanceof Array) {
      for (let i = 0, l = el.length; i < l; i++) {
        insertAfter(parent, el[i], target);
      }
    } else
      insertAfter(parent, el, target);
  },
  append(target, el) {
    if (el instanceof Array) {
      for (let i = 0, l = el.length; i < l; i++) {
        target.appendChild(el[i]);
      }
    } else
      target.appendChild(el);
  },
  appendTo(el, target) {
    dom.append(target, el);
  },
  prepend(target, el) {
    if (target.firstChild) {
      dom.before(el, target.firstChild)
    } else {
      dom.append(target, el)
    }
  },
  prependTo(el, target) {
    dom.prepend(target, el)
  },
  on(el, event, cb) {
    $(el).on(event, cb)
  },
  off(el, event, cb) {
    $(el).off(event, cb)
  },
  html(el, html) {
    if (arguments.length > 1)
      return (el.innerHTML = html);
    return el.innerHTML;
  },
  text(el, text) {
    if (el.nodeType == 3) {
      if (arguments.length > 1)
        return (el.data = text);
      return el.data;
    } else {
      return dom.html.apply(this, arguments)
    }
  },
  attr(el, attr, val) {
    if (arguments.length > 2)
      return el.setAttribute(attr, val);
    return el.getAttribute(attr)
  },
  removeAttr(el, attr) {
    el.removeAttribute(attr)
  },
  style(el, style) {
    if (arguments.length > 1)
      return dom.prop(el, 'style', style)
    return dom.prop(el, 'style')
  },
  css(el, name, value) {
    let prop = /[_-]/.test(name) ? camelize(name) : name,
      hook;

    name = cssName(prop) || prop;
    hook = cssHooks[prop] || cssDefaultHook;
    if (arguments.length == 2 || typeof value === 'boolean') {
      let convert = value, num;

      if (name === 'background')
        name = 'backgroundColor';
      value = hook.get(el, name);
      return convert !== false && isFinite((num = parseFloat(value))) ? num : value;
    } else if (value === '' || value === undefined || value === null) {
      el.style[name] = ''
    } else {
      if (isFinite(value) && !cssNumber[prop])
        value += 'px'
      hook.set(el, name, value)
    }
  },
  position: function(el) {
    let _offsetParent, _offset,
      parentOffset = {
        top: 0,
        left: 0
      };
    if (dom.css(el, 'position') === 'fixed') {
      _offset = el.getBoundingClientRect();
    } else {
      _offsetParent = offsetParent(el);
      _offset = offset(el);
      if (_offsetParent.tagName !== 'HTML')
        parentOffset = offset(_offsetParent);
      parentOffset.top += dom.css(_offsetParent, 'borderTopWidth', true);
      parentOffset.left += dom.css(_offsetParent, 'borderLeftWidth', true);

      parentOffset.top -= dom.scrollTop(_offsetParent);
      parentOffset.left -= dom.scrollLeft(_offsetParent);
    }
    return {
      top: _offset.top - parentOffset.top - dom.css(el, 'marginTop', true),
      left: _offset.left - parentOffset.left - dom.css(el, 'marginLeft', true)
    }
  },

  val(el, val) {
    let hook = valHooks[el.type || el.tagName.toLowerCase()];
    if (arguments.length > 1) {
      if (hook && hook.set) {
        hook.set(el, val);
      } else {
        if (val === undefined || val === null || val === NaN) {
          val = '';
        } else if (typeof val != 'string')
          val = val + '';
        el.value = val;
      }
    } else {
      if (hook && hook.get) {
        return hook.get(el);
      } else
        return el.value || '';
    }
  },
  checked(el, check) {
    if (arguments.length > 1)
      return dom.prop(el, 'checked', check)
    return dom.prop(el, 'checked')
  },
  class(el, cls) {
    if (arguments.length > 1)
      return dom.prop(el, 'class', cls)
    return dom.prop(el, 'class')
  },
  addClass(el, cls) {
    if (el.classList) {
      el.classList.add(cls)
    } else {
      var cur = ' ' + (dom.prop(el, 'class') || '') + ' '
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        dom.class(el, _.trim(cur + cls))
      }
    }
  },
  removeClass(el, cls) {
    if (el.classList) {
      el.classList.remove(cls)
    } else {
      var cur = ' ' + (dom.prop(el, 'class') || '') + ' '
      var tar = ' ' + cls + ' '
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ')
      }
      dom.class(el, _.trim(cur))
    }
  },
  focus(el) {
    el.focus();
  },
  outerHtml(el) {
    if (el.outerHTML) {
      return el.outerHTML
    } else {
      var container = document.createElement('div')
      container.appendChild(el.cloneNode(true))
      return container.innerHTML
    }
  },

  scrollTop(el, val) {
    let win = getWindow(el);
    if (arguments.length == 1) {
      return win ? 'scrollTop' in win ? win.scrollTop : root.pageYOffset : el.pageYOffset;
    } else if (win) {
      win.scrollTo(dom.scrollLeft(el), val);
    } else {
      el.pageYOffset = val;
    }
  },

  scrollLeft(el, val) {
    let win = getWindow(el);
    if (arguments.length == 1) {
      return win ? 'scrollLeft' in win ? win.scrollLeft : root.pageXOffset : el.pageXOffset;
    } else if (win) {
      win.scrollTo(val, dom.scrollTop(el));
    } else {
      el.pageXOffset = val;
    }
  },

  scroll(el, left, top) {
    let win = getWindow(el);
    if (arguments.length == 1) {
      return {
        left: dom.scrollLeft(el),
        top: dom.scrollTop(el)
      }
    } else if (win) {
      win.scrollTo(left, top);
    } else {
      el.pageXOffset = left;
      el.pageYOffset = top;
    }
  }
}
module.exports = dom;


//====================== Query =============================
if (!document.querySelectorAll) {
  document.querySelectorAll = function querySelectorAll(selector) {
    let doc = document,
      head = doc.documentElement.firstChild,
      styleTag = doc.createElement('STYLE');

    head.appendChild(styleTag);
    doc.__qsaels = [];
    if (styleTag.styleSheet) { // for IE
      styleTag.styleSheet.cssText = selector + '{x:expression(document.__qsaels.push(this))}';
    } else { // others
      let textnode = document.createTextNode(selector + '{x:expression(document.__qsaels.push(this))}');
      styleTag.appendChild(textnode);
    }
    window.scrollBy(0, 0);
    return doc.__qsaels;
  }
}
if (!document.querySelector) {
  document.querySelector = function querySelector(selectors) {
    let elements = document.querySelectorAll(selectors);
    return elements.length ? elements[0] : null;
  }
}

function insertAfter(parentEl, el, target) {
  if (parentEl.lastChild == target)
    parentEl.appendChild(el);
  else
    parentEl.insertBefore(el, target.nextSibling);
}


//====================== Prop =============================
let rfocusable = /^(?:input|select|textarea|button|object)$/i,
  rclickable = /^(?:a|area)$/i,
  propFix = dom.propFix = {
    tabindex: 'tabIndex',
    readonly: 'readOnly',
    'for': 'htmlFor',
    'class': 'className',
    maxlength: 'maxLength',
    cellspacing: 'cellSpacing',
    cellpadding: 'cellPadding',
    rowspan: 'rowSpan',
    colspan: 'colSpan',
    usemap: 'useMap',
    frameborder: 'frameBorder',
    contenteditable: 'contentEditable'
  },
  propHooks = dom.propHooks = {
    tabIndex: {
      get: function(elem) {
        let attributeNode = elem.getAttributeNode('tabindex');

        return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) :
          rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ?
            0 : undefined;
      }
    }
  }

//====================== Val =============================
let valHooks = dom.valHooks = {
  option: {
    get: function(elem) {
      var val = elem.attributes.value;
      return !val || val.specified ? elem.value : elem.text;
    }
  },

  select: {
    get: function(elem) {
      let signle = elem.type == 'select-one',
        index = elem.selectedIndex;
      if (index < 0)
        return signle ? undefined : [];

      let options = elem.options, option,
        values = signle ? undefined : [];

      for (let i = 0, l = options.length; i < l; i++) {
        option = options[i];
        if (option.selected || i == index) {
          if (signle)
            return dom.val(option);
          values.push(dom.val(option));
        }
      }
      return values;
    },

    set: function(elem, value) {
      let signle = elem.type == 'select-one',
        options = elem.options, option,
        i, l;

      elem.selectedIndex = -1;
      if( (value instanceof Array) ) {
        if (signle) {
          value = value[0];
        } else {
          if (!value.length)
            return;
          let vals = {};
          for (i = 0, l = value.length; i < l; i++)
            vals[value[i]] = true;

          for (i = 0, l = options.length; i < l; i++) {
            option = options[i];
            if (vals[dom.val(option)] === true)
              option.selected = true;
          }
          return;
        }
      }
      if (value !== undefined && value !== null) {
        if (typeof value != 'string')
          value = value + '';
        for (i = 0, l = options.length; i < l; i++) {
          option = options[i];
          if (dom.val(option) == value) {
            option.selected = true;
            return;
          }
        }
      }
    }
  }
}

//====================== Css =============================
let cssFix = dom.cssFix = {
    'float': W3C ? 'cssFloat' : 'styleFloat'
  },
  cssHooks = dom.cssHooks = {},
  cssDefaultHook = {},
  prefixes = ['', '-webkit-', '-o-', '-moz-', '-ms-'],
  cssNumber = {
    animationIterationCount: true,
    columnCount: true,
    order: true,
    flex: true,
    flexGrow: true,
    flexShrink: true,
    fillOpacity: true,
    fontWeight: true,
    lineHeight: true,
    opacity: true,
    orphans: true,
    widows: true,
    zIndex: true,
    zoom: true
  },
  cssShow = {
    position: 'absolute',
    visibility: 'hidden',
    display: 'block'
  },
  rdisplayswap = /^(none|table(?!-c[ea]).+)/,
  root = document.documentElement,
  css = dom.css;

function camelize(target) {
  if (!target || target.indexOf('-') < 0 && target.indexOf('_') < 0) {
    return target
  }
  return target.replace(/[-_][^-_]/g, function(match) {
    return match.charAt(1).toUpperCase()
  });
}
function cssName(name, host, camelCase) {
  if (cssFix[name])
    return cssFix[name]
  host = host || root.style
  for (var i = 0, n = prefixes.length; i < n; i++) {
    camelCase = camelize(prefixes[i] + name)
    if (camelCase in host) {
      return (cssFix[name] = camelCase)
    }
  }
  return null
}
cssDefaultHook.set = function cssDefaultSet(el, name, value) {
  try {
    el.style[name] = value
  } catch (e) {}
}

let cssDefaultGet;
if (window.getComputedStyle) {
  cssDefaultGet = cssDefaultHook.get = function cssDefaultGet(el, name) {
    let val,
      styles = getComputedStyle(el, null)

    if (styles) {
      val = name === 'filter' ? styles.getPropertyValue(name) : styles[name]
      if (val === '')
        val = el.style[name]
    }
    return val
  }
  cssHooks.opacity = {
    get(el, name) {
      let val = cssDefaultGet(el, name);
      return val === '' ? '1' : ret;
    }
  }
} else {
  let rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
    rposition = /^(top|right|bottom|left)$/,
    ralpha = /alpha\([^)]*\)/i,
    ie8 = !!window.XDomainRequest,
    salpha = 'DXImageTransform.Microsoft.Alpha',
    border = {
      thin: ie8 ? '1px' : '2px',
      medium: ie8 ? '3px' : '4px',
      thick: ie8 ? '5px' : '6px'
    }

  cssDefaultGet = cssDefaultHook.get = function cssDefaultGet(el, name) {
    let currentStyle = el.currentStyle,
      val = currentStyle[name];

    if ( (rnumnonpx.test(val) && !rposition.test(val)) ) {
      let style = el.style,
        left = style.left,
        rsLeft = el.runtimeStyle.left;

      el.runtimeStyle.left = currentStyle.left;
      style.left = name === 'fontSize' ? '1em' : (val || 0);
      val = style.pixelLeft + 'px';
      style.left = left;
      el.runtimeStyle.left = rsLeft;
    }
    if (val === 'medium') {
      name = name.replace('Width', 'Style');
      if (currentStyle[name] === 'none')
        val = '0px';
    }
    return val === '' ? 'auto' : border[val] || val;
  }
  cssHooks.opacity = {
    get(el, name) {
      let alpha = el.filters.alpha || el.filters[salpha],
        op = alpha && alpha.enabled ? alpha.opacity : 100;

      return (op / 100) + ''
    },
    set(el, name, value) {
      var style = el.style,
        opacity = isFinite(value) && value <= 1 ? `alpha(opacity=${value * 100})` : '',
        filter = style.filter || '';

      style.zoom = 1;
      style.filter = (ralpha.test(filter) ?
        filter.replace(ralpha, opacity) : filter + ' ' + opacity).trim();
      if (!style.filter)
        style.removeAttribute('filter');
    }
  }
}

_.each(['top', 'left'], function(name) {
  cssHooks[name] = {
    get(el, name) {
      let val = cssDefaultGet(el, name);
      return /px$/.test(val) ? val : dom.position(el)[name] + 'px'
    }
  }
})

_.each(['Width', 'Height'], function(name) {
  var method = name.toLowerCase(),
    clientProp = 'client' + name,
    scrollProp = 'scroll' + name,
    offsetProp = 'offset' + name,
    which = name == 'Width' ? ['Left', 'Right'] : ['Top', 'Bottom'];

  function get(el, boxSizing) {
    let val;

    val = el[offsetProp] // border-box 0
    if (boxSizing === 2) // margin-box 2
      return val + css(el, 'margin' + which[0], true) + css(el, 'margin' + which[1], true);
    if (boxSizing < 0) // padding-box  -2
      val = val - css(el, 'border' + which[0] + 'Width', true) - css(el, 'border' + which[1] + 'Width', true);
    if (boxSizing === -4) // content-box -4
      val = val - css(el, 'padding' + which[0], true) - css(el, 'padding' + which[1], true);
    return val
  }

  dom[method] = function(el) {
    return get(el, -4);
  }

  dom['inner' + name] = function(el) {
    return get(el, -2);
  }
  dom['outer' + name] = function(el, includeMargin) {
    return get(el, includeMargin === true ? 2 : 0);
  }
})

function offsetParent(el) {
  var offsetParent = el.offsetParent
  while (offsetParent && css(offsetParent, "position") === "static") {
    offsetParent = offsetParent.offsetParent;
  }
  return offsetParent || root;
}

function offset(el) { //取得距离页面左右角的坐标
  var box = {
    left: 0,
    top: 0
  };

  if (!el || !el.tagName || !el.ownerDocument)
    return box;

  var doc = el.ownerDocument,
    body = doc.body,
    root = doc.documentElement,
    win = doc.defaultView || doc.parentWindow;

  if (!dom.inDoc(el, root))
    return box;

  if (el.getBoundingClientRect)
    box = el.getBoundingClientRect();

  var clientTop = root.clientTop || body.clientTop,
    clientLeft = root.clientLeft || body.clientLeft,
    scrollTop = Math.max(win.pageYOffset || 0, root.scrollTop, body.scrollTop),
    scrollLeft = Math.max(win.pageXOffset || 0, root.scrollLeft, body.scrollLeft);
  return {
    top: box.top + scrollTop - clientTop,
    left: box.left + scrollLeft - clientLeft
  }
}

function getWindow(node) {
  return node.window && node.document ? node : node.nodeType === 9 ? node.defaultView || node.parentWindow : false;
}
