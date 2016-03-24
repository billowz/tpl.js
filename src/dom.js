const _ = require('./util'),
  tmpDiv = document.createElement('div')
if (!document.querySelectorAll) {
  document.querySelectorAll = function querySelectorAll(selector) {
    let doc = document,
      head = doc.documentElement.firstChild,
      styleTag = doc.createElement('STYLE');

    head.appendChild(styleTag);
    doc.__qsaels = [];
    if (styleTag.styleSheet) { // for IE
      styleTag.styleSheet.cssText = selector + "{x:expression(document.__qsaels.push(this))}";
    } else { // others
      let textnode = document.createTextNode(selector + "{x:expression(document.__qsaels.push(this))}");
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


let rfocusable = /^(?:input|select|textarea|button|object)$/i,
  rclickable = /^(?:a|area)$/i,
  propFix = {
    tabindex: "tabIndex",
    readonly: "readOnly",
    "for": "htmlFor",
    "class": "className",
    maxlength: "maxLength",
    cellspacing: "cellSpacing",
    cellpadding: "cellPadding",
    rowspan: "rowSpan",
    colspan: "colSpan",
    usemap: "useMap",
    frameborder: "frameBorder",
    contenteditable: "contentEditable"
  },
  propHooks = {
    tabIndex: {
      get: function(elem) {
        let attributeNode = elem.getAttributeNode("tabindex");

        return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) :
          rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ?
            0 : undefined;
      }
    }
  },
  valHooks = {
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
  },
  ralpha = /alpha\([^)]*\)/i,
  ropacity = /opacity\s*=\s*([^)]*)/,
  rposition = /^(top|right|bottom|left)$/,
  rdisplayswap = /^(none|table(?!-c[ea]).+)/,
  rmargin = /^margin/,
  rnumsplit = new RegExp("^(" + core_pnum + ")(.*)$", "i"),
  rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i"),
  rrelNum = new RegExp("^([+-])=(" + core_pnum + ")", "i"),
  rmsPrefix = /^-ms-/,
  rdashAlpha = /-([\da-z])/gi,
  cssProps = {},
  cssHooks = {},
  cssPrefixes = ["Webkit", "O", "Moz", "ms"]
function fcamelCase(all, letter) {
  return letter.toUpperCase();
}
function camelCase(string) {
  return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
}
function vendorPropName(style, name) {
  if (name in style)
    return name;

  var capName = name.charAt(0).toUpperCase() + name.slice(1),
    origName = name,
    i = cssPrefixes.length;

  while (i--) {
    name = cssPrefixes[i] + capName;
    if (name in style)
      return name;
  }
  return origName;
}

if (window.getComputedStyle) {
  function getStyles(elem) {
    return window.getComputedStyle(elem, null);
  }

  function curCSS(elem, name, _computed) {
    var width, minWidth, maxWidth,
      computed = _computed || getStyles(elem),

      ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined,
      style = elem.style;

    if (computed) {
      if (ret === "" && !jQuery.contains(elem.ownerDocument, elem))
        ret = jQuery.style(elem, name);

      if (rnumnonpx.test(ret) && rmargin.test(name)) {

        width = style.width;
        minWidth = style.minWidth;
        maxWidth = style.maxWidth;

        style.minWidth = style.maxWidth = style.width = ret;
        ret = computed.width;

        style.width = width;
        style.minWidth = minWidth;
        style.maxWidth = maxWidth;
      }
    }
    return ret;
  }
} else if (document.documentElement.currentStyle) {
  function getStyles(elem) {
    return elem.currentStyle;
  }

  function curCSS(elem, name, _computed) {
    var left, rs, rsLeft,
      computed = _computed || getStyles(elem),
      ret = computed ? computed[name] : undefined,
      style = elem.style;

    if (ret == null && style && style[name])
      ret = style[name];

    if (rnumnonpx.test(ret) && !rposition.test(name)) {

      left = style.left;
      rs = elem.runtimeStyle;
      rsLeft = rs && rs.left;

      if (rsLeft)
        rs.left = elem.currentStyle.left;
      style.left = name === "fontSize" ? "1em" : ret;
      ret = style.pixelLeft + "px";

      style.left = left;
      if (rsLeft)
        rs.left = rsLeft;
    }
    return ret === "" ? "auto" : ret;
  }
}

let dom = {
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
  inDoc(node) {
    let doc = document.documentElement,
      parent = node && node.parentNode;

    return doc === node || doc === parent ||
      !!(parent && parent.nodeType === 1 && (doc.contains(parent)))
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
  css(el, name, val) {
    if (arguments.length > 1) {
      return $(el).css(name, val)
    } else {
      var num, hook,
        origName = camelCase(name);

      name = cssProps[origName] || (cssProps[origName] = vendorPropName(elem.style, origName));

      hook = cssHooks[name] || cssHooks[origName];

      if (hook && hook.get)
        val = hook.get(elem, true, extra);

      if (val === undefined)
        val = curCSS(elem, name, styles);

      if (val === "normal" && name in cssNormalTransform)
        val = cssNormalTransform[name];

      if (extra === '' || extra) {
        num = parseFloat(val);
        return extra === true || _.isNumeric(num) ? num || 0 : val;
      }
      return val;
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
  }
}
module.exports = dom;

